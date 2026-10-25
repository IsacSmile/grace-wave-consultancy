import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { ALLOWED_SERVICES } from '../src/data/serviceOptions.js';

const MAX_PAYLOAD_SIZE = 10240; // 10KB cap to prevent memory exhaustion DoS

/**
 * Sanitizes input strings by stripping dangerous control characters, null bytes,
 * and escaping HTML entities to eliminate stored XSS vulnerabilities.
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

/**
 * Verifies request origin against host to prevent Cross-Site Request Forgery (CSRF)
 */
function isTrustedOrigin(req) {
  const origin = req.headers['origin'] || req.headers['referer'];
  if (!origin) return true; // Direct non-browser calls
  try {
    const originHost = new URL(origin).host;
    const reqHost = req.headers['host'];
    return originHost === reqHost;
  } catch {
    return false;
  }
}

/**
 * Serverless API handler for Grace Way Accounting FZC LLC enquiry submissions.
 * Fortified with CSRF origin verification, payload size limits, multi-tier rate limiting,
 * honeypot spam detection, input sanitization, and parameterized SQL queries to Neon.
 */
export default async function handler(req, res) {
  // Set security & anti-sniff headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  // 1. Method verification - POST only
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      ok: false,
      error: `Method ${req.method} Not Allowed`,
    });
  }

  // 2. Reject oversized payloads early to prevent memory exhaustion DoS
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > MAX_PAYLOAD_SIZE) {
    return res.status(413).json({ ok: false, error: 'Payload exceeds maximum permitted size' });
  }

  // 3. Cross-Site Request Forgery (CSRF) origin verification
  if (!isTrustedOrigin(req)) {
    console.warn('[Security Alert]: Cross-origin enquiry rejected.');
    return res.status(403).json({ ok: false, error: 'Cross-origin request rejected' });
  }

  try {
    // 4. Request body parsing (defensive handling of parsed objects or raw strings)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (parseErr) {
        return res.status(400).json({
          ok: false,
          error: 'Invalid JSON payload.',
          fields: ['general'],
        });
      }
    }
    body = body || {};

    const { name, email, phone, service, message, website, website_url } = body;

    // 5. Honeypot check - return 200 silently to foil spam bots without DB write
    const honeypot = website || website_url;
    if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
      return res.status(200).json({
        ok: true,
        message: 'Enquiry submitted successfully.',
      });
    }

    // 6. Server-side validation and sanitization
    const rawName = typeof name === 'string' ? name.trim() : '';
    const rawEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const rawPhone = typeof phone === 'string' ? phone.trim() : '';
    const rawService = typeof service === 'string' ? service.trim() : '';
    const rawMessage = typeof message === 'string' ? message.trim() : '';

    const invalidFields = [];
    let firstErrorMessage = '';

    // Name validation: 2 to 100 characters
    if (!rawName || rawName.length < 2 || rawName.length > 100) {
      invalidFields.push('name');
      firstErrorMessage = firstErrorMessage || 'Full Name must be between 2 and 100 characters.';
    }

    // Phone validation: allow digits, spaces, +, -, (, ), 7 to 15 digits after stripping
    const phoneAllowedChars = /^[0-9\s+\-()]+$/;
    const phoneDigits = rawPhone.replace(/\D/g, '');
    const isPhoneValid = phoneAllowedChars.test(rawPhone) && phoneDigits.length >= 7 && phoneDigits.length <= 15;
    if (!rawPhone || !isPhoneValid) {
      invalidFields.push('phone');
      firstErrorMessage = firstErrorMessage || 'Please provide a valid contact telephone number (7 to 15 digits).';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!rawEmail || rawEmail.length > 100 || !emailRegex.test(rawEmail)) {
      invalidFields.push('email');
      firstErrorMessage = firstErrorMessage || 'Please provide a valid email address.';
    }

    // Service validation: exactly matching ALLOWED_SERVICES
    const allowedList = ALLOWED_SERVICES || [
      'Accounting & Bookkeeping',
      'Taxation & Compliance',
      'Audit & Advisory',
      'Other',
    ];
    if (!rawService || !allowedList.includes(rawService)) {
      invalidFields.push('service');
      firstErrorMessage = firstErrorMessage || 'Please select a valid service from the options.';
    }

    // Message validation: 10 to 1000 characters
    if (!rawMessage || rawMessage.length < 10 || rawMessage.length > 1000) {
      invalidFields.push('message');
      firstErrorMessage = firstErrorMessage || 'Message must be between 10 and 1,000 characters.';
    }

    if (invalidFields.length > 0) {
      return res.status(400).json({
        ok: false,
        error: firstErrorMessage || 'Please check the highlighted fields.',
        fields: invalidFields,
      });
    }

    // Sanitize values to eliminate stored HTML/XSS injection
    const sanitizedName = sanitizeInput(rawName);
    const sanitizedEmail = sanitizeInput(rawEmail);
    const sanitizedPhone = sanitizeInput(rawPhone);
    const sanitizedService = sanitizeInput(rawService);
    const sanitizedMessage = sanitizeInput(rawMessage);

    // 7. Database configuration check
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('[API Error] DATABASE_URL environment variable is missing.');
      return res.status(500).json({
        ok: false,
        error: 'Database configuration unavailable. Please contact us directly via WhatsApp or telephone.',
      });
    }

    const sql = neon(databaseUrl);

    // 8. Rate limiting: SHA-256 hash of (IP + salt), max 5 per hour
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedIp = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : (Array.isArray(forwarded) ? forwarded[0].trim() : null);
    const rawIp = forwardedIp || req.socket?.remoteAddress || '127.0.0.1';
    const salt = process.env.RATE_LIMIT_SALT || 'grace_way_accounting_salt_2026';
    const ipHash = crypto.createHash('sha256').update(rawIp + salt).digest('hex');

    // Multi-tier Rate Limiting (Per-IP max 5/hr, Global flood limit max 60/hr)
    let submissionCount = 0;
    try {
      const recentSubmissions = await sql`
        SELECT 
          COUNT(*) FILTER (WHERE ip_hash = ${ipHash} AND created_at > NOW() - INTERVAL '1 hour')::int AS ip_count,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour')::int AS global_count
        FROM enquiries
      `;
      submissionCount = Number(recentSubmissions[0]?.ip_count || 0);
      const globalCount = Number(recentSubmissions[0]?.global_count || 0);

      if (globalCount >= 60) {
        console.warn('[Enquiry Rate-Limit Alert]: Global hourly enquiry throttle activated.');
        return res.status(429).json({
          ok: false,
          error: 'System is experiencing unusually high traffic. Please reach out to us directly via WhatsApp or telephone.',
        });
      }
    } catch (rateLimitErr) {
      console.warn('[Rate Limit Warning]: Query failed, proceeding to save enquiry:', rateLimitErr.message || rateLimitErr);
    }

    if (submissionCount >= 5) {
      return res.status(429).json({
        ok: false,
        error: 'Too many enquiries. Please try again later or call us.',
      });
    }

    // 9. Safe parameterized insertion into enquiries table
    await sql`
      INSERT INTO enquiries (name, email, phone, service, message, ip_hash)
      VALUES (
        ${sanitizedName},
        ${sanitizedEmail},
        ${sanitizedPhone},
        ${sanitizedService},
        ${sanitizedMessage},
        ${ipHash}
      )
    `;

    return res.status(200).json({
      ok: true,
      message: 'Enquiry submitted successfully.',
    });
  } catch (error) {
    // Log server-side only; never leak error stack traces to client
    console.error('[Enquiry API Error]:', error.message || error);
    return res.status(500).json({
      ok: false,
      error: 'An internal error occurred while processing your enquiry. Please reach out via WhatsApp or phone.',
    });
  }
}

import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { ALLOWED_SERVICES } from '../src/data/serviceOptions.js';

/**
 * Serverless API handler for Grace Way Accounting FZC LLC enquiry submissions.
 * Accepts POST only, applies honeypot detection, server-side validation,
 * IP-hash based rate limiting, and parameterized SQL queries to Neon Postgres.
 */
export default async function handler(req, res) {
  // 1. Method verification - POST only
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      ok: false,
      error: `Method ${req.method} Not Allowed`,
    });
  }

  try {
    // 2. Request body parsing (handle parsed object or raw string defensively)
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

    // 3. Honeypot check - return 200 silently to foil spam bots without DB write
    // Accepts 'website' (primary) or 'website_url' (secondary)
    const honeypot = website || website_url;
    if (honeypot && typeof honeypot === 'string' && honeypot.trim().length > 0) {
      return res.status(200).json({
        ok: true,
        message: 'Enquiry submitted successfully.',
      });
    }

    // 4. Server-side validation and sanitization
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
    const trimmedService = typeof service === 'string' ? service.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    const invalidFields = [];
    let firstErrorMessage = '';

    // Name validation: 2 to 100 characters
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      invalidFields.push('name');
      firstErrorMessage = firstErrorMessage || 'Full Name must be between 2 and 100 characters.';
    }

    // Phone validation: allow digits, spaces, +, -, (, ), 7 to 15 digits after stripping
    const phoneAllowedChars = /^[0-9\s+\-()]+$/;
    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    const isPhoneValid = phoneAllowedChars.test(trimmedPhone) && phoneDigits.length >= 7 && phoneDigits.length <= 15;
    if (!trimmedPhone || !isPhoneValid) {
      invalidFields.push('phone');
      firstErrorMessage = firstErrorMessage || 'Please provide a valid contact telephone number (7 to 15 digits).';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || trimmedEmail.length > 100 || !emailRegex.test(trimmedEmail)) {
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
    if (!trimmedService || !allowedList.includes(trimmedService)) {
      invalidFields.push('service');
      firstErrorMessage = firstErrorMessage || 'Please select a valid service from the options.';
    }

    // Message validation: 10 to 1000 characters
    if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
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

    // 5. Database configuration check
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('[API Error] DATABASE_URL environment variable is missing.');
      return res.status(500).json({
        ok: false,
        error: 'Database configuration unavailable. Please contact us directly via WhatsApp or telephone.',
      });
    }

    const sql = neon(databaseUrl);

    // 6. Rate limiting: SHA-256 hash of (IP + salt), max 5 per hour
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedIp = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : (Array.isArray(forwarded) ? forwarded[0].trim() : null);
    const rawIp = forwardedIp || req.socket?.remoteAddress || '127.0.0.1';
    const salt = process.env.RATE_LIMIT_SALT || 'grace_way_accounting_salt_2026';
    const ipHash = crypto.createHash('sha256').update(rawIp + salt).digest('hex');

    // Safe rate-limit check: if check query errors, log and proceed without failing request
    let submissionCount = 0;
    try {
      const recentSubmissions = await sql`
        SELECT COUNT(*)::int AS count 
        FROM enquiries 
        WHERE ip_hash = ${ipHash} 
          AND created_at > NOW() - INTERVAL '1 hour'
      `;
      submissionCount = Number(recentSubmissions[0]?.count || 0);
    } catch (rateLimitErr) {
      console.warn('[Rate Limit Warning]: Query failed, proceeding to save enquiry:', rateLimitErr.message || rateLimitErr);
    }

    if (submissionCount >= 5) {
      return res.status(429).json({
        ok: false,
        error: 'Too many enquiries. Please try again later or call us.',
      });
    }

    // 7. Safe parameterized insertion into enquiries table
    await sql`
      INSERT INTO enquiries (name, email, phone, service, message, ip_hash)
      VALUES (
        ${trimmedName},
        ${trimmedEmail},
        ${trimmedPhone},
        ${trimmedService},
        ${trimmedMessage},
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

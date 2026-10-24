import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

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
    const body = req.body || {};
    const { name, email, phone, service, message, website_url } = body;

    // 2. Honeypot check - return 200 silently to foil spam bots without DB write
    if (website_url && typeof website_url === 'string' && website_url.trim().length > 0) {
      return res.status(200).json({ ok: true });
    }

    // 3. Server-side validation and sanitization
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const trimmedPhone = typeof phone === 'string' ? phone.trim() : '';
    const trimmedService = typeof service === 'string' ? service.trim() : '';
    const trimmedMessage = typeof message === 'string' ? message.trim() : '';

    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
      return res.status(400).json({
        ok: false,
        error: 'Full Name must be between 2 and 100 characters.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || trimmedEmail.length > 100 || !emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        ok: false,
        error: 'Please provide a valid email address.',
      });
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,25}$/;
    if (!trimmedPhone || trimmedPhone.length > 30 || !phoneRegex.test(trimmedPhone)) {
      return res.status(400).json({
        ok: false,
        error: 'Please provide a valid contact telephone number.',
      });
    }

    const allowedServices = [
      'Accounting & Bookkeeping',
      'Taxation & Compliance',
      'Business Consultancy',
      'Other',
    ];
    const isValidService = allowedServices.some(
      (s) => s.toLowerCase() === trimmedService.toLowerCase()
    ) || (trimmedService.length >= 2 && trimmedService.length <= 100);

    if (!trimmedService || !isValidService) {
      return res.status(400).json({
        ok: false,
        error: 'Please select a valid service.',
      });
    }

    if (!trimmedMessage || trimmedMessage.length < 10 || trimmedMessage.length > 1000) {
      return res.status(400).json({
        ok: false,
        error: 'Message must be between 10 and 1,000 characters.',
      });
    }

    // 4. Database configuration check
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('[API Error] DATABASE_URL environment variable is missing.');
      return res.status(500).json({
        ok: false,
        error: 'Database configuration unavailable. Please contact us directly via WhatsApp or telephone.',
      });
    }

    const sql = neon(databaseUrl);

    // 5. Rate limiting: SHA-256 hash of (IP + salt), max 5 per hour
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || '127.0.0.1';
    const salt = process.env.RATE_LIMIT_SALT || 'grace_way_accounting_salt_2026';
    const ipHash = crypto.createHash('sha256').update(rawIp + salt).digest('hex');

    // Query submissions in the last 1 hour using parameterized tagged template
    const recentSubmissions = await sql`
      SELECT COUNT(*)::int AS count 
      FROM enquiries 
      WHERE ip_hash = ${ipHash} 
        AND created_at > NOW() - INTERVAL '1 hour'
    `;

    const submissionCount = Number(recentSubmissions[0]?.count || 0);

    if (submissionCount >= 5) {
      return res.status(429).json({
        ok: false,
        error: 'Enquiry rate limit reached (maximum 5 requests per hour). Please contact us directly via telephone or WhatsApp.',
      });
    }

    // 6. Safe parameterized insertion into enquiries table
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

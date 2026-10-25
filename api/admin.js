import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { ALLOWED_SERVICES } from '../src/data/serviceOptions.js';

const COOKIE_NAME = 'gw_admin';
const COOKIE_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds
const MAX_PAYLOAD_SIZE = 8192; // 8KB payload cap to prevent buffer exhaustion DoS

/**
 * Extracts a cookie value by name from the request headers
 */
function getCookie(req, name) {
  const header = req.headers.cookie;
  if (!header || typeof header !== 'string') return null;
  const match = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Computes a client binding fingerprint from IP hash and User-Agent
 * Prevents session hijacking if an attacker steals the session cookie
 */
function computeClientBinding(ipHash, userAgent, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${ipHash}:${userAgent}`)
    .digest('base64url')
    .slice(0, 16);
}

/**
 * Derives a dynamic signing key bound to both the session secret and the current admin password.
 * If the admin password is changed or rotated, all existing sessions immediately become invalid.
 */
function deriveSigningKey(sessionSecret, adminPassword) {
  return crypto
    .createHmac('sha256', sessionSecret)
    .update(adminPassword)
    .digest();
}

/**
 * Creates a signed, device-bound session token:
 * base64url(JSON { exp, bnd }) + "." + HMAC-SHA256(payload, signingKey) in base64url
 */
function createSessionToken(sessionSecret, adminPassword, ipHash, userAgent) {
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const bnd = computeClientBinding(ipHash, userAgent, sessionSecret);
  const payloadStr = JSON.stringify({ exp, bnd });
  const payloadB64 = Buffer.from(payloadStr, 'utf8').toString('base64url');

  const signingKey = deriveSigningKey(sessionSecret, adminPassword);
  const signature = crypto.createHmac('sha256', signingKey).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies session token signature, expiration, and client IP/Device binding
 */
function verifySessionToken(token, sessionSecret, adminPassword, ipHash, userAgent) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, signature] = parts;

  // 1. Verify HMAC signature in constant time
  const signingKey = deriveSigningKey(sessionSecret, adminPassword);
  const expectedSig = crypto.createHmac('sha256', signingKey).update(payloadB64).digest('base64url');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  // 2. Parse payload and verify expiry
  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return false;
  }

  if (!payload.exp || typeof payload.exp !== 'number') return false;
  if (payload.exp <= Math.floor(Date.now() / 1000)) return false;

  // 3. Verify Client Binding (Anti-Session-Hijacking: token cannot be used from another IP or browser)
  if (payload.bnd) {
    const expectedBinding = computeClientBinding(ipHash, userAgent, sessionSecret);
    const bndBuf = Buffer.from(payload.bnd);
    const expBndBuf = Buffer.from(expectedBinding);
    if (bndBuf.length !== expBndBuf.length || !crypto.timingSafeEqual(bndBuf, expBndBuf)) {
      console.warn('[Admin Security Alert]: Session token client binding mismatch. Rejecting hijacked token.');
      return false;
    }
  }

  return true;
}

/**
 * Verifies request origin against host to prevent Cross-Site Request Forgery (CSRF)
 */
function isTrustedOrigin(req) {
  const origin = req.headers['origin'] || req.headers['referer'];
  if (!origin) return true; // Direct programmatic calls without browser origin
  try {
    const originHost = new URL(origin).host;
    const reqHost = req.headers['host'];
    return originHost === reqHost;
  } catch {
    return false;
  }
}

/**
 * Strips dangerous control characters and null bytes from input strings
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

/**
 * Fortified serverless API handler for /api/admin
 */
export default async function handler(req, res) {
  // Enterprise Security Headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // Reject oversized payloads early to prevent memory exhaustion
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  if (contentLength > MAX_PAYLOAD_SIZE) {
    return res.status(413).json({ ok: false, error: 'Payload exceeds maximum permitted size' });
  }

  // Cross-Site Request Forgery (CSRF) check on state-changing requests
  if (req.method === 'POST' && !isTrustedOrigin(req)) {
    console.warn('[Admin Security Alert]: Cross-origin request rejected.');
    return res.status(403).json({ ok: false, error: 'Cross-origin request rejected' });
  }

  const action = sanitizeString(req.query.action || '').toLowerCase();

  // 1. Fail closed configuration check
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const databaseUrl = process.env.DATABASE_URL;

  if (
    !adminPassword ||
    adminPassword.length < 12 ||
    !sessionSecret ||
    Buffer.byteLength(sessionSecret, 'utf8') < 32 ||
    !databaseUrl
  ) {
    if (!adminPassword) {
      console.error('[Admin Security Error] ADMIN_PASSWORD environment variable is missing.');
    } else if (adminPassword.length < 12) {
      console.error('[Admin Security Error] ADMIN_PASSWORD must be at least 12 characters.');
    }
    if (!sessionSecret || Buffer.byteLength(sessionSecret, 'utf8') < 32) {
      console.error('[Admin Security Error] ADMIN_SESSION_SECRET is missing or under 32 bytes.');
    }
    if (!databaseUrl) {
      console.error('[Admin Security Error] DATABASE_URL environment variable is missing.');
    }

    return res.status(503).json({
      ok: false,
      error: 'Admin is not configured',
    });
  }

  const sql = neon(databaseUrl);

  // Compute hashed IP for rate limiting and audit logging
  const forwarded = req.headers['x-forwarded-for'];
  const forwardedIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : (Array.isArray(forwarded) ? forwarded[0].trim() : null);
  const rawIp = forwardedIp || req.socket?.remoteAddress || '127.0.0.1';
  const salt = process.env.RATE_LIMIT_SALT || 'grace_way_accounting_salt_2026';
  const ipHash = crypto.createHash('sha256').update(rawIp + salt).digest('hex');
  const userAgent = req.headers['user-agent'] || 'unknown';

  // =========================================================================
  // ACTION: login (POST ?action=login)
  // =========================================================================
  if (action === 'login') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ ok: false, error: `Method ${req.method} Not Allowed` });
    }

    // Multi-tier Rate Limiting:
    // Tier A: Max 5 failed attempts per IP in last 15 minutes
    // Tier B: Max 25 failed attempts globally across all IPs in last 15 minutes (Anti-distributed botnet)
    try {
      const recentAttempts = await sql`
        SELECT 
          COUNT(*) FILTER (WHERE ip_hash = ${ipHash} AND success = false AND created_at > NOW() - INTERVAL '15 minutes')::int AS ip_failures,
          COUNT(*) FILTER (WHERE success = false AND created_at > NOW() - INTERVAL '15 minutes')::int AS global_failures
        FROM admin_login_attempts
      `;
      const ipFailures = Number(recentAttempts[0]?.ip_failures || 0);
      const globalFailures = Number(recentAttempts[0]?.global_failures || 0);

      if (ipFailures >= 5) {
        return res.status(429).json({
          ok: false,
          error: 'Too many attempts. Try again later.',
        });
      }

      if (globalFailures >= 25) {
        console.warn('[Admin Security Alert]: Global distributed login throttle activated.');
        return res.status(429).json({
          ok: false,
          error: 'Too many login attempts worldwide. Access temporarily throttled.',
        });
      }
    } catch (dbErr) {
      console.error('[Admin Rate-Limit Error]:', dbErr.message || dbErr);
    }

    // Parse request body defensively
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    const submittedPassword = typeof body?.password === 'string' ? body.password : '';

    // Peppered HMAC-SHA256 comparison using constant-time timingSafeEqual
    const pepper = process.env.RATE_LIMIT_SALT || 'gw_security_pepper_2026';
    const submittedDigest = crypto.createHmac('sha256', pepper).update(submittedPassword).digest();
    const adminDigest = crypto.createHmac('sha256', pepper).update(adminPassword).digest();
    const isMatch = crypto.timingSafeEqual(submittedDigest, adminDigest);

    // Record login attempt in admin_login_attempts table
    try {
      await sql`
        INSERT INTO admin_login_attempts (ip_hash, success)
        VALUES (${ipHash}, ${isMatch})
      `;
    } catch (recordErr) {
      console.error('[Admin Login Attempt Record Error]:', recordErr.message || recordErr);
    }

    if (!isMatch) {
      // Artificial delay with cryptographic random jitter (550ms + 0-100ms) to defeat statistical timing analysis
      const jitterMs = 550 + crypto.randomInt(100);
      await new Promise((resolve) => setTimeout(resolve, jitterMs));
      return res.status(401).json({
        ok: false,
        error: 'Incorrect password',
      });
    }

    // Password valid -> Create signed, device-bound session token
    const token = createSessionToken(sessionSecret, adminPassword, ipHash, userAgent);
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? '; Secure' : '';
    const cookieHeader = `${COOKIE_NAME}=${token}; HttpOnly${secureFlag}; SameSite=Strict; Path=/; Max-Age=${COOKIE_MAX_AGE}`;
    res.setHeader('Set-Cookie', cookieHeader);

    return res.status(200).json({
      ok: true,
      message: 'Authentication successful',
    });
  }

  // =========================================================================
  // ACTION: session (GET ?action=session)
  // =========================================================================
  if (action === 'session') {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ ok: false, error: `Method ${req.method} Not Allowed` });
    }

    const token = getCookie(req, COOKIE_NAME);
    const isValid = verifySessionToken(token, sessionSecret, adminPassword, ipHash, userAgent);
    if (!isValid) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized',
      });
    }

    return res.status(200).json({ ok: true });
  }

  // =========================================================================
  // ACTION: logout (POST ?action=logout)
  // =========================================================================
  if (action === 'logout') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ ok: false, error: `Method ${req.method} Not Allowed` });
    }

    // CSRF Guard: require X-Requested-With: gw-admin
    const csrfHeader = req.headers['x-requested-with'];
    if (csrfHeader !== 'gw-admin') {
      return res.status(400).json({ ok: false, error: 'Invalid request headers' });
    }

    // Verify session
    const token = getCookie(req, COOKIE_NAME);
    const isValid = verifySessionToken(token, sessionSecret, adminPassword, ipHash, userAgent);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    // Clear cookie
    const isProd = process.env.NODE_ENV === 'production';
    const secureFlag = isProd ? '; Secure' : '';
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=; HttpOnly${secureFlag}; SameSite=Strict; Path=/; Max-Age=0`
    );

    return res.status(200).json({ ok: true, message: 'Logged out successfully' });
  }

  // =========================================================================
  // ACTION: delete (POST ?action=delete)
  // Supports single deletion ({ id: 123 }) and multi-select deletion ({ ids: [1, 2, ...] })
  // =========================================================================
  if (action === 'delete') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ ok: false, error: `Method ${req.method} Not Allowed` });
    }

    // CSRF Guard: require X-Requested-With: gw-admin
    const csrfHeader = req.headers['x-requested-with'];
    if (csrfHeader !== 'gw-admin') {
      return res.status(400).json({ ok: false, error: 'Invalid request headers' });
    }

    // Verify session
    const token = getCookie(req, COOKIE_NAME);
    const isValid = verifySessionToken(token, sessionSecret, adminPassword, ipHash, userAgent);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    // Parse request body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    // Extract IDs: support either { id: 123 } or { ids: [1, 2, 3] }
    const rawIds = Array.isArray(body?.ids)
      ? body.ids
      : (body?.id !== undefined ? [body.id] : []);

    const idsToDelete = rawIds
      .map((n) => parseInt(n, 10))
      .filter((n) => Number.isInteger(n) && n > 0);

    if (idsToDelete.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'No valid enquiry IDs specified for deletion',
      });
    }

    if (idsToDelete.length > 100) {
      return res.status(400).json({
        ok: false,
        error: 'Maximum 100 enquiries can be deleted at once',
      });
    }

    try {
      const deletedRows = await sql`
        DELETE FROM enquiries
        WHERE id = ANY(${idsToDelete})
        RETURNING id
      `;

      return res.status(200).json({
        ok: true,
        deletedCount: deletedRows.length,
        deletedIds: deletedRows.map((r) => r.id),
      });
    } catch (delErr) {
      console.error('[Admin Delete Error]:', delErr.message || delErr);
      return res.status(500).json({
        ok: false,
        error: 'Failed to delete enquiries',
      });
    }
  }

  // =========================================================================
  // ACTION: list (GET ?action=list)
  // =========================================================================
  if (action === 'list') {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ ok: false, error: `Method ${req.method} Not Allowed` });
    }

    // Verify session
    const token = getCookie(req, COOKIE_NAME);
    const isValid = verifySessionToken(token, sessionSecret, adminPassword, ipHash, userAgent);
    if (!isValid) {
      return res.status(401).json({
        ok: false,
        error: 'Unauthorized',
      });
    }

    try {
      // Clamped query parameters
      const rawPage = parseInt(req.query.page, 10);
      const page = !isNaN(rawPage) && rawPage >= 1 ? rawPage : 1;

      const rawPageSize = parseInt(req.query.pageSize, 10);
      const pageSize = !isNaN(rawPageSize) && rawPageSize >= 1 && rawPageSize <= 50 ? rawPageSize : 20;
      const offset = (page - 1) * pageSize;

      // Search parameter: sanitize, clamp to 100 chars and escape % and _ for ILIKE wildcard safety
      const rawQ = sanitizeString(req.query.q || '').slice(0, 100);
      const escapedQ = rawQ.replace(/[%_\\]/g, '\\$&');
      const qPattern = escapedQ ? `%${escapedQ}%` : '';

      // Service filter: must be in ALLOWED_SERVICES or empty
      const rawService = sanitizeString(req.query.service || '');
      const filterService = (ALLOWED_SERVICES || []).includes(rawService) ? rawService : '';

      // Sort order
      const sort = req.query.sort === 'oldest' ? 'oldest' : 'newest';

      // 1. Single aggregation query for KPI counts: all, today, last7days
      const countsResult = await sql`
        SELECT 
          COUNT(*)::int AS all_count,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE)::int AS today_count,
          COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days')::int AS last7days_count
        FROM enquiries
      `;
      const counts = {
        all: Number(countsResult[0]?.all_count || 0),
        today: Number(countsResult[0]?.today_count || 0),
        last7days: Number(countsResult[0]?.last7days_count || 0),
      };

      // 2. Count total rows matching search and filter
      const totalResult = await sql`
        SELECT COUNT(*)::int AS total
        FROM enquiries
        WHERE (${qPattern} = '' OR (
          name ILIKE ${qPattern} OR 
          email ILIKE ${qPattern} OR 
          phone ILIKE ${qPattern} OR 
          message ILIKE ${qPattern}
        ))
        AND (${filterService} = '' OR service = ${filterService})
      `;
      const total = Number(totalResult[0]?.total || 0);

      // 3. Paged items query (NEVER selects or returns ip_hash)
      let items;
      if (sort === 'oldest') {
        items = await sql`
          SELECT id, name, email, phone, service, message, status, created_at
          FROM enquiries
          WHERE (${qPattern} = '' OR (
            name ILIKE ${qPattern} OR 
            email ILIKE ${qPattern} OR 
            phone ILIKE ${qPattern} OR 
            message ILIKE ${qPattern}
          ))
          AND (${filterService} = '' OR service = ${filterService})
          ORDER BY created_at ASC, id ASC
          LIMIT ${pageSize} OFFSET ${offset}
        `;
      } else {
        items = await sql`
          SELECT id, name, email, phone, service, message, status, created_at
          FROM enquiries
          WHERE (${qPattern} = '' OR (
            name ILIKE ${qPattern} OR 
            email ILIKE ${qPattern} OR 
            phone ILIKE ${qPattern} OR 
            message ILIKE ${qPattern}
          ))
          AND (${filterService} = '' OR service = ${filterService})
          ORDER BY created_at DESC, id DESC
          LIMIT ${pageSize} OFFSET ${offset}
        `;
      }

      return res.status(200).json({
        ok: true,
        items,
        total,
        page,
        pageSize,
        counts,
      });
    } catch (listErr) {
      console.error('[Admin List Error]:', listErr.message || listErr);
      return res.status(500).json({
        ok: false,
        error: 'Failed to retrieve enquiries list',
      });
    }
  }

  // Any other action or method
  return res.status(400).json({
    ok: false,
    error: 'Invalid action parameter',
  });
}

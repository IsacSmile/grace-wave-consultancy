import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';
import { ALLOWED_SERVICES } from '../src/data/serviceOptions.js';

const COOKIE_NAME = 'gw_admin';
const COOKIE_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds

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
 * Creates a signed session token: base64url(JSON { exp }) + "." + HMAC-SHA256(payload, secret) in base64url
 */
function createSessionToken(secret) {
  const exp = Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE;
  const payloadStr = JSON.stringify({ exp });
  const payloadB64 = Buffer.from(payloadStr, 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

/**
 * Verifies the session token using timingSafeEqual and checks expiration
 */
function verifySessionToken(token, secret) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, signature] = parts;

  const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.exp || typeof payload.exp !== 'number') return false;
    if (payload.exp <= Math.floor(Date.now() / 1000)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Single serverless function handling /api/admin operations
 */
export default async function handler(req, res) {
  // Always set security & cache headers
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  const action = (req.query.action || '').trim().toLowerCase();

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

  // =========================================================================
  // ACTION: login (POST ?action=login)
  // =========================================================================
  if (action === 'login') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ ok: false, error: `Method ${req.method} Not Allowed` });
    }

    // Rate limiting: 5 failed attempts in last 15 minutes for this hashed IP
    try {
      const recentFails = await sql`
        SELECT COUNT(*)::int AS count 
        FROM admin_login_attempts 
        WHERE ip_hash = ${ipHash} 
          AND success = false 
          AND created_at > NOW() - INTERVAL '15 minutes'
      `;
      const failCount = Number(recentFails[0]?.count || 0);
      if (failCount >= 5) {
        return res.status(429).json({
          ok: false,
          error: 'Too many attempts. Try again later.',
        });
      }
    } catch (dbErr) {
      console.error('[Admin Rate-Limit Error]:', dbErr.message || dbErr);
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
    const submittedPassword = typeof body?.password === 'string' ? body.password : '';

    // Compare digests using crypto.timingSafeEqual (constant time, equal length buffers)
    const submittedDigest = crypto.createHash('sha256').update(submittedPassword).digest();
    const adminDigest = crypto.createHash('sha256').update(adminPassword).digest();
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
      // Artificial delay (~600ms) to mitigate timing analysis & brute-force throughput
      await new Promise((resolve) => setTimeout(resolve, 600));
      return res.status(401).json({
        ok: false,
        error: 'Incorrect password',
      });
    }

    // Password valid -> Create signed session token and set HttpOnly SameSite cookie
    const token = createSessionToken(sessionSecret);
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
    const isValid = verifySessionToken(token, sessionSecret);
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
    const isValid = verifySessionToken(token, sessionSecret);
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
  // ACTION: list (GET ?action=list)
  // =========================================================================
  if (action === 'list') {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).json({ ok: false, error: `Method ${req.method} Not Allowed` });
    }

    // Verify session
    const token = getCookie(req, COOKIE_NAME);
    const isValid = verifySessionToken(token, sessionSecret);
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

      // Search parameter: clamp to 100 chars and escape % and _ for ILIKE wildcard safety
      const rawQ = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : '';
      const escapedQ = rawQ.replace(/[%_]/g, '\\$&');
      const qPattern = escapedQ ? `%${escapedQ}%` : '';

      // Service filter: must be in ALLOWED_SERVICES or empty
      const rawService = typeof req.query.service === 'string' ? req.query.service.trim() : '';
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

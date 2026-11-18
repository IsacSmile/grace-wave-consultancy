import crypto from 'crypto';
import { neon } from '@neondatabase/serverless';

const COOKIE_NAME = 'gw_admin';
const MAX_PAYLOAD_SIZE = 8 * 1024 * 1024; // 8MB to allow image uploads (base64)

function getCookie(req, name) {
  const header = req.headers.cookie;
  if (!header || typeof header !== 'string') return null;
  const match = header.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function computeClientBinding(ipHash, userAgent, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(`${ipHash}:${userAgent}`)
    .digest('base64url')
    .slice(0, 16);
}

function deriveSigningKey(sessionSecret, adminPassword) {
  return crypto
    .createHmac('sha256', sessionSecret)
    .update(adminPassword)
    .digest();
}

function verifySessionToken(token, sessionSecret, adminPassword, ipHash, userAgent) {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, signature] = parts;

  const signingKey = deriveSigningKey(sessionSecret, adminPassword);
  const expectedSig = crypto.createHmac('sha256', signingKey).update(payloadB64).digest('base64url');
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return false;
  }

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return false;
  }

  if (!payload.exp || typeof payload.exp !== 'number') return false;
  if (payload.exp <= Math.floor(Date.now() / 1000)) return false;

  if (payload.bnd) {
    const expectedBinding = computeClientBinding(ipHash, userAgent, sessionSecret);
    const bndBuf = Buffer.from(payload.bnd);
    const expBndBuf = Buffer.from(expectedBinding);
    if (bndBuf.length !== expBndBuf.length || !crypto.timingSafeEqual(bndBuf, expBndBuf)) {
      return false;
    }
  }

  return true;
}

function isTrustedOrigin(req) {
  const origin = req.headers['origin'] || req.headers['referer'];
  if (!origin) return true;
  try {
    const originHost = new URL(origin).host;
    const reqHost = req.headers['host'];
    return originHost === reqHost;
  } catch {
    return false;
  }
}

/**
 * Serverless API handler for /api/content
 * GET: Public read for site content
 * POST: Authenticated admin write to update live content
 */
export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    // If database is not configured, respond with empty content object (frontend will use defaults)
    return res.status(200).json({ ok: true, content: {} });
  }

  const sql = neon(databaseUrl);

  // =========================================================================
  // GET: Public fetch of published content
  // =========================================================================
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    try {
      // Ensure table exists
      await sql`
        CREATE TABLE IF NOT EXISTS site_content (
          key TEXT PRIMARY KEY,
          content JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_by TEXT DEFAULT 'admin'
        )
      `;

      const rows = await sql`
        SELECT key, content, updated_at
        FROM site_content
      `;

      const content = {};
      for (const row of rows) {
        content[row.key] = row.content;
      }

      return res.status(200).json({
        ok: true,
        content,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('[Content API GET Error]:', err.message || err);
      // Graceful fallback
      return res.status(200).json({ ok: true, content: {} });
    }
  }

  // =========================================================================
  // POST: Admin save content
  // =========================================================================
  if (req.method === 'POST') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

    // 1. Check origin for CSRF
    if (!isTrustedOrigin(req)) {
      return res.status(403).json({ ok: false, error: 'Cross-origin request rejected' });
    }

    // 2. Check CSRF header
    const csrfHeader = req.headers['x-requested-with'];
    if (csrfHeader !== 'gw-admin') {
      return res.status(400).json({ ok: false, error: 'Invalid request headers' });
    }

    // 3. Payload size check
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > MAX_PAYLOAD_SIZE) {
      return res.status(413).json({ ok: false, error: 'Payload exceeds maximum permitted size (8MB)' });
    }

    // 4. Authenticate admin
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;
    if (!adminPassword || !sessionSecret) {
      return res.status(503).json({ ok: false, error: 'Admin is not configured' });
    }

    const forwarded = req.headers['x-forwarded-for'];
    const forwardedIp = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : (Array.isArray(forwarded) ? forwarded[0].trim() : null);
    const rawIp = forwardedIp || req.socket?.remoteAddress || '127.0.0.1';
    const salt = process.env.RATE_LIMIT_SALT || 'grace_way_accounting_salt_2026';
    const ipHash = crypto.createHash('sha256').update(rawIp + salt).digest('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';

    const token = getCookie(req, COOKIE_NAME);
    const isValid = verifySessionToken(token, sessionSecret, adminPassword, ipHash, userAgent);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    // 5. Parse body
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ ok: false, error: 'Invalid JSON payload' });
      }
    }

    // Handle single section { key, content } or multi-section { content: { hero: ..., stats: ... } }
    const entriesToSave = [];
    if (body.key && body.content !== undefined) {
      entriesToSave.push({ key: String(body.key), content: body.content });
    } else if (body.content && typeof body.content === 'object') {
      for (const [k, v] of Object.entries(body.content)) {
        if (v !== undefined) {
          entriesToSave.push({ key: String(k), content: v });
        }
      }
    }

    if (entriesToSave.length === 0) {
      return res.status(400).json({ ok: false, error: 'No content provided to save' });
    }

    try {
      await sql`
        CREATE TABLE IF NOT EXISTS site_content (
          key TEXT PRIMARY KEY,
          content JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_by TEXT DEFAULT 'admin'
        )
      `;

      for (const item of entriesToSave) {
        const jsonContent = JSON.stringify(item.content);
        await sql`
          INSERT INTO site_content (key, content, updated_at)
          VALUES (${item.key}, ${jsonContent}::jsonb, NOW())
          ON CONFLICT (key)
          DO UPDATE SET
            content = EXCLUDED.content,
            updated_at = NOW()
        `;
      }

      return res.status(200).json({
        ok: true,
        message: 'Content successfully saved and published live',
        savedKeys: entriesToSave.map((e) => e.key),
      });
    } catch (saveErr) {
      console.error('[Content API Save Error]:', saveErr.message || saveErr);
      return res.status(500).json({
        ok: false,
        error: 'Failed to save content to database',
      });
    }
  }

  // =========================================================================
  // DELETE: Reset content to default
  // =========================================================================
  if (req.method === 'DELETE') {
    // CSRF & Auth checks
    if (!isTrustedOrigin(req)) return res.status(403).json({ ok: false, error: 'Forbidden' });
    if (req.headers['x-requested-with'] !== 'gw-admin') return res.status(400).json({ ok: false, error: 'Invalid header' });

    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;
    const forwarded = req.headers['x-forwarded-for'];
    const forwardedIp = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null;
    const rawIp = forwardedIp || req.socket?.remoteAddress || '127.0.0.1';
    const salt = process.env.RATE_LIMIT_SALT || 'grace_way_accounting_salt_2026';
    const ipHash = crypto.createHash('sha256').update(rawIp + salt).digest('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';

    const token = getCookie(req, COOKIE_NAME);
    if (!verifySessionToken(token, sessionSecret, adminPassword, ipHash, userAgent)) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    const key = req.query.key;
    try {
      if (key) {
        await sql`DELETE FROM site_content WHERE key = ${String(key)}`;
      } else {
        await sql`DELETE FROM site_content`;
      }
      return res.status(200).json({ ok: true, message: 'Content reset to defaults' });
    } catch (delErr) {
      console.error('[Content API Reset Error]:', delErr.message || delErr);
      return res.status(500).json({ ok: false, error: 'Failed to reset content' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ ok: false, error: `Method ${req.method} Not Allowed` });
}


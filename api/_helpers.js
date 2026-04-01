const crypto = require('crypto');

// Derive a signing secret from the admin password — never transmitted
function signingSecret() {
  const base = process.env.ADMIN_PASSWORD || '';
  if (!base) throw new Error('ADMIN_PASSWORD env var not set');
  return crypto.createHash('sha256').update('homemeal-token-v1:' + base).digest('hex');
}

// Issue a simple HMAC token: "role.expiry.hmac"
function issueToken(role, chef_id) {
  const expiry  = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
  const payload = role + '.' + expiry + (chef_id ? '.' + chef_id : '');
  const sig     = crypto.createHmac('sha256', signingSecret()).update(payload).digest('hex');
  return payload + '.' + sig;
}

// Verify token — returns { role, chef_id } or null
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  // format: role.expiry[.chef_id].sig  — sig is always last
  if (parts.length < 3) return null;
  const sig     = parts[parts.length - 1];
  const payload = parts.slice(0, -1).join('.');
  const expected = crypto.createHmac('sha256', signingSecret()).update(payload).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))) return null;
  const [role, expiry, chef_id] = parts;
  if (Date.now() > parseInt(expiry)) return null;
  return { role, chef_id: chef_id || null };
}

// In-memory brute-force tracking (per-process, resets on cold start — good enough for Vercel)
const loginAttempts = {};
function checkRateLimit(key) {
  const now    = Date.now();
  const window = 15 * 60 * 1000; // 15 min
  const max    = 10;
  if (!loginAttempts[key]) loginAttempts[key] = [];
  loginAttempts[key] = loginAttempts[key].filter(t => now - t < window);
  if (loginAttempts[key].length >= max) return false;
  loginAttempts[key].push(now);
  return true;
}

const ALLOWED_ORIGINS = [
  'https://homemeal.com.au',
  'https://www.homemeal.com.au',
  'https://homechef-mvp.vercel.app',
];

function cors(req, res) {
  const origin = req.headers.origin || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Vary', 'Origin');
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

// Wrap a handler with CORS + security headers + error catching
function handle(fn) {
  return async (req, res) => {
    cors(req, res);
    if (req.method === 'OPTIONS') return res.status(200).end();
    try {
      await fn(req, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Middleware: require admin or chef token
function requireAuth(req, res) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  const claims = verifyToken(token);
  if (!claims) {
    res.status(401).json({ error: 'Unauthorised' });
    return null;
  }
  return claims;
}

// Middleware: require admin-role token only
function requireAdmin(req, res) {
  const claims = requireAuth(req, res);
  if (!claims) return null;
  if (claims.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return claims;
}

module.exports = { cors, handle, issueToken, verifyToken, requireAuth, requireAdmin, checkRateLimit };

const db = require('./_db');
const { handle, issueToken, checkRateLimit } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, password, username, chef_password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  // ── Admin login ──
  if (type === 'admin') {
    if (!checkRateLimit('admin:' + ip)) {
      return res.status(429).json({ error: 'Too many attempts. Please wait 15 minutes.' });
    }
    const adminPwd = process.env.ADMIN_PASSWORD;
    if (!adminPwd) return res.status(500).json({ error: 'Server misconfigured.' });
    if (password !== adminPwd) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }
    const token = issueToken('admin', null);
    return res.json({ ok: true, role: 'admin', token });
  }

  // ── Chef login ──
  if (type === 'chef') {
    if (!username || !chef_password) {
      return res.status(400).json({ error: 'Username and password required.' });
    }
    if (!checkRateLimit('chef:' + ip)) {
      return res.status(429).json({ error: 'Too many attempts. Please wait 15 minutes.' });
    }
    const { data, error } = await db
      .from('chef_accounts')
      .select('*')
      .eq('username', username.trim())
      .eq('active', true)
      .single();

    if (error || !data || data.password !== chef_password) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    const token = issueToken('chef', data.chef_id);
    return res.json({
      ok: true,
      role: 'chef',
      token,
      chef_id: data.chef_id,
      chef_name: data.chef_name,
      username: data.username,
    });
  }

  res.status(400).json({ error: 'Unknown auth type.' });
});

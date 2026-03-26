const db = require('./_db');
const { handle } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, password, username, chef_password } = req.body;

  // ── Admin login ──
  if (type === 'admin') {
    const adminPwd = process.env.ADMIN_PASSWORD || 'admin123';
    if (password === adminPwd) {
      return res.json({ ok: true, role: 'admin' });
    }
    return res.status(401).json({ error: 'Incorrect password.' });
  }

  // ── Chef login ──
  if (type === 'chef') {
    const { data, error } = await db
      .from('chef_accounts')
      .select('*')
      .eq('username', username.trim())
      .eq('active', true)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    if (data.password !== chef_password) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }
    return res.json({
      ok: true,
      role: 'chef',
      chef_id: data.chef_id,
      chef_name: data.chef_name,
      username: data.username,
    });
  }

  res.status(400).json({ error: 'Unknown auth type.' });
});

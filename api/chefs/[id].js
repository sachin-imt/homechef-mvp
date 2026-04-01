const db = require('../_db');
const { handle, requireAdmin, requireAuth } = require('../_helpers');

module.exports = handle(async (req, res) => {
  const { id } = req.query;

  // GET: chef portal reads their own record; admin reads any
  if (req.method === 'GET') {
    const claims = requireAuth(req, res);
    if (!claims) return;
    // Chef can only fetch their own record
    if (claims.role === 'chef' && String(claims.chef_id) !== String(id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { data, error } = await db
      .from('chefs')
      .select('*')
      .eq('chef_id', id)
      .single();
    if (error) return res.status(404).json({ error: 'Chef not found' });
    return res.json(data);
  }

  if (req.method === 'PUT') {
    const claims = requireAuth(req, res);
    if (!claims) return;
    // Chef can only update their own record; admin can update any
    if (claims.role === 'chef' && String(claims.chef_id) !== String(id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    delete updates.id;
    // Chefs cannot change their own status or chef_id
    if (claims.role === 'chef') {
      delete updates.status;
      delete updates.chef_id;
    }
    const { data, error } = await db
      .from('chefs')
      .update(updates)
      .eq('chef_id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    const { error } = await db.from('chefs').delete().eq('chef_id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).end();
});

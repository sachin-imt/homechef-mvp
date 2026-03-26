const db = require('../_db');
const { handle } = require('../_helpers');

module.exports = handle(async (req, res) => {
  const { id } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await db
      .from('chefs')
      .select('*')
      .eq('chef_id', id)
      .single();
    if (error) return res.status(404).json({ error: 'Chef not found' });
    return res.json(data);
  }

  if (req.method === 'PUT') {
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    delete updates.id; // don't overwrite PK
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
    const { error } = await db.from('chefs').delete().eq('chef_id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).end();
});

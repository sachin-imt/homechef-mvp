const db = require('./_db');
const { handle } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('chef_accounts')
      .select('*')
      .order('chef_id');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // POST — upsert a chef account (create or update)
  if (req.method === 'POST') {
    const { data, error } = await db
      .from('chef_accounts')
      .upsert(req.body, { onConflict: 'chef_id' })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // DELETE — revoke access for a chef_id
  if (req.method === 'DELETE') {
    const { chef_id } = req.body;
    const { error } = await db
      .from('chef_accounts')
      .delete()
      .eq('chef_id', chef_id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).end();
});

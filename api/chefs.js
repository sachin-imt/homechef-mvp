const db = require('./_db');
const { handle } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('chefs')
      .select('*')
      .eq('status', 'active')
      .order('chef_id');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    let body = { ...req.body };
    // Auto-generate chef_id if not supplied
    if (!body.chef_id) {
      const { data: maxRow } = await db
        .from('chefs').select('chef_id').order('chef_id', { ascending: false }).limit(1).single();
      body.chef_id = (maxRow?.chef_id || 0) + 1;
    }
    const { data, error } = await db
      .from('chefs')
      .insert(body)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).end();
});

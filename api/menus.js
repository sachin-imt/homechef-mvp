const db = require('./_db');
const { handle } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('pending_menus')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { chef_id, chef_name, week, menu_data } = req.body;
    const { data, error } = await db
      .from('pending_menus')
      .insert({
        chef_id, chef_name,
        week: week || '',
        menu_data: menu_data || {},
        status: 'pending',
        submitted_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  // PUT — update status (approve/reject), optionally apply approved menu to chef
  if (req.method === 'PUT') {
    const { id, status } = req.body;
    const { data, error } = await db
      .from('pending_menus')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    // If approved, apply the stored menu_data to the chef record
    if (status === 'approved' && data.chef_id && data.menu_data) {
      await db
        .from('chefs')
        .update({ menus: data.menu_data, updated_at: new Date().toISOString() })
        .eq('chef_id', data.chef_id);
    }

    return res.json(data);
  }

  res.status(405).end();
});

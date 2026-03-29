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
    const { chef_id, chef_name, chef_cuisine, week_key, week_label, dishes_by_day, days: daysField } = req.body;
    const { data, error } = await db
      .from('pending_menus')
      .insert({
        chef_id, chef_name, chef_cuisine, week_key, week_label,
        days: daysField || dishes_by_day,
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
    const { id, status, chef_id, menu_data } = req.body;
    const { data, error } = await db
      .from('pending_menus')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    // If approved, apply the new menus to the chef record
    if (status === 'approved' && chef_id && menu_data) {
      await db
        .from('chefs')
        .update({ menus: menu_data, updated_at: new Date().toISOString() })
        .eq('chef_id', chef_id);
    }

    return res.json(data);
  }

  res.status(405).end();
});

const db = require('./_db');
const { handle, requireAdmin, requireAuth } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
        const { data, error } = await db
      .from('pending_menus')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    if (!requireAuth(req, res)) return;
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
    if (!requireAdmin(req, res)) return;
        const { id, status } = req.body;
    const { data, error } = await db
      .from('pending_menus')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    // If approved, nest menu_data under the correct week key inside chef.menus
    // so cc-detail.js can read chef.menus.currentWeek / chef.menus.nextWeek
    if (status === 'approved' && data.chef_id && data.menu_data) {
      const weekKey = data.week || 'currentWeek';

      // Fetch the chef's existing menus so we can merge rather than overwrite
      const { data: chefRec } = await db
        .from('chefs')
        .select('menus')
        .eq('chef_id', data.chef_id)
        .single();

      const existingMenus = (chefRec && chefRec.menus) || {};
      const updatedMenus = { ...existingMenus, [weekKey]: data.menu_data };

      await db
        .from('chefs')
        .update({ menus: updatedMenus, updated_at: new Date().toISOString() })
        .eq('chef_id', data.chef_id);
    }

    return res.json(data);
  }

  res.status(405).end();
});

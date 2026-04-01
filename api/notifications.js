const db = require('./_db');
const { handle, requireAdmin } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
        const { data, error } = await db
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // PUT /api/notifications — mark notification(s) read
  // Body: { id } to mark one, or { all: true } to mark all
  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
        const { id, all } = req.body;
    if (all) {
      const { error } = await db.from('notifications').update({ read: true }).eq('read', false);
      if (error) return res.status(500).json({ error: error.message });
    } else {
      const { error } = await db.from('notifications').update({ read: true }).eq('id', id);
      if (error) return res.status(500).json({ error: error.message });
    }
    return res.json({ success: true });
  }

  // POST /api/notifications — create one
  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
        const { data, error } = await db
      .from('notifications')
      .insert(req.body)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.status(405).end();
});

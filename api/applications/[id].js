const db = require('../_db');
const { handle } = require('../_helpers');

module.exports = handle(async (req, res) => {
  const { id } = req.query;

  if (req.method === 'PUT') {
    // Only update known columns — strip frontend-only fields like reviewed_at, note
    const { status } = req.body;
    const { data, error } = await db
      .from('chef_applications')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await db.from('chef_applications').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).end();
});

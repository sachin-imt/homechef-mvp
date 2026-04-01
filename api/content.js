const db = require('./_db');
const { handle, requireAdmin } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await db.from('site_content').select('*');
    if (error) return res.status(500).json({ error: error.message });
    // Return as flat key→value object
    const result = {};
    (data || []).forEach(row => { result[row.key] = row.value; });
    return res.json(result);
  }

  // PUT — upsert all content key-value pairs
  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
        const content = req.body; // { hero_badge: "...", ... }
    const rows = Object.entries(content).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }));
    const { error } = await db
      .from('site_content')
      .upsert(rows, { onConflict: 'key' });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).end();
});

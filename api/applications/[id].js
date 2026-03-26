const db = require('../_db');
const { handle } = require('../_helpers');

module.exports = handle(async (req, res) => {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { data, error } = await db
      .from('chef_applications')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  res.status(405).end();
});

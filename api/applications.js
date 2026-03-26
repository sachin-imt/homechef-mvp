const db = require('./_db');
const { handle } = require('./_helpers');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('chef_applications')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    const { data, error } = await db
      .from('chef_applications')
      .insert({ ...req.body, submitted_at: new Date().toISOString() })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    // Push admin notification
    await db.from('notifications').insert({
      type: 'chef_application',
      message: `New chef application from ${data.full_name} (${data.cuisine_type})`,
      ref_id: String(data.id),
    });

    return res.status(201).json(data);
  }

  res.status(405).end();
});

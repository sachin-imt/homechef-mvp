const db = require('./_db');
const { handle } = require('./_helpers');
const { sendEmail, subscriberConfirmationEmail } = require('./_email');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    // Load subscribers with their payments joined
    const { data: subs, error: subErr } = await db
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    if (subErr) return res.status(500).json({ error: subErr.message });

    const { data: payments, error: payErr } = await db
      .from('payments')
      .select('*')
      .order('added_at', { ascending: false });
    if (payErr) return res.status(500).json({ error: payErr.message });

    // Attach payments array to each subscriber
    const result = subs.map(s => ({
      ...s,
      payments: payments.filter(p => p.subscriber_id === s.id),
    }));
    return res.json(result);
  }

  if (req.method === 'POST') {
    // Only pick known DB columns — strip frontend-only fields
    const { name, email, phone, chef_id, chef_name, suburb, postcode,
            dietary, status, status_notes, starting_week } = req.body;
    const subData = { name, email, phone, chef_id, chef_name, suburb, postcode,
                      dietary, status, status_notes, starting_week };
    const { data, error } = await db
      .from('subscribers')
      .insert({ ...subData, created_at: new Date().toISOString() })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    // Push admin notification
    await db.from('notifications').insert({
      type: 'new_subscriber',
      message: `New subscriber: ${data.name} → ${data.chef_name}`,
      ref_id: String(data.id),
    });

    // Send confirmation email to subscriber (fire-and-forget)
    if (data.email) {
      const { subject, html } = subscriberConfirmationEmail({
        name: data.name,
        chef_name: data.chef_name,
        starting_week: data.starting_week,
        amount: req.body.amount,
      });
      sendEmail({ to: data.email, subject, html }).catch(e => console.error('[email] subscriber confirm:', e));
    }

    return res.status(201).json({ ...data, payments: [] });
  }

  res.status(405).end();
});

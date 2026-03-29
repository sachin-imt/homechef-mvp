const db = require('./_db');
const { handle } = require('./_helpers');
const { sendEmail, subscriberConfirmationEmail, chefNewSubscriberEmail, newSubscriberAdminEmail } = require('./_email');

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

    // Send confirmation email to subscriber
    if (data.email) {
      const { subject, html } = subscriberConfirmationEmail({
        name: data.name,
        chef_name: data.chef_name,
        starting_week: data.starting_week,
        amount: req.body.amount,
      });
      await sendEmail({ to: data.email, subject, html }).catch(e => console.error('[email] subscriber confirm:', e));
    }

    // Send chef heads-up (new subscriber, pending payment)
    if (data.chef_id) {
      const { data: chefAccount } = await db.from('chef_accounts').select('chef_email').eq('chef_id', data.chef_id).single();
      if (chefAccount?.chef_email) {
        const { subject: cs, html: ch } = chefNewSubscriberEmail({
          chef_name: data.chef_name,
          subscriber_name: data.name,
          suburb: data.suburb,
          starting_week: data.starting_week,
          dietary: req.body.dietary,
        });
        await sendEmail({ to: chefAccount.chef_email, subject: cs, html: ch }).catch(e => console.error('[email] chef new sub:', e));
      }
    }

    // Send admin notification
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const { subject: as, html: ah } = newSubscriberAdminEmail({
        name: data.name, email: data.email, phone: data.phone,
        chef_name: data.chef_name, suburb: data.suburb, postcode: data.postcode,
        starting_week: data.starting_week, amount: req.body.amount,
        street_address: req.body.street_address,
      });
      await sendEmail({ to: adminEmail, subject: as, html: ah }).catch(e => console.error('[email] admin notify:', e));
    }

    return res.status(201).json({ ...data, payments: [] });
  }

  res.status(405).end();
});

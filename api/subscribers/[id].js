const db = require('../_db');
const { handle, requireAdmin } = require('../_helpers');
const { sendEmail, paymentReceivedEmail, chefPaymentConfirmedEmail } = require('../_email');

module.exports = handle(async (req, res) => {
  const { id } = req.query;

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    const { payments, ...subData } = req.body;
    delete subData.id;

    // Fetch existing confirmed payment weeks before overwriting (to detect newly confirmed)
    const { data: existingPayments } = await db.from('payments').select('week,confirmed').eq('subscriber_id', id);
    const prevConfirmed = new Set((existingPayments || []).filter(p => p.confirmed).map(p => p.week));

    // Update subscriber row
    const { error: subErr } = await db
      .from('subscribers')
      .update({ ...subData, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (subErr) return res.status(500).json({ error: subErr.message });

    // Replace all payments for this subscriber
    if (Array.isArray(payments)) {
      await db.from('payments').delete().eq('subscriber_id', id);
      if (payments.length > 0) {
        const rows = payments.map(p => ({
          subscriber_id: parseInt(id),
          week: p.week || '',
          week_iso: p.week_iso || '',
          status: p.status || 'Pending',
          amount: p.amount || 0,
          confirmed: p.confirmed || false,
          confirmed_at: p.confirmed_at || '',
          note: p.note || '',
          added_by: p.added_by || 'admin',
          added_at: p.added_at || new Date().toISOString().slice(0, 10),
        }));
        const { error: payErr } = await db.from('payments').insert(rows);
        if (payErr) return res.status(500).json({ error: payErr.message });
      }

      // Detect newly confirmed payments and send emails
      const newlyConfirmed = payments.filter(p => p.confirmed && !prevConfirmed.has(p.week));
      if (newlyConfirmed.length > 0) {
        const { data: sub } = await db.from('subscribers').select('*').eq('id', id).single();
        if (sub) {
          for (const p of newlyConfirmed) {
            // Email subscriber: payment received
            if (sub.email) {
              const { subject, html } = paymentReceivedEmail({
                name: sub.name,
                chef_name: sub.chef_name,
                week: p.week,
                amount: p.amount,
              });
              await sendEmail({ to: sub.email, subject, html }).catch(e => console.error('[email] payment confirm sub:', e));
            }
            // Email chef: cleared to begin delivery
            if (sub.chef_id) {
              const { data: chefAccount } = await db.from('chef_accounts').select('chef_email').eq('chef_id', sub.chef_id).single();
              if (chefAccount?.chef_email) {
                const { subject: cs, html: ch } = chefPaymentConfirmedEmail({
                  chef_name: sub.chef_name,
                  subscriber_name: sub.name,
                  suburb: sub.suburb,
                  street_address: sub.street_address,
                  starting_week: sub.starting_week,
                  dietary: sub.dietary,
                  week: p.week,
                });
                await sendEmail({ to: chefAccount.chef_email, subject: cs, html: ch }).catch(e => console.error('[email] payment confirm chef:', e));
              }
            }
          }
        }
      }
    }

    // Return updated subscriber with payments
    const { data: updated } = await db.from('subscribers').select('*').eq('id', id).single();
    const { data: updatedPayments } = await db.from('payments').select('*').eq('subscriber_id', id);
    return res.json({ ...updated, payments: updatedPayments || [] });
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    await db.from('payments').delete().eq('subscriber_id', id);
    const { error } = await db.from('subscribers').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).end();
});

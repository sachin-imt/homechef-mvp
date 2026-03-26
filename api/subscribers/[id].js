const db = require('../_db');
const { handle } = require('../_helpers');

module.exports = handle(async (req, res) => {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { payments, ...subData } = req.body;
    delete subData.id;

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
    }

    // Return updated subscriber with payments
    const { data: updated } = await db.from('subscribers').select('*').eq('id', id).single();
    const { data: updatedPayments } = await db.from('payments').select('*').eq('subscriber_id', id);
    return res.json({ ...updated, payments: updatedPayments || [] });
  }

  if (req.method === 'DELETE') {
    await db.from('payments').delete().eq('subscriber_id', id);
    const { error } = await db.from('subscribers').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).end();
});

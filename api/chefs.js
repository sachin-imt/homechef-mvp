const db = require('./_db');
const { handle, requireAdmin } = require('./_helpers');
const { sendEmail, chefApprovedEmail } = require('./_email');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('chefs')
      .select('*')
      .eq('status', 'active')
      .order('chef_id');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    let body = { ...req.body };
    // Pull out email metadata (not a DB column) before insert
    const applicantEmail = body.applicant_email;
    const applicantName  = body.applicant_name;
    delete body.applicant_email;
    delete body.applicant_name;

    // Auto-generate chef_id if not supplied
    if (!body.chef_id) {
      const { data: maxRow } = await db
        .from('chefs').select('chef_id').order('chef_id', { ascending: false }).limit(1).single();
      body.chef_id = (maxRow?.chef_id || 0) + 1;
    }
    const { data, error } = await db
      .from('chefs')
      .insert(body)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    // Send approval email to chef applicant (fire-and-forget)
    if (applicantEmail) {
      const { subject, html } = chefApprovedEmail({
        name: applicantName || data.chef_name,
        chef_name: data.chef_name,
      });
      await sendEmail({ to: applicantEmail, subject, html }).catch(e => console.error('[email] chef approved:', e));
    }

    return res.status(201).json(data);
  }

  res.status(405).end();
});

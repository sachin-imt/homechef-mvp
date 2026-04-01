const db = require('./_db');
const { handle, requireAdmin } = require('./_helpers');
const { sendEmail, chefPortalCredentialsEmail } = require('./_email');

module.exports = handle(async (req, res) => {
  if (req.method === 'GET') {
    if (!requireAdmin(req, res)) return;
        const { data, error } = await db
      .from('chef_accounts')
      .select('*')
      .order('chef_id');
    if (error) return res.status(500).json({ error: error.message });
    return res.json(data);
  }

  // POST — upsert a chef account (create or update)
  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
        const { send_credentials_email, ...body } = req.body;
    const { data, error } = await db
      .from('chef_accounts')
      .upsert(body, { onConflict: 'chef_id' })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    // Email credentials to chef if requested
    if (send_credentials_email && body.chef_email) {
      const { subject, html } = chefPortalCredentialsEmail({
        chef_name: body.chef_name,
        username: body.username,
        password: body.password,
      });
      await sendEmail({ to: body.chef_email, subject, html }).catch(e => console.error('[email] chef credentials:', e));
    }

    return res.status(201).json(data);
  }

  // DELETE — revoke access for a chef_id
  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
        const { chef_id } = req.body;
    const { error } = await db
      .from('chef_accounts')
      .delete()
      .eq('chef_id', chef_id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true });
  }

  res.status(405).end();
});

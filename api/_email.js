// ─── Resend email helper ───
// All emails go through this module. Underscore prefix → Vercel skips as a helper.
// Required env vars:
//   RESEND_API_KEY        — from resend.com
//   RESEND_FROM           — verified sender, e.g. "Home Meals <hello@yourdomain.com>"
//   SITE_URL              — e.g. "https://homemeals.app"
//   BANK_ACCOUNT_NAME     — e.g. "Home Meals Pty Ltd"
//   BANK_BSB              — e.g. "062-000"
//   BANK_ACCOUNT_NUMBER   — e.g. "12345678"

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || 'Home Meals <onboarding@resend.dev>';
const SITE_URL = process.env.SITE_URL || 'https://homemeals.app';

async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping:', subject, '->', to);
    return { skipped: true };
  }
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  if (!resp.ok) {
    const err = await resp.text();
    console.error('[email] Resend error:', err);
    return { error: err };
  }
  const data = await resp.json();
  console.log('[email] Sent:', data.id, '->', to);
  return data;
}

// ── Shared styles ──
function wrapper(content) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F5F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F0;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr><td style="background:#1A1A1A;padding:24px 32px;text-align:center">
          <span style="font-size:1.4rem;font-weight:800;color:#FACA50;letter-spacing:-0.5px">Home Meals</span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#F8F8F8;padding:18px 32px;text-align:center;font-size:0.75rem;color:#9CA3AF;border-top:1px solid #EEEEEE">
          Questions? Reply to this email or visit <a href="${SITE_URL}" style="color:#FACA50;text-decoration:none">${SITE_URL}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function h1(text) {
  return `<h1 style="margin:0 0 16px;font-size:1.5rem;font-weight:800;color:#1A1A1A">${text}</h1>`;
}
function p(text) {
  return `<p style="margin:0 0 14px;font-size:0.95rem;line-height:1.6;color:#374151">${text}</p>`;
}
function highlight(content) {
  return `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:16px 20px;margin:20px 0">${content}</div>`;
}
function row(label, value) {
  return `<tr>
    <td style="padding:7px 0;font-size:0.85rem;color:#9CA3AF;width:40%;vertical-align:top">${label}</td>
    <td style="padding:7px 0;font-size:0.85rem;font-weight:700;color:#1A1A1A">${value}</td>
  </tr>`;
}
function btn(text, href) {
  return `<div style="margin:24px 0 8px">
    <a href="${href}" style="display:inline-block;background:#FACA50;color:#1A1A1A;font-weight:800;font-size:0.9rem;text-decoration:none;padding:12px 28px;border-radius:8px">${text}</a>
  </div>`;
}

// ── 1. Subscriber confirmation ──
function subscriberConfirmationEmail({ name, chef_name, starting_week, amount }) {
  const bsb      = process.env.BANK_BSB            || 'XXX-XXX';
  const acctNo   = process.env.BANK_ACCOUNT_NUMBER  || 'XXXXXXXXXX';
  const acctName = process.env.BANK_ACCOUNT_NAME    || 'Home Meals Pty Ltd';
  const ref      = 'HM-' + (name || 'subscriber').replace(/\s+/g, '').toUpperCase().slice(0, 8);
  const amtStr   = amount ? `$${amount}` : 'the agreed weekly rate';

  return {
    subject: `You're all set with ${chef_name}! 🍱`,
    html: wrapper(`
      ${h1("You're all set! 🎉")}
      ${p(`Hi ${name},`)}
      ${p(`Your subscription with <strong>${chef_name}</strong> has been confirmed. Deliveries will begin the week of <strong>${starting_week}</strong>.`)}
      ${p('To get started, please transfer your first week\'s payment using the details below:')}
      ${highlight(`
        <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;color:#856404;text-transform:uppercase;letter-spacing:0.5px">Bank Transfer Details</p>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row('Account Name', acctName)}
          ${row('BSB', bsb)}
          ${row('Account Number', acctNo)}
          ${row('Reference', ref)}
          ${row('Amount', amtStr)}
        </table>
      `)}
      ${p('Your chef will contact you <strong>24 hours before your first delivery</strong> to confirm the drop-off time and address.')}
      ${p('Have any questions? Just reply to this email — we\'re here to help.')}
      ${p('Cheers,<br>The Home Meals team')}
    `),
  };
}

// ── 2. Chef application received ──
function applicationReceivedEmail({ name, cuisine_type }) {
  return {
    subject: `We've received your application, ${name}!`,
    html: wrapper(`
      ${h1('Application received 👨‍🍳')}
      ${p(`Hi ${name},`)}
      ${p(`Thanks for applying to become a Home Meals chef! We've received your ${cuisine_type ? `<strong>${cuisine_type}</strong> cuisine ` : ''}application and our team will review it shortly.`)}
      ${highlight(`
        <p style="margin:0 0 8px;font-size:0.85rem;font-weight:700;color:#856404">What happens next?</p>
        <ul style="margin:0;padding-left:18px;font-size:0.85rem;color:#374151;line-height:1.8">
          <li>We'll review your application within 2–3 business days</li>
          <li>You'll receive an email with our decision</li>
          <li>If approved, we'll set up your chef account and you can start accepting subscribers</li>
        </ul>
      `)}
      ${p('In the meantime, feel free to browse our platform at the link below.')}
      ${btn('Visit Home Meals', SITE_URL)}
      ${p('Cheers,<br>The Home Meals team')}
    `),
  };
}

// ── 3. Chef application approved ──
function chefApprovedEmail({ name, chef_name, portal_url }) {
  const loginUrl = portal_url || (SITE_URL + '/chef-portal.html');
  return {
    subject: `Congratulations ${name} — you've been approved! 🎉`,
    html: wrapper(`
      ${h1('Welcome to Home Meals! 🎉')}
      ${p(`Hi ${name},`)}
      ${p(`Great news — your application has been approved! You're now an official Home Meals chef as <strong>${chef_name || ('Chef ' + name.split(' ')[0])}</strong>.`)}
      ${highlight(`
        <p style="margin:0 0 8px;font-size:0.85rem;font-weight:700;color:#856404">Your next steps:</p>
        <ol style="margin:0;padding-left:18px;font-size:0.85rem;color:#374151;line-height:1.8">
          <li>Log in to your chef portal and complete your profile</li>
          <li>Upload a profile photo and a photo of your food</li>
          <li>Submit your first week's menu for approval</li>
          <li>We'll match you with subscribers in your area</li>
        </ol>
      `)}
      ${btn('Go to Chef Portal', loginUrl)}
      ${p('If you have any questions, just reply to this email. We\'re excited to have you on board!')}
      ${p('Cheers,<br>The Home Meals team')}
    `),
  };
}

// ── 4. Chef application rejected ──
function chefRejectedEmail({ name }) {
  return {
    subject: `Update on your Home Meals chef application`,
    html: wrapper(`
      ${h1('Thanks for your interest')}
      ${p(`Hi ${name},`)}
      ${p('Thank you for taking the time to apply to become a Home Meals chef. After careful review, we\'re unable to move forward with your application at this time.')}
      ${p('This is often due to capacity in your area or a temporary pause in onboarding new chefs — it doesn\'t reflect on your cooking skills!')}
      ${p('We encourage you to apply again in the future as we continue to grow. We\'ll keep your details on file and may reach out if a spot opens up in your area.')}
      ${p('Thanks again for your interest in Home Meals.')}
      ${p('Kind regards,<br>The Home Meals team')}
    `),
  };
}

// ── 5. Admin: new subscriber notification ──
function newSubscriberAdminEmail({ name, email, phone, chef_name, suburb, postcode, starting_week, amount, street_address }) {
  const ref = 'HM-' + (name || 'SUB').replace(/\s+/g, '').toUpperCase().slice(0, 8);
  const amtStr = amount ? `$${amount}/week` : 'Not specified';
  return {
    subject: `New subscriber: ${name} → ${chef_name}`,
    html: wrapper(`
      ${h1('New subscriber 🎉')}
      ${p(`A new subscription has been submitted.`)}
      ${highlight(`
        <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;color:#856404;text-transform:uppercase;letter-spacing:0.5px">Subscriber Details</p>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row('Name', name)}
          ${row('Email', email)}
          ${row('Phone', phone || '—')}
          ${row('Chef', chef_name)}
          ${row('Starting Week', starting_week)}
          ${row('Delivery Address', `${street_address || ''}, ${suburb} ${postcode}`)}
          ${row('Amount', amtStr)}
          ${row('Pay Reference', `<strong>${ref}</strong>`)}
        </table>
      `)}
      ${p('Log in to the admin panel to manage this subscription.')}
      ${btn('Go to Admin', SITE_URL + '/admin.html')}
    `),
  };
}

module.exports = {
  sendEmail,
  subscriberConfirmationEmail,
  applicationReceivedEmail,
  chefApprovedEmail,
  chefRejectedEmail,
  newSubscriberAdminEmail,
};

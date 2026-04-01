// ─── Resend email helper ───
// All emails go through this module. Underscore prefix → Vercel skips as a helper.
// Required env vars:
//   RESEND_API_KEY        — from resend.com
//   RESEND_FROM           — verified sender, e.g. "Home Meal <hello@yourdomain.com>"
//   SITE_URL              — e.g. "https://homemeals.app"
//   BANK_ACCOUNT_NAME     — e.g. "Home Meal Pty Ltd"
//   BANK_BSB              — e.g. "062-000"
//   BANK_ACCOUNT_NUMBER   — e.g. "12345678"

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || 'Home Meal <onboarding@resend.dev>';
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
          <span style="font-size:1.4rem;font-weight:800;color:#FACA50;letter-spacing:-0.5px">Home Meal</span>
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
  const acctName = process.env.BANK_ACCOUNT_NAME    || 'Home Meal Pty Ltd';
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
        <p style="margin:12px 0 0;font-size:0.82rem;color:#856404"><strong>⚠️ Payment deadline:</strong> Please ensure your transfer is received <strong>at least 1 day before your start week</strong> (${starting_week}) so your chef can prepare your meals on time.</p>
      `)}
      ${p('Your chef will contact you <strong>24 hours before your first delivery</strong> to confirm the drop-off time and address.')}
      ${p('Have any questions? Just reply to this email — we\'re here to help.')}
      ${p('Cheers,<br>The Home Meal team')}
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
      ${p(`Thanks for applying to become a Home Meal chef! We've received your ${cuisine_type ? `<strong>${cuisine_type}</strong> cuisine ` : ''}application and our team will review it shortly.`)}
      ${highlight(`
        <p style="margin:0 0 8px;font-size:0.85rem;font-weight:700;color:#856404">What happens next?</p>
        <ul style="margin:0;padding-left:18px;font-size:0.85rem;color:#374151;line-height:1.8">
          <li>We'll review your application within 2–3 business days</li>
          <li>You'll receive an email with our decision</li>
          <li>If approved, we'll set up your chef account and you can start accepting subscribers</li>
        </ul>
      `)}
      ${p('In the meantime, feel free to browse our platform at the link below.')}
      ${btn('Visit Home Meal', SITE_URL)}
      ${p('Cheers,<br>The Home Meal team')}
    `),
  };
}

// ── 3. Chef application approved ──
function chefApprovedEmail({ name, chef_name, portal_url }) {
  const loginUrl = portal_url || (SITE_URL + '/chef-portal.html');
  return {
    subject: `Congratulations ${name} — you've been approved! 🎉`,
    html: wrapper(`
      ${h1('Welcome to Home Meal! 🎉')}
      ${p(`Hi ${name},`)}
      ${p(`Great news — your application has been approved! You're now an official Home Meal chef as <strong>${chef_name || ('Chef ' + name.split(' ')[0])}</strong>.`)}
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
      ${p('Cheers,<br>The Home Meal team')}
    `),
  };
}

// ── 4. Chef application rejected ──
function chefRejectedEmail({ name }) {
  return {
    subject: `Update on your Home Meal chef application`,
    html: wrapper(`
      ${h1('Thanks for your interest')}
      ${p(`Hi ${name},`)}
      ${p('Thank you for taking the time to apply to become a Home Meal chef. After careful review, we\'re unable to move forward with your application at this time.')}
      ${p('This is often due to capacity in your area or a temporary pause in onboarding new chefs — it doesn\'t reflect on your cooking skills!')}
      ${p('We encourage you to apply again in the future as we continue to grow. We\'ll keep your details on file and may reach out if a spot opens up in your area.')}
      ${p('Thanks again for your interest in Home Meal.')}
      ${p('Kind regards,<br>The Home Meal team')}
    `),
  };
}

// ── 5. Chef portal credentials ──
function chefPortalCredentialsEmail({ chef_name, username, password }) {
  const portalUrl = SITE_URL + '/admin.html';
  return {
    subject: `Your Home Meal chef portal is ready`,
    html: wrapper(`
      ${h1('Your chef portal is ready 🍳')}
      ${p(`Hi ${chef_name},`)}
      ${p(`Your Home Meal chef portal account has been set up. You can now log in to manage your menus and view your subscribers.`)}
      ${highlight(`
        <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;color:#856404;text-transform:uppercase;letter-spacing:0.5px">Your Login Details</p>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row('Portal URL', `<a href="${portalUrl}" style="color:#1A1A1A">${portalUrl}</a>`)}
          ${row('Username', `<strong>${username}</strong>`)}
          ${row('Password', `<strong>${password}</strong>`)}
        </table>
        <p style="margin:12px 0 0;font-size:0.78rem;color:#856404">Select the <strong>Chef Portal</strong> tab on the login screen.</p>
      `)}
      ${p('We recommend changing your password after your first login.')}
      ${btn('Go to Chef Portal', portalUrl)}
      ${p('If you have any questions, just reply to this email.')}
      ${p('Cheers,<br>The Home Meal team')}
    `),
  };
}

// ── 6. Chef: new subscriber pending payment ──
function chefNewSubscriberEmail({ chef_name, subscriber_name, suburb, starting_week, dietary }) {
  return {
    subject: `New subscriber: ${subscriber_name} is joining your meal plan`,
    html: wrapper(`
      ${h1('You have a new subscriber! 🎉')}
      ${p(`Hi ${chef_name},`)}
      ${p(`Great news — <strong>${subscriber_name}</strong> has signed up for your meal plan. Their subscription is pending payment confirmation, so no action is needed from you just yet.`)}
      ${highlight(`
        <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;color:#856404;text-transform:uppercase;letter-spacing:0.5px">Subscriber Details</p>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row('Name', subscriber_name)}
          ${row('Suburb', suburb || '—')}
          ${row('Starting Week', starting_week || '—')}
          ${row('Dietary Notes', dietary || 'None')}
        </table>
        <p style="margin:12px 0 0;font-size:0.82rem;color:#856404">⏳ <strong>Status: Pending payment.</strong> You'll receive another email once their payment has been confirmed and you're cleared to begin delivery.</p>
      `)}
      ${p('Cheers,<br>The Home Meal team')}
    `),
  };
}

// ── 7. Subscriber: payment received confirmation ──
function paymentReceivedEmail({ name, chef_name, week, amount }) {
  const amtStr = amount ? `$${amount}` : 'your weekly amount';
  return {
    subject: `Payment confirmed — your meals are on the way! ✅`,
    html: wrapper(`
      ${h1('Payment confirmed ✅')}
      ${p(`Hi ${name},`)}
      ${p(`We've received your payment for the week of <strong>${week}</strong>. Your meal plan with <strong>${chef_name}</strong> is confirmed and your chef is preparing your meals.`)}
      ${highlight(`
        <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;color:#856404;text-transform:uppercase;letter-spacing:0.5px">Payment Summary</p>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row('Week', week)}
          ${row('Chef', chef_name)}
          ${row('Amount', amtStr)}
          ${row('Status', '<span style="color:#3A813D;font-weight:700">✓ Confirmed</span>')}
        </table>
      `)}
      ${p('Your chef will be in touch <strong>24 hours before delivery</strong> to confirm the drop-off time.')}
      ${p('Have any questions? Just reply to this email.')}
      ${p('Cheers,<br>The Home Meal team')}
    `),
  };
}

// ── 8. Chef: payment confirmed — begin delivery ──
function chefPaymentConfirmedEmail({ chef_name, subscriber_name, suburb, street_address, starting_week, dietary, week }) {
  return {
    subject: `Payment confirmed — begin delivery for ${subscriber_name}`,
    html: wrapper(`
      ${h1('Payment received — you\'re good to go! 🚀')}
      ${p(`Hi ${chef_name},`)}
      ${p(`<strong>${subscriber_name}</strong>'s payment has been confirmed. You're cleared to begin their meal delivery.`)}
      ${highlight(`
        <p style="margin:0 0 12px;font-size:0.8rem;font-weight:700;color:#856404;text-transform:uppercase;letter-spacing:0.5px">Delivery Details</p>
        <table cellpadding="0" cellspacing="0" width="100%">
          ${row('Subscriber', subscriber_name)}
          ${row('Delivery Address', street_address ? `${street_address}, ${suburb || ''}` : suburb || '—')}
          ${row('Week', week || starting_week || '—')}
          ${row('Dietary Notes', dietary || 'None')}
        </table>
        <p style="margin:12px 0 0;font-size:0.82rem;color:#856404">📞 Please contact ${subscriber_name} <strong>24 hours before your first delivery</strong> to confirm the drop-off time.</p>
      `)}
      ${p('Cheers,<br>The Home Meal team')}
    `),
  };
}

// ── 9. Admin: new subscriber notification ──
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
  chefPortalCredentialsEmail,
  chefNewSubscriberEmail,
  paymentReceivedEmail,
  chefPaymentConfirmedEmail,
  newSubscriberAdminEmail,
};

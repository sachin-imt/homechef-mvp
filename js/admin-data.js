// ─── ADMIN DATA — API-BACKED ───
window.ADM = window.ADM || {};

// ── Subscriber status stages ──
var SUBSCRIBER_STATUSES = [
  { value:'Interested',         label:'Interested',          color:'#3B82F6', bg:'#DBEAFE', desc:'Signed up — call to discuss and request payment' },
  { value:'Payment Made',       label:'Payment Made',        color:'#F59E0B', bg:'#FEF3C7', desc:'Payment received — confirm with chef that delivery is possible' },
  { value:'Active Deliveries',  label:'Active Deliveries',   color:'#3A813D', bg:'#D4EDDA', desc:'Deliveries underway' },
  { value:'Paused Deliveries',  label:'Paused Deliveries',   color:'#9CA3AF', bg:'#F4F4F4', desc:'Temporarily paused by subscriber' },
  { value:'Deactivated',        label:'Deactivated',         color:'#D0342C', bg:'#FEE2E2', desc:'No longer active' },
];

// ── Default site content (fallback if API unavailable) ──
var defaultContent = {
  hero_badge:       "Sydney's Home-Cooked Meal Marketplace",
  hero_line1:       "Authentic",
  hero_line2:       "Home-Cooked",
  hero_line3:       "Meals, Weekly.",
  hero_subtext:     "Subscribe to a local home chef. Get 5 freshly cooked meals delivered Mon–Fri. Support your community.",
  hero_stat1:       "4.8 ⭐", hero_stat1_label: "Avg chef rating",
  hero_stat2:       "5 meals", hero_stat2_label: "Delivered Mon–Fri",
  hero_stat3:       "Cancel", hero_stat3_label: "Anytime, no lock-in",
  how_c1_title:     "1. Find Your Chef",
  how_c1_desc:      "Browse local passionate home chefs. From heritage family recipes to authentic homestyle masters, find a chef whose menu matches your cravings.",
  how_c2_title:     "2. Subscribe Weekly",
  how_c2_desc:      "Choose your starting week and subscribe. No lock-in contracts. You'll receive a curated menu of 5 restaurant-quality meals every weekday.",
  how_c3_title:     "3. Gather & Enjoy",
  how_c3_desc:      "Your chef prepares meals fresh daily. Delivered straight to your door in eco-friendly containers — sit down and savour the food with family or friends.",
  how_ch1_title:    "1. Apply & Verify",
  how_ch1_desc:     "Submit your application with your cuisine style and sample menus. Our team reviews your background to ensure Home Meals standards are met.",
  how_ch2_title:    "2. Build Your Audience",
  how_ch2_desc:     "Set how many subscribers you want. We provide the marketing and platform to connect you with hungry locals looking for your culinary style.",
  how_ch3_title:    "3. Cook & Earn",
  how_ch3_desc:     "Cook your weekly menu, deliver to subscribers, and get paid. Keep 80% of the subscription price. Current chefs earn $400–$900/week.",
  become_headline:  "Become a Home Meals Partner",
  become_subtext:   "Turn your home cooking into income. Set your own menu. Set your own pace.",
  become_earnings:  "Current chefs earn $400–$900/week",
  footer_tagline:   "Authentic home-cooked meals from Sydney's best home chefs. Delivered weekly.",
  contact_email:    "hello@homemeals.com.au",
};

// ── HTTP helpers ──
function _apiGet(path) {
  return fetch(path).then(function(r) { return r.json(); });
}
function _apiPost(path, body) {
  return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function(r) {
    return r.json().then(function(d) { if (!r.ok) throw new Error(d.error || 'Request failed'); return d; });
  });
}
function _apiPut(path, body) {
  return fetch(path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function(r) {
    return r.json().then(function(d) { if (!r.ok) throw new Error(d.error || 'Request failed'); return d; });
  });
}
function _apiDelete(path, body) {
  return fetch(path, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(function(r) { return r.json(); });
}

// ── Chefs ──
function loadChefs()      { return _apiGet('/api/chefs'); }
function saveChefs()      { /* no-op: saves go through updateChef */ }
function updateChef(chef) { return _apiPut('/api/chefs/' + chef.chef_id, chef); }
function addChef(chef)    { return _apiPost('/api/chefs', chef); }
function deleteChef(chef_id) { return _apiDelete('/api/chefs/' + chef_id, {}); }

// ── Content ──
function loadContent()   { return _apiGet('/api/content'); }
function saveContent(c)  { return _apiPut('/api/content', c); }

// ── Subscribers ──
function loadSubscribers()     { return _apiGet('/api/subscribers'); }
function saveSubscribers()     { /* no-op */ }
function updateSubscriber(sub) { return _apiPut('/api/subscribers/' + sub.id, sub); }
function addSubscriberAPI(sub) { return _apiPost('/api/subscribers', sub); }
function deleteSubscriber(id)  { return _apiDelete('/api/subscribers/' + id, {}); }

// ── Applications ──
function loadApplications()        { return _apiGet('/api/applications'); }
function saveApplications()        { /* no-op */ }
function updateApplication(app)    { return _apiPut('/api/applications/' + app.id, app); }
function deleteApplication(id, body) { return _apiDelete('/api/applications/' + id, body || {}); }

// ── Notifications ──
function loadNotifications()   { return _apiGet('/api/notifications'); }
function saveNotifications()   { /* no-op */ }
function pushNotification(type, message, ref_id) {
  return _apiPost('/api/notifications', { type: type, message: message, ref_id: ref_id || null });
}
function markNotificationRead(id)  { return _apiPut('/api/notifications', { id: id }); }
function markAllNotificationsRead() { return _apiPut('/api/notifications', { all: true }); }

// ── Pending Menus ──
function loadPendingMenus()  { return _apiGet('/api/menus'); }
function savePendingMenus()  { /* no-op */ }
function addMenu(entry)      { return _apiPost('/api/menus', entry); }
function updateMenu(id, status, reason) {
  return _apiPut('/api/menus', { id: id, status: status, reject_reason: reason || null });
}

// ── Chef Accounts ──
function loadChefAccounts()         { return _apiGet('/api/accounts'); }
function saveChefAccounts()         { /* no-op */ }
function upsertChefAccount(acct)    { return _apiPost('/api/accounts', acct); }
function deleteChefAccount(chef_id) { return _apiDelete('/api/accounts', { chef_id: chef_id }); }

Object.assign(window.ADM, {
  SUBSCRIBER_STATUSES, defaultContent,
  // live data refs — populated async by AdminApp after login
  adminChefs: [], siteContent: defaultContent, subscribers: [], applications: [], notifications: [],
  // API-backed functions
  loadChefs, saveChefs, updateChef, addChef, deleteChef,
  loadContent, saveContent,
  loadSubscribers, saveSubscribers, updateSubscriber, addSubscriberAPI, deleteSubscriber,
  loadApplications, saveApplications, updateApplication, deleteApplication,
  loadNotifications, saveNotifications, pushNotification, markNotificationRead, markAllNotificationsRead,
  loadPendingMenus, savePendingMenus, addMenu, updateMenu,
  loadChefAccounts, saveChefAccounts, upsertChefAccount, deleteChefAccount,
});

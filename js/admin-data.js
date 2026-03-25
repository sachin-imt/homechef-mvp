// ─── ADMIN DATA + LOCALSTORAGE PERSISTENCE ───
window.ADM = window.ADM || {};

// ── Subscriber status stages ──
var SUBSCRIBER_STATUSES = [
  { value:'Interested',         label:'Interested',          color:'#3B82F6', bg:'#DBEAFE', desc:'Signed up — call to discuss and request payment' },
  { value:'Payment Made',       label:'Payment Made',        color:'#F59E0B', bg:'#FEF3C7', desc:'Payment received — confirm with chef that delivery is possible' },
  { value:'Active Deliveries',  label:'Active Deliveries',   color:'#3A813D', bg:'#D4EDDA', desc:'Deliveries underway' },
  { value:'Paused Deliveries',  label:'Paused Deliveries',   color:'#9CA3AF', bg:'#F4F4F4', desc:'Temporarily paused by subscriber' },
  { value:'Deactivated',        label:'Deactivated',         color:'#D0342C', bg:'#FEE2E2', desc:'No longer active' },
];

// ── localStorage helpers ──
function loadChefs() {
  try { var s = localStorage.getItem('cc_chefs'); return s ? JSON.parse(s) : null; } catch(e) { return null; }
}
function saveChefs(chefs) {
  try { localStorage.setItem('cc_chefs', JSON.stringify(chefs)); window.CC.mockChefs = chefs; } catch(e) {}
}
function loadContent() {
  try { var s = localStorage.getItem('cc_content'); return s ? { ...defaultContent, ...JSON.parse(s) } : defaultContent; } catch(e) { return defaultContent; }
}
function saveContent(c) {
  try { localStorage.setItem('cc_content', JSON.stringify(c)); window.CC.siteContent = c; } catch(e) {}
}
function loadSubscribers() {
  try { var s = localStorage.getItem('cc_subscribers'); return s ? JSON.parse(s) : []; } catch(e) { return []; }
}
function saveSubscribers(subs) {
  try { localStorage.setItem('cc_subscribers', JSON.stringify(subs)); } catch(e) {}
}
function loadApplications() {
  try { var s = localStorage.getItem('cc_chef_applications'); return s ? JSON.parse(s) : []; } catch(e) { return []; }
}
function saveApplications(apps) {
  try { localStorage.setItem('cc_chef_applications', JSON.stringify(apps)); } catch(e) {}
}
function loadNotifications() {
  try { var s = localStorage.getItem('cc_notifications'); return s ? JSON.parse(s) : []; } catch(e) { return []; }
}
function saveNotifications(n) {
  try { localStorage.setItem('cc_notifications', JSON.stringify(n)); } catch(e) {}
}
function pushNotification(type, message, ref_id) {
  var notifs = loadNotifications();
  notifs.unshift({ id: Date.now(), type, message, created: new Date().toISOString().slice(0,10), read: false, ref_id: ref_id || null });
  saveNotifications(notifs);
}

// ── Default site content ──
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

// ── Seed data ──
// Subscriber status stages: Interested → Payment Made → Active Deliveries → Paused Deliveries / Deactivated
var seedSubscribers = [
  {
    id: 1, name: 'Sarah Johnson', email: 'sarah.j@gmail.com', phone: '0412 345 678',
    chef_id: 1, chef_name: 'Chef Priya', suburb: 'Newtown', postcode: '2042',
    dietary: '', created: '2026-03-25', starting_week: 'Mar 31–Apr 4',
    status: 'Active Deliveries',
    status_notes: 'Payment confirmed. Chef confirmed delivery.',
    payments: [
      { week: 'Mar 31–Apr 4', week_iso: '2026-03-31', status: 'Paid', confirmed: true, confirmed_at: '2026-03-25', note: '', added_by: 'system', added_at: '2026-03-25' },
    ],
  },
  {
    id: 2, name: 'Michael Chen', email: 'mchen@outlook.com', phone: '0423 456 789',
    chef_id: 2, chef_name: 'Chef Asa', suburb: 'Redfern', postcode: '2016',
    dietary: 'Gluten-free', created: '2026-03-25', starting_week: 'Mar 31–Apr 4',
    status: 'Interested',
    status_notes: '',
    payments: [],
  },
];

var adminChefs    = loadChefs() || (window.CC && window.CC.mockChefs ? JSON.parse(JSON.stringify(window.CC.mockChefs)) : []);
var siteContent   = loadContent();
var stored        = loadSubscribers();
var subscribers   = stored.length > 0 ? stored : seedSubscribers;
var applications  = loadApplications();
var notifications = loadNotifications();

Object.assign(window.ADM, {
  SUBSCRIBER_STATUSES, defaultContent,
  adminChefs, siteContent, subscribers, applications, notifications,
  loadChefs, saveChefs, loadContent, saveContent,
  loadSubscribers, saveSubscribers,
  loadApplications, saveApplications,
  loadNotifications, saveNotifications, pushNotification,
});

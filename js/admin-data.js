// ─── ADMIN MOCK DATA + LOCALSTORAGE PERSISTENCE ───
window.ADM = window.ADM || {};

// ── Generate 30 days of analytics ──
var analyticsRaw = (function () {
  var rows = [];
  var base = new Date('2026-02-24');
  var subs = 0;
  for (var i = 0; i < 30; i++) {
    var d = new Date(base);
    d.setDate(base.getDate() + i);
    var weekend = d.getDay() === 0 || d.getDay() === 6;
    var visitors  = weekend ? 18 + Math.floor(Math.random()*22) : 42 + Math.floor(Math.random()*55);
    var newSubs   = weekend ? Math.floor(Math.random()*2)        : 1 + Math.floor(Math.random()*5);
    var unsubs    = i > 7 ? Math.floor(Math.random()*2) : 0;
    subs += newSubs - unsubs;
    rows.push({
      date:      d.toLocaleDateString('en-AU', { month:'short', day:'numeric' }),
      visitors,
      pageviews: Math.floor(visitors * (1.8 + Math.random()*0.8)),
      newSubs,
      unsubs,
      totalSubs: subs,
    });
  }
  return rows;
})();

// ── Mock subscribers ──
var mockSubscribers = [
  { id:1,  name:'Sarah Johnson',    email:'sarah.j@gmail.com',       phone:'0412 345 678', chef_id:1, chef_name:'Chef Priya',  suburb:'Newtown',       postcode:'2042', week:'Mar 24–28', payment:'Paid',    delivery:'Delivered',  created:'2026-03-18', dietary:'' },
  { id:2,  name:'Michael Chen',     email:'mchen@outlook.com',        phone:'0423 456 789', chef_id:1, chef_name:'Chef Priya',  suburb:'Stanmore',      postcode:'2048', week:'Mar 24–28', payment:'Paid',    delivery:'Scheduled',  created:'2026-03-19', dietary:'Gluten-free' },
  { id:3,  name:'Amelia Torres',    email:'amelia.t@gmail.com',       phone:'0434 567 890', chef_id:2, chef_name:'Chef Asa',    suburb:'Redfern',       postcode:'2016', week:'Mar 24–28', payment:'Paid',    delivery:'Delivered',  created:'2026-03-17', dietary:'' },
  { id:4,  name:'James Nguyen',     email:'jnguyen@icloud.com',       phone:'0445 678 901', chef_id:3, chef_name:'Chef Som',    suburb:'Newtown',       postcode:'2042', week:'Mar 24–28', payment:'Paid',    delivery:'Delivered',  created:'2026-03-18', dietary:'Nut-free' },
  { id:5,  name:'Priya Patel',      email:'priya.p@hotmail.com',      phone:'0456 789 012', chef_id:1, chef_name:'Chef Priya',  suburb:'Marrickville',  postcode:'2204', week:'Mar 24–28', payment:'Paid',    delivery:'Scheduled',  created:'2026-03-20', dietary:'' },
  { id:6,  name:'David Kim',        email:'dkim@gmail.com',            phone:'0467 890 123', chef_id:4, chef_name:'Chef Marco', suburb:'Darlinghurst',  postcode:'2010', week:'Mar 24–28', payment:'Pending', delivery:'Scheduled',  created:'2026-03-21', dietary:'' },
  { id:7,  name:'Emma Wilson',      email:'ewilson@gmail.com',         phone:'0478 901 234', chef_id:2, chef_name:'Chef Asa',    suburb:'Waterloo',      postcode:'2017', week:'Mar 24–28', payment:'Paid',    delivery:'Delivered',  created:'2026-03-16', dietary:'Dairy-free' },
  { id:8,  name:'Liam O\'Brien',    email:'liam.ob@outlook.com',       phone:'0489 012 345', chef_id:4, chef_name:'Chef Marco', suburb:'Potts Point',   postcode:'2011', week:'Mar 24–28', payment:'Paid',    delivery:'Delivered',  created:'2026-03-17', dietary:'' },
  { id:9,  name:'Chloe Nguyen',     email:'chloe.n@gmail.com',         phone:'0412 111 222', chef_id:3, chef_name:'Chef Som',    suburb:'Glebe',         postcode:'2050', week:'Mar 24–28', payment:'Paid',    delivery:'Scheduled',  created:'2026-03-22', dietary:'Vegetarian' },
  { id:10, name:'Noah Sharma',      email:'noah.s@icloud.com',         phone:'0423 222 333', chef_id:1, chef_name:'Chef Priya',  suburb:'Dulwich Hill',  postcode:'2203', week:'Mar 24–28', payment:'Paid',    delivery:'Scheduled',  created:'2026-03-22', dietary:'' },
  { id:11, name:'Olivia Zhang',     email:'o.zhang@gmail.com',         phone:'0434 333 444', chef_id:2, chef_name:'Chef Asa',    suburb:'Chippendale',   postcode:'2008', week:'Mar 31–Apr 4', payment:'Pending', delivery:'Scheduled', created:'2026-03-23', dietary:'' },
  { id:12, name:'William Brown',    email:'will.b@outlook.com',        phone:'0445 444 555', chef_id:3, chef_name:'Chef Som',    suburb:'Leichhardt',    postcode:'2045', week:'Mar 31–Apr 4', payment:'Paid',    delivery:'Scheduled', created:'2026-03-23', dietary:'Spicy ok' },
  { id:13, name:'Ava Martinez',     email:'ava.m@gmail.com',           phone:'0456 555 666', chef_id:4, chef_name:'Chef Marco', suburb:'Sydney CBD',    postcode:'2000', week:'Mar 31–Apr 4', payment:'Pending', delivery:'Scheduled', created:'2026-03-24', dietary:'' },
  { id:14, name:'Isabella Lee',     email:'isa.lee@gmail.com',         phone:'0467 666 777', chef_id:1, chef_name:'Chef Priya',  suburb:'Newtown',       postcode:'2042', week:'Mar 31–Apr 4', payment:'Paid',    delivery:'Scheduled', created:'2026-03-24', dietary:'Halal' },
  { id:15, name:'Ethan Cooper',     email:'ethan.c@icloud.com',        phone:'0478 777 888', chef_id:2, chef_name:'Chef Asa',    suburb:'Redfern',       postcode:'2016', week:'Mar 31–Apr 4', payment:'Paid',    delivery:'Scheduled', created:'2026-03-24', dietary:'' },
];

// ── Pending menu submissions (for approvals) ──
var pendingMenus = [
  { id:1, chef_id:1, chef_name:'Chef Priya',  photo:'https://images.unsplash.com/photo-1556910103-1c02745a8731?w=60&q=80', cuisine:'Indian',        week:'Mar 31–Apr 4', submitted:'2026-03-22', dishes:20, status:'pending' },
  { id:2, chef_id:3, chef_name:'Chef Som',    photo:'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=60&q=80', cuisine:'Thai',          week:'Mar 31–Apr 4', submitted:'2026-03-23', dishes:18, status:'pending' },
  { id:3, chef_id:2, chef_name:'Chef Asa',    photo:'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=60&q=80', cuisine:'Mediterranean', week:'Mar 31–Apr 4', submitted:'2026-03-23', dishes:19, status:'approved' },
  { id:4, chef_id:4, chef_name:'Chef Marco',  photo:'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=60&q=80', cuisine:'Italian',       week:'Mar 31–Apr 4', submitted:'2026-03-24', dishes:21, status:'pending' },
];

// ── Default site content (editable via Content page) ──
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
  how_ch1_desc:     "Submit your application with your cuisine style and sample menus. Our team reviews your background to ensure CelebChef standards are met.",
  how_ch2_title:    "2. Build Your Audience",
  how_ch2_desc:     "Set how many subscribers you want. We provide the marketing and platform to connect you with hungry locals looking for your culinary style.",
  how_ch3_title:    "3. Cook & Earn",
  how_ch3_desc:     "Cook your weekly menu, deliver to subscribers, and get paid. Keep 80% of the subscription price. Current chefs earn $400–$900/week.",
  become_headline:  "Become a CelebChef Partner",
  become_subtext:   "Turn your home cooking into income. Set your own menu. Set your own pace.",
  become_earnings:  "Current chefs earn $400–$900/week",
  footer_tagline:   "Authentic home-cooked meals from Sydney's best home chefs. Delivered weekly.",
  contact_email:    "hello@celebchef.com.au",
};

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

// ── Seed chefs from localStorage or cc-data defaults ──
var adminChefs = loadChefs() || (window.CC && window.CC.mockChefs ? JSON.parse(JSON.stringify(window.CC.mockChefs)) : []);
var siteContent = loadContent();

// Make available globally
Object.assign(window.ADM, {
  analyticsRaw, mockSubscribers, pendingMenus, defaultContent,
  adminChefs, siteContent,
  loadChefs, saveChefs, loadContent, saveContent,
});

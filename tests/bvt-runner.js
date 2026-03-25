#!/usr/bin/env node
// ══════════════════════════════════════════════
// Home Meals BVT Runner
// Usage: node tests/bvt-runner.js
// ══════════════════════════════════════════════
const fs   = require('fs');
const path = require('path');

const ROOT        = path.join(__dirname, '..');
const RESULTS_DIR = path.join(__dirname, 'bvt-results');
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

let passed = 0, failed = 0;
const results = [];

function test(id, name, fn) {
  try {
    fn();
    results.push({ id, name, status: 'PASS' });
    passed++;
    process.stdout.write(`  ✅  [${id}] ${name}\n`);
  } catch(e) {
    results.push({ id, name, status: 'FAIL', error: e.message });
    failed++;
    process.stdout.write(`  ❌  [${id}] ${name}\n       → ${e.message}\n`);
  }
}

function assert(cond, msg) { if (!cond) throw new Error(msg || 'Assertion failed'); }

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }

function hasAll(content, ...strings) {
  for (const s of strings) assert(content.includes(s), `Missing: "${s}"`);
}

function fileHas(rel, ...strings) { hasAll(read(rel), ...strings); }

function fileExists(rel) {
  assert(fs.existsSync(path.join(ROOT, rel)), `File not found: ${rel}`);
}

// ──────────────────────────────────────────────
console.log('\n🧪 Home Meals BVT Suite');
console.log('='.repeat(50));
console.log('Timestamp :', new Date().toISOString());
console.log('Root      :', ROOT);
console.log('');

// ── S1: File Existence ──
console.log('📁  S1: File Existence');

test('BVT-001', 'app.html exists',           () => fileExists('app.html'));
test('BVT-002', 'admin.html exists',         () => fileExists('admin.html'));
test('BVT-003', 'vercel.json exists',        () => fileExists('vercel.json'));
['cc-data','cc-nav','cc-home','cc-detail','cc-subscribe','cc-how','cc-portal','cc-main'].forEach((f,i) =>
  test(`BVT-0${String(4+i).padStart(2,'0')}`, `js/${f}.js exists`, () => fileExists(`js/${f}.js`))
);
['admin-data','admin-dashboard','admin-chefs','admin-subs','admin-content','admin-app'].forEach((f,i) =>
  test(`BVT-0${String(12+i).padStart(2,'0')}`, `js/${f}.js exists`, () => fileExists(`js/${f}.js`))
);

// ── S2: Routing & Config ──
console.log('\n🔗  S2: Routing & Config');

test('BVT-020', 'vercel.json redirects / → /app.html', () => {
  const v = JSON.parse(read('vercel.json'));
  assert(Array.isArray(v.redirects), 'No redirects array');
  assert(v.redirects.some(r => r.source === '/' && r.destination === '/app.html'),
    'Missing / → /app.html redirect');
});

test('BVT-021', 'app.html loads all 8 JS modules', () => {
  const c = read('app.html');
  ['cc-data','cc-nav','cc-home','cc-detail','cc-subscribe','cc-how','cc-portal','cc-main']
    .forEach(f => assert(c.includes(`${f}.js`), `Missing: ${f}.js`));
});

test('BVT-022', 'admin.html loads cc-portal.js (chef login)', () => {
  fileHas('admin.html', 'cc-portal.js');
});

test('BVT-023', 'admin.html loads all 6 admin modules', () => {
  const c = read('admin.html');
  ['admin-data','admin-dashboard','admin-chefs','admin-subs','admin-content','admin-app']
    .forEach(f => assert(c.includes(`${f}.js`), `Missing: ${f}.js`));
});

test('BVT-024', 'app.html has Home Meals yellow branding', () => {
  fileHas('app.html', '#FACA50');
});

// ── S3: Data Layer ──
console.log('\n📊  S3: Data Layer');

test('BVT-030', 'cc-data.js has window.CC + mockChefs', () => {
  fileHas('js/cc-data.js', 'window.CC', 'mockChefs');
});

test('BVT-031', 'cc-data.js has ≥4 chefs', () => {
  const matches = (read('js/cc-data.js').match(/chef_id:/g) || []);
  assert(matches.length >= 4, `Expected ≥4 chefs, found ${matches.length}`);
});

test('BVT-032', 'cc-data.js has all 4 cuisine types', () => {
  fileHas('js/cc-data.js', 'Indian', 'Mediterranean', 'Thai', 'Italian');
});

test('BVT-033', 'cc-data.js has POSTCODE_SUBURB_MAP with ≥10 postcodes', () => {
  const matches = (read('js/cc-data.js').match(/"\d{4}":/g) || []);
  assert(matches.length >= 10, `Expected ≥10 postcodes, found ${matches.length}`);
});

test('BVT-034', 'cc-data.js chefs have currentWeek + nextWeek menus', () => {
  fileHas('js/cc-data.js', 'currentWeek', 'nextWeek', 'monday', 'friday');
});

test('BVT-035', 'admin-data.js has all 5 subscriber status stages', () => {
  fileHas('js/admin-data.js',
    'Interested', 'Payment Made', 'Active Deliveries', 'Paused Deliveries', 'Deactivated');
});

test('BVT-036', 'admin-data.js has all localStorage helpers', () => {
  fileHas('js/admin-data.js',
    'loadChefs', 'saveChefs', 'loadSubscribers', 'saveSubscribers',
    'loadApplications', 'saveApplications', 'pushNotification');
});

// ── S4: Public Site ──
console.log('\n🌐  S4: Public Site Components');

test('BVT-040', 'cc-nav.js does NOT expose Chef Portal publicly', () => {
  const navItems = read('js/cc-nav.js').match(/var navItems = \[([\s\S]*?)\];/)?.[1] || '';
  assert(!navItems.includes('"portal"') && !navItems.includes("'portal'"),
    'Chef Portal still in public navItems');
});

test('BVT-041', 'cc-home.js has HomePage + ChefCard', () => {
  fileHas('js/cc-home.js', 'function HomePage', 'function ChefCard');
});

test('BVT-042', 'cc-home.js hero has dark background', () => {
  fileHas('js/cc-home.js', '#111');
});

test('BVT-043', 'cc-detail.js has ChefDetailPage', () => {
  fileHas('js/cc-detail.js', 'function ChefDetailPage');
});

test('BVT-044', 'cc-subscribe.js has SubscribePage with AU phone validation', () => {
  fileHas('js/cc-subscribe.js', 'function SubscribePage', '04');
});

test('BVT-045', 'cc-how.js BecomeAChefPage saves to cc_chef_applications', () => {
  fileHas('js/cc-how.js', 'cc_chef_applications', 'cc_notifications');
});

// ── S5: Admin Portal ──
console.log('\n🔒  S5: Admin Portal');

test('BVT-050', 'admin-app.js LoginGate has Admin + Chef tabs', () => {
  fileHas('js/admin-app.js', 'LoginGate', 'Admin Portal', 'Chef Portal', 'cc_chef_accounts');
});

test('BVT-051', 'admin-app.js routes to all pages', () => {
  fileHas('js/admin-app.js',
    'DashboardPage', 'ChefsPage', 'ApplicationsPage',
    'SubscribersPage', 'ContentPage', 'SettingsPage');
});

test('BVT-052', 'admin-app.js has Menu Approvals in nav + route', () => {
  fileHas('js/admin-app.js', 'MenuApprovalsPage', 'menus');
});

test('BVT-053', 'admin-chefs.js has ApplicationsPage with approve/reject', () => {
  fileHas('js/admin-chefs.js', 'function ApplicationsPage', 'handleApprove', 'handleReject');
});

test('BVT-054', 'admin-chefs.js has ChefAccessModal for credentials', () => {
  fileHas('js/admin-chefs.js', 'function ChefAccessModal', 'cc_chef_accounts', 'username', 'password');
});

test('BVT-055', 'admin-subs.js has status workflow guide', () => {
  fileHas('js/admin-subs.js', 'WorkflowGuide', 'WORKFLOW_STEPS', 'statusBadgeFor');
});

test('BVT-056', 'admin-subs.js can add subscribers manually', () => {
  fileHas('js/admin-subs.js', 'handleAddSubscriber', 'Add Subscriber');
});

test('BVT-057', 'admin-subs.js has status filter dropdown', () => {
  fileHas('js/admin-subs.js', 'filterStatus', 'All Statuses');
});

test('BVT-058', 'admin-dashboard.js has DashboardPage', () => {
  fileHas('js/admin-dashboard.js', 'DashboardPage');
});

// ── S6: Chef Portal ──
console.log('\n👨‍🍳  S6: Chef Portal');

test('BVT-060', 'cc-portal.js loads chef data via chefFromStore', () => {
  fileHas('js/cc-portal.js', 'chefFromStore', 'buildMenusFromChef', 'cc_chefs');
});

test('BVT-061', 'cc-portal.js writes back on Save Profile', () => {
  const c = read('js/cc-portal.js');
  assert(c.includes("localStorage.setItem('cc_chefs'") || c.includes('localStorage.setItem("cc_chefs"'),
    'Save Profile does not write to cc_chefs');
});

test('BVT-062', 'cc-portal.js submits menus to cc_pending_menus', () => {
  fileHas('js/cc-portal.js', 'cc_pending_menus', 'handleSubmitForApproval');
});

test('BVT-063', 'cc-portal.js has dish image spec (800×500)', () => {
  fileHas('js/cc-portal.js', '800', '500');
});

test('BVT-064', 'cc-portal.js accepts session prop (auth integration)', () => {
  fileHas('js/cc-portal.js', 'session', 'chef_id', 'chef_name');
});

// ── S7: Notifications & Applications ──
console.log('\n🔔  S7: Notifications & Chef Applications');

test('BVT-070', 'cc-how.js pushes notification on chef application submit', () => {
  fileHas('js/cc-how.js', 'cc_notifications', 'chef_application');
});

test('BVT-071', 'admin-data.js has pushNotification helper', () => {
  fileHas('js/admin-data.js', 'function pushNotification');
});

test('BVT-072', 'admin-app.js shows badge counts on sidebar', () => {
  fileHas('js/admin-app.js', 'badges', 'applications', 'newSubscribers', 'Badge');
});

// ──────────────────────────────────────────────
// Results
// ──────────────────────────────────────────────
const total  = passed + failed;
const pct    = total ? Math.round((passed / total) * 100) : 0;
const status = failed === 0 ? '✅  ALL PASS' : `❌  ${failed} FAILED`;

console.log('\n' + '='.repeat(50));
console.log(`${status}   (${passed}/${total} · ${pct}%)`);
console.log('='.repeat(50));

// Write JSON report
const ts = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
const reportPath = path.join(RESULTS_DIR, `bvt-${ts}.json`);
const report = {
  timestamp: new Date().toISOString(),
  summary: { total, passed, failed, pct },
  results,
};
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`\n💾  Report → ${reportPath}\n`);

// Keep only last 30 reports
const reports = fs.readdirSync(RESULTS_DIR)
  .filter(f => f.startsWith('bvt-') && f.endsWith('.json'))
  .sort();
if (reports.length > 30) {
  reports.slice(0, reports.length - 30).forEach(f =>
    fs.unlinkSync(path.join(RESULTS_DIR, f))
  );
}

process.exit(failed > 0 ? 1 : 0);

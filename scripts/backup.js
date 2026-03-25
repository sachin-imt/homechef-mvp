#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════
// Home Meals Daily Backup Script
//
// Extracts source data from cc-data.js and any exported
// localStorage snapshots, then writes date-stamped CSV files
// to the /backups directory.
//
// Usage:
//   node scripts/backup.js
//   node scripts/backup.js --restore backups/2026-03-25/
//
// For live data (localStorage), use the Admin Portal:
//   Admin → Settings → Export All Data → download JSON
//   Then place the JSON file in backups/ and run:
//   node scripts/backup.js --restore backups/homemeals-backup-YYYY-MM-DD.json
// ══════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const ROOT       = path.join(__dirname, '..');
const BACKUP_DIR = path.join(ROOT, 'backups');
const TODAY      = new Date().toISOString().slice(0, 10);
const OUT_DIR    = path.join(BACKUP_DIR, TODAY);

// ── Helpers ──────────────────────────────────────────────────
function csvRow(fields) {
  return fields.map(f => {
    if (f == null) return '';
    const s = String(f).replace(/"/g, '""');
    return /[,"\n\r]/.test(s) ? `"${s}"` : s;
  }).join(',');
}

function writeCSV(filename, headers, rows) {
  const lines = [csvRow(headers), ...rows.map(r => csvRow(headers.map(h => r[h])))];
  fs.writeFileSync(path.join(OUT_DIR, filename), lines.join('\n'), 'utf8');
  console.log(`  ✅  ${filename}  (${rows.length} rows)`);
}

// ── Parse chef data from cc-data.js using regex ──────────────
function parseSourceChefs() {
  const src = fs.readFileSync(path.join(ROOT, 'js', 'cc-data.js'), 'utf8');
  const chefs = [];
  // Extract each chef block between { chef_id: ... } entries
  const chefPattern = /\{\s*chef_id:\s*(\d+)[\s\S]*?(?=,\s*\{[\s\S]*?chef_id:|var CUISINES)/g;

  let m;
  while ((m = chefPattern.exec(src)) !== null) {
    const block = m[0];
    const get = (key) => {
      const r = new RegExp(`${key}:\\s*["'\`]([^"'\`]+)["'\`]`);
      return (block.match(r) || [])[1] || '';
    };
    const getNum = (key) => {
      const r = new RegExp(`${key}:\\s*([\\d.]+)`);
      return (block.match(r) || [])[1] || '';
    };

    chefs.push({
      chef_id:           m[1],
      chef_name:         get('chef_name'),
      cuisine_type:      get('cuisine_type'),
      price_per_week:    getNum('price_per_week'),
      rating:            getNum('rating'),
      bio:               get('bio').slice(0, 100),
    });
  }
  return chefs;
}

// ── Parse postcode map from cc-data.js ───────────────────────
function parsePostcodes() {
  const src = fs.readFileSync(path.join(ROOT, 'js', 'cc-data.js'), 'utf8');
  const map = [];
  const r = /"(\d{4})":\s*"([^"]+)"/g;
  let m;
  while ((m = r.exec(src)) !== null) {
    map.push({ postcode: m[1], suburb: m[2] });
  }
  return map;
}

// ── Main ─────────────────────────────────────────────────────
function runBackup(lsData) {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`\n📦  Home Meals Backup — ${TODAY}`);
  console.log('='.repeat(40));
  console.log(`Output: ${OUT_DIR}\n`);

  // ── Chefs ──
  const chefs = lsData?.cc_chefs || parseSourceChefs();
  if (chefs.length) {
    writeCSV('chefs.csv',
      ['chef_id','chef_name','cuisine_type','price_per_week','rating','bio','status'],
      chefs
    );
  }

  // ── Postcodes ──
  const postcodes = lsData?.cc_postcode_map ? Object.entries(lsData.cc_postcode_map).map(([k,v]) => ({ postcode:k, suburb:v })) : parsePostcodes();
  writeCSV('postcodes.csv', ['postcode','suburb'], postcodes);

  // ── Subscribers ──
  const subscribers = lsData?.cc_subscribers || [];
  if (subscribers.length) {
    // Flatten payments into subscriber rows
    const rows = [];
    subscribers.forEach(s => {
      if (!s.payments?.length) {
        rows.push({ id:s.id, name:s.name, email:s.email, phone:s.phone, chef_id:s.chef_id, chef_name:s.chef_name, suburb:s.suburb, postcode:s.postcode, dietary:s.dietary, status:s.status, created:s.created, starting_week:s.starting_week, payment_week:'', payment_status:'', payment_confirmed:'', payment_date:'' });
      } else {
        s.payments.forEach(p => {
          rows.push({ id:s.id, name:s.name, email:s.email, phone:s.phone, chef_id:s.chef_id, chef_name:s.chef_name, suburb:s.suburb, postcode:s.postcode, dietary:s.dietary, status:s.status, created:s.created, starting_week:s.starting_week, payment_week:p.week, payment_status:p.status, payment_confirmed:p.confirmed?'Yes':'No', payment_date:p.confirmed_at||'' });
        });
      }
    });
    writeCSV('subscribers.csv',
      ['id','name','email','phone','chef_id','chef_name','suburb','postcode','dietary','status','created','starting_week','payment_week','payment_status','payment_confirmed','payment_date'],
      rows
    );
  } else {
    console.log('  ℹ️   subscribers.csv — no live data (export from Admin → Settings)');
  }

  // ── Chef Applications ──
  const apps = lsData?.cc_chef_applications || [];
  if (apps.length) {
    writeCSV('chef_applications.csv',
      ['id','full_name','email','phone','suburb','cuisine_type','weekly_capacity','status','submitted','reviewed_at'],
      apps
    );
  }

  // ── Chef Accounts (usernames only — NO passwords) ──
  const accounts = lsData?.cc_chef_accounts || [];
  if (accounts.length) {
    writeCSV('chef_accounts.csv',
      ['chef_id','chef_name','username','active','created'],
      accounts.map(a => ({ ...a, password: undefined })) // strip passwords
    );
  }

  // ── Metadata ──
  const meta = {
    backup_date:  TODAY,
    generated_at: new Date().toISOString(),
    source:       lsData ? 'admin_export' : 'source_code',
    files:        fs.readdirSync(OUT_DIR),
    note: lsData ? 'Full live data backup from admin export.' : 'Source-code baseline only. For live subscriber/application data, use Admin → Settings → Export All Data.',
  };
  fs.writeFileSync(path.join(OUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));
  console.log(`  ✅  meta.json`);

  console.log(`\n✅  Backup complete → ${OUT_DIR}`);
  if (!lsData) {
    console.log('\n⚠️   TIP: To backup live data (subscribers, applications):');
    console.log('    1. Open admin.html → Settings → Export All Data');
    console.log('    2. Save the JSON file to backups/');
    console.log('    3. Run: node scripts/backup.js --restore backups/<filename>.json');
  }
}

// ── Restore mode ─────────────────────────────────────────────
function runRestore(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    console.error(`❌  File not found: ${abs}`);
    process.exit(1);
  }
  console.log(`\n🔄  Restoring from: ${abs}`);
  const data = JSON.parse(fs.readFileSync(abs, 'utf8'));

  // Print instructions (browser localStorage must be set manually or via admin import)
  console.log('\nTo restore this data:');
  console.log('1. Open admin.html in your browser');
  console.log('2. Go to Settings → Import Backup');
  console.log('3. Upload this JSON file');
  console.log('\nOr paste this into the browser console:');
  Object.entries(data).forEach(([k, v]) => {
    if (k !== 'export_date' && k !== 'version') {
      console.log(`localStorage.setItem('${k}', '${JSON.stringify(v).replace(/'/g, "\\'")}');`);
    }
  });
}

// ── Entry point ──────────────────────────────────────────────
const args = process.argv.slice(2);
if (args[0] === '--restore' && args[1]) {
  runRestore(args[1]);
} else {
  // Check for exported JSON from admin portal
  const exportFiles = fs.readdirSync(BACKUP_DIR)
    .filter(f => f.startsWith('homemeals-backup-') && f.endsWith('.json'))
    .sort().reverse();

  if (exportFiles.length) {
    const latest = exportFiles[0];
    console.log(`Found admin export: ${latest} — using live data`);
    const lsData = JSON.parse(fs.readFileSync(path.join(BACKUP_DIR, latest), 'utf8'));
    runBackup(lsData);
  } else {
    runBackup(null); // source-code baseline only
  }
}

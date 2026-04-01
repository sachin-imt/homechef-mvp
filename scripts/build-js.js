// Pre-compiles JSX files in js/ to plain JS in dist/js/
// Run via: node scripts/build-js.js
const babel = require('@babel/core');
const fs    = require('fs');
const path  = require('path');

const srcDir = path.join(__dirname, '../js');
const outDir = path.join(__dirname, '../dist/js');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));
let ok = 0, fail = 0;

for (const file of files) {
  const src = fs.readFileSync(path.join(srcDir, file), 'utf8');
  try {
    const { code } = babel.transformSync(src, {
      presets: ['@babel/preset-react'],
      filename: file,
    });
    fs.writeFileSync(path.join(outDir, file), code);
    console.log('✓', file);
    ok++;
  } catch (e) {
    console.error('✗', file, '—', e.message);
    fail++;
  }
}

console.log(`\n${ok} compiled, ${fail} failed`);
if (fail > 0) process.exit(1);

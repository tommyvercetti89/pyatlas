// Automated App & Button Integrity Test Suite
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = process.cwd();
let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

console.log('=== 1. Checking index.html Structure & Interactive Elements ===');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const requiredIds = ['main', 'topbar', 'topnav', 'bottomnav', 'search', 'search-input', 'search-close', 'btn-search', 'toast', 'boot'];
for (const id of requiredIds) {
  assert(html.includes(`id="${id}"`), `index.html contains element #${id}`);
}

assert(html.includes('data-act="open-search"'), 'Search trigger has data-act="open-search"');
assert(html.includes('data-act="close-search"'), 'Search close button has data-act="close-search"');
assert(html.includes('data-act="lang" data-v="tr"'), 'TR button has data-act="lang" data-v="tr"');
assert(html.includes('data-act="lang" data-v="en"'), 'EN button has data-act="lang" data-v="en"');
assert(html.includes('data-act="theme" data-v="light"'), 'Light theme button has data-act="theme" data-v="light"');
assert(html.includes('data-act="theme" data-v="purple"'), 'Purple theme button has data-act="theme" data-v="purple"');
assert(html.includes('data-act="theme" data-v="dark"'), 'Dark theme button has data-act="theme" data-v="dark"');

console.log('\n=== 2. Checking css/style.css Overlay & Pointer Safety ===');
const css = fs.readFileSync(path.join(ROOT, 'css', 'style.css'), 'utf8');

assert(css.includes('[hidden] {') && css.includes('display: none !important;'), 'Author [hidden] rule has !important display:none reset');
assert(/\.search-ov\s*\{[^}]*pointer-events:\s*none;/s.test(css), '.search-ov has pointer-events: none default');
assert(/\.search-ov\s*\{[^}]*visibility:\s*hidden;/s.test(css), '.search-ov has visibility: hidden default');
assert(/\.search-ov\.on\s*\{[^}]*pointer-events:\s*auto;/s.test(css), '.search-ov.on restores pointer-events: auto');
assert(/\.search-ov\.on\s*\{[^}]*visibility:\s*visible;/s.test(css), '.search-ov.on restores visibility: visible');
assert(/\.search-ov\[hidden\]\s*\{[^}]*display:\s*none\s*!important;/s.test(css), '.search-ov[hidden] explicitly enforced !important');
assert(/\.toast\s*\{[^}]*pointer-events:\s*none;/s.test(css), '.toast has pointer-events: none to avoid click interception');
assert(/\.boot\.out\s*\{[^}]*pointer-events:\s*none;/s.test(css), '.boot.out has pointer-events: none');

console.log('\n=== 3. Checking JavaScript Click Action Handlers ===');
const appJs = fs.readFileSync(path.join(ROOT, 'js', 'app.js'), 'utf8');

// Collect all data-act attributes generated in HTML strings or index.html
const allHtml = html + '\n' + appJs;
const actsInTemplates = new Set();
const actRegex = /data-act=["']([^"']+)["']/g;
let m;
while ((m = actRegex.exec(allHtml)) !== null) {
  actsInTemplates.add(m[1]);
}

// Collect all cases handled in switch (act)
const switchMatch = appJs.match(/switch\s*\(\s*act\s*\)\s*\{([\s\S]*?)\n\s*\}\s*\)\s*;/);
assert(!!switchMatch, 'switch (act) found in js/app.js');
const switchBody = switchMatch ? switchMatch[1] : '';
const handledCases = new Set();
const caseRegex = /case\s+['"]([^'"]+)['"]\s*:/g;
while ((m = caseRegex.exec(switchBody)) !== null) {
  handledCases.add(m[1]);
}

console.log(`Discovered ${actsInTemplates.size} unique data-act values in templates:`, Array.from(actsInTemplates).sort());
console.log(`Discovered ${handledCases.size} cases handled in event delegation:`, Array.from(handledCases).sort());

for (const act of actsInTemplates) {
  assert(handledCases.has(act), `data-act="${act}" has a corresponding handler in click delegation`);
}

assert(!appJs.includes('CSS.escape'), 'No vulnerable or unsupported CSS.escape calls in js/app.js');

console.log('\n=== 4. Checking Service Worker Precache Files ===');
const swJs = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
const precacheMatch = swJs.match(/const PRECACHE_ASSETS = \[([\s\S]*?)\];/);
assert(!!precacheMatch, 'PRECACHE_ASSETS array found in sw.js');
const precacheFiles = eval(`[${precacheMatch[1]}]`);
let missingPrecache = 0;
for (const rel of precacheFiles) {
  const norm = rel === './' ? 'index.html' : rel;
  const fp = path.join(ROOT, norm);
  if (!fs.existsSync(fp)) {
    console.error(`Missing precache asset: ${rel} -> ${fp}`);
    missingPrecache++;
  }
}
assert(missingPrecache === 0, `All ${precacheFiles.length} precache assets exist on disk`);

console.log('\n=== 5. Checking Data Integrity & Translations ===');
const coreJs = fs.readFileSync(path.join(ROOT, 'js', 'core.js'), 'utf8');
const stringsJs = fs.readFileSync(path.join(ROOT, 'js', 'strings.js'), 'utf8');
const manifestJs = fs.readFileSync(path.join(ROOT, 'js', 'manifest.js'), 'utf8');
const pathsJs = fs.readFileSync(path.join(ROOT, 'js', 'paths.js'), 'utf8');

const mockWindow = { matchMedia: () => ({ matches: false }) };
mockWindow.window = mockWindow;
const sandbox = {
  window: mockWindow,
  document: { documentElement: { lang: 'tr' }, querySelector: () => null, querySelectorAll: () => [] },
  navigator: { language: 'tr' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  setTimeout: () => {},
  clearTimeout: () => {},
  requestAnimationFrame: (cb) => cb(),
  console
};
vm.createContext(sandbox);
vm.runInContext(coreJs, sandbox);
vm.runInContext(stringsJs, sandbox);
vm.runInContext(manifestJs, sandbox);
vm.runInContext(pathsJs, sandbox);

const PY = sandbox.window.PY;
const strings = PY.strings;
const trKeys = Object.keys(strings.tr);
const enKeys = Object.keys(strings.en);
assert(trKeys.length > 50, `TR strings loaded (${trKeys.length} keys)`);
assert(enKeys.length > 50, `EN strings loaded (${enKeys.length} keys)`);
const missingEn = trKeys.filter(k => !(k in strings.en));
assert(missingEn.length === 0, `No missing English translation keys (missing: ${missingEn.join(', ') || 'none'})`);
assert(PY.manifest.length === 34, `Manifest registers exactly 34 libraries (got: ${PY.manifest.length})`);
assert(PY.paths.length === 5, `Paths registers 5 learning tracks (got: ${PY.paths.length})`);

console.log(`\n========================================`);
if (failed === 0) {
  console.log('🎉 ALL INTEGRITY TESTS PASSED WITH 0 ERRORS!');
  process.exit(0);
} else {
  console.error(`💥 ${failed} INTEGRITY TESTS FAILED!`);
  process.exit(1);
}

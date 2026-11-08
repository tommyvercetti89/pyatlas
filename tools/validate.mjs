// Validates every data/libs/*.js file and dumps them to tools/.out/libs.json
// usage: node tools/validate.mjs [libId ...]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const only = process.argv.slice(2);

function load(file) {
  const libs = [];
  const sandbox = { PY: { addLib: (l) => libs.push(l) } };
  sandbox.window = sandbox;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  return libs;
}

const mf = { PY: {} };
mf.window = mf;
vm.runInNewContext(fs.readFileSync(path.join(root, 'js/manifest.js'), 'utf8'), mf);
const manifest = mf.PY.manifest;

const KINDS = new Set(['class', 'function', 'method', 'attr', 'const', 'exception', 'concept', 'keyword', 'module', 'decorator', 'operator', 'type']);
const CATS = new Set(['basics', 'files', 'text', 'data', 'time', 'network', 'crypto', 'system', 'concurrency', 'web', 'tools']);
const FOCUS = new Set(['general', 'cyber', 'both']);

let errors = 0, warns = 0;
const out = [];
const err = (lib, msg) => { errors++; console.log(`  ERROR [${lib}] ${msg}`); };
const warn = (lib, msg) => { warns++; console.log(`  warn  [${lib}] ${msg}`); };

function bi(lib, v, where, { optional = false, long = false } = {}) {
  if (v == null) { if (!optional) err(lib, `${where}: missing`); return; }
  if (!Array.isArray(v) || v.length !== 2 || typeof v[0] !== 'string' || typeof v[1] !== 'string') return err(lib, `${where}: must be ["tr","en"]`);
  if (!v[0].trim() || !v[1].trim()) return err(lib, `${where}: empty tr or en`);
  if (/todo|fixme|lorem/i.test(v[0] + v[1])) err(lib, `${where}: contains TODO/lorem`);
  if (long && v[0] === v[1] && v[0].length > 30) warn(lib, `${where}: tr == en (untranslated?)`);
  if (v[0].length > 0 && /\b(the|which|you can|this is)\b/i.test(v[0]) && v[0].split(' ').length > 6) warn(lib, `${where}: tr looks English`);
}
function code(lib, c, where, bilingual = true) {
  if (typeof c !== 'string' || !c.trim()) return err(lib, `${where}: code missing`);
  c.split('\n').forEach((line, i) => {
    const m = line.match(/#\s?(.*?)\s*\|\|\|\s*(.*)$/);
    if (line.includes('|||') && (!m || !m[1].trim() || !m[2].trim())) err(lib, `${where}:${i + 1}: bad bilingual comment`);
  });
  // comments without ||| are allowed only if they look language-neutral
  c.split('\n').forEach((line, i) => {
    const m = line.match(/(^|\s)#\s?(.+)$/);
    if (m && !line.includes('|||') && /[a-zA-ZçğıöşüÇĞİÖŞÜ]{4,}\s+[a-zA-ZçğıöşüÇĞİÖŞÜ]{3,}/.test(m[2]) && !/^\s*#!/.test(line) && !/["'].*#.*["']/.test(line))
      warn(where.split(':')[0], `${where}:${i + 1}: comment without "|||" translation: ${m[2].slice(0, 50)}`);
  });
}

for (const id of manifest) {
  if (only.length && !only.includes(id)) continue;
  const file = path.join(root, 'data/libs', id + '.js');
  if (!fs.existsSync(file)) { if (only.length) err(id, 'file missing'); continue; }
  console.log(`• ${id}`);
  let libs;
  try { libs = load(file); } catch (e) { err(id, 'cannot load: ' + e.message); continue; }
  if (libs.length !== 1) { err(id, `expected exactly 1 PY.addLib call, got ${libs.length}`); continue; }
  const L = libs[0];
  if (L.id !== id) err(id, `id mismatch: ${L.id}`);
  for (const k of ['name', 'color', 'focus', 'level', 'cat', 'docs', 'import']) if (L[k] == null) err(id, `missing ${k}`);
  if (!FOCUS.has(L.focus)) err(id, 'bad focus');
  if (![1, 2, 3].includes(L.level)) err(id, 'bad level');
  if (!CATS.has(L.cat)) err(id, 'bad cat ' + L.cat);
  if (L.ext && !L.install) err(id, 'ext lib needs install');
  if (!/^#[0-9a-fA-F]{6}$/.test(L.color || '')) err(id, 'color must be #rrggbb');
  bi(id, L.tagline, 'tagline', { long: true });
  bi(id, L.analogy, 'analogy', { long: true });
  if (!Array.isArray(L.intro) || L.intro.length < 2) err(id, 'intro needs >= 2 paragraphs'); else L.intro.forEach((p, i) => bi(id, p, `intro[${i}]`, { long: true }));
  code(id, L.import, 'import');
  for (const k of ['general', 'cyberUse']) {
    if (!Array.isArray(L[k]) || L[k].length < 3) err(id, `${k} needs >= 3 bullets`); else L[k].forEach((p, i) => bi(id, p, `${k}[${i}]`, { long: true }));
  }
  const ids = new Set();
  let members = 0, examples = 0, withCyber = 0;
  const secIds = new Set();
  for (const sec of L.sections || []) {
    if (!sec.id || secIds.has(sec.id)) err(id, `section id dup/missing ${sec.id}`);
    secIds.add(sec.id);
    bi(id, sec.title, `section ${sec.id} title`);
    bi(id, sec.intro, `section ${sec.id} intro`, { optional: true, long: true });
    for (const m of sec.items || []) {
      members++;
      const w = `${sec.id}/${m.id}`;
      if (!m.id || !/^[a-z0-9_.-]+$/.test(m.id)) err(id, `bad member id ${m.id}`);
      if (ids.has(m.id)) err(id, `duplicate member id ${m.id}`);
      ids.add(m.id);
      if (!m.name) err(id, `${w}: name missing`);
      if (!KINDS.has(m.kind)) err(id, `${w}: bad kind ${m.kind}`);
      if (!m.sig) warn(id, `${w}: no sig`);
      bi(id, m.sum, `${w}.sum`, { long: true });
      bi(id, m.desc, `${w}.desc`, { long: true });
      if (m.params) m.params.forEach((p, i) => { if (!p.n) err(id, `${w}.params[${i}].n`); bi(id, p.d, `${w}.params[${i}].d`, { long: true }); });
      bi(id, m.ret, `${w}.ret`, { optional: true, long: true });
      bi(id, m.cyber, `${w}.cyber`, { optional: true, long: true });
      bi(id, m.gotcha, `${w}.gotcha`, { optional: true, long: true });
      if (m.cyber) withCyber++;
      const exs = m.ex ? (Array.isArray(m.ex) ? m.ex : [m.ex]) : [];
      if (!exs.length) warn(id, `${w}: no example`);
      exs.forEach((e, i) => {
        examples++;
        code(id, e.code, `${w}.ex[${i}]`);
        if (e.title) bi(id, e.title, `${w}.ex[${i}].title`);
        if (e.out == null && !e.nocheck) warn(id, `${w}.ex[${i}]: no out (prints nothing?)`);
      });
    }
  }
  for (const sec of L.sections || []) for (const m of sec.items || []) for (const s of m.see || []) {
    if (!s.includes(':') && !ids.has(s)) err(id, `${sec.id}/${m.id}: see -> unknown member ${s}`);
  }
  if (members < 8) err(id, `only ${members} members`);
  if (!Array.isArray(L.recipes) || L.recipes.length < 2) err(id, 'recipes needs >= 2');
  const rids = new Set();
  (L.recipes || []).forEach((r) => {
    if (!r.id || rids.has(r.id)) err(id, `recipe id dup/missing ${r.id}`);
    rids.add(r.id);
    bi(id, r.title, `recipe ${r.id}.title`);
    bi(id, r.sum, `recipe ${r.id}.sum`, { long: true });
    bi(id, r.note, `recipe ${r.id}.note`, { optional: true, long: true });
    code(id, r.code, `recipe ${r.id}.code`);
    examples++;
  });
  if (!Array.isArray(L.cards) || L.cards.length < 5) err(id, 'cards needs >= 5');
  const cids = new Set();
  (L.cards || []).forEach((c) => {
    if (!c.id || cids.has(c.id)) err(id, `card id dup/missing ${c.id}`);
    cids.add(c.id);
    bi(id, c.q, `card ${c.id}.q`, { long: true });
    bi(id, c.a, `card ${c.id}.a`, { long: true });
    if (c.code) code(id, c.code, `card ${c.id}.code`);
  });
  console.log(`  ${members} members, ${examples} examples, ${withCyber} cyber notes, ${(L.recipes || []).length} recipes, ${(L.cards || []).length} cards`);
  out.push(L);
}

fs.mkdirSync(path.join(root, 'tools/.out'), { recursive: true });
const dumpFile = path.join(root, 'tools/.out/' + (only.join('+') || 'all') + '.json');
fs.writeFileSync(dumpFile, JSON.stringify(out));
console.log(`\n${errors} errors, ${warns} warnings`);
process.exit(errors ? 1 : 0);


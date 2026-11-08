/* PyAtlas app: router, views, review session, search, settings */
(function () {
  'use strict';
  const { t, s, esc, rt, hl, $, $$, store } = PY;
  const ST = () => store.state;
  const main = $('#main');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- icons ---------- */
  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
    refresh: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    settings: '<path d="M4 6h8M18 6h2M4 12h2M12 12h8M4 18h10M20 18h0"/><circle cx="15" cy="6" r="2.2"/><circle cx="9" cy="12" r="2.2"/><circle cx="17" cy="18" r="2.2"/>',
    sparkles: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    alert: '<path d="M12 3 2.5 20h19z"/><path d="M12 10v5M12 18h.01"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    download: '<path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 20h16"/>',
    upload: '<path d="M12 15V3m0 0L8 7m4-4 4 4"/><path d="M4 20h16"/>',
    arrowR: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    arrowL: '<path d="M19 12H5m5-5-5 5 5 5"/>',
    flame: '<path d="M12 22c4 0 7-2.8 7-7 0-3-2-5-3-7-1 1.5-2 2-3 2 0-3-1-6-4-8 0 4-4 6-4 12 0 4.2 3 8 7 8z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9m-3 3 3 3m-6 0 2 2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    phone: '<rect x="7" y="2" width="10" height="20" rx="2.4"/><path d="M11 18h2"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  };
  const ic = (n, cls = '') =>
    `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  /* ---------- small view helpers ---------- */
  const trim = (x) => String(x).replace(/^\n+|\n+$/g, '');
  const tile = (l, big) => `<span class="tile${big ? ' big' : ''}" style="--lc:${l.color}"><span>${esc(l.sym || l.name.slice(0, 2))}</span></span>`;
  const lvl = (n) =>
    `<span class="lvl" title="${esc(s('level.' + n))}" aria-label="${esc(s('level.' + n))}">${[1, 2, 3].map((i) => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}<em>${esc(s('level.' + n))}</em></span>`;
  const focusBadge = (l) =>
    `<span class="badge b-${l.focus}">${ic(l.focus === 'general' ? 'book' : 'shield')}${esc(s('focus.' + l.focus))}</span>`;
  const srcBadge = (l) => `<span class="badge b-src">${esc(s(l.ext ? 'src.ext' : 'src.std'))}</span>`;
  function progress(l) {
    const ms = PY.members(l);
    const done = ms.filter((m) => ST().done[l.id + ':' + m.id]).length;
    return { done, total: ms.length, pct: ms.length ? Math.round((done / ms.length) * 100) : 0 };
  }
  function ring(pct, size = 64) {
    const R = 26, C = 2 * Math.PI * R;
    return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-label="${pct}%"><circle class="ring-bg" cx="32" cy="32" r="${R}"/><circle class="ring-fg" cx="32" cy="32" r="${R}" stroke-dasharray="${C.toFixed(2)}" data-c="${C.toFixed(2)}" data-pct="${pct}" stroke-dashoffset="${C.toFixed(2)}"/><text x="32" y="37" text-anchor="middle">${pct}%</text></svg>`;
  }
  function fmtIvl(d) {
    if (d <= 0) return s('ivl.min10');
    if (d === 1) return s('ivl.d1');
    if (d < 30) return s('ivl.dn', { n: d });
    if (d < 365) return s('ivl.mn', { n: Math.round(d / 30) });
    return s('ivl.y');
  }
  function codeBox(code, { kind, label } = {}) {
    const txt = kind === 'sh' ? trim(code) : PY.code(code);
    return `<div class="code"><div class="code-bar"><span class="code-lang">${esc(label || (kind === 'sh' ? 'shell' : 'python'))}</span><button class="copy" data-act="copy" type="button" aria-label="${esc(s('copy'))}">${ic('copy')}<em>${esc(s('copy'))}</em></button></div><pre><code>${hl(txt, kind)}</code></pre></div>`;
  }
  function exBlock(e) {
    return `<div class="ex">${e.title ? `<div class="ex-t">${ic('play')}${esc(t(e.title))}</div>` : ''}${codeBox(e.code)}${
      e.out != null
        ? `<div class="out"><div class="out-l">${ic('check')}${esc(s('output'))}${e.nocheck ? ' · ' + esc(s('illustrative')) : ''}</div><pre>${esc(trim(e.out))}</pre></div>`
        : ''
    }</div>`;
  }
  const pager = (prev, next) =>
    `<nav class="pager">${prev ? `<a class="pg prev" href="${prev.href}">${ic('arrowL')}<span><small>${esc(s('prev'))}</small>${esc(prev.label)}</span></a>` : '<span></span>'}${next ? `<a class="pg next" href="${next.href}"><span><small>${esc(s('next'))}</small>${esc(next.label)}</span>${ic('arrowR')}</a>` : ''}</nav>`;

  /* ---------- route ---------- */
  function parseRoute() {
    const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const p = h.split('/').filter(Boolean);
    if (!p.length) return { name: 'home' };
    switch (p[0]) {
      case 'libs': return { name: 'libs' };
      case 'lib': return PY.libById(p[1]) ? { name: 'lib', id: p[1], sub: p[2] } : { name: 'libs' };
      case 'path': return PY.paths.some((x) => x.id === p[1]) ? { name: 'path', id: p[1] } : { name: 'home' };
      case 'review': return { name: 'review', mode: 'due' };
      case 'study': return PY.libById(p[1]) ? { name: 'review', mode: 'study', id: p[1] } : { name: 'review', mode: 'due' };
      case 'settings': return { name: 'settings' };
      default: return { name: 'home' };
    }
  }
  const ui = { focus: 'all', src: 'all', q: '' };
  const OPEN = new Set();
  let sess = null;
  let deferredInstall = null;

  /* ---------- HOME ---------- */
  const DEMOS = [
    ['import socket', '', 's = socket.socket()', 's.settimeout(1.5)', 'code = s.connect_ex(("127.0.0.1", 22))', 'print("open" if code == 0 else "closed")'],
    ['import hashlib', '', 'h = hashlib.sha256()', 'h.update(b"pyatlas")', 'print(h.hexdigest()[:16])'],
    ['import re', '', 'log = "Failed login from 10.0.0.7"', 'ip = re.search(r"\\d+\\.\\d+\\.\\d+\\.\\d+", log)', 'print(ip.group())'],
  ];
  function homeView() {
    const libs = PY.libs;
    const totalM = libs.reduce((a, l) => a + PY.members(l).length, 0);
    const doneM = Object.keys(ST().done).filter((k) => { const [lid] = k.split(':'); const l = PY.libById(lid); return !!l; }).length;
    const due = PY.dueIds().length;
    const last = ST().lastLib && PY.libById(ST().lastLib);
    const started = libs.filter((l) => progress(l).done > 0).length;
    return `
    <section class="hero">
      <div class="hero-text">
        <span class="eyebrow reveal">${ic('sparkles')}${esc(s('hero.eyebrow'))}</span>
        <h1 class="reveal">${s('hero.title')}</h1>
        <p class="lead reveal">${esc(s('hero.lead'))}</p>
        <div class="cta reveal">
          <a class="btn primary lg" href="#/libs">${esc(s('hero.start'))}${ic('arrowR')}</a>
          ${last ? `<a class="btn ghost lg" href="#/lib/${esc(last.id)}">${esc(s('hero.continue', { lib: last.name }))}</a>` : ''}
          ${due ? `<a class="btn soft lg" href="#/review">${ic('refresh')}${esc(s('hero.review', { n: due }))}</a>` : ''}
        </div>
        <ul class="chips reveal">
          <li>${ic('book')}${esc(s('hero.c1', { n: libs.length }))}</li>
          <li>${ic('layers')}${esc(s('hero.c2', { n: totalM }))}</li>
          <li>${ic('refresh')}${esc(s('hero.c3'))}</li>
        </ul>
      </div>
      <div class="hero-code reveal" aria-hidden="true">
        <div class="win"><div class="win-bar"><i></i><i></i><i></i><span>atlas.py</span></div><pre id="demo"><code></code></pre></div>
        <div class="float f1">${ic('shield')}<span>socket</span></div>
        <div class="float f2">${ic('key')}<span>hashlib</span></div>
        <div class="float f3">${ic('bolt')}<span>threading</span></div>
      </div>
    </section>

    <section class="stats">
      ${[
        ['flame', STREAK(), s('stats.streak'), 'warm'],
        ['book', `${doneM}<small>/${totalM}</small>`, s('stats.read'), ''],
        ['refresh', due, s('stats.due'), due ? 'hot' : ''],
        ['layers', `${started}<small>/${libs.length}</small>`, s('stats.libs'), ''],
      ].map(([i, v, l, c]) => `<div class="stat reveal ${c}">${ic(i)}<div><b>${v}</b><span>${esc(l)}</span></div></div>`).join('')}
    </section>

    ${deferredInstall && !isStandalone() ? `<section class="install reveal">${ic('phone')}<div><b>${esc(s('install.t'))}</b><span>${esc(s('install.d'))}</span></div><button class="btn primary" data-act="install">${ic('download')}${esc(s('install.btn'))}</button></section>` : ''}

    <section class="block">
      <header class="block-h reveal"><h2>${esc(s('sec.paths'))}</h2><p>${esc(s('sec.paths.sub'))}</p></header>
      <div class="paths">${PY.paths.map(pathCard).join('')}</div>
    </section>

    <section class="block">
      <header class="block-h reveal"><h2>${esc(s('sec.how'))}</h2></header>
      <div class="how">
        ${[1, 2, 3].map((n) => `<div class="how-i reveal"><span class="how-n">${n}</span><h3>${esc(s('how.' + n + '.t'))}</h3><p>${esc(s('how.' + n + '.d'))}</p></div>`).join('')}
      </div>
    </section>

    <section class="block">
      <header class="block-h reveal"><h2>${esc(s('sec.libs'))}</h2><p>${esc(s('sec.libs.sub'))}</p></header>
      <div class="libgrid">${libs.filter((l) => l.focus !== 'general').slice(0, 6).map(libCard).join('')}</div>
      <p class="more reveal"><a class="btn ghost" href="#/libs">${esc(s('see.all', { n: libs.length }))}${ic('arrowR')}</a></p>
    </section>
    ${footer()}`;
  }
  const STREAK = () => store.streak();
  const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  function pathCard(p) {
    const libs = p.libs.map(PY.libById).filter(Boolean);
    const sum = libs.reduce((a, l) => { const pr = progress(l); return [a[0] + pr.done, a[1] + pr.total]; }, [0, 0]);
    const pct = sum[1] ? Math.round((sum[0] / sum[1]) * 100) : 0;
    return `<a class="path reveal" href="#/path/${p.id}" style="--lc:${p.color}"><span class="path-ic">${ic(p.icon)}</span><div><h3>${esc(t(p.title))}</h3><p>${esc(t(p.desc))}</p><div class="path-libs">${libs.slice(0, 6).map((l) => `<code>${esc(l.name)}</code>`).join('')}${libs.length > 6 ? `<code>+${libs.length - 6}</code>` : ''}</div></div><div class="path-foot"><div class="bar"><i style="width:${pct}%"></i></div><span>${pct}%</span></div></a>`;
  }
  function libCard(l) {
    const pr = progress(l);
    return `<a class="lib reveal" href="#/lib/${esc(l.id)}" style="--lc:${l.color}">
      <div class="lib-top">${tile(l)}<div class="lib-tt"><h3>${esc(l.name)}</h3>${lvl(l.level)}</div></div>
      <p>${esc(t(l.tagline))}</p>
      <div class="lib-badges">${focusBadge(l)}${srcBadge(l)}<span class="badge b-n">${esc(s('n.members', { n: pr.total }))}</span></div>
      <div class="lib-foot"><div class="bar"><i style="width:${pr.pct}%"></i></div><span>${pr.pct}%</span></div>
    </a>`;
  }
  function footer() {
    return `<footer class="foot"><div class="ethics">${ic('shield')}<p>${esc(s('ethics'))}</p></div><p class="small">${esc(s('foot'))}</p></footer>`;
  }

  /* ---------- LIBS ---------- */
  function filteredLibs() {
    const q = PY.fold(ui.q.trim());
    return PY.libs.filter((l) => {
      if (ui.focus === 'general' && l.focus === 'cyber') return false;
      if (ui.focus === 'cyber' && l.focus === 'general') return false;
      if (ui.src === 'std' && l.ext) return false;
      if (ui.src === 'ext' && !l.ext) return false;
      if (q && !PY.fold(l.name + ' ' + t(l.tagline) + ' ' + l.tagline.join(' ')).includes(q)) return false;
      return true;
    });
  }
  function libsGrid() {
    const list = filteredLibs();
    return list.length ? list.map(libCard).join('') : `<p class="empty">${esc(s('libs.none'))}</p>`;
  }
  function chip(k, v, label) {
    const on = ui[k] === v;
    return `<button class="fchip${on ? ' on' : ''}" data-act="filter" data-k="${k}" data-v="${v}" aria-pressed="${on}">${esc(label)}</button>`;
  }
  function libsView() {
    return `
    <section class="page-h reveal"><h1>${esc(s('libs.title'))}</h1><p>${esc(s('libs.sub', { n: PY.libs.length }))}</p></section>
    <div class="toolbar reveal">
      <label class="filter-search">${ic('search')}<input id="lib-q" type="search" value="${esc(ui.q)}" placeholder="${esc(s('libs.filter.ph'))}" autocomplete="off"></label>
      <div class="fgroup" role="group">${chip('focus', 'all', s('f.all'))}${chip('focus', 'general', s('f.general'))}${chip('focus', 'cyber', s('f.cyber'))}</div>
      <div class="fgroup" role="group">${chip('src', 'all', s('f.all'))}${chip('src', 'std', s('src.std'))}${chip('src', 'ext', s('src.ext'))}</div>
    </div>
    <div class="libgrid" id="libgrid">${libsGrid()}</div>
    ${footer()}`;
  }

  /* ---------- PATH ---------- */
  function pathView(id) {
    const p = PY.paths.find((x) => x.id === id);
    const libs = p.libs.map(PY.libById).filter(Boolean);
    const sum = libs.reduce((a, l) => { const pr = progress(l); return [a[0] + pr.done, a[1] + pr.total]; }, [0, 0]);
    const pct = sum[1] ? Math.round((sum[0] / sum[1]) * 100) : 0;
    const nextLib = libs.find((l) => progress(l).pct < 100) || libs[0];
    return `
    <div class="crumbs reveal"><a href="#/">${esc(s('nav.home'))}</a><span>/</span><span>${esc(t(p.title))}</span></div>
    <section class="path-hero reveal" style="--lc:${p.color}"><span class="path-ic big">${ic(p.icon)}</span><div><h1>${esc(t(p.title))}</h1><p>${esc(t(p.desc))}</p><div class="path-meta"><div class="bar"><i style="width:${pct}%"></i></div><span>${pct}% · ${esc(s('path.libs', { n: libs.length }))}</span></div></div>${nextLib ? `<a class="btn primary" href="#/lib/${esc(nextLib.id)}">${esc(s('path.go'))}${ic('arrowR')}</a>` : ''}</section>
    <ol class="steps">${libs.map((l, i) => { const pr = progress(l); return `<li class="step reveal" style="--lc:${l.color}"><span class="step-n${pr.pct === 100 ? ' ok' : ''}">${pr.pct === 100 ? ic('check') : i + 1}</span><a class="step-c" href="#/lib/${esc(l.id)}">${tile(l)}<div><h3>${esc(l.name)}</h3><p>${esc(t(l.tagline))}</p></div><div class="step-p"><div class="bar"><i style="width:${pr.pct}%"></i></div><span>${pr.done}/${pr.total}</span></div></a></li>`; }).join('')}</ol>
    ${footer()}`;
  }

  /* ---------- LIBRARY ---------- */
  function memberHTML(l, m) {
    const key = l.id + ':' + m.id;
    const done = !!ST().done[key];
    const open = OPEN.has(key);
    const exs = PY.examples(m);
    return `<article class="mem${open ? ' open' : ''}${done ? ' is-done' : ''}" id="m-${esc(l.id)}-${esc(m.id)}" data-key="${esc(key)}" data-mid="${esc(m.id)}">
      <div class="mem-h" role="button" tabindex="0" aria-expanded="${open}" data-act="toggle-mem">
        <span class="kind k-${m.kind}">${esc(s('kind.' + m.kind))}</span>
        <div class="mem-t"><code class="mem-name">${esc(m.name)}</code><span class="mem-sum">${esc(t(m.sum))}</span></div>
        ${m.cyber ? `<span class="mem-cy" title="${esc(s('cyber'))}">${ic('shield')}</span>` : ''}
        <button class="done-btn" data-act="done" type="button" aria-pressed="${done}" aria-label="${esc(s('mark.done'))}" title="${esc(s('mark.done'))}">${ic('check')}</button>
        ${ic('chevron', 'chev')}
      </div>
      <div class="mem-b"><div class="mem-in">
        ${m.sig ? codeBox(m.sig, { label: s('signature') }) : ''}
        <div class="rt">${rt(m.desc)}</div>
        ${m.params && m.params.length ? `<div class="params"><h4>${esc(s('params'))}</h4><dl>${m.params.map((p) => `<div><dt><code>${esc(p.n)}</code></dt><dd>${PY.inline(p.d)}</dd></div>`).join('')}</dl></div>` : ''}
        ${m.ret ? `<div class="ret"><h4>${esc(s('returns'))}</h4><div class="rt">${rt(m.ret)}</div></div>` : ''}
        ${exs.map(exBlock).join('')}
        ${m.cyber ? `<div class="callout cy">${ic('shield')}<div><b>${esc(s('cyber'))}</b><div class="rt">${rt(m.cyber)}</div></div></div>` : ''}
        ${m.gotcha ? `<div class="callout wa">${ic('alert')}<div><b>${esc(s('gotcha'))}</b><div class="rt">${rt(m.gotcha)}</div></div></div>` : ''}
        ${m.see && m.see.length ? `<div class="see"><span>${esc(s('see'))}</span>${m.see.map((x) => seeLink(l, x)).join('')}</div>` : ''}
      </div></div>
    </article>`;
  }
  function seeLink(l, ref) {
    const [lid, mid] = ref.includes(':') ? ref.split(':') : [l.id, ref];
    const tl = PY.libById(lid);
    const tm = tl && PY.members(tl).find((m) => m.id === mid);
    if (!tm) return '';
    return `<a class="see-l" href="#/lib/${esc(lid)}/${esc(mid)}"><code>${esc(tm.name)}</code></a>`;
  }
  function libView(l, sub) {
    const pr = progress(l);
    const sections = l.sections || [];
    const nNew = PY.newIds(l.id).length;
    const nDue = PY.dueIds(l.id).length;
    const idx = PY.libs.indexOf(l);
    const prev = PY.libs[idx - 1], next = PY.libs[idx + 1];
    const toc = [
      ['overview', s('toc.overview')],
      ['quick', s('toc.quick')],
      ...sections.map((x) => ['sec-' + x.id, t(x.title)]),
      ['recipes', s('toc.recipes')],
      ['practice', s('toc.practice')],
    ];
    const all = PY.members(l);
    return `
    <div class="lib-page" style="--lc:${l.color}">
      <div class="crumbs reveal"><a href="#/libs">${esc(s('nav.libs'))}</a><span>/</span><span>${esc(l.name)}</span></div>
      <header class="lib-hero reveal">
        ${tile(l, true)}
        <div class="lib-hero-t">
          <h1>${esc(l.name)}</h1>
          <p class="tag">${esc(t(l.tagline))}</p>
          <div class="lib-badges">${focusBadge(l)}${srcBadge(l)}${lvl(l.level)}<span class="badge b-n">${esc(s('n.members', { n: all.length }))}</span></div>
        </div>
        <div class="lib-hero-r" id="lib-ring">${ring(pr.pct, 72)}<small>${esc(s('read.of', { a: pr.done, b: pr.total }))}</small></div>
      </header>
      <div class="lib-actions reveal">
        <a class="btn primary" href="#/study/${esc(l.id)}">${ic('target')}${esc(nDue + nNew ? s('study.cta', { n: nDue + nNew }) : s('study.none'))}</a>
        <button class="btn ghost" data-act="expand-all">${ic('layers')}${esc(s('expand.all'))}</button>
        <button class="btn ghost" data-act="collapse-all">${esc(s('collapse.all'))}</button>
        <a class="btn ghost" href="${esc(l.docs)}" target="_blank" rel="noopener noreferrer">${ic('link')}${esc(s('docs'))}</a>
      </div>
      <nav class="toc-m" aria-label="${esc(s('toc'))}">${toc.map(([id, label]) => `<a href="#" data-act="goto" data-t="${esc(id)}">${esc(label)}</a>`).join('')}</nav>
      <div class="lib-grid">
        <aside class="toc"><div class="toc-in"><h4>${esc(s('toc'))}</h4><nav>${toc.map(([id, label]) => `<a href="#" data-act="goto" data-t="${esc(id)}" data-spy="${esc(id)}">${esc(label)}</a>`).join('')}</nav></div></aside>
        <div class="lib-main">
          <section id="overview" class="sec" data-spy-sec>
            ${l.ext ? `<div class="install-cmd reveal"><span>${esc(s('install.cmd'))}</span>${codeBox(l.install, { kind: 'sh', label: 'shell' })}</div>` : ''}
            <div class="intro rt reveal">${l.intro.map((p) => rt(p)).join('')}</div>
            <div class="callout an reveal">${ic('bulb')}<div><b>${esc(s('analogy'))}</b><div class="rt">${rt(l.analogy)}</div></div></div>
            <div class="reveal"><h4 class="mini-h">${esc(s('import'))}</h4>${codeBox(l.import)}</div>
            <div class="two reveal">
              <div class="use use-g"><h4>${ic('book')}${esc(s('use.general'))}</h4><ul>${l.general.map((x) => `<li>${PY.inline(x)}</li>`).join('')}</ul></div>
              <div class="use use-c"><h4>${ic('shield')}${esc(s('use.cyber'))}</h4><ul>${l.cyberUse.map((x) => `<li>${PY.inline(x)}</li>`).join('')}</ul></div>
            </div>
            ${l.focus !== 'general' ? `<div class="ethics sm reveal">${ic('shield')}<p>${esc(s('ethics'))}</p></div>` : ''}
          </section>
          <section id="quick" class="sec" data-spy-sec>
            <h2 class="sec-h reveal">${ic('bolt')}${esc(s('toc.quick'))}</h2>
            <p class="sec-i reveal">${esc(s('quick.sub'))}</p>
            <div class="quick reveal">${sections.map((sec) => `<div class="q-sec"><h5>${esc(t(sec.title))}</h5>${(sec.items || []).map((m) => `<a class="q-row" href="#" data-act="goto-mem" data-mid="${esc(m.id)}"><code>${esc(m.name)}</code><span>${esc(t(m.sum))}</span></a>`).join('')}</div>`).join('')}</div>
          </section>
          ${sections.map((sec) => `<section id="sec-${esc(sec.id)}" class="sec" data-spy-sec>
            <h2 class="sec-h reveal">${esc(t(sec.title))}<small>${(sec.items || []).length}</small></h2>
            ${sec.intro ? `<div class="sec-i rt reveal">${rt(sec.intro)}</div>` : ''}
            <div class="mems">${(sec.items || []).map((m) => memberHTML(l, m)).join('')}</div>
          </section>`).join('')}
          <section id="recipes" class="sec" data-spy-sec>
            <h2 class="sec-h reveal">${ic('layers')}${esc(s('toc.recipes'))}<small>${(l.recipes || []).length}</small></h2>
            <p class="sec-i reveal">${esc(s('recipes.sub'))}</p>
            ${(l.recipes || []).map((r) => `<article class="recipe reveal"><header><h3>${esc(t(r.title))}</h3>${r.cyber ? `<span class="badge b-cyber">${ic('shield')}${esc(s('focus.cyber'))}</span>` : ''}</header><p>${PY.inline(r.sum)}</p>${exBlock(r)}${r.note ? `<div class="callout an">${ic('bulb')}<div class="rt">${rt(r.note)}</div></div>` : ''}${r.cyber ? `<p class="legal">${ic('shield')}${esc(s('legal'))}</p>` : ''}</article>`).join('')}
          </section>
          <section id="practice" class="sec" data-spy-sec>
            <div class="practice reveal">
              <div><h2>${ic('target')}${esc(s('toc.practice'))}</h2><p>${esc(s('practice.d', { n: (PY.cards.byLib[l.id] || []).length }))}</p></div>
              <a class="btn primary lg" href="#/study/${esc(l.id)}">${esc(nDue + nNew ? s('study.cta', { n: nDue + nNew }) : s('study.none'))}${ic('arrowR')}</a>
            </div>
          </section>
          ${pager(prev && { href: '#/lib/' + prev.id, label: prev.name }, next && { href: '#/lib/' + next.id, label: next.name })}
        </div>
      </div>
    </div>`;
  }

  /* ---------- REVIEW / STUDY ---------- */
  function startSession(r) {
    const cap = ST().session;
    let ids;
    if (r.mode === 'study') ids = [...PY.dueIds(r.id), ...PY.newIds(r.id)].slice(0, cap);
    else ids = PY.dueIds().slice(0, cap);
    sess = { key: r.mode + '/' + (r.id || ''), mode: r.mode, lib: r.id || null, queue: ids, total: ids.length, completed: 0, shown: false, stats: [0, 0, 0, 0], graded: 0, finished: false };
  }
  function nextDueText() {
    const now = Date.now();
    const future = Object.keys(ST().cards).filter((id) => PY.cards.map.has(id) && ST().cards[id].due > now).map((id) => ST().cards[id].due);
    if (!future.length) return '';
    const days = Math.max(0, Math.round((PY.startOfDay(Math.min(...future)) - PY.startOfDay(now)) / 864e5));
    return days === 0 ? s('rev.next.today') : s('rev.next', { when: fmtIvl(days) });
  }
  function reviewView(r) {
    const l = r.id && PY.libById(r.id);
    const back = l ? `#/lib/${l.id}` : '#/';
    if (!sess || sess.key !== r.mode + '/' + (r.id || '')) startSession(r);
    const title = l ? s('study.title', { lib: l.name }) : s('rev.title');
    const head = `<div class="rev-head"><a class="icon-btn" href="${back}" aria-label="${esc(s('back'))}">${ic('x')}</a><div class="rev-prog"><div class="bar"><i style="width:${sess.total ? Math.round((sess.completed / sess.total) * 100) : 0}%"></i></div><span>${sess.completed}/${sess.total}</span></div></div>`;
    if (!sess.total) {
      const nxt = nextDueText();
      return `<div class="rev">${head}<div class="rev-empty reveal">${ic('sparkles', 'big')}<h2>${esc(l ? s('study.empty.t') : s('rev.empty.t'))}</h2><p>${esc(l ? s('study.empty.d') : s('rev.empty.d'))}</p>${nxt ? `<p class="muted">${esc(nxt)}</p>` : ''}<div class="cta"><a class="btn primary" href="#/libs">${esc(s('rev.browse'))}${ic('arrowR')}</a></div></div></div>`;
    }
    if (sess.finished || !sess.queue.length) {
      const g = sess.graded || 1;
      const acc = Math.round(((sess.stats[2] + sess.stats[3]) / g) * 100);
      const more = (l ? PY.dueIds(l.id).length + PY.newIds(l.id).length : PY.dueIds().length) > 0;
      return `<div class="rev">${head}<div class="rev-done reveal">${ic('sparkles', 'big')}<h2>${esc(s('rev.done.t'))}</h2><p>${esc(s('rev.done.d', { n: sess.total, acc }))}</p>
        <div class="sumbars">${['again', 'hard', 'good', 'easy'].map((k, i) => `<div class="sb sb-${k}"><b>${sess.stats[i]}</b><span>${esc(s('g.' + k))}</span></div>`).join('')}</div>
        ${nextDueText() ? `<p class="muted">${esc(nextDueText())}</p>` : ''}
        <div class="cta">${more ? `<button class="btn primary" data-act="more">${esc(s('rev.more'))}${ic('arrowR')}</button>` : ''}<a class="btn ghost" href="${back}">${esc(s('rev.back'))}</a></div></div></div>`;
    }
    const id = sess.queue[0];
    const card = PY.cards.map.get(id);
    const lib = PY.libById(card.lib);
    const isNew = !ST().cards[id];
    const faces = cardFaces(card, lib);
    const prev = (g) => fmtIvl(PY.srs.preview(ST().cards[id], g));
    return `<div class="rev" style="--lc:${lib.color}">${head}
      <p class="rev-mode">${esc(title)}</p>
      <article class="rcard" data-id="${esc(id)}">
        <div class="rc-top">${tile(lib)}<span class="rc-lib">${esc(lib.name)}</span><span class="rc-type">${esc(faces.label)}</span>${isNew ? `<span class="badge b-new">${esc(s('rev.new'))}</span>` : ''}</div>
        <div class="rc-front">${faces.front}</div>
        <div class="rc-back${sess.shown ? ' show' : ''}" aria-hidden="${!sess.shown}"><div class="rc-back-in">${faces.back}</div></div>
      </article>
      ${sess.shown
        ? `<div class="grades" role="group" aria-label="${esc(s('rev.grade'))}">${['again', 'hard', 'good', 'easy'].map((k, i) => `<button class="grade g-${k}" data-act="grade" data-g="${i}"><b>${esc(s('g.' + k))}</b><span>${esc(prev(i))}</span><kbd>${i + 1}</kbd></button>`).join('')}</div>`
        : `<div class="reveal-row"><button class="btn primary lg" data-act="show">${ic('eye')}${esc(s('rev.show'))}<kbd class="kbd">␣</kbd></button></div>`}
    </div>`;
  }
  function cardFaces(c, lib) {
    if (c.type === 'member') {
      const m = c.m;
      const ex = PY.examples(m)[0];
      return {
        label: s('kind.' + m.kind),
        front: `<h2 class="rc-name"><code>${esc(m.name)}</code></h2><p class="rc-q">${esc(s('rev.q.member'))}</p>`,
        back: `${m.sig ? codeBox(m.sig, { label: s('signature') }) : ''}<p class="rc-sum"><strong>${PY.inline(m.sum)}</strong></p><div class="rt">${rt(m.desc)}</div>${m.params && m.params.length ? `<div class="params"><dl>${m.params.map((p) => `<div><dt><code>${esc(p.n)}</code></dt><dd>${PY.inline(p.d)}</dd></div>`).join('')}</dl></div>` : ''}${ex ? exBlock(ex) : ''}${m.cyber ? `<div class="callout cy">${ic('shield')}<div><b>${esc(s('cyber'))}</b><div class="rt">${rt(m.cyber)}</div></div></div>` : ''}<p class="rc-open"><a href="#/lib/${esc(lib.id)}/${esc(m.id)}">${esc(s('rev.open'))}${ic('arrowR')}</a></p>`,
      };
    }
    if (c.type === 'out') {
      return {
        label: s('rev.type.out'),
        front: `<p class="rc-q">${esc(s('rev.q.out', { name: c.m.name }))}</p>${codeBox(c.ex.code)}`,
        back: `<div class="out"><div class="out-l">${ic('check')}${esc(s('output'))}</div><pre>${esc(trim(c.ex.out))}</pre></div><p class="rc-sum"><strong>${PY.inline(c.m.sum)}</strong></p><p class="rc-open"><a href="#/lib/${esc(lib.id)}/${esc(c.m.id)}">${esc(s('rev.open'))}${ic('arrowR')}</a></p>`,
      };
    }
    return {
      label: s('rev.type.custom'),
      front: `<div class="rc-q big rt">${rt(c.c.q)}</div>${c.c.code ? codeBox(c.c.code) : ''}`,
      back: `<div class="rt">${rt(c.c.a)}</div>`,
    };
  }
  function grade(g) {
    if (!sess || !sess.queue.length) return;
    const id = sess.queue.shift();
    PY.srs.apply(id, g);
    sess.stats[g]++;
    sess.graded++;
    if (g === 0) sess.queue.splice(Math.min(sess.queue.length, 3), 0, id);
    else sess.completed++;
    sess.shown = false;
    if (!sess.queue.length) sess.finished = true;
    renderNav();
    render({ swap: true });
    window.scrollTo({ top: 0 });
  }

  /* ---------- SETTINGS ---------- */
  function settingsView() {
    const cur = ST().theme, lg = PY.lang();
    const sizes = [[0.9, 'S'], [1, 'M'], [1.12, 'L'], [1.25, 'XL']];
    return `
    <section class="page-h reveal"><h1>${esc(s('set.title'))}</h1><p>${esc(s('set.sub'))}</p></section>
    <div class="set-grid">
      <section class="card reveal"><h3>${esc(s('set.lang'))}</h3><div class="opts">
        <button class="opt${lg === 'tr' ? ' on' : ''}" data-act="lang" data-v="tr"><b>Türkçe</b><span>TR</span></button>
        <button class="opt${lg === 'en' ? ' on' : ''}" data-act="lang" data-v="en"><b>English</b><span>EN</span></button></div></section>
      <section class="card reveal"><h3>${esc(s('set.theme'))}</h3><div class="opts three">
        ${['light', 'purple', 'dark'].map((th) => `<button class="opt theme-o t-${th}${cur === th ? ' on' : ''}" data-act="theme" data-v="${th}"><i></i><b>${esc(s('theme.' + th))}</b></button>`).join('')}</div></section>
      <section class="card reveal"><h3>${esc(s('set.font'))}</h3><div class="opts four">
        ${sizes.map(([v, n]) => `<button class="opt${Math.abs((ST().font || 1) - v) < 0.01 ? ' on' : ''}" data-act="font" data-v="${v}"><b style="font-size:${0.8 + v * 0.35}rem">Aa</b><span>${n}</span></button>`).join('')}</div></section>
      <section class="card reveal"><h3>${esc(s('set.session'))}</h3><p class="muted">${esc(s('set.session.d'))}</p><div class="opts four">
        ${[10, 15, 25, 40].map((n) => `<button class="opt${ST().session === n ? ' on' : ''}" data-act="session" data-v="${n}"><b>${n}</b></button>`).join('')}</div></section>
      <section class="card reveal"><h3>${esc(s('set.install'))}</h3>
        ${isStandalone() ? `<p>${esc(s('install.done'))}</p>` : deferredInstall ? `<p class="muted">${esc(s('install.d'))}</p><button class="btn primary" data-act="install">${ic('download')}${esc(s('install.btn'))}</button>` : `<p class="muted">${esc(s('install.manual'))}</p><ul class="how-install"><li><b>Android · Chrome</b> — ${esc(s('install.android'))}</li><li><b>iPhone · Safari</b> — ${esc(s('install.ios'))}</li></ul>`}
      </section>
      <section class="card reveal"><h3>${esc(s('set.data'))}</h3><p class="muted">${esc(s('set.data.d'))}</p>
        <div class="row"><button class="btn ghost" data-act="export">${ic('download')}${esc(s('set.export'))}</button><label class="btn ghost file">${ic('upload')}${esc(s('set.import'))}<input id="import-file" type="file" accept="application/json,.json" hidden></label><button class="btn danger" data-act="reset">${ic('trash')}${esc(s('set.reset'))}</button></div></section>
      <section class="card wide reveal"><h3>${esc(s('set.about'))}</h3><p>${esc(s('set.about.d', { n: PY.libs.length, m: PY.libs.reduce((a, l) => a + PY.members(l).length, 0) }))}</p><div class="ethics sm">${ic('shield')}<p>${esc(s('ethics'))}</p></div><p class="small muted">${esc(s('shortcuts'))}</p></section>
    </div>
    ${footer()}`;
  }

  /* ---------- nav ---------- */
  function renderNav() {
    const r = parseRoute();
    const due = PY.dueIds().length;
    const act = (n) => (r.name === n || (n === 'libs' && (r.name === 'lib' || r.name === 'path'))) ? ' on' : '';
    const items = [
      ['home', '#/', 'home', s('nav.home')],
      ['libs', '#/libs', 'grid', s('nav.libs')],
      ['review', '#/review', 'refresh', s('nav.review'), due],
      ['settings', '#/settings', 'settings', s('nav.settings')],
    ];
    $('#topnav').innerHTML = items.map(([n, h, i, l, b]) => `<a class="tn${act(n)}" href="${h}">${l}${b ? `<em class="count">${b}</em>` : ''}</a>`).join('');
    $('#bottomnav').innerHTML =
      items.slice(0, 3).map(([n, h, i, l, b]) => `<a class="bn${act(n)}" href="${h}">${ic(i)}<span>${l}</span>${b ? `<em class="count">${b}</em>` : ''}</a>`).join('') +
      `<button class="bn" data-act="open-search">${ic('search')}<span>${esc(s('nav.search'))}</span></button>` +
      `<a class="bn${act('settings')}" href="#/settings">${ic('settings')}<span>${esc(s('nav.settings'))}</span></a>`;
  }

  /* ---------- render ---------- */
  let demoTimer = 0;
  function render(opts = {}) {
    clearTimeout(demoTimer);
    const r = parseRoute();
    let html = '';
    if (r.name === 'home') html = homeView();
    else if (r.name === 'libs') html = libsView();
    else if (r.name === 'path') html = pathView(r.id);
    else if (r.name === 'lib') html = libView(PY.libById(r.id), r.sub);
    else if (r.name === 'review') html = reviewView(r);
    else html = settingsView();
    const y = window.scrollY;
    main.dataset.view = r.name;
    main.classList.remove('view-in', 'lang-in', 'swap-in');
    main.innerHTML = html;
    void main.offsetWidth;
    main.classList.add(opts.fresh ? 'view-in' : opts.swap ? 'swap-in' : 'lang-in');
    document.title = pageTitle(r);
    afterRender(r, opts);
    renderNav();
    if (opts.fresh && !(r.name === 'lib' && r.sub)) window.scrollTo({ top: 0 });
    else if (!opts.fresh && !opts.swap) window.scrollTo({ top: y });
  }
  function pageTitle(r) {
    const base = 'PyAtlas';
    if (r.name === 'lib') return `${PY.libById(r.id).name} · ${base}`;
    if (r.name === 'path') return `${t(PY.paths.find((p) => p.id === r.id).title)} · ${base}`;
    const k = { libs: 'nav.libs', review: 'nav.review', settings: 'nav.settings' }[r.name];
    return k ? `${s(k)} · ${base}` : `${base} · ${s('title.home')}`;
  }
  function afterRender(r, opts) {
    // reveal animations
    const els = $$('.reveal', main);
    const instant = opts.swap || !opts.fresh || reduceMotion;
    if (instant || !('IntersectionObserver' in window)) els.forEach((e) => e.classList.add('in'));
    else {
      let n = 0;
      const io = new IntersectionObserver(
        (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
        { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }
      );
      els.forEach((e) => { e.style.setProperty('--d', Math.min(n++ % 8, 7) * 60 + 'ms'); io.observe(e); });
    }
    // progress rings
    requestAnimationFrame(() => requestAnimationFrame(() => $$('.ring-fg', main).forEach((c) => { c.style.strokeDashoffset = (+c.dataset.c * (1 - +c.dataset.pct / 100)).toFixed(2); })));
    if (r.name === 'home') typeDemo();
    if (r.name === 'lib') {
      const l = PY.libById(r.id);
      store.set('lastLib', l.id);
      setupSpy();
      if (r.sub) {
        const m = PY.members(l).find((x) => x.id === r.sub);
        if (m) {
          const el = document.getElementById('m-' + l.id + '-' + m.id);
          if (el) {
            toggleMem(el, true, true);
            if (opts.fresh) setTimeout(() => { el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); el.classList.add('flash'); }, 120);
          }
        }
      }
    }
    if (r.name === 'libs') {
      const q = $('#lib-q');
      if (q) q.addEventListener('input', () => { ui.q = q.value; $('#libgrid').innerHTML = libsGrid(); $$('#libgrid .reveal').forEach((e) => e.classList.add('in')); });
    }
    const imp = $('#import-file');
    if (imp) imp.addEventListener('change', importFile);
  }
  function typeDemo() {
    const el = $('#demo code');
    if (!el) return;
    let si = 0;
    const run = () => {
      if (!el.isConnected) return;
      const text = DEMOS[si % DEMOS.length].join('\n');
      let i = 0;
      const step = () => {
        if (!el.isConnected) return;
        el.innerHTML = hl(text.slice(0, i)) + '<span class="caret"></span>';
        if (i++ < text.length) demoTimer = setTimeout(step, reduceMotion ? 0 : 26 + Math.random() * 30);
        else { si++; demoTimer = setTimeout(run, 2400); }
      };
      step();
    };
    if (reduceMotion) el.innerHTML = hl(DEMOS[0].join('\n'));
    else run();
  }
  function setupSpy() {
    const links = $$('[data-spy]');
    const secs = $$('[data-spy-sec]', main);
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((a) => a.classList.toggle('on', a.dataset.spy === e.target.id));
            const a = links.find((x) => x.dataset.spy === e.target.id);
            if (a) { const box = a.parentElement; const top = a.offsetTop - box.clientHeight / 2; box.scrollTo?.({ top, behavior: 'auto' }); }
          }
        });
      },
      { rootMargin: '-15% 0px -70% 0px' }
    );
    secs.forEach((x) => io.observe(x));
  }
  function toggleMem(el, force, silent) {
    const open = force == null ? !el.classList.contains('open') : force;
    el.classList.toggle('open', open);
    $('.mem-h', el).setAttribute('aria-expanded', open);
    const key = el.dataset.key;
    if (open) OPEN.add(key); else OPEN.delete(key);
    if (open && !silent) { const [lid, mid] = [key.split(':')[0], el.dataset.mid]; history.replaceState(null, '', '#/lib/' + encodeURIComponent(lid) + '/' + encodeURIComponent(mid)); }
  }
  function refreshProgress(libId) {
    const l = PY.libById(libId);
    const pr = progress(l);
    const box = $('#lib-ring');
    if (!box) return;
    box.innerHTML = ring(pr.pct, 72) + `<small>${esc(s('read.of', { a: pr.done, b: pr.total }))}</small>`;
    const c = $('.ring-fg', box);
    c.getBoundingClientRect();
    requestAnimationFrame(() => { c.style.strokeDashoffset = (+c.dataset.c * (1 - pr.pct / 100)).toFixed(2); });
  }

  /* ---------- toast ---------- */
  let toastT = 0;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.classList.remove('on'), 2600);
  }

  /* ---------- search ---------- */
  let sIndex = null, sSel = 0, sResults = [];
  function buildIndex() {
    sIndex = [];
    for (const l of PY.libs) {
      sIndex.push({ lib: l, m: null, name: l.name, hay: PY.fold(l.name + ' ' + l.tagline.join(' ') + ' ' + (l.sym || '')) });
      for (const m of PY.members(l))
        sIndex.push({ lib: l, m, name: m.name, hay: PY.fold(m.name + ' ' + (m.sig || '') + ' ' + m.sum.join(' ') + ' ' + l.name) });
    }
  }
  function doSearch(q) {
    if (!sIndex) buildIndex();
    const toks = PY.fold(q).split(/\s+/).filter(Boolean);
    if (!toks.length) { sResults = []; return renderResults(q); }
    const res = [];
    for (const it of sIndex) {
      if (!toks.every((x) => it.hay.includes(x))) continue;
      const nm = PY.fold(it.name);
      let sc = it.m ? 1 : 3;
      for (const x of toks) { if (nm === x) sc += 6; else if (nm.startsWith(x)) sc += 4; else if (nm.includes('.' + x) || nm.includes(x)) sc += 3; }
      res.push([sc, it]);
    }
    res.sort((a, b) => b[0] - a[0] || a[1].name.length - b[1].name.length);
    sResults = res.slice(0, 40).map((x) => x[1]);
    sSel = 0;
    renderResults(q);
  }
  function renderResults(q) {
    const box = $('#search-res');
    if (!q.trim()) { box.innerHTML = `<p class="s-hint">${esc(s('search.hint'))}</p>`; return; }
    if (!sResults.length) { box.innerHTML = `<p class="s-hint">${esc(s('search.empty', { q }))}</p>`; return; }
    box.innerHTML = sResults.map((it, i) => `<a role="option" class="s-it${i === sSel ? ' on' : ''}" href="#/lib/${esc(it.lib.id)}${it.m ? '/' + esc(it.m.id) : ''}" data-i="${i}">${tile(it.lib)}<div><b><code>${esc(it.name)}</code>${it.m ? `<em>${esc(it.lib.name)}</em>` : `<em>${esc(s('search.lib'))}</em>`}</b><span>${esc(t(it.m ? it.m.sum : it.lib.tagline))}</span></div></a>`).join('');
  }
  function openSearch() {
    const ov = $('#search');
    ov.hidden = false;
    document.body.classList.add('noscroll');
    requestAnimationFrame(() => ov.classList.add('on'));
    const inp = $('#search-input');
    inp.value = '';
    renderResults('');
    setTimeout(() => inp.focus(), 30);
  }
  function closeSearch() {
    const ov = $('#search');
    ov.classList.remove('on');
    document.body.classList.remove('noscroll');
    setTimeout(() => { ov.hidden = true; }, 180);
  }
  const searchOpen = () => !$('#search').hidden;

  /* ---------- theme / language ---------- */
  const THEME_COLOR = { light: '#f5f6fb', purple: '#150d2e', dark: '#0b0e14' };
  function applyTheme(th, animate) {
    const d = document.documentElement;
    if (animate && !reduceMotion) { d.classList.add('theme-anim'); setTimeout(() => d.classList.remove('theme-anim'), 500); }
    d.setAttribute('data-theme', th);
    $('meta[name=theme-color]').setAttribute('content', THEME_COLOR[th]);
    $$('[data-theme-btn]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.themeBtn === th));
  }
  function applyFont(v) { document.documentElement.style.setProperty('--fs', v); }
  function applyLang(lg, rerender = true) {
    PY.setLang(lg);
    $$('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === lg));
    $('.seg').dataset.pos = lg === 'tr' ? 0 : 1;
    $$('[data-i18n]').forEach((e) => { e.textContent = s(e.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((e) => e.setAttribute('aria-label', s(e.dataset.i18nAria)));
    $$('[data-i18n-ph]').forEach((e) => e.setAttribute('placeholder', s(e.dataset.i18nPh)));
    if (rerender) {
      render();
      if (searchOpen()) doSearch($('#search-input').value);
    }
  }
  function setLang(lg) { store.set('lang', lg); applyLang(lg); }
  function setTheme(th) { store.set('theme', th); applyTheme(th, true); if (parseRoute().name === 'settings') render(); }

  /* ---------- data import/export ---------- */
  function exportData() {
    const blob = new Blob([store.export()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pyatlas-progress-' + PY.dayKey() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast(s('toast.exported'));
  }
  function importFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try { store.import(String(rd.result)); bootFromStore(); toast(s('toast.imported')); render({ swap: true }); }
      catch (err) { toast(s('toast.import.bad')); }
    };
    rd.readAsText(f);
  }
  function bootFromStore() {
    const d = ST();
    const defaultLang = ((navigator.language || 'tr').toLowerCase().startsWith('tr')) ? 'tr' : 'en';
    const lang = d.lang || defaultLang;
    const theme = d.theme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(theme);
    applyFont(d.font || 1);
    applyLang(lang, false);
  }

  /* ---------- events ---------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const act = a.dataset.act;
    switch (act) {
      case 'toggle-mem': { const m = a.closest('.mem'); toggleMem(m); break; }
      case 'done': {
        e.stopPropagation();
        const m = a.closest('.mem');
        const on = store.toggleDone(m.dataset.key);
        m.classList.toggle('is-done', on);
        a.setAttribute('aria-pressed', on);
        refreshProgress(m.dataset.key.split(':')[0]);
        renderNav();
        break;
      }
      case 'copy': {
        const code = a.closest('.code').querySelector('code').innerText;
        const ok = () => { a.classList.add('ok'); $('em', a).textContent = s('copied'); setTimeout(() => { a.classList.remove('ok'); $('em', a).textContent = s('copy'); }, 1400); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(ok, () => fallbackCopy(code, ok));
        else fallbackCopy(code, ok);
        break;
      }
      case 'expand-all': $$('.mem', main).forEach((m) => toggleMem(m, true, true)); break;
      case 'collapse-all': $$('.mem', main).forEach((m) => toggleMem(m, false, true)); break;
      case 'goto': {
        e.preventDefault();
        const el = document.getElementById(a.dataset.t);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        break;
      }
      case 'goto-mem': {
        e.preventDefault();
        const l = PY.libById(parseRoute().id);
        const el = document.getElementById('m-' + l.id + '-' + a.dataset.mid);
        if (el) { toggleMem(el, true, true); el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
        break;
      }
      case 'filter': ui[a.dataset.k] = a.dataset.v; render({ swap: true }); break;
      case 'show': sess.shown = true; render({ swap: true }); break;
      case 'grade': grade(+a.dataset.g); break;
      case 'more': { const r = parseRoute(); sess = null; render({ fresh: true }); break; }
      case 'lang': setLang(a.dataset.v); break;
      case 'theme': setTheme(a.dataset.v); break;
      case 'font': store.set('font', +a.dataset.v); applyFont(+a.dataset.v); render(); break;
      case 'session': store.set('session', +a.dataset.v); sess = null; render(); break;
      case 'open-search': openSearch(); break;
      case 'close-search': closeSearch(); break;
      case 'export': exportData(); break;
      case 'reset': if (confirm(s('set.reset.confirm'))) { store.reset(); sess = null; bootFromStore(); toast(s('toast.reset')); render({ fresh: true }); } break;
      case 'install':
        if (deferredInstall) { deferredInstall.prompt(); deferredInstall.userChoice.finally(() => { deferredInstall = null; render(); }); }
        break;
    }
  });
  function fallbackCopy(text, ok) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); ok(); } catch (e) { /* ignore */ }
    ta.remove();
  }
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea';
    if (e.target.matches && e.target.matches('.mem-h') && (e.key === 'Enter' || e.key === ' ') && !e.target.closest('[data-act=done]')) {
      if (e.target === e.currentTarget || e.target.classList.contains('mem-h')) { e.preventDefault(); toggleMem(e.target.closest('.mem')); }
      return;
    }
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); if (!searchOpen()) openSearch(); return; }
    if (searchOpen()) {
      if (e.key === 'Escape') closeSearch();
      else if (e.key === 'ArrowDown') { e.preventDefault(); sSel = Math.min(sResults.length - 1, sSel + 1); renderResults($('#search-input').value); $('.s-it.on')?.scrollIntoView({ block: 'nearest' }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sSel = Math.max(0, sSel - 1); renderResults($('#search-input').value); $('.s-it.on')?.scrollIntoView({ block: 'nearest' }); }
      else if (e.key === 'Enter' && sResults[sSel]) { const it = sResults[sSel]; location.hash = '#/lib/' + it.lib.id + (it.m ? '/' + it.m.id : ''); closeSearch(); }
      return;
    }
    if (parseRoute().name === 'review' && sess && !typing) {
      if (!sess.shown && (e.key === ' ' || e.key === 'Enter') && sess.queue.length) { e.preventDefault(); sess.shown = true; render({ swap: true }); }
      else if (sess.shown && /^[1-4]$/.test(e.key)) grade(+e.key - 1);
    }
  });
  $('#search-input').addEventListener('input', (e) => doSearch(e.target.value));
  $('#search-close').addEventListener('click', closeSearch);
  $('#btn-search').addEventListener('click', openSearch);
  $('#search').addEventListener('click', (e) => { if (e.target.id === 'search') closeSearch(); });
  $('#search-res').addEventListener('click', (e) => { if (e.target.closest('.s-it')) setTimeout(closeSearch, 0); });
  $$('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
  $$('[data-theme-btn]').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.themeBtn)));
  window.addEventListener('hashchange', () => { sess = sess && parseRoute().name === 'review' ? null : sess; if (parseRoute().name !== 'review') sess = null; render({ fresh: true }); });
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; if (['home', 'settings'].includes(parseRoute().name)) render(); });
  window.addEventListener('appinstalled', () => { deferredInstall = null; toast(s('install.done')); });
  let lastScroll = 0;
  window.addEventListener('scroll', () => { const y = window.scrollY; $('#topbar').classList.toggle('scrolled', y > 8); lastScroll = y; }, { passive: true });

  /* ---------- boot ---------- */
  function loadLib(id) {
    return new Promise((res) => {
      const el = document.createElement('script');
      el.src = 'data/libs/' + id + '.js';
      el.async = false;
      el.onload = el.onerror = () => res();
      document.head.appendChild(el);
    });
  }
  async function boot() {
    try {
      store.load();
      bootFromStore();
      await Promise.all(PY.manifest.map(loadLib));
      PY.libs.sort((a, b) => PY.manifest.indexOf(a.id) - PY.manifest.indexOf(b.id));
      PY.buildCards();
      store.set('lang', PY.lang());
      if (!ST().theme) store.set('theme', document.documentElement.getAttribute('data-theme'));
      render({ fresh: true });
    } catch (err) {
      console.error('Boot error:', err);
    } finally {
      const bootEl = $('#boot');
      if (bootEl) {
        bootEl.classList.add('out');
        setTimeout(() => bootEl.remove(), 500);
      }
    }
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      const had = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register('sw.js').catch(() => {});
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (had) toast(s('toast.updated')); });
    }
  }
  boot();
  PY._debug = { render, parseRoute, grade };
})();


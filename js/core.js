/* PyAtlas core: namespace, i18n engine, store, rich text, highlighter, SRS, card builder */
var PY;
(function () {
  'use strict';
  PY = window.PY = window.PY || {};
  if (typeof globalThis !== 'undefined') globalThis.PY = PY;
  PY.libs = [];
  PY.addLib = (l) => PY.libs.push(l);
  PY.strings = PY.strings || { tr: {}, en: {} };

  /* ---------- tiny helpers ---------- */
  PY.$ = (s, r = document) => r.querySelector(s);
  PY.$$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  PY.esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  PY.fold = (s) =>
    String(s)
      .replace(/İ/g, 'i')
      .replace(/ı/g, 'i')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  PY.dayKey = (d = new Date()) => {
    const p = (n) => String(n).padStart(2, '0');
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  };
  PY.startOfDay = (ts = Date.now()) => {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  /* ---------- i18n ---------- */
  let lang = 'tr';
  PY.lang = () => lang;
  PY.setLang = (l) => {
    lang = l === 'en' ? 'en' : 'tr';
    document.documentElement.lang = lang;
  };
  /** Translate a value: string | [tr,en] | {tr,en} */
  PY.t = (x) => {
    if (x == null) return '';
    if (typeof x === 'string') return x;
    if (Array.isArray(x)) return x[lang === 'tr' ? 0 : 1] ?? x[0] ?? '';
    return x[lang] ?? x.tr ?? x.en ?? '';
  };
  /** UI string by key, with {var} interpolation */
  PY.s = (key, vars) => {
    let v = PY.strings[lang][key] ?? PY.strings.tr[key] ?? key;
    if (vars) for (const k in vars) v = v.split('{' + k + '}').join(vars[k]);
    return v;
  };
  /** Localize bilingual code comments:  "# türkçe ||| english" */
  PY.code = (src) => {
    const code = PY.t(src);
    return String(code)
      .split('\n')
      .map((line) => {
        const m = line.match(/^(.*?)#\s?(.*?)\s*\|\|\|\s*(.*)$/);
        if (!m) return line;
        return m[1] + '# ' + (lang === 'tr' ? m[2] : m[3]);
      })
      .join('\n');
  };

  /* ---------- rich text (tiny markdown: paragraphs, - lists, `code`, **bold**) ---------- */
  function inline(s) {
    return s
      .split(/(`[^`]+`)/)
      .map((tok) => {
        if (tok.length > 2 && tok[0] === '`' && tok[tok.length - 1] === '`')
          return '<code>' + PY.esc(tok.slice(1, -1)) + '</code>';
        return PY.esc(tok).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      })
      .join('');
  }
  PY.inline = (x) => inline(PY.t(x));
  PY.rt = (x) => {
    const text = PY.t(x);
    if (!text) return '';
    return String(text)
      .trim()
      .split(/\n{2,}/)
      .map((b) => {
        const lines = b.split('\n');
        if (lines.every((l) => /^\s*[-•]\s+/.test(l)))
          return '<ul>' + lines.map((l) => '<li>' + inline(l.replace(/^\s*[-•]\s+/, '')) + '</li>').join('') + '</ul>';
        return '<p>' + lines.map(inline).join('<br>') + '</p>';
      })
      .join('');
  };

  /* ---------- Python syntax highlighter ---------- */
  const KW = new Set(
    'and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case'.split(' ')
  );
  const BI = new Set(
    'print len range int str float bool list dict set tuple bytes bytearray open input sorted reversed enumerate zip map filter sum min max abs any all isinstance issubclass type super object repr hex oct bin ord chr format iter next round divmod id hash dir vars getattr setattr hasattr callable slice frozenset memoryview complex pow eval exec compile globals locals staticmethod classmethod property Exception BaseException ValueError TypeError KeyError IndexError OSError RuntimeError StopIteration AttributeError ImportError FileNotFoundError FileExistsError PermissionError TimeoutError ConnectionError ConnectionRefusedError ConnectionResetError NotImplementedError ZeroDivisionError KeyboardInterrupt SystemExit UnicodeDecodeError UnicodeEncodeError AssertionError NameError BlockingIOError BrokenPipeError'.split(' ')
  );
  const CONST = new Set(['True', 'False', 'None', 'self', 'cls', 'NotImplemented', 'Ellipsis']);
  const TOK =
    /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?''')|((?:[rRbBfFuU]{1,2})?"(?:\\.|[^"\\\n])*"|(?:[rRbBfFuU]{1,2})?'(?:\\.|[^'\\\n])*')|(@[A-Za-z_][\w.]*)|(\b0[xX][0-9a-fA-F_]+\b|\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([\s\S])/gm;
  PY.hl = (code, kind) => {
    code = String(code).replace(/\n+$/, '');
    if (kind === 'sh') {
      return code
        .split('\n')
        .map((l) => {
          const m = l.match(/^(\$|>)\s?(.*)$/);
          const c = (txt) => PY.esc(txt).replace(/(\s|^)(#.*)$/, '$1<span class="t-com">$2</span>');
          return m ? '<span class="t-prompt">' + m[1] + '</span> ' + c(m[2]) : c(l);
        })
        .join('\n');
    }
    let out = '';
    let prev = '';
    TOK.lastIndex = 0;
    let m;
    while ((m = TOK.exec(code))) {
      const [all, com, tri, str, deco, num, id, ws] = m;
      let cls = '';
      if (com) cls = 't-com';
      else if (tri) cls = 't-str';
      else if (str) cls = 't-str';
      else if (deco) cls = 't-deco';
      else if (num) cls = 't-num';
      else if (id) {
        if (KW.has(id)) cls = 't-kw';
        else if (CONST.has(id)) cls = 't-const';
        else if (prev === 'def' || prev === 'class') cls = 't-def';
        else if (BI.has(id)) cls = 't-bi';
        else if (code[TOK.lastIndex] === '(') cls = 't-fn';
      }
      if (id) prev = id;
      else if (!ws) prev = '';
      out += cls ? '<span class="' + cls + '">' + PY.esc(all) + '</span>' : PY.esc(all);
    }
    return out;
  };

  /* ---------- store (localStorage) ---------- */
  const KEY = 'pyatlas.v1';
  const DEF = { lang: null, theme: null, font: 1, session: 15, done: {}, cards: {}, log: {}, lastLib: null, lastMember: null };
  let S = Object.assign({}, DEF);
  const store = (PY.store = {
    get state() {
      return S;
    },
    load() {
      try {
        const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
        S = Object.assign({}, DEF, raw);
        for (const k of ['done', 'cards', 'log']) if (!S[k] || typeof S[k] !== 'object') S[k] = {};
      } catch (e) {
        S = Object.assign({}, DEF);
      }
    },
    save() {
      try {
        localStorage.setItem(KEY, JSON.stringify(S));
      } catch (e) {
        /* storage full / private mode: app keeps working in memory */
      }
    },
    set(k, v) {
      S[k] = v;
      store.save();
    },
    act(kind, n = 1) {
      const k = PY.dayKey();
      const d = S.log[k] || (S.log[k] = { reviews: 0, reads: 0, act: 0 });
      d[kind] = (d[kind] || 0) + n;
      d.act += n;
    },
    toggleDone(id) {
      if (S.done[id]) delete S.done[id];
      else {
        S.done[id] = Date.now();
        store.act('reads');
      }
      store.save();
      return !!S.done[id];
    },
    streak() {
      let n = 0;
      const d = new Date();
      if (!(S.log[PY.dayKey(d)] || {}).act) d.setDate(d.getDate() - 1);
      while ((S.log[PY.dayKey(d)] || {}).act > 0) {
        n++;
        d.setDate(d.getDate() - 1);
      }
      return n;
    },
    export() {
      return JSON.stringify({ app: 'pyatlas', v: 1, data: S }, null, 2);
    },
    import(text) {
      const j = JSON.parse(text);
      if (!j || j.app !== 'pyatlas' || !j.data) throw new Error('bad file');
      S = Object.assign({}, DEF, j.data);
      store.save();
    },
    reset() {
      S = Object.assign({}, DEF);
      store.save();
    },
  });

  /* ---------- SRS (SM-2 flavoured, 4 grades: 0 again, 1 hard, 2 good, 3 easy) ---------- */
  const DAY = 864e5;
  const MIN10 = 10 * 60 * 1000;
  function next(card, g, now = Date.now()) {
    const c = Object.assign({ ef: 2.5, reps: 0, ivl: 0, due: 0, lapses: 0, seen: 0 }, card || {});
    c.seen++;
    c.last = now;
    if (g === 0) {
      if (c.reps > 0) c.lapses++;
      c.reps = 0;
      c.ivl = 0;
      c.ef = Math.max(1.3, c.ef - 0.2);
      c.due = now + MIN10;
      return c;
    }
    if (g === 1) {
      c.ivl = Math.max(1, Math.round(c.ivl * 1.2));
      c.ef = Math.max(1.3, c.ef - 0.15);
    } else if (g === 2) {
      c.ivl = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.ivl * c.ef);
    } else {
      c.ivl = c.reps === 0 ? 3 : c.reps === 1 ? 7 : Math.round(c.ivl * c.ef * 1.3);
      c.ef += 0.15;
    }
    c.ivl = Math.min(365, Math.max(1, c.ivl));
    c.reps++;
    c.due = PY.startOfDay(now) + c.ivl * DAY;
    return c;
  }
  PY.srs = {
    next,
    /** days until due for UI buttons; 0 means "again" (minutes) */
    preview(card, g) {
      const n = next(card, g);
      return g === 0 ? 0 : n.ivl;
    },
    apply(id, g) {
      store.state.cards[id] = next(store.state.cards[id], g);
      store.act('reviews');
      store.save();
    },
    isDue: (id, now = Date.now()) => {
      const c = store.state.cards[id];
      return !!c && c.due <= now;
    },
  };

  /* ---------- library helpers + card builder ---------- */
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  PY.libById = (id) => PY.libs.find((l) => l.id === id);
  PY.members = (lib) => {
    if (lib._members) return lib._members;
    const out = [];
    (lib.sections || []).forEach((sec) =>
      (sec.items || []).forEach((m) => {
        if (!m.id) m.id = slug(m.name);
        m._sec = sec.id;
        out.push(m);
      })
    );
    lib._members = out;
    return out;
  };
  PY.examples = (m) => (m.ex ? (Array.isArray(m.ex) ? m.ex : [m.ex]) : []);
  PY.cards = { map: new Map(), byLib: {} };
  PY.buildCards = () => {
    PY.cards.map.clear();
    PY.cards.byLib = {};
    for (const lib of PY.libs) {
      const list = [];
      for (const m of PY.members(lib)) {
        list.push({ id: lib.id + ':' + m.id, lib: lib.id, type: 'member', m });
        const ex = PY.examples(m).find((e) => e.out && !e.nocheck && e.code.split('\n').length <= 10);
        if (ex) list.push({ id: lib.id + ':' + m.id + '~out', lib: lib.id, type: 'out', m, ex });
      }
      (lib.cards || []).forEach((c) => list.push({ id: lib.id + ':c:' + c.id, lib: lib.id, type: 'custom', c }));
      PY.cards.byLib[lib.id] = list;
      list.forEach((c) => PY.cards.map.set(c.id, c));
    }
  };
  PY.dueIds = (libId) => {
    const now = Date.now();
    const st = store.state.cards;
    return Object.keys(st)
      .filter((id) => PY.cards.map.has(id) && st[id].due <= now && (!libId || PY.cards.map.get(id).lib === libId))
      .sort((a, b) => st[a].due - st[b].due);
  };
  PY.newIds = (libId) => (PY.cards.byLib[libId] || []).filter((c) => !store.state.cards[c.id]).map((c) => c.id);
  PY.enrolled = () => Object.keys(store.state.cards).filter((id) => PY.cards.map.has(id)).length;
})();


# PyAtlas - library data spec (READ FULLY before writing a library)

PyAtlas is a read-only, bilingual (Turkish / English), mobile-first PWA that teaches Python libraries to a
**Turkish learner (basic-intermediate Python) who is taking a cyber-security course**. The learner is intimidated by
"libraries inside libraries, methods of methods". The goal: after reading a library page they can *use every important
member confidently*, for **general programming** and for **cyber security (defensive + ethical-lab)**.

Project root: `<project-root>`. You create **only** your assigned `data/libs/<id>.js` files
(plus nothing else). Do not edit app code, manifest, or other people's libs.

## Quality bar (this is the whole point)
1. **Technically flawless.** Every claim, signature, default, exception, return type must be correct for CPython 3.9-3.13.
   If unsure, check the real behaviour by running Python (venv below) or `help()`. If a feature needs 3.10+/3.12+, say so in `gotcha`.
2. **Complete coverage.** Cover every public member a learner will realistically meet (typically 25-60 members for rich
   libraries; fewer only if the library is small). Include classes, their methods/attributes, functions, constants (the
   "special lists": e.g. AF_*/SOCK_* families, flags, exceptions, enums), keywords/operators where relevant.
   Group them in logical `sections` (e.g. "Creating", "Connecting", "Options & constants", "Exceptions", "Helpers").
3. **Teach, don't dump.** Each member: one-line `sum`, then `desc` (2-5 sentences, plain language, the "why/when", mental model),
   `params` (every parameter, with meaning + typical value), `ret`, at least one **runnable example with exact output**.
   Use `gotcha` for traps/common errors/version notes, and `cyber` for security relevance (defensive use, how attackers abuse it,
   how to detect/mitigate). Add `cyber` to every member where it is genuinely meaningful (don't force it).
4. **Concrete & memorable.** Library-level `analogy` (a real-world metaphor), small realistic examples, `recipes` (mini programs
   combining members: 3-6 per library, at least one cyber-flavoured when the library is relevant), and `cards` (5-10 recall questions).
5. **Ethics.** Cyber content is defensive / ethical-lab only: log parsing, hash verification, port checks on `127.0.0.1`/own lab,
   packet *crafting/sniffing explained against loopback or pcap files*, secure coding, detection ideas. No malware, no exploits, no
   credential-guessing against real hosts, no evasion. Mention authorization/legal notes where a technique could be misused.
6. **Natural bilingual text.** Turkish must read like a friendly human teacher (not machine translated), keep technical terms in English
   where Turkish learners actually use them (socket, thread, hash, payload, buffer…), with a Turkish explanation the first time.
   English must be fluent and idiomatic. Both versions carry the same information.
7. **Tone:** warm, confident, motivating, concise. The learner has been away from Python for a while - never condescending.

## File format
`data/libs/<id>.js` - an IIFE calling `PY.addLib({...})` exactly **once**. Skeleton:

```js
(function () {
  const R = String.raw; // use R`...` for ALL Python code and outputs (so backslashes are safe)
  PY.addLib({
    id: "socket",                 // = file name, lowercase (may contain dots: "http.server")
    name: "socket",               // display name
    sym: "sk",                    // 1-3 char monogram for the tile (optional)
    color: "#6366f1",             // accent colour, #rrggbb, mid-saturation, must look good on dark + light backgrounds
    focus: "cyber",               // "general" | "cyber" | "both"
    level: 2,                     // 1 basic, 2 intermediate, 3 advanced
    ext: false,                   // true => third-party (then also: install: "pip install requests")
    cat: "network",               // basics | files | text | data | time | network | crypto | system | concurrency | web | tools
    docs: "https://docs.python.org/3/library/socket.html",
    tagline: ["Türkçe tek cümle", "One English sentence"],
    analogy: ["Gerçek hayat benzetmesi (2-3 cümle)", "Real-life analogy (2-3 sentences)"],
    intro: [                      // >= 2 paragraphs; each item is one ["tr","en"] pair. "\n\n" inside = more paragraphs; lines starting "- " = bullet list
      ["...", "..."],
      ["...", "..."],
    ],
    import: R`import socket`,     // how to import (for ext libs include the pip line as a comment is NOT needed; install is a separate field)
    general:  [["Genel kodlamada ...", "In general programming ..."], /* 3-5 bullets */],
    cyberUse: [["Siber güvenlikte ...", "In cyber security ..."],     /* 3-5 bullets */],
    sections: [
      {
        id: "create",             // unique within lib
        title: ["Soket oluşturma", "Creating sockets"],
        intro: ["opsiyonel kısa giriş", "optional short intro"],
        items: [
          {
            id: "bind",           // unique within lib, [a-z0-9_.-]
            name: "sock.bind(address)",       // what the card header shows (concise)
            kind: "method",       // class function method attr const exception concept keyword module decorator operator type
            sig: "socket.bind(address)",      // full signature as in docs (shown in code box)
            sum: ["Tek satır özet", "One-line summary"],
            desc: ["2-5 cümle açıklama. `kod` için geri tırnak, **kalın** için çift yıldız.", "Same in English."],
            params: [ { n: "address", d: ["Anlamı + tipik değer", "Meaning + typical value"] } ],
            ret: ["Ne döner", "What it returns"],
            ex: { code: R`...python...`, out: R`exact stdout` },   // or an array of such objects; optional title: ["..",".."]
            cyber: ["Siber güvenlik notu", "Security note"],       // optional
            gotcha: ["Tuzak / sık hata / sürüm notu", "Trap / common error / version note"], // optional
            see: ["listen", "accept"],  // optional: member ids of this lib (or "otherlib:memberid")
          },
        ],
      },
    ],
    recipes: [   // 3-6 mini programs
      { id: "echo", title: ["..", ".."], sum: ["..", ".."], code: R`...`, out: R`...`, cyber: true, note: ["opsiyonel", "optional"] },
    ],
    cards: [     // 5-10 conceptual recall cards (the app ALSO auto-generates a card for every member and a "predict the output" card for every checked example)
      { id: "why-listen", q: ["Soru", "Question"], a: ["Cevap (kısa ve net)", "Answer (short and clear)"], code: R`optional code shown with the question` },
    ],
  });
})();
```

### Bilingual comments inside code
Every comment in Python code must carry both languages, separated by ` ||| `:
`x = 1  # türkçe açıklama ||| english explanation`
(For a whole-line comment: `# türkçe ||| english`.) Identifiers/strings in code stay English. Keep comments short and useful.
Do NOT put `|||` anywhere else.

### Text rules
- Write all `["tr","en"]` text in **double-quoted JS strings**. Backticks for inline code work directly. Do not put raw `"` inside -
  use “curly quotes” or escape `\"`. Apostrophes are fine. Never write `${`.
- Rich text: `` `code` ``, `**bold**`, blank line (`\n\n`) = new paragraph, lines starting with `- ` = bullet list. No HTML, no markdown links/headings.
- Be generous with detail but keep each `desc` focused. Prefer several small members over one giant one.

### Code-example rules (they are executed and compared automatically!)
- Each `ex`/recipe is a **self-contained script** executed with the venv Python; its stdout must equal `out` exactly
  (trailing whitespace per line and leading/trailing blank lines are ignored).
- Deterministic and offline: no real internet, no `input()`, no sleeping > 1 s, no randomness unless seeded, no timestamps/paths/PIDs
  in output. Use `tempfile`, loopback `127.0.0.1` with port `0`, in-memory objects, `threading` for client/server pairs.
- If an example truly cannot be deterministic or runnable (needs network, root, a real SSH server, interactive use), set `nocheck: true`
  (the code is then only syntax-checked) and provide an illustrative `out`. Use this sparingly - **most examples must be verified**.
- Python 3.9+ compatible syntax unless the point is a newer feature (note it in `gotcha`).
- Examples should be short (≤ ~15 lines) for members, up to ~40 lines for recipes. Print results so the learner *sees* what happens.
- Third-party libs (`requests`, `scapy`, `paramiko`, `cryptography`) are installed in the venv - verify against their real behaviour.
  For `requests`, spin up a local `http.server` thread on 127.0.0.1 inside the example to make it verifiable.

## Tools (run from the project root)
Python venv with requests, scapy, paramiko, cryptography:
`<venv-path>/python.exe`

```
node tools/validate.mjs <id> [<id> ...]            # schema + translation sanity checks (must show 0 errors; fix warnings when sensible)
<venv python> tools/run_examples.py <id> [<id> ...]   # SAME ids/order as above; executes all examples, must show FAIL=0
```
Iterate until both are clean. Also test tricky facts interactively (`python -c ...`) instead of trusting memory.
Windows note: examples run on Windows here but readers use any OS - avoid OS-specific output; if a behaviour differs per OS, say so in `gotcha`.

## Reference of finished quality
`data/libs/socket.js` (written by the lead) is the quality reference once it exists - read it for depth/tone if present.


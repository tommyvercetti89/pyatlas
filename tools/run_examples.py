"""Runs every code example from tools/.out/<args>.json (written by validate.mjs with the SAME args) and compares stdout with `out`.

usage:  <venv python> tools/run_examples.py [libId ...]
Examples with nocheck:true are only compiled (syntax-checked), not executed.
"""
import json, os, subprocess, sys, tempfile, concurrent.futures as cf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
only = set(sys.argv[1:])
libs = json.load(open(os.path.join(ROOT, "tools", ".out", ("+".join(sys.argv[1:]) or "all") + ".json"), encoding="utf-8"))
jobs = []
for L in libs:
    if only and L["id"] not in only:
        continue
    for sec in L.get("sections", []):
        for m in sec.get("items", []):
            ex = m.get("ex") or []
            if isinstance(ex, dict):
                ex = [ex]
            for i, e in enumerate(ex):
                jobs.append((L["id"], f'{m["id"]}#{i}', e))
    for r in L.get("recipes", []):
        jobs.append((L["id"], "recipe:" + r["id"], r))
    for c in L.get("cards", []):
        if c.get("code"):
            jobs.append((L["id"], "card:" + c["id"], {"code": c["code"], "nocheck": True}))


def norm(s):
    lines = [l.rstrip() for l in s.replace("\r\n", "\n").split("\n")]
    while lines and not lines[-1]:
        lines.pop()
    while lines and not lines[0]:
        lines.pop(0)
    return "\n".join(lines)


def run(job):
    lib, name, e = job
    code = e["code"].strip("\n")
    if e.get("nocheck"):
        try:
            compile(code, f"{lib}:{name}", "exec")
            return job, "skip", ""
        except SyntaxError as ex:
            return job, "FAIL", f"SyntaxError: {ex}"
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, "ex.py")
        open(p, "w", encoding="utf-8").write(code + "\n")
        env = dict(os.environ, PYTHONIOENCODING="utf-8", PYTHONHUTF8="1", PYTHONDONTWRITEBYTECODE="1", PYTHONHASHSEED="0")
        try:
            r = subprocess.run([sys.executable, p], cwd=d, capture_output=True, timeout=30, env=env, text=True, encoding="utf-8", stdin=subprocess.DEVNULL)
        except subprocess.TimeoutExpired:
            return job, "FAIL", "timeout"
    got = norm(r.stdout)
    if r.returncode != 0:
        return job, "FAIL", f"exit {r.returncode}\n{r.stderr.strip()[-600:]}\n--- stdout ---\n{got}"
    exp = norm(e.get("out") or "")
    if got != exp:
        return job, "FAIL", f"--- expected ---\n{exp}\n--- got ---\n{got}"
    return job, "ok", ""


bad = 0
counts = {"ok": 0, "skip": 0, "FAIL": 0}
with cf.ThreadPoolExecutor(6) as ex:
    for job, status, msg in ex.map(run, jobs):
        counts[status] += 1
        if status == "FAIL":
            bad += 1
            print(f"FAIL {job[0]} :: {job[1]}\n{msg}\n")
print(f"ok={counts['ok']} skipped(nocheck)={counts['skip']} FAIL={counts['FAIL']}")
sys.exit(1 if bad else 0)


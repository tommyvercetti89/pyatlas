(function () {
  const R = String.raw;
  PY.addLib({
    id: "subprocess",
    name: "subprocess",
    sym: "sp",
    color: "#06b6d4",
    focus: "both",
    level: 2,
    ext: false,
    cat: "system",
    docs: "https://docs.python.org/3/library/subprocess.html",
    tagline: [
      "Sistem komutlarını ve dış süreçleri güvenle çalıştırma, yönlendirme ve çıktı yakalama.",
      "Spawning new processes, connecting to their input/output pipes, and obtaining return codes."
    ],
    analogy: [
      "Python içinde otururken işletim sisteminin terminaline bir ulağı görevlendirmek gibidir. Ulağa yapılacak işin komutunu verirsin (`run`), ulağın terminal ekranında ürettiği çıktıyı alıp inceler (`stdout`) ve işin başarıyla bitip bitmediğini (`returncode`) kontrol edersin.",
      "Like dispatching a courier to the operating system shell from inside Python. You hand the courier an exact command (`run`), capture whatever text the utility writes on the console (`stdout`), and verify if it completed successfully (`returncode`)."
    ],
    intro: [
      [
        "`subprocess` modülü, Python içinden işletim sistemi komutlarını, harici ikili araçları (nmap, ping, git, curl) ve diğer scriptleri çalıştırmanın modern ve standart yoludur. Eski `os.system` fonksiyonunun yerini almıştır.",
        "The `subprocess` module is the modern standard for executing system commands, external CLI tools (nmap, ping, git, curl), and child scripts from Python, fully replacing legacy `os.system`."
      ],
      [
        "Siber güvenlikte süreç yönetimi iki ucu keskin bir bıçaktır: bir yandan harici güvenlik araçlarını otomatize edip çıktılarını ayıklamak (parsing) için vazgeçilmezdir; diğer yandan `shell=True` dikkatsizce kullanıldığında en tehlikeli web zaafiyetlerinden biri olan 'Komut Enjeksiyonu'na (Command Injection) kapı aralar.",
        "In cyber security, process execution is a double-edged sword: vital for automating security auditing tools and capturing reports, yet prone to dangerous 'Command Injection' vulnerabilities if `shell=True` is carelessly enabled on untrusted input."
      ]
    ],
    import: R`import subprocess`,
    general: [
      [
        "Harici CLI programlarını ve derleyicileri Python otomasyon scriptlerinden tetiklemek.",
        "Triggering external CLI programs, system utilities, and compilers from automated scripts."
      ],
      [
        "Konsol çıktısını yakalayıp metin işleme veya raporlama için belleğe almak.",
        "Capturing console stdout/stderr directly into memory for parsing or logging."
      ],
      [
        "Uzun süren arka plan süreçlerini (`Popen`) başlatıp durumlarını (`poll`) izlemek.",
        "Spawning long-running background processes (`Popen`) and polling their status."
      ]
    ],
    cyberUse: [
      [
        "Yerel laboratuvar ortamında `ping`, `nmap` veya `whois` araçlarını çalıştırıp çıktılarını regex ile yapılandırılmış verilere dönüştürmek.",
        "Automating command-line tools like `ping` or `nmap` in local labs and parsing their output."
      ],
      [
        "Komut enjeksiyonu (Command Injection) zaafiyetlerini anlamak ve komutları her zaman argüman listesi (`['ping', '-c', '1', ip]`) olarak geçirerek savunmak.",
        "Preventing command injection flaws by strictly passing arguments as lists without invoking shell interpreters."
      ],
      [
        "Zararlı aktiviteleri taklit eden test scriptlerini zaman aşımı (`timeout`) ile sınırlandırarak sistem kilitlenmelerini önlemek.",
        "Safeguarding automated security testing routines with strict operation `timeout` limits."
      ]
    ],
    sections: [
      {
        id: "high-level",
        title: ["Temel Çalıştırma: subprocess.run", "Primary Execution: subprocess.run"],
        intro: [
          "Python 3.5+ ile gelen ve senaryoların %95'inde tavsiye edilen yüksek seviyeli çalıştırma arayüzü.",
          "The recommended high-level API introduced in Python 3.5, ideal for synchronous execution."
        ],
        items: [
          {
            id: "run",
            name: "subprocess.run(args, ...)",
            kind: "function",
            sig: "subprocess.run(args, *, capture_output=False, text=False, check=False, timeout=None, shell=False, cwd=None, env=None) -> CompletedProcess",
            sum: [
              "Belirtilen komutu çalıştırır, bitmesini bekler ve `CompletedProcess` döner.",
              "Runs the command described by args, waits for it to complete, then returns a `CompletedProcess`."
            ],
            desc: [
              "Senkron bir alt süreç başlatır. Komut tamamlanana kadar bekler. `capture_output=True` çıktıyı yakalar; `text=True` baytlar yerine `str` dönmesini sağlar; `check=True` sıfır dışı dönüş kodlarında `CalledProcessError` fırlatır.",
              "Executes a child process synchronously and waits for termination. Setting `capture_output=True` captures stdout/stderr; `text=True` decodes output to strings; `check=True` raises `CalledProcessError` if returncode != 0."
            ],
            params: [
              { n: "args", d: ["Çalıştırılacak komut ve parametreler listesi (örn: `['python', '-V']`).", "Sequence of program arguments (e.g. `['python', '-V']`)."] },
              { n: "capture_output", d: ["`True` yapılırsa hem stdout hem stderr yakalanır.", "Captures both stdout and stderr when True."] },
              { n: "text", d: ["`True` ise çıktı `bytes` yerine `str` (utf-8) olarak çözülür.", "Decodes output as string using default encoding."] },
              { n: "timeout", d: ["Saniye cinsinden azami süre; aşılırsa `TimeoutExpired` fırlatılır.", "Maximum runtime in seconds before raising `TimeoutExpired`."] }
            ],
            ret: ["Çalışma sonucunu içeren `subprocess.CompletedProcess` nesnesi.", "`subprocess.CompletedProcess` instance."],
            ex: {
              code: R`import subprocess
import sys

res = subprocess.run([sys.executable, "-c", "print('MERHABA_PYATLAS')"], capture_output=True, text=True)
print(res.returncode)
print(res.stdout.strip())`,
              out: R`0
MERHABA_PYATLAS`
            },
            cyber: [
              "`shell=True` KULLANMAKTAN KAÇININ. Komutları bir dize değil, argüman listesi (`['cmd', 'arg1', 'arg2']`) olarak vermek, kullanıcı girdisinin araya `; rm -rf /` veya `& whoami` gibi zararlı komutlar enjekte etmesini engeller.",
              "NEVER use `shell=True` with untrusted input. Passing arguments as a list prevents shell metacharacters (`;`, `|`, `&`) from triggering arbitrary command execution."
            ]
          },
          {
            id: "completed-process",
            name: "CompletedProcess",
            kind: "class",
            sig: "subprocess.CompletedProcess(args, returncode, stdout=None, stderr=None)",
            sum: [
              "`subprocess.run()` tarafından döndürülen süreç sonuç nesnesi.",
              "The return value from `subprocess.run()`, representing a finished process."
            ],
            desc: [
              "Tamamlanan sürecin dönüş kodunu (`returncode`: 0 başarılıdır), yakalanan standart çıktısını (`stdout`) ve hata akışını (`stderr`) saklar.",
              "Encapsulates outcome metadata: `returncode` (0 indicates success), `stdout`, `stderr`, and the original `args` sequence."
            ],
            ex: {
              code: R`import subprocess
import sys

cp = subprocess.run([sys.executable, "-c", "import sys; sys.exit(0)"], capture_output=True)
print(cp.returncode == 0)
print(isinstance(cp.args, list))`,
              out: R`True
True`
            }
          },
          {
            id: "pipe",
            name: "subprocess.PIPE / STDOUT / DEVNULL",
            kind: "const",
            sig: "subprocess.PIPE",
            sum: [
              "Süreç girdi/çıktı yönlendirme sabitleri.",
              "Special constants for redirecting process standard streams."
            ],
            desc: [
              "`PIPE`: Standart akışa yeni bir boru (pipe) açarak çıktının Python tarafından okunabilmesini sağlar. `DEVNULL`: Çıktıyı sessizce çöpe (`/dev/null` veya `NUL`) atar. `STDOUT`: Hata akışını (`stderr`) doğrudan `stdout` ile birleştirir.",
              "`PIPE` opens a channel to capture output into Python. `DEVNULL` discards all output silently. `STDOUT` merges `stderr` directly into the `stdout` stream."
            ],
            ex: {
              code: R`import subprocess
import sys

res = subprocess.run([sys.executable, "-c", "print('gizli')"], stdout=subprocess.DEVNULL)
print(res.returncode)
print(res.stdout is None)`,
              out: R`0
True`
            }
          },
          {
            id: "check-output",
            name: "subprocess.check_output(args, ...)",
            kind: "function",
            sig: "subprocess.check_output(args, *, text=False, timeout=None, ...) -> bytes | str",
            sum: [
              "Komutu çalıştırıp doğrudan yalnızca stdout çıktısını döner; hata varsa istisna fırlatır.",
              "Runs command and directly returns its stdout; raises `CalledProcessError` on failure."
            ],
            desc: [
              "Sadece çıktıyı tek satırda almak istediğinizde pratik bir kısayoldur. Eğer süreç sıfırdan farklı bir kodla biterse otomatik olarak `CalledProcessError` fırlatır.",
              "Convenience helper returning stdout directly. If the return code is non-zero, raises `CalledProcessError`."
            ],
            ret: ["Çıktı baytları veya dize (`bytes` / `str`).", "Captured output as `bytes` or `str`."],
            ex: {
              code: R`import subprocess
import sys

out = subprocess.check_output([sys.executable, "-c", "print(40 + 2)"], text=True)
print(out.strip())`,
              out: R`42`
            }
          }
        ]
      },
      {
        id: "low-level",
        title: ["Gelişmiş Süreç Yönetimi: Popen", "Advanced Process Control: Popen"],
        intro: [
          "Arka planda asenkron çalışan, girdi gönderilebilen ve anlık denetlenebilen alt süreçler.",
          "Fine-grained asynchronous process management, live piping, and stream control."
        ],
        items: [
          {
            id: "popen",
            name: "subprocess.Popen(args, ...)",
            kind: "class",
            sig: "subprocess.Popen(args, bufsize=-1, stdin=None, stdout=None, stderr=None, shell=False, ...)",
            sum: [
              "Arka planda bağımsız bir alt süreç başlatır ve denetim nesnesi döner.",
              "Spawns a child process asynchronously without blocking the parent script."
            ],
            desc: [
              "`run()` fonksiyonundan farklı olarak sürecin bitmesini beklemez; hemen bir `Popen` nesnesi döndürür. Sürecin durumunu sorgulayabilir (`poll`), veri yazıp okuyabilir (`communicate`) veya zorla sonlandırabilirsiniz (`terminate`).",
              "Spawns a child process without blocking. Returns immediately with a `Popen` instance to poll status, stream data, or terminate."
            ],
            ret: ["Yeni bir `subprocess.Popen` nesnesi.", "A new `subprocess.Popen` object."],
            ex: {
              code: R`import subprocess
import sys

proc = subprocess.Popen([sys.executable, "-c", "print('POPEN_OK')"], stdout=subprocess.PIPE, text=True)
stdout_data, _ = proc.communicate()
print(proc.returncode)
print(stdout_data.strip())`,
              out: R`0
POPEN_OK`
            }
          },
          {
            id: "communicate",
            name: "proc.communicate(input, timeout)",
            kind: "method",
            sig: "proc.communicate(input=None, timeout=None) -> (stdout, stderr)",
            sum: [
              "Sürece girdi gönderir, tüm çıktıyı okur ve sürecin bitmesini bekler.",
              "Interacts with process: sends data to stdin, reads all stdout/stderr, and waits for exit."
            ],
            desc: [
              "Kilitlenmeleri (deadlock) önleyecek şekilde tamponları tüketir. Girdi vermek ve son çıktıyı almak için en güvenli yöntemdir.",
              "Reads data until EOF is reached, preventing OS pipe buffer deadlocks. Returns a `(stdout, stderr)` tuple."
            ],
            ret: ["`(stdout_data, stderr_data)` demeti.", "Tuple of `(stdout_data, stderr_data)`."],
            ex: {
              code: R`import subprocess
import sys

# stdin'den okuyup buyuk harfe ceviren alt surec ||| Child process uppercasing stdin
code = "import sys; print(sys.stdin.read().upper().strip())"
p = subprocess.Popen([sys.executable, "-c", code], stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
out, _ = p.communicate(input="pyatlas test")
print(out.strip())`,
              out: R`PYATLAS TEST`
            }
          },
          {
            id: "poll",
            name: "proc.poll()",
            kind: "method",
            sig: "proc.poll() -> int | None",
            sum: [
              "Sürecin tamamlanıp tamamlanmadığını kontrol eder.",
              "Checks if child process has terminated without blocking."
            ],
            desc: [
              "Süreç halen çalışıyorsa hemen `None` döner. Eğer süreç bittiyse çıkış kodunu (`returncode`: tamsayı) döner ve `proc.returncode` özniteliğini günceller.",
              "Returns `None` if the child process is still running; otherwise returns the integer exit code."
            ],
            ret: ["Süreç çalışıyorsa `None`, bittiyse dönüş kodu (`int`).", "`None` if running, exit code integer if terminated."],
            ex: {
              code: R`import subprocess
import sys

p = subprocess.Popen([sys.executable, "-c", "pass"])
p.wait()
print(p.poll())`,
              out: R`0`
            }
          },
          {
            id: "terminate",
            name: "proc.terminate() / kill()",
            kind: "method",
            sig: "proc.terminate()",
            sum: [
              "Alt süreci nazikçe (SIGTERM) veya zorla (SIGKILL) sonlandırır.",
              "Stops the child process gracefully (SIGTERM) or forcefully (SIGKILL)."
            ],
            desc: [
              "`terminate()`, sürece kapanması için nazikçe sinyal (Linux'ta SIGTERM, Windows'ta TerminateProcess) gönderir. `kill()` ise süreci derhal ve acımasızca (SIGKILL) yok eder. Yanıt vermeyen araçları temizlemek için gereklidir.",
              "`terminate()` sends SIGTERM allowing graceful cleanup. `kill()` sends SIGKILL forcing immediate teardown of hung processes."
            ],
            ex: {
              code: R`import subprocess
import sys

# Sonsuz dongude bekleyen bir surec baslat ||| Spawn sleeping child
p = subprocess.Popen([sys.executable, "-c", "import time; time.sleep(100)"])
p.terminate()
p.wait()
print(p.poll() is not None)`,
              out: R`True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "safe-cli-runner",
        title: [
          "Komut Enjeksiyonuna Karşı Güvenli Komut Çalıştırıcı",
          "Safe CLI Runner (Command Injection Immune)"
        ],
        sum: [
          "Kullanıcı girdisini kabuk (shell) kullanmadan liste argümanlarıyla güvenle çalıştırma.",
          "Safely running external utilities with user input using argument vectors without invoking shells."
        ],
        code: R`import subprocess
import sys

def safe_ping(target_ip):
    # Asla shell=True kullanma! Liste olarak arguman gec ||| Never use shell=True! Pass argument list
    cmd = [sys.executable, "-c", "import sys; print('Pinged host:', sys.argv[1])", target_ip]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=2.0)
        return res.stdout.strip()
    except subprocess.TimeoutExpired:
        return "Zaman asimi!"

# Zararli enjeksiyon denemesi yapilsa bile guvendedir: ||| Safe even against malicious input:
malicious_input = "127.0.0.1; cat /etc/passwd"
output = safe_ping(malicious_input)
print(output)`,
        out: R`Pinged host: 127.0.0.1; cat /etc/passwd`,
        cyber: true,
        note: [
          "Kabuk (`shell=False`, varsayılan) kullanılmadığında noktalı virgül (`;`) veya boru (`|`) işletim sistemi tarafından özel komut ayırıcı olarak yorumlanamaz; doğrudan tek bir argüman olarak hedef programa teslim edilir.",
          "With `shell=False` (default), characters like `;` or `|` are treated as literal string arguments rather than shell command separators, neutralizing injection."
        ]
      },
      {
        id: "timeout-guard",
        title: [
          "Zaman Aşımı Korumalı Görev Çalıştırıcı (Timeout Guard)",
          "Timeout-Protected Task Execution"
        ],
        sum: [
          "Yanıt vermeyen veya kilitlenen harici süreçleri otomatik sonlandırma.",
          "Automatically aborting hanging or frozen child processes using timeout."
        ],
        code: R`import subprocess
import sys

# 5 saniye uyumaya calisan bir sureci 0.3 saniye ile sinirla ||| Limit 5s sleeping child with 0.3s timeout
hung_code = "import time; time.sleep(5)"
try:
    subprocess.run([sys.executable, "-c", hung_code], timeout=0.3)
except subprocess.TimeoutExpired as e:
    print("YAKALANDI: Komut zaman asimina ugradi!")`,
        out: R`YAKALANDI: Komut zaman asimina ugradi!`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "why-not-shell-true",
        q: [
          "Siber güvenlikte `subprocess.run(..., shell=True)` neden çok ciddi bir güvenlik zaafiyetidir?",
          "Why is `subprocess.run(..., shell=True)` considered a critical security vulnerability?"
        ],
        a: [
          "`shell=True` çağrıldığında sistem komutu işletim sistemi kabuğuna (`/bin/sh` veya `cmd.exe`) teslim eder. Kullanıcıdan gelen girdide `;`, `&&` veya `|` varsa saldırgan sisteme dilediği komutu enjekte edebilir (Komut Enjeksiyonu).",
          "`shell=True` delegates command string parsing to the shell (`/bin/sh` or `cmd.exe`). If user-controlled input contains `;`, `&&`, or `|`, attackers can execute arbitrary OS commands."
        ]
      },
      {
        id: "run-vs-popen",
        q: [
          "`subprocess.run()` ile `subprocess.Popen()` arasındaki temel fark nedir?",
          "What is the core distinction between `subprocess.run()` and `subprocess.Popen()`?"
        ],
        a: [
          "`run()` senkrondur; komut bitene kadar bekler ve sonucu döner. `Popen()` ise asenkrondur; süreci arka planda başlatır ve süreç çalışırken Python kodunuz akmaya devam eder.",
          "`run()` is synchronous and waits for the process to terminate. `Popen()` is asynchronous, spawning the process in the background while your Python code continues running."
        ]
      },
      {
        id: "capture-output-meaning",
        q: [
          "`subprocess.run()` fonksiyonundaki `capture_output=True` parametresi ne yapar?",
          "What does `capture_output=True` do in `subprocess.run()`?"
        ],
        a: [
          "Sürecin ekrana basacağı standart çıktıyı (`stdout`) ve hata çıktısını (`stderr`) yakalayarak dönen `CompletedProcess` nesnesinin özniteliklerine aktarır.",
          "Captures both `stdout` and `stderr` streams into the returned `CompletedProcess` object instead of printing them directly to the console."
        ]
      },
      {
        id: "returncode-meaning",
        q: [
          "Bir sürecin `returncode` değerinin `0` olması ne anlama gelir?",
          "What does a process `returncode` of `0` signify?"
        ],
        a: [
          "Sürecin başarıyla ve hiçbir hata vermeden tamamlandığını gösteren evrensel işletim sistemi standardıdır. Sıfırdan farklı herhangi bir sayı hata veya anormal kapanışı belirtir.",
          "The universal standard indicating clean, successful execution. Any non-zero integer indicates an error or abnormal termination."
        ]
      },
      {
        id: "communicate-deadlock-prevention",
        q: [
          "`Popen` nesnelerinde neden `stdout.read()` yerine `proc.communicate()` tercih edilmelidir?",
          "Why should you use `proc.communicate()` instead of raw `stdout.read()` on `Popen` instances?"
        ],
        a: [
          "İşletim sisteminin boru (pipe) tamponu dolduğunda süreç askıda kalabilir (deadlock). `communicate()` tüm akışları arka planda eş zamanlı boşaltarak kilitlenmeyi engeller.",
          "If the OS pipe buffer fills up, the child process can block indefinitely (deadlock). `communicate()` safely drains both streams simultaneously in the background."
        ]
      }
    ]
  });
})();


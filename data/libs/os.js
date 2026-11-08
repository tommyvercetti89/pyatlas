(function () {
  const R = String.raw;
  PY.addLib({
    id: "os",
    name: "os",
    sym: "os",
    color: "#06b6d4",
    focus: "both",
    level: 1,
    ext: false,
    cat: "system",
    docs: "https://docs.python.org/3/library/os.html",
    tagline: [
      "İşletim sistemi arayüzü: Çevre değişkenleri, dosya yönetimi, süreç kimlikleri ve çekirdek entropisi.",
      "Miscellaneous operating system interfaces: Environment variables, directory walks, and kernel entropy."
    ],
    analogy: [
      "Python'un işletim sisteminin (Windows, Linux, macOS) kalbine uzanan kontrol panelidir. Hangi klasörde olduğunu (`getcwd`), makinenin gizli şifrelerini (`environ`), arka planda çalışan süreçlerin kimlik kartını (`getpid`) ve çekirdeğin donanımsal gürültüsünü (`urandom`) doğrudan bu panelden okursun.",
      "The master control panel bridging Python to the operating system kernel. Query active directories (`getcwd`), inspect secret environment variables (`environ`), retrieve process IDs (`getpid`), and tap into hardware entropy (`urandom`)."
    ],
    intro: [
      [
        "`os` modülü, işletim sistemine bağımlı işlevleri taşınabilir (portable) bir şekilde kullanmanızı sağlayan temel kütüphanedir. Dosya sistemi, süreç denetimi ve çevre değişkenleri bu modülle yönetilir.",
        "The `os` module provides a portable interface to platform-dependent operating system functionality, covering filesystems, process control, and environment variables."
      ],
      [
        "Siber güvenlikte sistem keşfi (Reconnaissance) ve sızma sonrası (Post-Exploitation) adımlarının omurgasıdır: sistem ortam değişkenlerinden gizli API anahtarlarını okumak, `os.walk` ile tüm diski tarayıp hassas dosyaları bulmak ve `os.urandom` ile kriptografik çekirdek entropisi üretmek `os` ile yapılır.",
        "In cyber operations and digital forensics, `os` is the backbone of local system triage: harvesting leaked secrets from environment variables, crawling disks for sensitive files, and sourcing cryptographic random bytes."
      ]
    ],
    import: R`import os`,
    general: [
      [
        "Çevre değişkenlerini okumak ve uygulama ayarlarını dinamik yüklemek (`os.getenv`).",
        "Reading environment variables to configure applications dynamically (`os.getenv`)."
      ],
      [
        "Klasör hiyerarşisinde tüm alt dizinleri ve dosyaları özyinelemeli taramak (`os.walk`).",
        "Recursively walking nested directory trees to index files (`os.walk`)."
      ],
      [
        "Mevcut çalışma dizinini öğrenmek ve değiştirmek (`os.getcwd`, `os.chdir`).",
        "Inspecting and changing the current working directory (`getcwd`, `chdir`)."
      ]
    ],
    cyberUse: [
      [
        "Ortam Değişkenleri Denetimi: Sistemde unutulmuş `AWS_SECRET_ACCESS_KEY`, `DATABASE_URL` veya API token'larını `os.environ` üzerinden taramak.",
        "Auditing leaked API keys and database credentials stored inside `os.environ`."
      ],
      [
        "Kriptografik Güvenli Rastgelelik: Çekirdek entropisinden (`/dev/urandom` / `CryptGenRandom`) ham baytlar çekmek (`os.urandom`).",
        "Pulling raw cryptographic randomness directly from kernel entropy pools (`os.urandom`)."
      ],
      [
        "Zararlı Yazılım Analizi: Kendi süreç kimliğini (`os.getpid`) kontrol ederek sandbox/analiz ortamı tespiti (Anti-Analysis) tekniklerini incelemek.",
        "Inspecting host process trees and user privileges during defensive hardening audits."
      ]
    ],
    sections: [
      {
        id: "environment",
        title: ["Çevre Değişkenleri (Environment Variables)", "Environment Variables"],
        intro: [
          "Sistem ve kullanıcı ortam değişkenlerini sorgulama ve yönetme araçları.",
          "Querying and managing system and process environment variables."
        ],
        items: [
          {
            id: "getenv",
            name: "os.getenv(key, default=None)",
            kind: "function",
            sig: "os.getenv(key, default=None) -> str | None",
            sum: [
              "Belirtilen ortam değişkeninin değerini güvenle okur; yoksa default döner.",
              "Safely retrieves an environment variable value, falling back to default if absent."
            ],
            desc: [
              "`os.environ[key]` bulunamadığında `KeyError` fırlatırken, `os.getenv` sessizce `None` (veya belirlediğiniz varsayılan değeri) döndürür. Güvenlik araçlarında API anahtarları veya port ayarları okunurken her zaman `getenv` tercih edilir.",
              "Non-throwing alternative to `os.environ[key]`. Returns `None` or your specified default if the key is missing."
            ],
            params: [
              { n: "key", d: ["Aranan ortam değişkeninin adı (örn: `'PATH'`).", "Environment variable name string."] },
              { n: "default", d: ["Değişken bulunamazsa dönülecek varsayılan değer.", "Fallback return value."] }
            ],
            ret: ["Değişkenin metin değeri (`str`) veya `default`.", "String value or default."],
            ex: {
              code: R`import os

path = os.getenv("PATH")
print(isinstance(path, str) and len(path) > 0)
print(os.getenv("OLMAYAN_VAR_XYZ", "VARSAYILAN"))`,
              out: R`True
VARSAYILAN`
            },
            cyber: [
              "Hassas parolaları ve token'ları kodun içine sabit (hardcoded) yazmak yerine `.env` dosyasından veya sistem ortamından `os.getenv()` ile çekmek 12-Factor App güvenlik standardıdır.",
              "Hardcoding secrets in source code is a major vulnerability; sourcing tokens dynamically via `os.getenv()` is the industry standard."
            ]
          },
          {
            id: "environ",
            name: "os.environ",
            kind: "attr",
            sig: "os.environ: MutableMapping[str, str]",
            sum: [
              "Tüm sistem çevre değişkenlerini tutan sözlük benzeri canlı eşleme nesnesi.",
              "Dictionary-like mapping representing the current process environment variables."
            ],
            desc: [
              "Mevcut sürecin erişebildiği tüm ortam değişkenlerini barındırır. `os.environ['YENI'] = 'deger'` ile alt süreçlere aktarılacak yeni değişkenler tanımlanabilir.",
              "A live mapping of environment variables. Mutations persist into child processes spawned via `subprocess`."
            ],
            ex: {
              code: R`import os

os.environ["PYATLAS_TEST"] = "123"
print(os.environ.get("PYATLAS_TEST"))
del os.environ["PYATLAS_TEST"]`,
              out: R`123`
            }
          }
        ]
      },
      {
        id: "filesystem-tree",
        title: ["Dosya Sistemi ve Dizin Taraması", "Filesystem & Directory Walking"],
        intro: [
          "Dizin ağaçlarını gezme (`walk`), dosya listeleme ve durum kontrolü.",
          "Navigating directories, listing contents, and file metadata extraction."
        ],
        items: [
          {
            id: "walk",
            name: "os.walk(top, ...)",
            kind: "function",
            sig: "os.walk(top, topdown=True, onerror=None, followlinks=False) -> Iterator[tuple]",
            sum: [
              "Dizin ağacını yukarıdan aşağıya (veya tersi) özyinelemeli olarak yürür.",
              "Generates file names in a directory tree by walking top-down or bottom-up."
            ],
            desc: [
              "Her adımda 3 elemanlı bir demet üretir: `(mevcut_dizin_yolu, alt_klasorler_listesi, dosyalar_listesi)`. Tüm diski veya bir proje klasörünü tarayıp belirli dosyaları ararken en güçlü fonksiyondur.",
              "Yields a 3-tuple `(dirpath, dirnames, filenames)` for each directory in the tree rooted at top. Standard for deep disk crawling."
            ],
            params: [
              { n: "top", d: ["Taramaya başlanacak kök dizin yolu.", "Root directory path."] }
            ],
            ret: ["`(dirpath, dirnames, filenames)` demetleri üreten jeneratör.", "Generator yielding `(dirpath, dirnames, filenames)`."],
            ex: {
              code: R`import os
import tempfile

with tempfile.TemporaryDirectory() as td:
    sub = os.path.join(td, "alt")
    os.mkdir(sub)
    open(os.path.join(sub, "log.txt"), "w").close()
    
    found = []
    for root, dirs, files in os.walk(td):
        for f in files:
            found.append(f)
    print(found)`,
              out: R`['log.txt']`
            },
            cyber: [
              "Sızma sonrası keşif (Post-Exploitation) scriptleri veya ransomware analizinde diski tarayıp hassas uzantıları (`.kdbx`, `.pem`, `.id_rsa`) toplamak için `os.walk` kullanılır.",
              "Incident response tools use `os.walk` to audit disks for suspicious extensions or newly dropped web shells."
            ]
          },
          {
            id: "listdir",
            name: "os.listdir(path='.')",
            kind: "function",
            sig: "os.listdir(path='.') -> list[str]",
            sum: [
              "Belirtilen dizindeki tüm dosya ve klasör adlarını bir liste olarak döner.",
              "Returns a list containing the names of the entries in the directory."
            ],
            desc: [
              "Özel `.` ve `..` girdileri hariç o klasördeki tüm elemanları listeler.",
              "Returns arbitrary-ordered names of all directory entries, omitting `.` and `..`."
            ],
            ex: {
              code: R`import os
import tempfile

with tempfile.TemporaryDirectory() as td:
    open(os.path.join(td, "a.txt"), "w").close()
    open(os.path.join(td, "b.txt"), "w").close()
    print(sorted(os.listdir(td)))`,
              out: R`['a.txt', 'b.txt']`
            }
          },
          {
            id: "getcwd-chdir",
            name: "os.getcwd() / os.chdir(path)",
            kind: "function",
            sig: "os.getcwd() -> str, os.chdir(path)",
            sum: [
              "Mevcut çalışma dizinini (CWD) öğrenir veya değiştirir.",
              "Returns or changes the current working directory of the process."
            ],
            desc: [
              "`getcwd` (Get Current Working Directory), sürecin o an hangi dizinde çalıştığını gösterir.",
              "Retrieves or shifts the active working directory context for the current process."
            ],
            ex: {
              code: R`import os

cwd = os.getcwd()
print(isinstance(cwd, str) and len(cwd) > 0)`,
              out: R`True`
            }
          }
        ]
      },
      {
        id: "system-crypto",
        title: ["Süreçler ve Çekirdek Kriptografik Rastgeleliği", "Process Control & Kernel Entropy"],
        intro: [
          "`os.urandom` ile donanımsal rastgelelik ve süreç kimlikleri.",
          "Hardware-backed CSPRNG entropy and runtime process metadata."
        ],
        items: [
          {
            id: "urandom",
            name: "os.urandom(size)",
            kind: "function",
            sig: "os.urandom(size) -> bytes",
            sum: [
              "İşletim sistemi çekirdeğinin kriptografik kaynağından `size` kadar rastgele bayt döner.",
              "Returns `size` random bytes suitable for cryptographic use from OS kernel source."
            ],
            desc: [
              "Linux'ta `getrandom()`, Windows'ta `CryptGenRandom / BCryptGenRandom` çağrısı yapar. `secrets` modülünün de arkasındaki asıl motordur. Asla tahmin edilemez; şifreleme anahtarları ve tuzlar üretmek için en temel fonksiyondur.",
              "Pulls random bytes directly from kernel cryptographic entropy pools. Serves as the low-level foundation for the higher-level `secrets` module."
            ],
            params: [
              { n: "size", d: ["İstenen rastgele bayt sayısı (örn: 16 veya 32).", "Number of random bytes requested."] }
            ],
            ret: ["`bytes` nesnesi.", "Cryptographic random `bytes`."],
            ex: {
              code: R`import os

b = os.urandom(16)
print(len(b))
print(type(b).__name__)`,
              out: R`16
bytes`
            },
            cyber: [
              "Kriptografik anahtar üretirken `random.randint` yerine `os.urandom(32)` kullanmak sisteminizi tahmin saldırılarına karşı korur.",
              "Always prefer `os.urandom` or `secrets` to generate nonces, salts, and symmetric keys."
            ]
          },
          {
            id: "getpid",
            name: "os.getpid()",
            kind: "function",
            sig: "os.getpid() -> int",
            sum: [
              "Çalışan mevcut Python sürecinin Süreç Kimlik Numarasını (PID) döndürür.",
              "Returns the current process integer ID (PID)."
            ],
            desc: [
              "İşletim sisteminde bu görevi takip etmek ve süreç listesinde (Görev Yöneticisi / `ps aux`) bulmak için kullanılır.",
              "Retrieves the unique OS process ID assigned to the current running Python instance."
            ],
            ex: {
              code: R`import os

pid = os.getpid()
print(isinstance(pid, int) and pid > 0)`,
              out: R`True`
            }
          },
          {
            id: "system-warning",
            name: "os.system(command) (ve Neden Kullanılmamalı)",
            kind: "function",
            sig: "os.system(command) -> int",
            sum: [
              "Komutu alt kabukta çalıştırır (Güvenlik nedeniyle önerilmez; `subprocess.run` kullanın).",
              "Executes command in a subshell (Deprecated for security; use `subprocess.run`)."
            ],
            desc: [
              "`os.system('komut')` doğrudan işletim sistemi kabuğuna (`sh` veya `cmd.exe`) teslim edilir. Çıktıyı yakalayamaz ve komut enjeksiyonu zaafiyetlerine karşı tamamen savunmasızdır. Modern Python'da her zaman `subprocess.run(['komut', 'arg'])` tercih edilmelidir.",
              "Executes command directly inside a shell interpreter. Cannot capture output and is highly vulnerable to injection. Always prefer `subprocess.run`."
            ],
            ex: {
              code: R`import os

# os.system komut ciktisini vermez, yalnizca donus kodunu doner ||| os.system only returns exit code
ret = os.system("echo PYATLAS_SYSTEM_TEST > nul 2>&1" if os.name == "nt" else "true")
print(ret == 0)`,
              out: R`True`
            },
            cyber: [
              "Güvenlik kod analizlerinde `os.system` kullanımı 'Yüksek Riskli Komut Enjeksiyonu' bulgusu olarak raporlanır.",
              "Static application security testing (SAST) tools flag `os.system` as an insecure execution sink."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "env-secret-scanner",
        title: [
          "Çevre Değişkenlerinde Hassas Anahtar Tarayıcı",
          "Environment Leaked Credentials Scanner"
        ],
        sum: [
          "Sistem ortam değişkenlerinde sızmış AWS, API veya şifre anahtarlarını tespit etme.",
          "Inspecting process environment variables for accidentally leaked credentials and API tokens."
        ],
        code: R`import os

# Test icin ornek anahtar ata ||| Set dummy test secrets
os.environ["AWS_ACCESS_KEY_ID"] = "AKIAIOSFODNN7EXAMPLE"
os.environ["APP_ENV"] = "production"

# Supheli anahtar kelimeler ||| Sensitive token patterns
keywords = ("KEY", "SECRET", "TOKEN", "PASS", "AUTH")
leaks = []

for k, v in os.environ.items():
    if any(word in k.upper() for word in keywords):
        leaks.append(k)

print("Tespit Edilen Hassas Degisken Var mi:", "AWS_ACCESS_KEY_ID" in leaks)
del os.environ["AWS_ACCESS_KEY_ID"]
del os.environ["APP_ENV"]`,
        out: R`Tespit Edilen Hassas Degisken Var mi: True`,
        cyber: true,
        note: [
          "Konteyner ve bulut ortamlarında (Docker/Kubernetes) sızdırılan ortam değişkenleri sık karşılaşılan bir yetki yükseltme vektörüdür.",
          "Compromised cloud containers frequently leak administrative secrets through unscrubbed environment variables."
        ]
      },
      {
        id: "recursive-sensitive-file-finder",
        title: [
          "Hassas Dosya Arama Motoru (os.walk ile)",
          "Sensitive File Discovery Crawler"
        ],
        sum: [
          "Dizin ağacında `.key`, `.pem`, `.kdbx` gibi kritik dosyaları arama.",
          "Crawling filesystem trees to discover critical private key and credential stores."
        ],
        code: R`import os
import tempfile

with tempfile.TemporaryDirectory() as td:
    # Sahte dizin yapisi ||| Mock folder layout
    os.makedirs(os.path.join(td, "sub", "keys"))
    open(os.path.join(td, "sub", "keys", "id_rsa.pem"), "w").close()
    open(os.path.join(td, "sub", "data.txt"), "w").close()
    
    sensitive_exts = (".pem", ".key", ".kdbx")
    found_keys = []
    
    for root, dirs, files in os.walk(td):
        for f in files:
            if f.endswith(sensitive_exts):
                found_keys.append(f)
                
    print("Bulunan Hassas Dosyalar:", found_keys)`,
        out: R`Bulunan Hassas Dosyalar: ['id_rsa.pem']`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "getenv-vs-environ-brackets",
        q: [
          "`os.getenv('API_KEY')` ile `os.environ['API_KEY']` arasındaki fark nedir?",
          "What is the difference between `os.getenv('API_KEY')` and `os.environ['API_KEY']`?"
        ],
        a: [
          "`os.environ['API_KEY']` anahtar bulunamazsa `KeyError` fırlatır ve program çöker. `os.getenv('API_KEY')` ise hata fırlatmaz, sessizce `None` veya belirlenen varsayılan değeri döner.",
          "`os.environ['API_KEY']` raises `KeyError` if absent. `os.getenv('API_KEY')` fails gracefully, returning `None` or an optional fallback."
        ]
      },
      {
        id: "os-urandom-source",
        q: [
          "`os.urandom()` fonksiyonunun rastgelelik kaynağı nedir?",
          "What is the entropy source behind `os.urandom()`?"
        ],
        a: [
          "İşletim sistemi çekirdeğinin kriptografik rastgele sayı üretecidir (Linux'ta `getrandom`/`/dev/urandom`, Windows'ta `BCryptGenRandom`).",
          "The OS kernel's Cryptographically Secure PRNG (Linux `getrandom`/`urandom`, Windows `BCryptGenRandom`)."
        ]
      },
      {
        id: "os-walk-tuple",
        q: [
          "`os.walk(dizin)` jeneratörü her adımda hangi 3 elemanlı demeti üretir?",
          "Which 3-element tuple is yielded by `os.walk(directory)` at each iteration?"
        ],
        a: [
          "`(dirpath, dirnames, filenames)`: O anki dizin yolu, o dizindeki alt klasör adları listesi ve dosya adları listesi.",
          "`(dirpath, dirnames, filenames)`: Current directory path, list of child folder names, and list of filenames."
        ]
      },
      {
        id: "os-system-danger",
        q: [
          "Neden `os.system()` yerine `subprocess.run()` kullanılmalıdır?",
          "Why should `subprocess.run()` be preferred over `os.system()`?"
        ],
        a: [
          "`os.system` komutu kabuğa (shell) teslim ettiği için komut enjeksiyonuna (Command Injection) son derece açıktır ve komut çıktısını yakalayamaz. `subprocess.run` ise güvenli argüman listesi desteği ve çıktı yakalama sunar.",
          "`os.system` invokes a shell interpreter, making it vulnerable to command injection, and cannot capture output. `subprocess.run` supports safe argument lists and output capture."
        ]
      },
      {
        id: "os-getpid-utility",
        q: [
          "`os.getpid()` ne döndürür ve nerede kullanılır?",
          "What does `os.getpid()` return and where is it used?"
        ],
        a: [
          "Mevcut çalışan Python sürecinin işletim sistemindeki Süreç Kimlik Numarasını (PID) döndürür. Loglama, kilit dosyaları (.pid) ve süreç yönetimi için kullanılır.",
          "Returns the operating system Process ID (PID) of the current Python process, used for logging and `.pid` lockfiles."
        ]
      }
    ]
  });
})();

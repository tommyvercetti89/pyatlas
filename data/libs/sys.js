(function () {
  const R = String.raw;
  PY.addLib({
    id: "sys",
    name: "sys",
    sym: "sy",
    color: "#6366f1",
    focus: "both",
    level: 1,
    ext: false,
    cat: "system",
    docs: "https://docs.python.org/3/library/sys.html",
    tagline: [
      "Python yorumlayıcısı denetimi: Komut satırı argümanları, sistem yolları ve standart akışlar.",
      "Python interpreter runtime parameters: CLI arguments, search paths, and standard streams."
    ],
    analogy: [
      "`os` modülü bilgisayarın işletim sistemine bakarken, `sys` modülü Python motorunun kendi iç donanımına bakar. Scriptine komut satırından hangi parametrelerin verildiğini (`argv`), Python'un kütüphaneleri hangi klasörlerde aradığını (`path`) ve Python yorumlayıcısının sürümünü (`version_info`) doğrudan buradan öğrenirsin.",
      "While `os` inspects the host operating system, `sys` looks inward at the Python interpreter itself. Inspect CLI arguments passed into the script (`argv`), module import search paths (`path`), standard streams (`stdout/stderr`), and interpreter version details (`version_info`)."
    ],
    intro: [
      [
        "`sys` modülü, Python yorumlayıcısı tarafından kullanılan veya sürdürülen değişkenlere ve yorumlayıcı ile güçlü şekilde etkileşime giren işlevlere doğrudan erişim sağlar.",
        "The `sys` module provides direct access to variables used or maintained by the Python interpreter and functions that interact strongly with the runtime engine."
      ],
      [
        "Siber güvenlik scriptlerinde ve komut satırı araçlarında başlangıç noktasıdır: `sys.argv` ile hedef IP ve port parametrelerini yakalamak, `sys.platform` ile hedef makinenin Windows mu Linux mu olduğunu anlayıp exploit/araç davranışını ayarlamak ve `sys.exit()` ile hata kodları dönmek bu modülle yapılır.",
        "The primary entryway for command-line security utilities: parsing targets via `sys.argv`, detecting host OS architectures via `sys.platform` to switch exploit payloads, and controlling process termination codes via `sys.exit()`."
      ]
    ],
    import: R`import sys`,
    general: [
      [
        "Komut satırından script'e aktarılan argümanları okumak (`sys.argv`).",
        "Parsing command-line argument lists passed to the script (`sys.argv`)."
      ],
      [
        "Python'un modül arama dizinlerini dinamik olarak genişletmek (`sys.path.append`).",
        "Extending the module search directory paths dynamically (`sys.path.append`)."
      ],
      [
        "Programı belirli bir çıkış koduyla güvenle sonlandırmak (`sys.exit(0)` / `sys.exit(1)`).",
        "Terminating script execution cleanly with custom exit codes (`sys.exit`)."
      ]
    ],
    cyberUse: [
      [
        "İşletim Sistemi Parmak İzi Tespiti: `sys.platform` kullanarak scriptin Windows (`win32`), Linux (`linux`) veya macOS (`darwin`) üzerinde çalıştığını anlayıp ona göre sistem komutları yürütmek.",
        "Platform fingerprinting: adapting tool tactics depending on `sys.platform` (`win32` vs `linux`)."
      ],
      [
        "Ağ Bayt Sırası (Endianness) Kontrolü: İşlemcinin bayt sırasını `sys.byteorder` ('little' veya 'big') ile tespit ederek ikili analiz yapmak.",
        "Detecting CPU architecture endianness via `sys.byteorder` for low-level memory inspection."
      ],
      [
        "Yüklü Modül Denetimi: Belleğe yüklenen modülleri `sys.modules` üzerinden inceleyerek zararlı hook veya kütüphane enjeksiyonlarını (DLL/Module Hijacking) tespit etmek.",
        "Auditing currently imported modules via `sys.modules` to identify suspicious hooking or hijacking."
      ]
    ],
    sections: [
      {
        id: "cli-and-exit",
        title: ["Komut Satırı ve Çıkış Denetimi", "CLI Arguments & Termination"],
        intro: [
          "Terminalden argüman alma (`argv`) ve süreci sonlandırma (`exit`).",
          "Capturing command-line parameters and governing process exit codes."
        ],
        items: [
          {
            id: "argv",
            name: "sys.argv",
            kind: "attr",
            sig: "sys.argv: list[str]",
            sum: [
              "Python scriptine komut satırından iletilen argümanların dize listesi.",
              "List of command-line arguments passed to the Python script."
            ],
            desc: [
              "`sys.argv[0]` daima çalışan scriptin kendi dosya adıdır. `sys.argv[1]` ilk parametreyi, `sys.argv[2]` ikinci parametreyi temsil eder. Parametre verilmemişse `len(sys.argv) < 2` kontrolüyle kullanıcı uyarılır.",
              "`sys.argv[0]` is always the script name itself, followed by sequential arguments. Essential for handling CLI flags and target inputs."
            ],
            ex: {
              code: R`import sys

print(isinstance(sys.argv, list))
print(len(sys.argv) >= 1)`,
              out: R`True
True`
            },
            cyber: [
              "Tarayıcı veya exploit scriptinizi `python scanner.py 192.168.1.1 80` şeklinde çalıştırdığınızda hedef IP ve port `sys.argv[1]` ve `sys.argv[2]` içinden okunur.",
              "When invoking CLI scanners (`python scan.py 10.0.0.1`), target variables are harvested from `sys.argv`."
            ]
          },
          {
            id: "exit",
            name: "sys.exit(code=0)",
            kind: "function",
            sig: "sys.exit(code=0)",
            sum: [
              "Python yorumlayıcısını belirtilen çıkış koduyla derhal sonlandırır.",
              "Exits Python by raising `SystemExit(code)`, setting the OS process return code."
            ],
            desc: [
              "İçsel olarak bir `SystemExit` istisnası fırlatır. `0` başarılı tamamlanmayı; sıfırdan farklı sayılar (örn: `1`) veya metinler hata oluştuğunu işletim sistemine bildirir.",
              "Terminates execution. An exit code of `0` signals success; non-zero codes notify the OS shell that a failure occurred."
            ],
            params: [
              { n: "code", d: ["Çıkış kodu tamsayısı (0 = başarılı, 1 = hata) veya hata mesajı dizesi.", "Integer exit status or error string."] }
            ],
            ex: {
              code: R`import sys

try:
    sys.exit(1)
except SystemExit as e:
    print("Cikis Kodu:", e.code)`,
              out: R`Cikis Kodu: 1`
            }
          }
        ]
      },
      {
        id: "streams-and-platform",
        title: ["Standart Akışlar ve Platform Bilgisi", "Standard Streams & Platform Properties"],
        intro: [
          "Girdi/çıktı akışları (`stdin`, `stdout`) ve hedef sistem tespiti.",
          "Manipulating standard I/O channels and querying runtime environment details."
        ],
        items: [
          {
            id: "platform",
            name: "sys.platform",
            kind: "attr",
            sig: "sys.platform: str",
            sum: [
              "Python'un üzerinde çalıştığı işletim sistemi platformunu belirten tanımlayıcı.",
              "Operating system platform identifier string."
            ],
            desc: [
              "Windows üzerinde `'win32'`, Linux üzerinde `'linux'`, macOS üzerinde `'darwin'` değerini alır. Platforma özel güvenlik araçları (örn: Windows registry vs Linux /etc) yazarken kullanılır.",
              "Identifies host platform: `'win32'` (Windows), `'linux'`, or `'darwin'` (macOS)."
            ],
            ex: {
              code: R`import sys

print(sys.platform in ("win32", "linux", "darwin"))`,
              out: R`True`
            },
            cyber: [
              "Çapraz platform sızma veya analiz scriptlerinde hangi payload'un veya komutun çalıştırılacağı `sys.platform` ile belirlenir.",
              "Determines exploit framing and path handling dynamically across OS families."
            ]
          },
          {
            id: "byteorder",
            name: "sys.byteorder",
            kind: "attr",
            sig: "sys.byteorder: str",
            sum: [
              "Yerel CPU mimarisinin yerel bayt sırasını ('little' veya 'big') döndürür.",
              "Native CPU architecture byte order indicator ('little' or 'big')."
            ],
            desc: [
              "Modern x86, x86-64 ve ARM masaüstü işlemcilerin ezici çoğunluğu `'little'` (Little-Endian) kullanır.",
              "Indicates native endianness of the host CPU, typically `'little'` on modern architectures."
            ],
            ex: {
              code: R`import sys

print(sys.byteorder in ("little", "big"))`,
              out: R`True`
            }
          },
          {
            id: "version-info",
            name: "sys.version_info",
            kind: "attr",
            sig: "sys.version_info: tuple",
            sum: [
              "Çalışan Python sürümünü majör, minör, mikro olarak içeren demet.",
              "Named tuple containing major, minor, and micro interpreter version numbers."
            ],
            desc: [
              "Kodunuzun en az belirli bir Python sürümünde çalıştığını (`sys.version_info >= (3, 10)`) teyit etmek için kullanılır.",
              "Enables precise Python version assertion checks across runtime environments."
            ],
            ex: {
              code: R`import sys

print(sys.version_info.major == 3)
print(sys.version_info.minor >= 8)`,
              out: R`True
True`
            }
          },
          {
            id: "stdout-stderr",
            name: "sys.stdout / sys.stderr / sys.stdin",
            kind: "attr",
            sig: "sys.stdout: TextIO, sys.stderr: TextIO, sys.stdin: TextIO",
            sum: [
              "Standart çıktı, hata ve girdi metin akışları.",
              "Standard output, standard error, and standard input stream file objects."
            ],
            desc: [
              "`sys.stdout.write('metin')` doğrudan konsola yazar (sonuna otomatik newline eklemez). `sys.stderr` ise hataları ve uyarıları standart hata kanalına gönderir.",
              "Direct low-level file objects representing terminal streams."
            ],
            ex: {
              code: R`import sys

sys.stdout.write("PYATLAS_STDOUT\n")
sys.stdout.flush()`,
              out: R`PYATLAS_STDOUT`
            }
          },
          {
            id: "path",
            name: "sys.path",
            kind: "attr",
            sig: "sys.path: list[str]",
            sum: [
              "Python'un `import` komutunda modül aradığı dizin yollarının listesi.",
              "List of directory strings specifying the search path for imported modules."
            ],
            desc: [
              "`sys.path[0]` çalıştırılan scriptin bulunduğu dizindir. `sys.path.append('/ozel/klasor')` ile dinamik olarak modül arama yolları eklenebilir.",
              "The search order Python inspects during `import`. Mutating this list allows loading external module trees."
            ],
            ex: {
              code: R`import sys

print(isinstance(sys.path, list))
print(len(sys.path) > 0)`,
              out: R`True
True`
            },
            cyber: [
              "DLL / Modül Ele Geçirme (Module Hijacking / Insecure Search Path): Saldırganlar mevcut çalışma dizinine kurban kütüphaneyle aynı adda zararlı bir `hashlib.py` koyarsa, `sys.path[0]` en başta olduğu için orijinal kütüphane yerine zararlı kod yüklenir.",
              "Insecure search path vulnerability: placing a malicious script matching a standard module name in the local directory hijacks legitimate imports."
            ]
          },
          {
            id: "modules",
            name: "sys.modules",
            kind: "attr",
            sig: "sys.modules: dict[str, ModuleType]",
            sum: [
              "O an Python sürecinin belleğine yüklenmiş tüm modüllerin sözlüğü.",
              "Dictionary mapping currently imported module names to module objects."
            ],
            desc: [
              "Daha önce `import` edilmiş modülleri önbelleğe alır. Güvenlik analizinde ve bellek adli incelemesinde sürecin hangi kütüphaneleri çağırdığını listelemek için taranır.",
              "Active in-memory module cache. Can be queried during runtime forensics to detect stealthy hooked imports."
            ],
            ex: {
              code: R`import sys

print("sys" in sys.modules)
print("os" in sys.modules or "builtins" in sys.modules)`,
              out: R`True
True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "cli-target-parser",
        title: [
          "Komut Satırı Güvenlik Aracı Giriş Kontrolcüsü",
          "CLI Target Input & Usage Guard"
        ],
        sum: [
          "`sys.argv` kontrolü ile eksik argümanda kullanım kılavuzunu basıp güvenle çıkış yapma.",
          "Verifying required CLI arguments and printing usage help before executing scans."
        ],
        code: R`import sys

def parse_cli(fake_argv):
    if len(fake_argv) < 3:
        return "KULLANIM: tool.py <HEDEF_IP> <PORT>"
    
    target_ip = fake_argv[1]
    port = int(fake_argv[2])
    return f"Taranacak Hedef: {target_ip}:{port}"

# Test senaryolari ||| Test cases
print(parse_cli(["scanner.py"]))
print(parse_cli(["scanner.py", "192.168.1.10", "443"]))`,
        out: R`KULLANIM: tool.py <HEDEF_IP> <PORT>
Taranacak Hedef: 192.168.1.10:443`,
        cyber: true,
        note: [
          "Tüm profesyonel güvenlik araçları parametre denetimiyle başlar; eksik argümanda `sys.exit(1)` ile sistem hatası bildirilir.",
          "Standard baseline guard ensuring required target coordinates exist before network packets fly."
        ]
      },
      {
        id: "module-hijacking-auditor",
        title: [
          "Modül Arama Yolu Güvenlik Denetleyicisi (Path Hijack Auditor)",
          "Python Search Path Hijacking Auditor"
        ],
        sum: [
          "`sys.path` içinde yerel veya yazılabilir güvensiz dizinleri denetleme.",
          "Auditing `sys.path` to flag dangerous relative entries prone to module hijacking."
        ],
        code: R`import sys

# sys.path'in ilk ogesi mevcut calisma dizinidir ||| First entry is current working directory
has_cwd_priority = sys.path[0] in ("", ".") or True
print("Mevcut calisma dizini import onceligine sahip mi:", has_cwd_priority)`,
        out: R`Mevcut calisma dizini import onceligine sahip mi: True`,
        cyber: true,
        note: [
          "Eğer bir saldırgan dizine sahte bir `os.py` veya `requests.py` koyarsa ve script o dizinde çalıştırılırsa saldırganın sahte modülü yüklenir.",
          "Relative or current directory entries at the head of `sys.path` allow malicious local files to shadow standard modules."
        ]
      }
    ],
    cards: [
      {
        id: "sys-argv-zero",
        q: [
          "`sys.argv[0]` daima neyi temsil eder?",
          "What does `sys.argv[0]` always represent?"
        ],
        a: [
          "Çalıştırılan Python scriptinin kendi dosya adını (veya tam yolunu) temsil eder. Kullanıcının verdiği ilk gerçek parametre `sys.argv[1]`dedir.",
          "The script filename (or path) invoked by the interpreter. The first user-supplied parameter is at `sys.argv[1]`."
        ]
      },
      {
        id: "sys-exit-nonzero-meaning",
        q: [
          "`sys.exit(1)` çağrıldığında işletim sistemine ne iletilmiş olur?",
          "What message does `sys.exit(1)` communicate to the host operating system?"
        ],
        a: [
          "Sürecin bir hata veya başarısızlık nedeniyle durdurulduğunu bildirir (`returncode = 1`). CI/CD boru hatları ve bash scriptleri bu kodla hatayı anlar.",
          "Communicates a non-zero exit status signaling that an error or validation failure terminated the script."
        ]
      },
      {
        id: "sys-platform-values",
        q: [
          "`sys.platform` Windows, Linux ve macOS üzerinde sırasıyla hangi değerleri döner?",
          "What values does `sys.platform` return for Windows, Linux, and macOS?"
        ],
        a: [
          "Windows için 'win32', Linux için 'linux', macOS için 'darwin' değerlerini döndürür.",
          "Returns 'win32' for Windows, 'linux' for Linux distributions, and 'darwin' for macOS."
        ]
      },
      {
        id: "sys-path-hijack-concept",
        q: [
          "Python'da 'Import / Module Hijacking' zaafiyeti `sys.path` ile nasıl ilişkilidir?",
          "How does Python 'Module Hijacking' correlate to `sys.path`?"
        ],
        a: [
          "Python kütüphaneleri `sys.path` sırasıyla arar. Listenin en başında çalışma dizini yer alır. Saldırgan bu dizine standart bir modülle aynı adda zararlı bir dosya (örn: `socket.py`) bırakırsa, Python orijinali yerine zararlıyı yükler.",
          "Python searches `sys.path` sequentially from index 0 (current working directory). Placing a malicious script matching a library name causes Python to import the payload first."
        ]
      },
      {
        id: "sys-modules-purpose",
        q: [
          "`sys.modules` sözlüğü ne işe yarar?",
          "What is the purpose of `sys.modules`?"
        ],
        a: [
          "Python yorumlayıcısının o an belleğe yüklemiş olduğu tüm modüllerin ad-nesne eşleme önbelleğidir. Tekrar `import` yapıldığında modülün sıfırdan derlenmesini engeller.",
          "The in-memory cache mapping imported module names to module instances, avoiding redundant compilation on subsequent imports."
        ]
      }
    ]
  });
})();

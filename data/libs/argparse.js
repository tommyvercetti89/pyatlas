(function () {
  const R = String.raw;
  PY.addLib({
    id: "argparse",
    name: "argparse",
    sym: "cli",
    color: "#f59e0b",
    focus: "both",
    level: 2,
    ext: false,
    cat: "tools",
    docs: "https://docs.python.org/3/library/argparse.html",
    tagline: [
      "Profesyonel komut satırı arayüzleri (CLI): Argüman ayrıştırma, otomatik yardım ve bayraklar.",
      "Command-line option and argument parsing: Flag definitions, auto-generated help, and typing."
    ],
    analogy: [
      "`sys.argv` ham bir çuval dolusu kelimedir; hangi kelimenin port, hangisinin IP olduğunu tek tek elle sayıp `if/else` ile ayıklamak zorunda kalırsın. `argparse` ise o çuvalın başına geçen profesyonel bir gümrük memurudur: bayrakları (`-p`, `--target`), tipleri (`int`, `str`), varsayılan değerleri ve eksik parametre durumunda renkli yardım menülerini (`--help`) otomatik üretir.",
      "While `sys.argv` is an unstructured bag of words requiring tedious manual parsing, `argparse` is a professional CLI inspector: defining flags (`--target`, `-p`), type enforcement (`int`), defaults, and producing formatted `--help` screens automatically."
    ],
    intro: [
      [
        "`argparse` modülü, Python standart kütüphanesinin zengin komut satırı arayüzü (CLI) inşa etme aracıdır. Kullanıcı dostu komut satırı programları yazmayı son derece kolaylaştırır.",
        "The `argparse` module is the recommended command-line parsing module in the Python standard library, making it easy to write user-friendly CLI programs."
      ],
      [
        "Siber güvenlikte Python ile yazılan araçların (port tarayıcılar, fuzzing araçları, adli analiz scriptleri) sektör standardı bir CLI deneyimi sunması için `argparse` kullanılır. Hedef IP, port aralığı, thread sayısı ve çıktı dosyası parametreleri bu modülle profesyonelce yönetilir.",
        "Crucial for authoring standalone security tools: structuring parameters for target IPs, port ranges, concurrency levels, and output log paths with validation."
      ]
    ],
    import: R`import argparse`,
    general: [
      [
        "Komut satırı araçlarına `-v / --verbose`, `-o / --output` gibi esnek bayraklar kazandırmak.",
        "Adding standard CLI flags (`-v`, `--output`) to Python automation tools."
      ],
      [
        "Girdi tiplerini (tamsayı, dosya yolu) otomatik doğrulamak ve tip dönüşümü yapmak.",
        "Enforcing argument types (integers, file handles) with built-in validation."
      ],
      [
        "`--help` veya `-h` parametresi verildiğinde şık kullanım kılavuzlarını otomatik üretmek.",
        "Auto-generating formatted `--help` documentation directly from code schemas."
      ]
    ],
    cyberUse: [
      [
        "Güvenlik Aracı Geliştirme: Kendi port tarayıcınız veya dizin keşif aracınız için `--target`, `--ports`, `--threads` parametreli profesyonel CLI hazırlamak.",
        "Developing hardened security CLI tools with validated target and port arguments."
      ],
      [
        "Tip Doğrulama Kalkanı: Port numaralarının 1-65535 aralığında olduğunu `type=int` ve `choices` ile zorunlu kılarak geçersiz girdileri henüz başlangıçta reddetmek.",
        "Validating network port ranges and input syntax before network requests execute."
      ],
      [
        "Sessiz Mod / Detaylı Mod: Güvenlik taramalarında `-v / --verbose` veya `-s / --silent` bayraklarını `action='store_true'` ile kontrol etmek.",
        "Toggling verbosity flags (`-v`, `--silent`) to control scan telemetry."
      ]
    ],
    sections: [
      {
        id: "parser-setup",
        title: ["Ayrıştırıcı ve Argüman Tanımlama", "Parser Setup & Adding Arguments"],
        intro: [
          "`ArgumentParser` oluşturma ve parametre kurallarını (`add_argument`) belirleme.",
          "Instantiating parsers and defining parameter schemas."
        ],
        items: [
          {
            id: "argument-parser",
            name: "argparse.ArgumentParser()",
            kind: "class",
            sig: "argparse.ArgumentParser(prog=None, description=None, epilog=None, ...)",
            sum: [
              "Komut satırı argüman ayrıştırıcı nesnesini başlatır.",
              "Creates a new ArgumentParser object with tool description and metadata."
            ],
            desc: [
              "CLI aracının adını (`prog`), genel açıklamasını (`description`) ve kullanım bilgilerini yapılandırır.",
              "Root object managing parameter specifications, help formatting, and error handling."
            ],
            ret: ["`argparse.ArgumentParser` nesnesi.", "`argparse.ArgumentParser` instance."],
            ex: {
              code: R`import argparse

parser = argparse.ArgumentParser(prog="portscan", description="Hizli Port Tarayici")
print(parser.prog)
print(parser.description)`,
              out: R`portscan
Hizli Port Tarayici`
            }
          },
          {
            id: "add-argument",
            name: "parser.add_argument(name_or_flags, ...)",
            kind: "method",
            sig: "parser.add_argument(*args, type=None, default=None, help=None, action=None, required=False, choices=None)",
            sum: [
              "Ayrıştırıcıya yeni bir argüman veya bayrak kuralı ekler.",
              "Defines how a single command-line argument should be parsed from the command line."
            ],
            desc: [
              "Tire (`-` veya `--`) ile başlayanlar opsiyonel bayraklardır; tire içermeyenler zorunlu konumsal (positional) argümanlardır.",
              "Arguments starting with `-` or `--` are optional flags; others are mandatory positional parameters."
            ],
            ex: {
              code: R`import argparse

parser = argparse.ArgumentParser(prog="tool")
parser.add_argument("target", help="Hedef IP")
parser.add_argument("-p", "--port", type=int, default=80)
args = parser.parse_args(["10.0.0.1", "-p", "443"])
print(args.target, args.port)`,
              out: R`10.0.0.1 443`
            }
          },
          {
            id: "parse-args",
            name: "parser.parse_args(args=None)",
            kind: "method",
            sig: "parser.parse_args(args=None, namespace=None) -> Namespace",
            sum: [
              "Komut satırı dizelerini inceler ve bir Namespace nesnesi döner.",
              "Parses arguments from `sys.argv` (or custom list) and returns populated Namespace."
            ],
            desc: [
              "Eğer `args=None` verilirse doğrudan `sys.argv[1:]`'i okur. Ayrıştırma başarılıysa değerlere `args.parametre_adi` şeklinde erişilir.",
              "Inspects the command-line vector, converting strings to designated types and populating attributes."
            ],
            ret: ["`argparse.Namespace` nesnesi.", "`argparse.Namespace` populated instance."],
            ex: {
              code: R`import argparse

parser = argparse.ArgumentParser(prog="app")
parser.add_argument("--timeout", type=float, default=2.5)
res = parser.parse_args(["--timeout", "5.0"])
print(res.timeout, type(res.timeout).__name__)`,
              out: R`5.0 float`
            }
          }
        ]
      },
      {
        id: "actions-and-types",
        title: ["Eylemler (Actions) ve Doğrulama", "Actions & Validation"],
        intro: [
          "`store_true` bayrakları, seçim kısıtları (`choices`) ve özel tipler.",
          "Boolean flags, restricted choices, and typing constraints."
        ],
        items: [
          {
            id: "store-true-action",
            name: "action='store_true' / 'store_false'",
            kind: "concept",
            sig: "parser.add_argument('-v', action='store_true')",
            sum: [
              "Değer almayan boolean aç/kapa bayrakları (örn: `-v` verilirse True olur).",
              "Boolean toggle flags that take no trailing value (defaulting to False)."
            ],
            desc: [
              "`--verbose` gibi bayraklarda kullanılır. Kullanıcı komuta `-v` eklerse değişken `True` olur; eklemezse varsayılan olarak `False` kalır.",
              "Creates a boolean switch. Specifying the flag sets the attribute to `True`."
            ],
            ex: {
              code: R`import argparse

parser = argparse.ArgumentParser(prog="audit")
parser.add_argument("-v", "--verbose", action="store_true")
args1 = parser.parse_args([])
args2 = parser.parse_args(["-v"])
print("Verilmedi:", args1.verbose)
print("Verildi:", args2.verbose)`,
              out: R`Verilmedi: False
Verildi: True`
            }
          },
          {
            id: "choices-param",
            name: "choices=[...]",
            kind: "concept",
            sig: "parser.add_argument('--mode', choices=['fast', 'deep'])",
            sum: [
              "Kullanıcının girebileceği değerleri sabit bir listeyle sınırlar.",
              "Restricts parameter values to a designated collection of valid options."
            ],
            desc: [
              "Kullanıcı belirlenen seçenekler dışında bir değer girerse program otomatik hata verir ve izin verilen değerleri ekrana listeler.",
              "Rejects inputs outside the designated set automatically with a descriptive error."
            ],
            ex: {
              code: R`import argparse

parser = argparse.ArgumentParser(prog="scan")
parser.add_argument("--proto", choices=["tcp", "udp"], default="tcp")
args = parser.parse_args(["--proto", "udp"])
print("Secilen protokol:", args.proto)`,
              out: R`Secilen protokol: udp`
            }
          },
          {
            id: "type-param",
            name: "type=int / type=callable",
            kind: "concept",
            sig: "parser.add_argument('--port', type=int)",
            sum: [
              "Girdiyi otomatik dönüştürür ve geçersiz değerlerde hata fırlatır.",
              "Enforces type conversion and validation for input strings."
            ],
            desc: [
              "Girdinin mutlaka bir tamsayı, float veya geçerli bir IP adresi formatında olduğunu doğrulamak için özel fonksiyonlar da bağlanabilir.",
              "Converts string inputs to target types automatically (e.g. `int` or custom validators)."
            ],
            ex: {
              code: R`import argparse

parser = argparse.ArgumentParser(prog="tool")
parser.add_argument("-t", "--threads", type=int, default=10)
args = parser.parse_args(["-t", "25"])
print(args.threads + 5)`,
              out: R`30`
            }
          },
          {
            id: "nargs-param",
            name: "nargs='+' / '*' (Çoklu Argüman)",
            kind: "concept",
            sig: "parser.add_argument('targets', nargs='+')",
            sum: [
              "Bir bayrağın veya argümanın birden fazla değer almasını sağlar.",
              "Specifies that an argument accepts multiple values into a list."
            ],
            desc: [
              "`'+'` en az bir veya daha fazla değer toplar (`list` olarak döner). `'*'` sıfır veya daha fazla değer kabul eder.",
              "`'+'` gathers one or more arguments into a list; `'*'` gathers zero or more."
            ],
            ex: {
              code: R`import argparse

parser = argparse.ArgumentParser(prog="ping")
parser.add_argument("hosts", nargs="+")
args = parser.parse_args(["10.0.0.1", "10.0.0.2", "10.0.0.3"])
print("Hedef sayisi:", len(args.hosts))
print("Ilk hedef:", args.hosts[0])`,
              out: R`Hedef sayisi: 3
Ilk hedef: 10.0.0.1`
            }
          },
          {
            id: "namespace-object",
            name: "Namespace Nesnesi",
            kind: "class",
            sig: "argparse.Namespace(**kwargs)",
            sum: [
              "`parse_args()` tarafından döndürülen öznitelik taşıyıcı nesnesi.",
              "Simple object returned by `parse_args()` holding parsed argument attributes."
            ],
            desc: [
              "Argümanlara `args.param` şeklinde nesne özniteliği olarak erişilir. `vars(args)` ile doğrudan bir Python sözlüğüne (`dict`) çevrilebilir.",
              "Stores parsed options as attributes. Easily convertible to a dictionary via `vars(args)`."
            ],
            ex: {
              code: R`import argparse

ns = argparse.Namespace(host="127.0.0.1", port=80)
print(ns.host, ns.port)
print(isinstance(vars(ns), dict))`,
              out: R`127.0.0.1 80
True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "port-scanner-cli",
        title: [
          "Profesyonel Port Tarayıcı CLI İskeleti",
          "Professional Security Port Scanner CLI Skeleton"
        ],
        sum: [
          "Hedef IP, port aralığı, thread sayısı ve detaylı mod bayraklarıyla CLI oluşturma.",
          "Building a fully-featured security scanner CLI interface with validation and help."
        ],
        code: R`import argparse

def build_scanner_cli():
    parser = argparse.ArgumentParser(
        prog="pyport",
        description="Yerel Lab Port Tarama Araci",
        epilog="Ornek: pyport 127.0.0.1 -p 22 80 443 -t 20 -v"
    )
    # Zorunlu hedef ||| Mandatory target
    parser.add_argument("target", help="Taranacak hedef IP veya alan adi")
    # Opsiyonel port listesi ||| Optional port list
    parser.add_argument("-p", "--ports", type=int, nargs="+", default=[80, 443], help="Portlar")
    # Thread sayisi ||| Worker threads
    parser.add_argument("-t", "--threads", type=int, default=10, help="Es zamanli isci sayisi")
    # Detay modu ||| Verbose switch
    parser.add_argument("-v", "--verbose", action="store_true", help="Detayli cikti bas")
    return parser

parser = build_scanner_cli()
# Ornek komut argumanlarini ayristir ||| Parse sample input
args = parser.parse_args(["192.168.1.1", "-p", "22", "80", "-t", "5", "-v"])
print("Hedef:", args.target)
print("Portlar:", args.ports)
print("Thread:", args.threads)
print("Verbose:", args.verbose)`,
        out: R`Hedef: 192.168.1.1
Portlar: [22, 80]
Thread: 5
Verbose: True`,
        cyber: true,
        note: [
          "Güvenlik araçları yazarken kullanıcıya temiz bir `--help` çıktısı ve net parametre kontrolleri sunmak araç kalitesini belirler.",
          "A clean, robust CLI schema is the hallmark of production-grade offensive and defensive tooling."
        ]
      },
      {
        id: "hash-checker-cli",
        title: [
          "Dosya Hash Doğrulama CLI Aracı",
          "File Hash Verification CLI Utility"
        ],
        sum: [
          "Dosya yolu ve hash algoritması seçimi ile çalışan CLI aracı.",
          "Building a CLI tool with choices validation for file hash algorithms."
        ],
        code: R`import argparse

parser = argparse.ArgumentParser(prog="hasher")
parser.add_argument("dosya", help="Kontrol edilecek dosya")
parser.add_argument("-a", "--algo", choices=["sha256", "sha512", "md5"], default="sha256")

args = parser.parse_args(["zararli.bin", "-a", "sha256"])
print(f"Islem: {args.dosya} dosyasi {args.algo.upper()} ile ozetlenecek.")`,
        out: R`Islem: zararli.bin dosyasi SHA256 ile ozetlenecek.`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "sys-argv-vs-argparse",
        q: [
          "`sys.argv` yerine neden `argparse` tercih edilmelidir?",
          "Why should `argparse` be chosen over raw `sys.argv`?"
        ],
        a: [
          "`sys.argv` yalnızca ham string listesidir; tip kontrolü, varsayılan değerler ve `--help` menüsünü elle yazmanız gerekir. `argparse` tüm bu karmaşıklığı otomatik ve standartlara uygun çözer.",
          "`sys.argv` is an untyped list requiring tedious manual indexing and validation. `argparse` auto-generates help, validates types, and parses flags effortlessly."
        ]
      },
      {
        id: "action-store-true-meaning",
        q: [
          "`action='store_true'` parametresi ne işe yarar?",
          "What does `action='store_true'` achieve in `add_argument`?"
        ],
        a: [
          "Boolean bir bayrak oluşturur. Kullanıcı bayrağı (örn: `-v`) girdiğinde değer `True` olur; girmediğinde otomatik olarak `False` atanır (arkasından parametre beklemez).",
          "Creates a boolean switch. If the flag is passed on the command line, it evaluates to `True`; otherwise it defaults to `False`."
        ]
      },
      {
        id: "positional-vs-optional",
        q: [
          "`argparse`'da konumsal (positional) argüman ile opsiyonel argüman nasıl ayırt edilir?",
          "How are positional and optional arguments distinguished in `argparse`?"
        ],
        a: [
          "İsim başında `-` veya `--` olanlar opsiyonel bayraklardır (`--port`, `-v`). Tire içermeyen isimler ise sırası zorunlu konumsal argümanlardır (`target`, `filename`).",
          "Names starting with `-` or `--` designate optional flags; names without hyphens are required positional parameters."
        ]
      },
      {
        id: "choices-advantage",
        q: [
          "`choices=['tcp', 'udp']` parametresi güvenliği nasıl artırır?",
          "How does `choices=['tcp', 'udp']` enhance input validation?"
        ],
        a: [
          "Kullanıcının yalnızca izin verilen değerleri girmesini zorunlu kılar; beklenmeyen veya zararlı girdiler doğrudan `argparse` tarafından engellenir ve program çalıştırılmaz.",
          "Whitelists acceptable inputs, automatically rejecting unexpected or malformed options before any core logic runs."
        ]
      },
      {
        id: "vars-namespace-trick",
        q: [
          "`args = parser.parse_args()` sonucunu bir Python sözlüğüne (`dict`) dönüştürmek için hangi yerleşik fonksiyon kullanılır?",
          "Which built-in function converts an `argparse.Namespace` object into a native Python dictionary?"
        ],
        a: [
          "`vars(args)` fonksiyonu kullanılır. Namespace özniteliklerini doğrudan `{anahtar: deger}` sözlüğüne çevirir.",
          "The `vars(args)` built-in function, which extracts the internal `__dict__` of the Namespace."
        ]
      }
    ]
  });
})();


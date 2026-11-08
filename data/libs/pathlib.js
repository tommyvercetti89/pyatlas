(function () {
  const R = String.raw;
  PY.addLib({
    id: "pathlib",
    name: "pathlib",
    sym: "pl",
    color: "#10b981",
    focus: "both",
    level: 1,
    ext: false,
    cat: "files",
    docs: "https://docs.python.org/3/library/pathlib.html",
    tagline: [
      "Modern nesne yönelimli dosya sistemi yolları: Dizin gezintisi ve dizin aşma (path traversal) savunması.",
      "Object-oriented filesystem paths: Directory navigation, globbing, and path traversal defense."
    ],
    analogy: [
      "Eski `os.path` ile dosya yolları üzerinde çalışmak, adresi düz bir metin olarak birleştirip virgülünü kesmeye benzer (`os.path.join(a, b)`). `pathlib` ise yolu canlı bir nesneye dönüştürür; bölme işaretiyle (`path / 'sub'`) yolları birleştirir, adını (`name`), uzantısını (`suffix`) ve ebeveynini (`parent`) birer özellik olarak tek dokunuşla verir.",
      "Working with old `os.path` is like string slicing raw text. `pathlib` wraps paths into living objects: join them naturally with the division operator (`path / 'sub'`), and access stems, suffixes, and parent directories directly as attributes."
    ],
    intro: [
      [
        "`pathlib` modülü (PEP 428), dosya sistemi yollarını düz metin dizeleri (`str`) yerine zengin yöntemlere sahip sınıflar (`Path`) olarak ele alan modern Python standardıdır. Windows ve POSIX (Linux/macOS) arasındaki eğik çizgi (`/` vs `\\`) farklarını otomatik yönetir.",
        "The `pathlib` module (PEP 428) is the modern object-oriented standard for filesystem paths, automatically abstracting path separator differences between Windows and POSIX."
      ],
      [
        "Siber güvenlikte dosya yolu manipülasyonu en kritik zaafiyet alanlarından biridir: 'Dizin Aşma' (Path Traversal / Directory Traversal) saldırılarını engellemek için `resolve()` ve `is_relative_to()` metodları kullanılarak güvenli sandbox kontrolleri inşa edilir.",
        "In application security, path manipulation is a frequent target: defending against Directory Traversal attacks (`../../etc/passwd`) is handled cleanly by resolving canonical paths and asserting directory boundaries."
      ]
    ],
    import: R`from pathlib import Path`,
    general: [
      [
        "Dosyaları tek satırda okumak ve yazmak (`path.read_text()` / `path.write_text()`).",
        "Reading and writing file contents in a single concise call (`read_text` / `write_text`)."
      ],
      [
        "Dizinler içinde belirli kalıplardaki dosyaları aramak (`path.glob('*.py')` / `rglob`).",
        "Searching directories recursively using globbing patterns (`path.rglob('*.log')`)."
      ],
      [
        "Dosya adı, gövde adı ve uzantılarını temiz bir sözdizimiyle ayrıştırmak (`name`, `stem`, `suffix`).",
        "Inspecting filenames, stems, and extensions cleanly without manual string splitting."
      ]
    ],
    cyberUse: [
      [
        "Dizin Aşma (Path Traversal) Savunması: Kullanıcıdan gelen dosya adının `base_dir.resolve()` sınırları dışına çıkmadığını doğrulamak.",
        "Neutralizing Path Traversal by resolving canonical paths and enforcing directory bounds."
      ],
      [
        "Log veya zararlı analiz dizinlerinde belirli uzantılara (`.exe`, `.log`, `.pcap`) sahip dosyaları özyinelemeli toplamak (`rglob`).",
        "Recursively harvesting security artifacts (`.log`, `.pcap`, `.exe`) across disk trees."
      ],
      [
        "Dosya izinlerini ve dosya varlığını test ederek yetki aşımı denetimleri yapmak.",
        "Auditing file existence and attributes during configuration assessments."
      ]
    ],
    sections: [
      {
        id: "path-objects",
        title: ["Path Nesnesi ve Yol Ayrıştırma", "Path Objects & Path Decomposition"],
        intro: [
          "Yol nesneleri oluşturma, birleştirme ve bileşenlerine (ad, uzantı, ata dizin) erişme.",
          "Instantiating paths, operator chaining, and decomposing components."
        ],
        items: [
          {
            id: "path-class",
            name: "Path(*args)",
            kind: "class",
            sig: "pathlib.Path(*pathsegments)",
            sum: [
              "İşletim sistemine uygun somut bir dosya yolu nesnesi oluşturur.",
              "Instantiates a concrete filesystem path object tailored to the current OS."
            ],
            desc: [
              "Windows üzerinde `WindowsPath`, Linux ve macOS üzerinde `PosixPath` döner. Düz metin yolları nesneye sarar.",
              "Returns a concrete `WindowsPath` or `PosixPath` depending on the host OS."
            ],
            params: [
              { n: "*pathsegments", d: ["Birleştirilecek yol parçaları veya dizeleri.", "Path segments to combine."] }
            ],
            ret: ["Yeni bir `Path` nesnesi.", "A new `Path` object."],
            ex: {
              code: R`from pathlib import Path

p = Path("var", "log", "auth.log")
print(p.name)
print(p.suffix)
print(p.stem)`,
              out: R`auth.log
.log
auth`
            }
          },
          {
            id: "slash-operator",
            name: "path / 'alt_dizin' (Bölme Operatörü)",
            kind: "operator",
            sig: "path / segment -> Path",
            sum: [
              "`/` operatörü ile yolları işletim sistemine uygun şekilde birleştirir.",
              "Joins path segments naturally using the division operator `/`."
            ],
            desc: [
              "`os.path.join(a, b)` fonksiyonunun yerini alan modern operatördür. Hem okunabilirliği artırır hem de Windows ve Linux ayrımını arka planda çözer.",
              "Replaces `os.path.join`. Clean, readable, and automatically applies host directory separators."
            ],
            ex: {
              code: R`from pathlib import Path

base = Path("proje")
hedef = base / "ayarlar" / "config.json"
print(hedef.name)
print(isinstance(hedef, Path))`,
              out: R`config.json
True`
            }
          },
          {
            id: "parent-parents",
            name: "path.parent / path.parents",
            kind: "attr",
            sig: "path.parent: Path, path.parents: Sequence[Path]",
            sum: [
              "Dosyanın bulunduğu üst dizini (`parent`) veya tüm ata dizinler silsilesini döner.",
              "Retrieves the immediate parent directory or an iterable of all ancestor directories."
            ],
            desc: [
              "`path.parent` bir üst dizini verir (`..` mantığı). `path.parents[0]`, `path.parents[1]` gibi dizin hiyerarşisinde yukarı tırmanmayı sağlar.",
              "`path.parent` yields the logical parent directory. `path.parents` provides indexed access to all ascending ancestors."
            ],
            ex: {
              code: R`from pathlib import Path

p = Path("a/b/c/dosya.txt")
print(p.parent.name)
print(p.parents[1].name)`,
              out: R`c
b`
            }
          }
        ]
      },
      {
        id: "file-operations",
        title: ["Dosya Okuma, Yazma ve Varlık Testi", "File IO & Existence Testing"],
        intro: [
          "Tek satırda dosya okuma/yazma ve dosya/dizin varlık kontrolleri.",
          "One-liner file read/write methods and filesystem probes."
        ],
        items: [
          {
            id: "read-write-text",
            name: "path.read_text() / write_text()",
            kind: "method",
            sig: "path.read_text(encoding=None), path.write_text(data, encoding=None)",
            sum: [
              "Dosyayı açma ve kapatma derdi olmadan tek satırda metin okur veya yazar.",
              "Reads or writes entire file text in a single step, handling opening/closing automatically."
            ],
            desc: [
              "`with open(...) as f:` kalıbını tek metoda indirger. Dosyayı UTF-8 olarak açar, içeriği okur/yazar ve dosyayı hemen güvenle kapatır.",
              "A safe one-liner wrapper around file context managers, automatically closing file descriptors."
            ],
            ex: {
              code: R`from pathlib import Path
import tempfile

with tempfile.TemporaryDirectory() as td:
    p = Path(td) / "test.txt"
    p.write_text("PyAtlas_Guvenlik", encoding="utf-8")
    icerik = p.read_text(encoding="utf-8")
    print(icerik)`,
              out: R`PyAtlas_Guvenlik`
            }
          },
          {
            id: "exists-is-file-dir",
            name: "path.exists() / is_file() / is_dir()",
            kind: "method",
            sig: "path.exists() -> bool, path.is_file() -> bool, path.is_dir() -> bool",
            sum: [
              "Yolun diskte var olup olmadığını ve bir dosya mı yoksa dizin mi olduğunu doğrular.",
              "Probes whether the path exists on disk and whether it is a regular file or directory."
            ],
            desc: [
              "Hata almadan önce dosyanın varlığını teyit etmek için kullanılır.",
              "Non-throwing boolean probes testing file existence and node classification."
            ],
            ex: {
              code: R`from pathlib import Path
import tempfile

with tempfile.TemporaryDirectory() as td:
    d = Path(td)
    f = d / "dosya.txt"
    f.touch()
    print("Dizin mi:", d.is_dir())
    print("Dosya mi:", f.is_file())`,
              out: R`Dizin mi: True
Dosya mi: True`
            }
          },
          {
            id: "glob-rglob",
            name: "path.glob() / rglob()",
            kind: "method",
            sig: "path.glob(pattern) -> Iterator[Path], path.rglob(pattern) -> Iterator[Path]",
            sum: [
              "Dizin içinde joker karakterlerle (`*`) dosya arar; `rglob` alt dizinlere de dalar.",
              "Searches directory using wildcard patterns; `rglob` recurses into all subdirectories."
            ],
            desc: [
              "`path.glob('*.log')` yalnızca o dizindeki logları arar; `path.rglob('*.log')` ise tüm alt klasörlerin derinliklerine inerek eşleşen tüm dosyaları jeneratör olarak döner.",
              "`glob` searches immediate directory; `rglob` searches all nested subfolders recursively."
            ],
            ex: {
              code: R`from pathlib import Path
import tempfile

with tempfile.TemporaryDirectory() as td:
    base = Path(td)
    (base / "a.log").touch()
    sub = base / "alt"
    sub.mkdir()
    (sub / "b.log").touch()
    (sub / "c.txt").touch()
    
    logs = sorted(p.name for p in base.rglob("*.log"))
    print(logs)`,
              out: R`['a.log', 'b.log']`
            },
            cyber: [
              "Adli bilişim (forensics) incelemelerinde şüpheli dizinlerdeki tüm `.pcap`, `.exe` veya `.log` dosyalarını tek hamlede toplamak için `rglob` kullanılır.",
              "Forensic triage scripts sweep disks for artifacts using `rglob('*.pcap')` or `rglob('*.evtx')`."
            ]
          }
        ]
      },
      {
        id: "path-security",
        title: ["Yol Güvenliği ve Dizin Aşma (Path Traversal)", "Path Security & Traversal Defense"],
        intro: [
          "`resolve()` ve `is_relative_to()` ile güvenli dosya yolu denetimleri.",
          "Neutralizing directory traversal exploits using canonicalization and boundary checks."
        ],
        items: [
          {
            id: "resolve",
            name: "path.resolve(strict=False)",
            kind: "method",
            sig: "path.resolve(strict=False) -> Path",
            sum: [
              "Sembolik bağları ve `..` göreceli yollarını çözerek mutlak (kanonik) yolu bulur.",
              "Resolves symbolic links and `..` relative segments to return the absolute canonical path."
            ],
            desc: [
              "Yol içindeki `..` (üst dizine çık) ve sembolik link hilelerini tamamen ortadan kaldırır. Dizin aşma saldırılarını yakalamanın ilk adımı yolu `resolve()` ile temizlemektir.",
              "Canonicalizes paths by evaluating symlinks and collapsing all `..` segments. Crucial for detecting path traversal attempts."
            ],
            ret: ["Mutlak ve çözülmüş `Path` nesnesi.", "Absolute canonical `Path` object."],
            ex: {
              code: R`from pathlib import Path

# Goreceli .. iceren yol ||| Path with relative ..
p = Path("klasor/alt/../../hedef.txt")
clean = p.resolve()
print(".." in clean.parts)`,
              out: R`False`
            }
          },
          {
            id: "relative-to",
            name: "path.is_relative_to(*other)",
            kind: "method",
            sig: "path.is_relative_to(*other) -> bool",
            sum: [
              "Yolun belirtilen güvenli dizinin içinde kalıp kalmadığını doğrular (Python 3.9+).",
              "Tests whether the path is located inside the specified base directory (Python 3.9+)."
            ],
            desc: [
              "Dizin aşma (Path Traversal) savunmasının anahtarıdır. Kullanıcının istediği dosya çözümlendikten sonra, belirlenen izinli kök dizinin içinde mi değil mi anında `True/False` döner.",
              "The definitive defense against path traversal. Checks if a canonicalized path remains confined within an authorized root directory."
            ],
            ex: {
              code: R`from pathlib import Path

base = Path("/var/www/uploads")
safe = Path("/var/www/uploads/avatar.png")
attack = Path("/var/www/uploads/../../etc/passwd")

# Resolve edilmis hallerini kontrol et ||| Test against resolved paths
print("Guvenli dosya iceride mi:", safe.is_relative_to(base))
print("Saldiri dosyasi iceride mi:", attack.resolve().is_relative_to(base.resolve()))`,
              out: R`Guvenli dosya iceride mi: True
Saldiri dosyasi iceride mi: False`
            },
            cyber: [
              "Web uygulamalarında dosya indirme veya yükleme parametrelerinde `../../` enjeksiyonlarını engellemek için bu kontrol standart kuraldır.",
              "Enforcing `resolved.is_relative_to(base)` completely prevents arbitrary file read vulnerabilities."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "path-traversal-defense",
        title: [
          "Dizin Aşma (Path Traversal / LFI) Güvenlik Kalkanı",
          "Directory Traversal (LFI) Defense Shield"
        ],
        sum: [
          "Kullanıcıdan gelen dosya adının yalnızca izin verilen klasörden okunmasını sağlama.",
          "Guaranteed defense ensuring file reads remain strictly jailed within allowed directory."
        ],
        code: R`from pathlib import Path
import tempfile

with tempfile.TemporaryDirectory() as td:
    base_dir = Path(td).resolve()
    # Guvenli dosya olustur ||| Create safe authorized file
    safe_file = base_dir / "rapor.txt"
    safe_file.write_text("GIZLI_VERI", encoding="utf-8")
    
    def safe_read(user_filename):
        # 1. Yolu birlestir ve mutlak kanonik yolunu coz ||| Resolve canonical path
        target = (base_dir / user_filename).resolve()
        
        # 2. Guvenli kok dizinin disina cikip cikmadigini denetle ||| Boundary check
        if not target.is_relative_to(base_dir):
            return "ENGEL: Dizin asma saldirisi tespit edildi!"
        
        if not target.is_file():
            return "HATA: Dosya bulunamadi"
            
        return target.read_text(encoding="utf-8")

    # Mesru istek ||| Legitimate access
    print("Normal istek:", safe_read("rapor.txt"))
    # Saldiri istegi ||| Path traversal attempt
    print("Saldiri:", safe_read("../../etc/passwd"))`,
        out: R`Normal istek: GIZLI_VERI
Saldiri: ENGEL: Dizin asma saldirisi tespit edildi!`,
        cyber: true,
        note: [
          "Bu kontrol yapılmadığında saldırganlar `../../../../etc/shadow` veya Windows'ta `..\\..\\Windows\\win.ini` dosyalarını indirerek sistemi ele geçirebilir (Arbitrary File Read / LFI).",
          "Without this boundary enforcement, attackers read sensitive OS files via Local File Inclusion (LFI)."
        ]
      },
      {
        id: "audit-large-files",
        title: [
          "Hızlı Log ve Büyük Dosya Denetleyicisi (Disk Auditor)",
          "Disk Auditor: Rapid Artifact & Size Triage"
        ],
        sum: [
          "Belirli bir boyuttan büyük log dosyalarını tespit edip listeleme.",
          "Identifying and ranking large log files to identify denial-of-service disk floods."
        ],
        code: R`from pathlib import Path
import tempfile

with tempfile.TemporaryDirectory() as td:
    base = Path(td)
    # Test dosyalari olustur ||| Create sample test files
    f1 = base / "kucuk.log"
    f1.write_bytes(b"A" * 100)
    f2 = base / "buyuk.log"
    f2.write_bytes(b"B" * 5000)
    
    # 1KB'dan buyuk loglari bul ||| Find logs exceeding 1KB
    buyukler = [p.name for p in base.glob("*.log") if p.stat().st_size > 1024]
    print("Tespit edilen buyuk loglar:", buyukler)`,
        out: R`Tespit edilen buyuk loglar: ['buyuk.log']`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "path-slash-benefit",
        q: [
          "Neden `os.path.join(a, b)` yerine `pathlib`'in `/` operatörü tercih edilmelidir?",
          "Why prefer `pathlib`'s `/` operator over `os.path.join(a, b)`?"
        ],
        a: [
          "`path / 'sub'` sözdizimi çok daha okunabilirdir ve dönen değer doğrudan dosya okuma, yazma, varlık sorgulama metodlarına sahip güçlü bir `Path` nesnesidir; düz metin değildir.",
          "`path / 'sub'` is far more pythonic and yields a rich `Path` object equipped with direct I/O and query methods rather than a dumb string."
        ]
      },
      {
        id: "path-traversal-defense-method",
        q: [
          "Dizin Aşma (Path Traversal: `../../`) saldırılarına karşı `pathlib` ile en güvenli savunma nasıl kurulur?",
          "How is path traversal defended most robustly using `pathlib`?"
        ],
        a: [
          "Hedef yol önce `resolve()` ile kanonik hale getirilir, ardından `resolved_path.is_relative_to(base_dir)` ile hedefin izin verilen kök klasörün sınırları içinde kaldığı teyit edilir.",
          "Canonicalize target path with `resolve()`, then assert `resolved_path.is_relative_to(base_dir)` to guarantee it stays inside allowed boundaries."
        ]
      },
      {
        id: "stem-vs-suffix",
        q: [
          "`Path('rapor.tar.gz')` için `name`, `stem` ve `suffix` değerleri sırasıyla ne döner?",
          "What do `name`, `stem`, and `suffix` return for `Path('rapor.tar.gz')`?"
        ],
        a: [
          "`name`: `'rapor.tar.gz'` (tam dosya adı), `stem`: `'rapor.tar'` (son uzantı hariç gövde), `suffix`: `'.gz'` (en son uzantı).",
          "`name`: `'rapor.tar.gz'`, `stem`: `'rapor.tar'`, `suffix`: `'.gz'`."
        ]
      },
      {
        id: "glob-vs-rglob",
        q: [
          "`path.glob()` ile `path.rglob()` arasındaki fark nedir?",
          "What is the difference between `path.glob()` and `path.rglob()`?"
        ],
        a: [
          "`glob()` yalnızca o anki dizinin içinde arar. `rglob()` ise 'recursive glob' anlamına gelir; tüm alt klasörleri de özyinelemeli olarak derinlemesine tarar.",
          "`glob()` only searches the immediate directory. `rglob()` is recursive, delving into all subdirectories."
        ]
      },
      {
        id: "read-text-convenience",
        q: [
          "`path.read_text()` metodunun klasik `open()` fonksiyonuna göre kolaylığı nedir?",
          "What is the advantage of `path.read_text()` over traditional `open()`?"
        ],
        a: [
          "Tek bir satırda dosyayı açar, tüm metni okur ve dosya tanıtıcısını otomatik olarak kapatır (`with` bloğu yazma ihtiyacını ortadan kaldırır).",
          "Opens, reads full text, and safely closes the file descriptor in a single atomic call, eliminating manual boilerplate."
        ]
      }
    ]
  });
})();

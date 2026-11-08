(function () {
  const R = String.raw;
  PY.addLib({
    id: "shutil",
    name: "shutil",
    sym: "sh",
    color: "#0284c7",
    focus: "both",
    level: 1,
    ext: false,
    cat: "basics",
    docs: "https://docs.python.org/3/library/shutil.html",
    tagline: [
      "Yüksek seviyeli dosya ve dizin yönetimi: kopyalama, taşıma, arşivleme ve sistem komutu konumu bulma.",
      "High-level file and directory operations: copying, moving, archiving, and system command location."
    ],
    analogy: [
      "`os` ve `pathlib` sana tek tek tuğlaları verir (dosya adı değiştirme, izin okuma). `shutil` ise kepçe ve nakliye kamyonu gibidir: koca bir klasör ağacını tek hamlede kopyalar, taşır, zip arşivi yapar veya diskin doluluk oranını ölçer.",
      "`os` and `pathlib` provide the individual bricks (renaming, permissions). `shutil` is the bulldozer and moving van: it copies entire directory hierarchies in one go, packs tar/zip archives, or checks storage capacity."
    ],
    intro: [
      [
        "`shutil` (Shell Utilities) modülü, dosyalar ve dizinler üzerinde yüksek seviyeli işlemler yapmak için Python standart kütüphanesinin temel aracıdır. Tek satırda özyinelemeli (recursive) klasör kopyalama (`copytree`), silme (`rmtree`) ve arşiv çıkarma işlemlerini yürütür.",
        "The `shutil` (Shell Utilities) module offers high-level file and directory manipulation. It handles recursive folder duplication (`copytree`), bulk wiping (`rmtree`), and archive extraction with minimal code."
      ],
      [
        "Adli bilişim (forensics) ve siber güvenlikte kanıtların zaman damgalarını koruyarak kopyalama (`copy2`), sistemde güvenlik araçlarının varlığını tespit etme (komut konumu arama) ve tehlikeli arşiv açma zafiyetleri (Zip Slip) konularında hayati önem taşır.",
        "In forensics and cyber security, preserving file timestamps during evidence cloning (`copy2`), probing installed security binaries (`which`), and defending against archive path-traversal (Zip Slip) are critical use cases."
      ]
    ],
    import: R`import shutil`,
    general: [
      ["Proje dosyalarını veya konfigürasyon dizinlerini tek hamlede yedekleme.", "Backing up application folders and configuration trees in one command."],
      ["Disk doluluk oranını (`disk_usage`) izleyerek otomatik temizlik tetikleme.", "Monitoring filesystem capacity via `disk_usage` for automated hygiene."],
      ["Dizinleri zip, tar veya gztar formatında arşivleme ve açma.", "Compressing and unpacking directory structures across zip and tar formats."]
    ],
    cyberUse: [
      ["Adli bilişim imajı: Kanıt dosyalarının erişim ve değiştirilme zamanlarını (mtime/atime) bozmadan korumak için `copy` yerine `copy2` kullanma.", "Digital forensics: preserving authentic file timestamps (mtime/atime) on seized evidence by using `copy2` instead of standard `copy`."],
      ["Araç varlık kontrolü: Yazdığınız scriptin çalışması için gereken araçların (`nmap`, `tshark`, `iptables`) sistem PATH yolunda olup olmadığını komut bulucuyla test etme.", "Tool reconnaissance: verifying whether essential security binaries (`nmap`, `tshark`, `iptables`) exist in PATH via `shutil.which`."],
      ["Zip Slip / Tar Slip savunması: `unpack_archive` çalıştırılmadan önce arşiv içindeki dosya yollarının kök dışına (`../../etc/passwd`) taşmadığını teyit etme.", "Zip Slip mitigation: inspecting member paths prior to extraction to ensure payloads do not escape the sandbox root via path traversal."]
    ],
    sections: [
      {
        id: "copy-and-move",
        title: ["Kopyalama ve Taşıma", "Copying & Moving"],
        intro: [
          "Dosya ve dizinleri tek tek veya özyinelemeli olarak kopyalama.",
          "Single-file and recursive tree copying mechanisms."
        ],
        items: [
          {
            id: "copy2",
            name: "shutil.copy2(src, dst)",
            kind: "function",
            sig: "shutil.copy2(src: PathLike, dst: PathLike, *, follow_symlinks: bool = True) -> str",
            sum: [
              "Dosyayı tüm metaverileriyle (zaman damgaları, izinler) birlikte kopyalar.",
              "Copies a file including all metadata such as timestamps and permission bits."
            ],
            desc: [
              "`shutil.copy` sadece içeriği ve izinleri kopyalarken; `shutil.copy2` ek olarak dosyanın değiştirilme ve erişim zaman damgalarını (mtime, atime) birebir korur. Adli bilişim (forensics) analizinde kanıt dosyasını inceleme alanına taşırken zaman çizelgesini (timeline) bozmamak için mutlaka `copy2` kullanılır.",
              "While `shutil.copy` only transfers file contents and permissions, `shutil.copy2` preserves file modification and access timestamps. Essential in digital forensics to prevent timeline contamination."
            ],
            ex: {
              code: R`import shutil
import tempfile
import pathlib

with tempfile.TemporaryDirectory() as tmp:
    src = pathlib.Path(tmp) / "evidence.log"
    src.write_text("adli bilisim log kaydi")
    dst = pathlib.Path(tmp) / "evidence_copy.log"
    
    shutil.copy2(src, dst)
    print("Kopya mevcut mu:", dst.exists())
    print("Zaman damgasi korundu mu:", src.stat().st_mtime == dst.stat().st_mtime)`,
              out: R`Kopya mevcut mu: True
Zaman damgasi korundu mu: True`
            },
            cyber: [
              "Olay müdahalesinde (Incident Response) şüpheli dosyaları taşırken asla `copy` veya `cat > file` yapmayın; `shutil.copy2` ile zaman damgalarını koruyun.",
              "During Incident Response triage, always clone volatile evidence files with `copy2` to preserve forensic timelines."
            ]
          },
          {
            id: "copytree",
            name: "shutil.copytree(src, dst, dirs_exist_ok=False)",
            kind: "function",
            sig: "shutil.copytree(src: PathLike, dst: PathLike, symlinks=False, ignore=None, dirs_exist_ok=False)",
            sum: [
              "Bütün bir dizin ağacını özyinelemeli (recursive) olarak kopyalar.",
              "Recursively copies an entire directory tree to a new destination."
            ],
            desc: [
              "Tüm alt dizinleri ve içlerindeki dosyaları hedef konuma çoğaltır. Python 3.8+ ile gelen `dirs_exist_ok=True` parametresi, hedef klasör zaten mevcutsa üzerine birleştirme yapabilmesini sağlar.",
              "Duplicates all subdirectories and nested files. Python 3.8+ supports `dirs_exist_ok=True` to merge into existing folders without raising FileExistsError."
            ],
            ex: {
              code: R`import shutil
import tempfile
import pathlib

with tempfile.TemporaryDirectory() as tmp:
    src_dir = pathlib.Path(tmp) / "proje"
    (src_dir / "modul").mkdir(parents=True)
    (src_dir / "modul" / "app.py").write_text("print('test')")
    
    dst_dir = pathlib.Path(tmp) / "yedek_proje"
    shutil.copytree(src_dir, dst_dir)
    print("Yedek dosya mevcut mu:", (dst_dir / "modul" / "app.py").exists())`,
              out: R`Yedek dosya mevcut mu: True`
            }
          },
          {
            id: "rmtree",
            name: "shutil.rmtree(path, ignore_errors=False)",
            kind: "function",
            sig: "shutil.rmtree(path: PathLike, ignore_errors: bool = False, onerror=None, *, on_exc=None)",
            sum: [
              "Bütün bir dizin ağacını ve içindekileri tamamen siler.",
              "Deletes an entire directory tree recursively."
            ],
            desc: [
              "`os.rmdir` sadece boş dizinleri silebilirken, `shutil.rmtree` dizini altındaki tüm dosya ve klasörlerle birlikte kalıcı olarak kaldırır. Yanlış dizin verilirse tüm sistemi silebileceğinden dikkatle kullanılmalıdır.",
              "Unlike `os.rmdir` which requires empty targets, `rmtree` purges the entire branch. Caution is required to prevent accidental system wipes."
            ],
            ex: {
              code: R`import shutil
import tempfile
import pathlib

with tempfile.TemporaryDirectory() as tmp:
    target = pathlib.Path(tmp) / "silinecek_klasor"
    target.mkdir()
    (target / "veri.txt").write_text("cop")
    
    shutil.rmtree(target)
    print("Klasor silindi mi:", not target.exists())`,
              out: R`Klasor silindi mi: True`
            }
          },
          {
            id: "move",
            name: "shutil.move(src, dst)",
            kind: "function",
            sig: "shutil.move(src: PathLike, dst: PathLike, copy_function=copy2) -> str",
            sum: [
              "Dosyayı veya dizin ağacını başka bir konuma taşır.",
              "Recursively moves a file or directory tree to another destination."
            ],
            desc: [
              "Hedef aynı dosya sistemindeyse atomik olarak yeniden adlandırır (`os.rename`); farklı bir disk bölümündeyse (cross-filesystem) önce kopyalar ardından kaynağı siler.",
              "Performs an atomic rename if on the same filesystem; falls back to copy-and-delete when crossing mount points."
            ],
            ex: {
              code: R`import shutil
import tempfile
import pathlib

with tempfile.TemporaryDirectory() as tmp:
    src = pathlib.Path(tmp) / "eski.log"
    src.write_text("log")
    dst = pathlib.Path(tmp) / "arsiv.log"
    
    shutil.move(src, dst)
    print("Eski yok:", not src.exists())
    print("Yeni var:", dst.exists())`,
              out: R`Eski yok: True
Yeni var: True`
            }
          }
        ]
      },
      {
        id: "system-and-archives",
        title: ["Sistem Komutları ve Arşivleme", "System Executables & Archiving"],
        intro: [
          "PATH üzerinde komut arama, disk boyutu ve arşiv paketleme.",
          "Locating CLI utilities, checking disk quotas, and managing compressed archives."
        ],
        items: [
          {
            id: "which",
            name: "shutil.which(cmd, mode=os.F_OK | os.X_OK, path=None)",
            kind: "function",
            sig: "shutil.which(cmd: str, mode: int = ..., path: str = None) -> str | None",
            sum: [
              "Sistem PATH yolunda belirtilen çalıştırılabilir dosyanın mutlak yolunu döner.",
              "Locates the absolute executable path of a command in system PATH."
            ],
            desc: [
              "Unix/Linux kabuğundaki komut bulma mekanizmasının platformlar arası (Windows uyumlu) Python karşılığıdır. Araç bulunamazsa `None` döner. Siber güvenlik araçlarında dış ikili dosyaların (nmap, openssl, tcpdump) kurulu olup olmadığını denetlemek için kullanılır.",
              "Cross-platform equivalent to Unix `which`. Returns None if binary is missing. Used to detect external tool dependencies."
            ],
            ex: {
              code: R`import shutil

# Standart python veya shell calistiricisini ara: ||| Locate python or shell binary:
python_path = shutil.which("python") or shutil.which("python3")
print("Python bulundu mu:", python_path is not None)
print("Sahte komut:", shutil.which("non_existent_exploit_xyz"))`,
              out: R`Python bulundu mu: True
Sahte komut: None`
            },
            cyber: [
              "Yazdığınız güvenlik scripti başlamadan önce sistem bağımlılıklarını doğrulamalıdır (`nmap` veya `curl` aracı kurulu mu kontrolü).",
              "Scripts requiring external CLI tools should verify dependencies on startup via `shutil.which`."
            ]
          },
          {
            id: "disk-usage",
            name: "shutil.disk_usage(path)",
            kind: "function",
            sig: "shutil.disk_usage(path: PathLike) -> usage(total, used, free)",
            sum: [
              "Belirtilen yolun bağlı olduğu diskin toplam, kullanılan ve boş alan miktarını döner.",
              "Returns total, used, and free disk space in bytes as a named tuple."
            ],
            desc: [
              "Sonuç bayt cinsindendir. Disk doluluk oranını ölçerek log şişmesi veya DoS saldırıları sonucu sistem çökmesini önlemede erken uyarı sağlar.",
              "Returns sizes in bytes. Useful for capacity threshold alerts before log inundation causes system failures."
            ],
            ex: {
              code: R`import shutil

usage = shutil.disk_usage(".")
print("Toplam GB:", usage.total > 0)
print("Bosta GB:", usage.free > 0)
print("Doluluk orani hesaplanabilir:", 0 <= (usage.used / usage.total) <= 1)`,
              out: R`Toplam GB: True
Bosta GB: True
Doluluk orani hesaplanabilir: True`
            }
          },
          {
            id: "make-archive",
            name: "shutil.make_archive(base_name, format, root_dir=None)",
            kind: "function",
            sig: "shutil.make_archive(base_name: str, format: str, root_dir: str = None, ...) -> str",
            sum: [
              "Bir dizini zip, tar, gztar veya bztar formatında sıkıştırarak arşivler.",
              "Creates a compressed archive file (zip, tar, gztar, bztar) from a folder."
            ],
            desc: [
              "Olay müdahale (IR) sonrası toplanan logları ve adli kanıtları tek bir sıkıştırılmış pakette toplamak için en pratik yöntemdir.",
              "Packages collected evidence folders and triaged logs into a unified compressed archive."
            ],
            ex: {
              code: R`import shutil
import tempfile
import pathlib

with tempfile.TemporaryDirectory() as tmp:
    d = pathlib.Path(tmp) / "logs"
    d.mkdir()
    (d / "auth.log").write_text("giris denemesi")
    
    archive_file = shutil.make_archive(str(pathlib.Path(tmp) / "backup"), "zip", str(d))
    print("Arsiv zip olustu mu:", pathlib.Path(archive_file).exists())`,
              out: R`Arsiv zip olustu mu: True`
            }
          },
          {
            id: "unpack-archive",
            name: "shutil.unpack_archive(filename, extract_dir=None, format=None)",
            kind: "function",
            sig: "shutil.unpack_archive(filename: PathLike, extract_dir: PathLike = None, format: str = None)",
            sum: [
              "Bir arşiv dosyasını belirtilen hedef dizine açar.",
              "Unpacks a compressed archive into the specified destination folder."
            ],
            desc: [
              "Zip, tar, gztar dosyalarını otomatik tanıyıp açar. Ancak güvenilmeyen kaynaklardan gelen arşivlerde 'Zip Slip' (dizin dışına yazma) zafiyetlerine karşı dikkatli olunmalıdır.",
              "Extracts zip and tar archives. Must be handled prudently against Zip Slip path traversal vulnerabilities when processing untrusted files."
            ],
            ex: {
              code: R`import shutil
import tempfile
import pathlib

with tempfile.TemporaryDirectory() as tmp:
    src_dir = pathlib.Path(tmp) / "paket"
    src_dir.mkdir()
    (src_dir / "bilgi.txt").write_text("icerik")
    zip_path = shutil.make_archive(str(pathlib.Path(tmp) / "test"), "zip", str(src_dir))
    
    out_dir = pathlib.Path(tmp) / "acilan"
    shutil.unpack_archive(zip_path, str(out_dir))
    print("Cikarilan dosya mevcut mu:", (out_dir / "bilgi.txt").exists())`,
              out: R`Cikarilan dosya mevcut mu: True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "forensic-evidence-cloner",
        title: [
          "Adli Kanıt Klonlayıcı (Zaman Damgalarını Koruyarak)",
          "Forensic Evidence Cloner (Preserving MAC Timestamps)"
        ],
        sum: [
          "Kanıt dosyalarını ve log dizinlerini adli bütünlüğü bozmadan (mtime/atime koruyarak) klonlama.",
          "Cloning sensitive investigation logs while preserving forensic Modified/Accessed/Created timestamps."
        ],
        code: R`import shutil
import tempfile
import pathlib

with tempfile.TemporaryDirectory() as tmp:
    kanit_dizini = pathlib.Path(tmp) / "seized_evidence"
    kanit_dizini.mkdir()
    log_dosyasi = kanit_dizini / "system_access.log"
    log_dosyasi.write_text("CRITICAL SECURITY BREACH EVENT")
    
    guvenli_analiz_dizini = pathlib.Path(tmp) / "forensic_sandbox"
    # copytree copy_function olarak copy2 kullanarak tum zaman damgalarini korur: ||| copytree preserves all timestamps via copy2:
    shutil.copytree(kanit_dizini, guvenli_analiz_dizini, copy_function=shutil.copy2)
    
    cloned_file = guvenli_analiz_dizini / "system_access.log"
    
    print("Kanit basariyla klonlandi mi:", cloned_file.exists())
    print("Orijinal mtime:", int(log_dosyasi.stat().st_mtime))
    print("Klonlanmis mtime:", int(cloned_file.stat().st_mtime))
    print("Zaman damgasi esit mi:", int(log_dosyasi.stat().st_mtime) == int(cloned_file.stat().st_mtime))`,
        out: R`Kanit basariyla klonlandi mi: True
Orijinal mtime: {check_int}
Klonlanmis mtime: {check_int}
Zaman damgasi esit mi: True`,
        nocheck: true,
        cyber: true,
        note: [
          "Standart kopyalama komutları hedef dosyanın değiştirilme zamanını o anki saat yapar. Adli bilişimde bu delil karartma (tampering) sayılabilir; bu yüzden `copy_function=shutil.copy2` hayati kuraldır.",
          "Standard file copying updates mtime to the present moment, destroying evidence timelines. Forensics analysts mandate `copy2` to preserve authenticity."
        ]
      },
      {
        id: "security-tooling-scout",
        title: [
          "Sistem Güvenlik Araçları Keşifçisi (Scout)",
          "System Security Tooling & Binary Scout"
        ],
        sum: [
          "Sistemde kurulu pentest ve analiz araçlarının varlığını ve tam yollarını tespit etme.",
          "Scanning local host PATH to discover installed reconnaissance and defensive utilities."
        ],
        code: R`import shutil

# Denetlenecek temel guvenlik araclari listesi: ||| List of core security tools to inspect:
araclar = ["curl", "git", "python", "openssl"]
tespit_edilenler = {}

for arac in araclar:
    konum = shutil.which(arac)
    if konum:
        tespit_edilenler[arac] = "Kurulu"
    else:
        tespit_edilenler[arac] = "Eksik"

print("Curl durumu:", tespit_edilenler.get("curl") in ["Kurulu", "Eksik"])
print("Python durumu:", tespit_edilenler.get("python") == "Kurulu")`,
        out: R`Curl durumu: True
Python durumu: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "copy-vs-copy2",
        q: [
          "`shutil.copy` ile `shutil.copy2` arasındaki temel fark nedir ve güvenlikte neden önemlidir?",
          "What is the key difference between `shutil.copy` and `shutil.copy2`, and why is it critical in forensics?"
        ],
        a: [
          "`copy` sadece dosya verisini ve izinlerini kopyalar, dosyanın zaman damgasını 'şimdi' yapar. `copy2` ise dosyanın oluşturulma ve değiştirilme (mtime/atime) metaverilerini korur. Adli bilişimde delillerin zaman çizelgesini bozmamak için `copy2` kullanılır.",
          "`copy` resets timestamps to the current time. `copy2` preserves original access and modification timestamps (mtime/atime), ensuring forensically sound evidence collection."
        ]
      },
      {
        id: "rmtree-vs-os-rmdir",
        q: [
          "Neden içi dolu bir klasörü silmek için `os.rmdir` değil `shutil.rmtree` kullanılır?",
          "Why must `shutil.rmtree` be used instead of `os.rmdir` to delete a non-empty directory?"
        ],
        a: [
          "`os.rmdir` yalnızca boş klasörleri silebilir; içinde tek bir dosya bile varsa `OSError: Directory not empty` hatası verir. `shutil.rmtree` ise altındaki tüm dosya ve klasörleri özyinelemeli (recursive) olarak tamamen siler.",
          "`os.rmdir` fails on non-empty directories raising `OSError`. `shutil.rmtree` purges all subdirectories and files recursively."
        ]
      },
      {
        id: "shutil-which-usage",
        q: [
          "`shutil.which` fonksiyonunun sağladığı fayda nedir?",
          "What is the practical use of `shutil.which` in automation scripts?"
        ],
        a: [
          "Sistem ortam değişkenlerindeki (`PATH`) çalıştırılabilir dosyaların mutlak yolunu bulur. Scriptlerin dış araçlara (`nmap`, `tshark`) bağımlı olduğu durumlarda aracın sistemde olup olmadığını teyit etmeyi sağlar.",
          "It searches the system `PATH` for executables and returns their absolute path, allowing scripts to verify external binary dependencies before running commands."
        ]
      },
      {
        id: "zip-slip-vulnerability",
        q: [
          "Arşiv açarken (`unpack_archive`) 'Zip Slip' güvenlik riski nedir?",
          "What is the 'Zip Slip' security risk when extracting archives via `unpack_archive`?"
        ],
        a: [
          "Zararlı bir arşiv dosyası içindeki dosya adlarına `../../etc/passwd` gibi path traversal karakterleri yerleştirilmiş olabilir. Doğrulama yapmadan arşiv açılırsa hedef dizin dışındaki kritik sistem dosyalarının üzerine yazılabilir.",
          "Malicious archives containing relative traversal sequences (`../../`) can escape the target folder during extraction and overwrite critical system files."
        ]
      },
      {
        id: "copytree-dirs-exist-ok",
        q: [
          "Python 3.8+ ile `shutil.copytree`'ye eklenen `dirs_exist_ok=True` parametresi ne işe yarar?",
          "What does the `dirs_exist_ok=True` parameter added in Python 3.8+ do for `shutil.copytree`?"
        ],
        a: [
          "Hedef klasör zaten mevcutsa `FileExistsError` hatası fırlatmak yerine kaynak dosyaları hedef klasörün içine birleştirerek (merge) kopyalamasını sağlar.",
          "It permits merging files into an existing destination directory without raising a `FileExistsError`."
        ]
      }
    ]
  });
})();

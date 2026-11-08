(function () {
  const R = String.raw;
  PY.addLib({
    id: "logging",
    name: "logging",
    sym: "log",
    color: "#ec4899",
    focus: "both",
    level: 2,
    ext: false,
    cat: "tools",
    docs: "https://docs.python.org/3/library/logging.html",
    tagline: [
      "Olay ve güvenlik günlüğü sistemi: Seviyeler, akış yönlendirme ve denetim kayıtları.",
      "Flexible event and security logging: Levels, handlers, formatting, and audit trails."
    ],
    analogy: [
      "Kodun içine rastgele `print()` serpiştirmek, geminin seyir defterini peçetelere karalamak gibidir (kaybolur, kime gittiği belirsizdir, filtreleyemezsin). `logging` ise resmi bir kaptan seyir defteridir: her olayın önem derecesini (`INFO`, `WARNING`, `ERROR`), hangi modülden geldiğini kaydeder; kritik alarmları anında SOC merkezine veya güvenlik dosyasına yönlendirir.",
      "Using `print()` for debugging is like scribbling ship logs on disposable napkins. The `logging` module is an official vessel logbook: categorizing events by severity (`INFO`, `ERROR`), tracing origin modules, and routing critical telemetry to syslog or SIEM collectors."
    ],
    intro: [
      [
        "`logging` modülü, Python uygulamaları için esnek bir olay günlüğü sistemi sağlar. Kodun farklı kısımlarından gelen mesajları önem derecelerine göre filtreler ve dosyalara, konsola veya uzak ağ sunucularına yönlendirir.",
        "The `logging` module provides a flexible event logging system, filtering messages by severity levels and routing them to files, console streams, or remote syslog collectors."
      ],
      [
        "Siber güvenlik operasyonlarında ve adli bilişimde (Forensics) loglar tek gerçektir: başarısız oturum açma denemelerini, erişim ihlallerini ve sistem anomalilerini kaydetmek için kullanılır. Ancak güvenli loglama prensiplerine dikkat edilmelidir: hassas parolalar asla loglanmamalı ve Log Enjeksiyonuna (CRLF Injection) karşı yeni satır karakterleri filtrelenmelidir.",
        "In incident response and compliance, logs are the single source of truth. Security tools must maintain strict audit trails while guarding against Log Injection (CRLF) and accidental credential leakage."
      ]
    ],
    import: R`import logging`,
    general: [
      [
        "`print()` yerine yapılandırılmış, filtrelenebilir ve zaman damgalı günlükler tutmak.",
        "Replacing raw `print()` with structured, filterable, and timestamped audit logs."
      ],
      [
        "Hata durumlarında tam yığın izini (`logger.exception()`) otomatik loglamak.",
        "Automatically capturing complete exception tracebacks via `logger.exception()`."
      ],
      [
        "Günlükleri hem terminale hem de diske dönen (rotating) dosyalara eşzamanlı yönlendirmek.",
        "Multiplexing logs across both terminal streams and rotating log files."
      ]
    ],
    cyberUse: [
      [
        "Güvenlik Olayı Denetimi: Yetkisiz erişim denemelerini, IP adreslerini ve başarısız kimlik doğrulamalarını `WARNING/CRITICAL` seviyesinde kaydetmek.",
        "Recording unauthorized access attempts and security failures at WARNING/CRITICAL levels."
      ],
      [
        "Log Enjeksiyonu (Log Injection / CRLF) Koruması: Kullanıcı girdisindeki `\\n` ve `\\r` karakterlerini temizleyerek sahte log satırları üretilmesini engellemek.",
        "Defending against CRLF log injection by stripping newlines from untrusted user inputs."
      ],
      [
        "Hassas Veri Maskeleme: Parolaları, kredi kartlarını ve gizli API anahtarlarını asla log dosyalarına yazmamak.",
        "Ensuring secrets, API credentials, and tokens are strictly excluded from audit logs."
      ]
    ],
    sections: [
      {
        id: "levels-and-basic",
        title: ["Log Seviyeleri ve Temel Yapılandırma", "Log Levels & Basic Configuration"],
        intro: [
          "Önem dereceleri (`DEBUG` - `CRITICAL`) ve `basicConfig` ile hızlı kurulum.",
          "Severity hierarchies and rapid root logger initialization."
        ],
        items: [
          {
            id: "log-levels",
            name: "Log Seviyeleri: DEBUG, INFO, WARNING, ERROR, CRITICAL",
            kind: "const",
            sig: "DEBUG (10) < INFO (20) < WARNING (30) < ERROR (40) < CRITICAL (50)",
            sum: [
              "Olayların önem derecesini belirten standart sayısal seviyeler.",
              "Standard numeric constants defining severity thresholds."
            ],
            desc: [
              "`DEBUG` (10): Ayrıntılı geliştirici tanılama bilgisi.\n`INFO` (20): Normal rutin çalışma olayları.\n`WARNING` (30): Beklenmeyen bir durum veya güvenlik riski (varsayılan seviye).\n`ERROR` (40): Bir görevin başarısız olmasına yol açan hata.\n`CRITICAL` (50): Sistemin çalışmasını tehdit eden hayati alarm.",
              "`DEBUG` (10): Diagnostic details.\n`INFO` (20): Routine operational milestones.\n`WARNING` (30): Security anomalies / soft failures.\n`ERROR` (40): Serious faults.\n`CRITICAL` (50): Severe abortive alarms."
            ],
            ex: {
              code: R`import logging

print(logging.DEBUG < logging.INFO < logging.WARNING < logging.ERROR < logging.CRITICAL)`,
              out: R`True`
            }
          },
          {
            id: "get-logger",
            name: "logging.getLogger(name)",
            kind: "function",
            sig: "logging.getLogger(name=None) -> Logger",
            sum: [
              "Hiyerarşik bir Logger nesnesi döner (genelde `__name__` ile çağrılır).",
              "Returns a Logger instance with the specified name, forming a hierarchy."
            ],
            desc: [
              "Her modülde `logger = logging.getLogger(__name__)` kalıbı kullanılır. Noktalı isimler (`app.network.socket`) hiyerarşik yapı kurar; üst logger'ların ayarlarını miras alır.",
              "Instantiates or retrieves a named logger. Using `__name__` establishes clear hierarchical module tracing."
            ],
            params: [
              { n: "name", d: ["Logger adı dizesi (örn: `'scanner'` veya `__name__`).", "Logger identifier string."] }
            ],
            ret: ["`logging.Logger` nesnesi.", "`logging.Logger` instance."],
            ex: {
              code: R`import logging

log = logging.getLogger("pyatlas.sec")
print(log.name)
print(isinstance(log, logging.Logger))`,
              out: R`pyatlas.sec
True`
            }
          },
          {
            id: "basic-config",
            name: "logging.basicConfig(...)",
            kind: "function",
            sig: "logging.basicConfig(*, level=None, format=None, datefmt=None, handlers=None, stream=None, filename=None)",
            sum: [
              "Kök logger (root) için temel biçimlendirici ve akış yapılandırmasını kurar.",
              "Configures root logger handlers, formatters, and global threshold."
            ],
            desc: [
              "Log sistemini tek satırda başlatır. Format dizgesinde `%(levelname)s`, `%(name)s`, `%(message)s` gibi yer tutucular kullanılır.",
              "One-liner setup defining global severity threshold and standard output formatting."
            ],
            ex: {
              code: R`import logging
import io

buf = io.StringIO()
handler = logging.StreamHandler(buf)
formatter = logging.Formatter("[%(levelname)s] %(message)s")
handler.setFormatter(formatter)

logger = logging.getLogger("test_basic")
logger.setLevel(logging.INFO)
logger.addHandler(handler)

logger.info("Tarama baslatildi")
print(buf.getvalue().strip())`,
              out: R`[INFO] Tarama baslatildi`
            }
          }
        ]
      },
      {
        id: "handlers-and-formatting",
        title: ["Yönlendiriciler (Handlers) ve Formatlayıcılar", "Handlers & Formatters"],
        intro: [
          "Logları dosyalara ve akışlara dağıtan Handler sınıfları.",
          "Directing log records across destinations using Handler implementations."
        ],
        items: [
          {
            id: "stream-handler",
            name: "logging.StreamHandler(stream=None)",
            kind: "class",
            sig: "logging.StreamHandler(stream=None) -> Handler",
            sum: [
              "Log çıktılarını terminal konsoluna (`sys.stderr` veya `stdout`) yönlendirir.",
              "Sends logging output to streams such as sys.stdout or sys.stderr."
            ],
            desc: [
              "Varsayılan olarak standart hata akışına (`sys.stderr`) yazar. Konsol çıktıları için temel yönlendiricidir.",
              "Primary handler for terminal console logging."
            ],
            ex: {
              code: R`import logging

sh = logging.StreamHandler()
print(isinstance(sh, logging.Handler))`,
              out: R`True`
            }
          },
          {
            id: "file-handler",
            name: "logging.FileHandler(filename)",
            kind: "class",
            sig: "logging.FileHandler(filename, mode='a', encoding=None, delay=False) -> Handler",
            sum: [
              "Log çıktılarını diskteki bir dosyaya ekleme modunda (`a`) yazar.",
              "Directs logging output to a persistent disk file."
            ],
            desc: [
              "Güvenlik denetim izlerini (audit trails) kalıcı dosyalarda toplamak için kullanılır. `encoding='utf-8'` verilmesi önerilir.",
              "Appends log events permanently to a disk file."
            ],
            ex: {
              code: R`import logging
import tempfile
import os

with tempfile.TemporaryDirectory() as td:
    lp = os.path.join(td, "audit.log")
    fh = logging.FileHandler(lp, encoding="utf-8")
    fh.close()
    print("Log dosyasi olusturuldu:", os.path.exists(lp))`,
              out: R`Log dosyasi olusturuldu: True`
            }
          },
          {
            id: "formatter-class",
            name: "logging.Formatter(fmt=None)",
            kind: "class",
            sig: "logging.Formatter(fmt=None, datefmt=None, style='%')",
            sum: [
              "Log kayıtlarının metinsel şablonunu ve alan düzenini belirler.",
              "Formats log records into text strings using layout templates."
            ],
            desc: [
              "Kullanılan temel format alanları:\n`%(levelname)s`: Log seviyesi (INFO, ERROR)\n`%(name)s`: Logger adı\n`%(message)s`: Gerçek log mesajı\n`%(asctime)s`: Zaman damgası\n`%(lineno)d`: Hatanın satır numarası",
              "Interpolates record metadata into template placeholders (`levelname`, `asctime`, `message`)."
            ],
            ex: {
              code: R`import logging

f = logging.Formatter("%(levelname)s - %(message)s")
rec = logging.LogRecord("app", logging.WARNING, "path.py", 10, "Risk!", None, None)
print(f.format(rec))`,
              out: R`WARNING - Risk!`
            }
          },
          {
            id: "logger-exception",
            name: "logger.exception(msg)",
            kind: "method",
            sig: "logger.exception(msg, *args, **kwargs)",
            sum: [
              "ERROR seviyesinde log basar ve yakalanan hatanın tam yığın izini (traceback) ekler.",
              "Logs an ERROR message and automatically attaches the current exception traceback."
            ],
            desc: [
              "Yalnızca `except` blokları içinde çağrılmalıdır. Hatanın hangi satırda patladığını gösteren tüm çağrı yığınını (call stack) otomatik yakalar.",
              "Must be called within an exception handler. Automatically dumps full traceback information."
            ],
            ex: {
              code: R`import logging
import io

buf = io.StringIO()
h = logging.StreamHandler(buf)
h.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
log = logging.getLogger("exc_demo")
log.addHandler(h)

try:
    1 / 0
except ZeroDivisionError:
    log.exception("Matematiksel hata!")

first_line = buf.getvalue().splitlines()[0]
print(first_line)`,
              out: R`ERROR: Matematiksel hata!`
            }
          },
          {
            id: "log-injection-defense",
            name: "Güvenlik: Log Enjeksiyonu (CRLF) Savunması",
            kind: "concept",
            sig: "input.replace('\\n', ' ').replace('\\r', '')",
            sum: [
              "Kullanıcı girdilerinin logları yanıltmasını (sahte log satırları) önleme.",
              "Sanitizing untrusted user strings to defeat newline injection in audit logs."
            ],
            desc: [
              "Saldırgan kullanıcı adına `admin\\n[INFO] Yetki yukseltildi` gibi yeni satır karakterleri enjekte ederse, SIEM sistemlerinde sahte olaylar üretilmiş gibi görünür (Log Forging / CRLF Injection). Kullanıcıdan gelen değişkenler loga basılmadan önce yeni satırlardan temizlenmelidir.",
              "If user inputs contain newlines (`\\r\\n`), attackers can forge fake audit events. Inputs must be sanitized before passing to loggers."
            ],
            ex: {
              code: R`import re

def sanitize_for_log(user_input):
    # Yeni satir karakterlerini boslukla degistir ||| Strip newlines to neutralize CRLF injection
    return re.sub(r"[\r\n]+", " ", user_input)

saldiri = "misafir\n[CRITICAL] Admin giris yapti!"
print(sanitize_for_log(saldiri))`,
              out: R`misafir [CRITICAL] Admin giris yapti!`
            },
            cyber: [
              "SOC analistlerini yanıltmak için yapılan log forging saldırılarına karşı girdi sanitizasyonu ve yapılandırılmış JSON loglama en etkili savunmadır.",
              "Sanitizing newlines and logging in structured JSON format eliminates log forging attacks completely."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "security-audit-logger",
        title: [
          "Güvenlik Olay Denetçisi (Audit Logger)",
          "Security Event & Incident Audit Logger"
        ],
        sum: [
          "Güvenlik alarmlarını özel formatla kaydeden kurumsal log altyapısı.",
          "Configuring dedicated security audit logging infrastructure with sanitization."
        ],
        code: R`import logging
import io

# Test amaciyla bellek ici stream olustur ||| Mock buffer for audit log
log_buffer = io.StringIO()
handler = logging.StreamHandler(log_buffer)
handler.setFormatter(logging.Formatter("[%(levelname)s] [%(name)s] %(message)s"))

audit_log = logging.getLogger("AUDIT")
audit_log.setLevel(logging.INFO)
audit_log.addHandler(handler)

def log_login_attempt(user, ip, success):
    clean_user = user.replace("\n", " ").replace("\r", "")
    if success:
        audit_log.info(f"Basarili giris: {clean_user} (IP: {ip})")
    else:
        audit_log.warning(f"BASARISIZ GIRIS DENEMESI: {clean_user} (IP: {ip})")

log_login_attempt("root", "192.168.1.100", False)
print(log_buffer.getvalue().strip())`,
        out: R`[WARNING] [AUDIT] BASARISIZ GIRIS DENEMESI: root (IP: 192.168.1.100)`,
        cyber: true,
        note: [
          "Başarısız oturum denemeleri `WARNING` seviyesinde loglanarak SIEM kurallarının otomatik Brute-Force alarmları üretmesi sağlanır.",
          "Failed authentication logs routed at WARNING severity trigger automatic rate-limiting and brute-force SIEM alerts."
        ]
      },
      {
        id: "rotating-file-concept",
        title: [
          "Dönen Dosya Yönlendiricisi (RotatingFileHandler)",
          "Disk Flood Prevention via Log Rotation"
        ],
        sum: [
          "Logların diski doldurup sistemi kilitlemesini önleyen boyut sınırlı loglama.",
          "Enforcing max file size thresholds to prevent denial-of-service disk saturation."
        ],
        code: R`from logging.handlers import RotatingFileHandler
import tempfile
import os

with tempfile.TemporaryDirectory() as td:
    lp = os.path.join(td, "servis.log")
    # Maksimum 1KB boyut, en fazla 3 yedek dosya ||| Max 1KB size, keep 3 backups
    rfh = RotatingFileHandler(lp, maxBytes=1024, backupCount=3)
    rfh.close()
    print("Rotating Handler hazir mi:", os.path.exists(lp))`,
        out: R`Rotating Handler hazir mi: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "print-vs-logging",
        q: [
          "Üretim ve güvenlik kodlarında neden `print()` yerine `logging` modülü kullanılmalıdır?",
          "Why should `logging` be used instead of `print()` in production security scripts?"
        ],
        a: [
          "`print()` yönlendirilemez, seviye filtresi (DEBUG/INFO/ERROR) yoktur ve tek satırda kapatılamaz. `logging` ise tek bir ayarla sessize alınabilir, dosyalara ve syslog sunucularına eşzamanlı yönlendirilebilir.",
          "`print()` lacks severity levels, filtering, and redirection. `logging` can be dynamically muted, enriched with timestamps, and routed to files and syslog."
        ]
      },
      {
        id: "crlf-log-injection",
        q: [
          "Siber güvenlikte 'Log Enjeksiyonu' (Log Forging / CRLF Injection) nedir?",
          "What is Log Forging / CRLF Injection?"
        ],
        a: [
          "Kullanıcı girdisindeki satır sonu (`\\r\\n`) karakterlerinin filtrelenmemesi sonucu, saldırganın log dosyasına sahte `[INFO] Admin giris yapti` gibi sahte log kayıtları ekleyerek güvenlik analistlerini yanıltmasıdır.",
          "Attacker injects newline characters (`\\r\\n`) into user input to generate fraudulent log lines, deceiving SIEM systems and forensic investigators."
        ]
      },
      {
        id: "logger-exception-advantage",
        q: [
          "`logger.error()` yerine `logger.exception()` kullanmanın avantajı nedir?",
          "What is the advantage of `logger.exception()` over `logger.error()`?"
        ],
        a: [
          "`logger.exception()` otomatik olarak o anki hatanın tam çağrı yığınını (call stack traceback) yakalayıp loga ekler; hatanın tam hangi satırda patladığını belgeler.",
          "`logger.exception()` automatically captures and appends the complete traceback stack trace to the log message."
        ]
      },
      {
        id: "default-log-level",
        q: [
          "Python `logging` modülünün varsayılan başlangıç seviyesi nedir?",
          "What is the default threshold severity level in Python's `logging` module?"
        ],
        a: [
          "`WARNING` seviyesidir. Yani `DEBUG` ve `INFO` mesajları siz `setLevel(logging.INFO)` demedikçe varsayılan olarak ekrana basılmaz.",
          "`WARNING` (30). `DEBUG` and `INFO` messages are muted by default unless the threshold is explicitly lowered."
        ]
      },
      {
        id: "never-log-secrets",
        q: [
          "Güvenlik denetimlerinde log dosyalarıyla ilgili en sık karşılaşılan 'Kritik Bilgi Sızıntısı' hatası nedir?",
          "What is the most frequent credential leakage flaw identified in log audits?"
        ],
        a: [
          "Kullanıcı parolalarının, API anahtarlarının veya session token'larının hata ayıklama (debug) amacıyla loglara açık metin olarak yazılmasıdır.",
          "Accidentally outputting raw passwords, session tokens, or private keys to log files during debugging routines."
        ]
      }
    ]
  });
})();

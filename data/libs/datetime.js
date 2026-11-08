(function () {
  const R = String.raw;
  PY.addLib({
    id: "datetime",
    name: "datetime",
    sym: "dt",
    color: "#059669",
    focus: "both",
    level: 1,
    ext: false,
    cat: "basics",
    docs: "https://docs.python.org/3/library/datetime.html",
    tagline: [
      "Tarih, saat ve süre aritmetiği: log ayrıştırma, zaman damgası analizi ve oturum süre sınırları.",
      "Date, time, and duration arithmetic: log parsing, timestamp analysis, and session expiration."
    ],
    analogy: [
      "`time` modülü zamanı sadece kayan bir saniye sayacı (1700000000 gibi tek bir float sayı) olarak görür. `datetime` ise o saniyeyi duvardaki takvim ve koldaki saate çevirir: Yıl, Ay, Gün, Saat, Dakika ve Saat Dilimi. İki tarih arasındaki gün farkını hesaplar ya da bir log kaydındaki `'10/Oct/2026:14:00:00'` metnini takvim nesnesine dönüştürür.",
      "`time` views time as a raw tick counter of seconds since 1970. `datetime` translates those ticks into calendar dates and wall clocks: Year, Month, Day, Hour, Minute, and Timezone offsets. It handles date differences and parses text timestamps from log files."
    ],
    intro: [
      [
        "`datetime` modülü, tarih ve saatleri nesne yönelimli olarak temsil etmek ve aralarında zaman aritmetiği (`timedelta`) yapabilmek için Python standart kütüphanesinin en temel bileşenidir.",
        "The `datetime` module supplies object-oriented classes to represent and compute dates, times, and duration intervals (`timedelta`) across Python applications."
      ],
      [
        "Siber güvenlikte olay müdahalesi (Incident Response), adli bilişim zaman çizelgesi (forensic timeline) çıkarma, web sunucu loglarını (`strptime`) ayrıştırma ve JWT oturumlarının zaman aşımını (`timedelta`) belirlemede vazgeçilmez bir araçtır.",
        "In cyber security and digital forensics, reconstructing breach timelines, parsing heterogeneous access logs via `strptime`, and governing token expirations depend directly on `datetime`."
      ]
    ],
    import: R`import datetime`,
    general: [
      ["Veritabanı kayıtlarının oluşturulma ve güncellenme tarihlerini yönetme.", "Tracking database record creation and modification timestamps."],
      ["Gelecek veya geçmiş bir tarihi hesaplama (`timedelta(days=30)`).", "Computing offset dates for subscription renewals or event triggers."],
      ["ISO-8601 standart tarih metinlerini JSON API'lerine dönüştürme.", "Serializing standardized ISO-8601 timestamps for API exchanges."]
    ],
    cyberUse: [
      ["Zaman çizelgesi (Timeline) analizi: Farklı sunuculardan toplanan Nginx, Syslog ve Windows Event loglarının zaman damgalarını tek bir UTC ekseninde birleştirme.", "Timeline forensics: normalizing heterogeneous log formats from Linux and Windows systems into a synchronized UTC continuum."],
      ["Oturum ve Token güvenliği: Parola sıfırlama linkleri veya JWT token'ları için kesin son kullanma tarihi (`now + timedelta(minutes=15)`) belirleme.", "Token lifecycle management: enforcing tight validity horizons on password resets and access tokens via `timedelta`."],
      ["Saat dilimi (Timezone) zaafiyetlerini önleme: Yerel saat farklarından doğan zaman kaymalarını engellemek için tüm güvenlik kayıtlarında `timezone.utc` kullanma.", "Eliminating timezone desynchronization by strictly adopting `timezone.utc` in audit logs."]
    ],
    sections: [
      {
        id: "core-classes",
        title: ["Temel Sınıflar ve Saat Dilimleri", "Core Classes & Timezones"],
        intro: [
          "`datetime`, `date`, `time` ve UTC saat dilimi yönetimi.",
          "Instantiating calendar moments and managing UTC offsets."
        ],
        items: [
          {
            id: "now",
            name: "datetime.now(tz=None)",
            kind: "function",
            sig: "datetime.datetime.now(tz: datetime.tzinfo = None) -> datetime",
            sum: [
              "Şu anki yerel veya saat dilimi duyarlı (aware) tarih ve saat nesnesini döner.",
              "Returns the current date and time, optionally bound to an explicit timezone."
            ],
            desc: [
              "`tz=datetime.timezone.utc` parametresi verilmezse 'naive' (saat dilimi bilinmeyen) bir nesne döner. Siber güvenlik loglamalarında zaman karmaşasını önlemek için daima açıkça UTC saat dilimi verilmelidir.",
              "Returns a 'naive' object unless `tz=datetime.timezone.utc` is specified. In security auditing, always supply explicit UTC timezone to prevent ambiguity."
            ],
            ex: {
              code: R`import datetime

simdi_utc = datetime.datetime.now(datetime.timezone.utc)
print(simdi_utc.tzname())
print(isinstance(simdi_utc.year, int))`,
              out: R`UTC
True`
            },
            cyber: [
              "Farklı coğrafyalardaki sunuculardan gelen loglar naive kaydedilirse delil analizinde olay sıralaması (causality) bozulur. Daima `now(timezone.utc)` kullanın.",
              "Naive timestamps collected across global infrastructure scramble event ordering; mandate `now(timezone.utc)` in all security logging."
            ]
          },
          {
            id: "timedelta",
            name: "datetime.timedelta(days=0, seconds=0, ...)",
            kind: "class",
            sig: "datetime.timedelta(days=0, seconds=0, microseconds=0, milliseconds=0, minutes=0, hours=0, weeks=0)",
            sum: [
              "İki zaman noktası arasındaki süreyi (farkı) temsil eden sınıf.",
              "Represents a duration or the difference between two date/time points."
            ],
            desc: [
              "Tarih aritmetiğinde kullanılır. Bir `datetime` nesnesine eklenip çıkarılabilir (`tarih + timedelta(hours=2)`). İki `datetime` nesnesi birbirinden çıkarıldığında sonuç otomatik olarak `timedelta` olur.",
              "Enables duration arithmetic. Adding or subtracting a timedelta yields a shifted datetime instance."
            ],
            ex: {
              code: R`import datetime

baslangic = datetime.datetime(2026, 1, 1, 12, 0)
bitis = baslangic + datetime.timedelta(hours=2, minutes=30)
fark = bitis - baslangic

print(fark.total_seconds())`,
              out: R`9000.0`
            }
          },
          {
            id: "date-class",
            name: "datetime.date(year, month, day)",
            kind: "class",
            sig: "datetime.date(year: int, month: int, day: int)",
            sum: [
              "Yıl, ay ve gün içeren saf takvim tarihi.",
              "Pure calendar date holding year, month, and day without time components."
            ],
            desc: [
              "Saat ve dakika içermeyen günlük periyotlar, sertifika geçerlilik günleri ve takvimsel sınırları ifade etmek için kullanılır.",
              "Represents date without wall clock time. Useful for certificate validity ranges and calendar boundaries."
            ],
            ex: {
              code: R`import datetime

bugun = datetime.date(2026, 5, 20)
print(bugun.isoformat())`,
              out: R`2026-05-20`
            }
          },
          {
            id: "timezone-utc",
            name: "datetime.timezone.utc",
            kind: "const",
            sig: "datetime.timezone.utc",
            sum: [
              "Standart Evrensel Saat (UTC) saat dilimi sabiti.",
              "Standard Universal Coordinated Time (UTC) timezone singleton."
            ],
            desc: [
              "Saat dilimi farkı sıfır olan UTC nesnesidir. Güvenlik olaylarında tek referans noktası olarak kabul edilir.",
              "Timezone offset zero UTC reference object. Serves as the universal ground truth across all cyber telemetry."
            ],
            ex: {
              code: R`import datetime

dt = datetime.datetime(2026, 1, 1, 0, 0, tzinfo=datetime.timezone.utc)
print(dt.isoformat())`,
              out: R`2026-01-01T00:00:00+00:00`
            }
          }
        ]
      },
      {
        id: "formatting-and-parsing",
        title: ["Biçimlendirme ve Ayrıştırma (Format & Parse)", "Formatting & Parsing"],
        intro: [
          "Log kayıtlarını okuma (`strptime`) ve standart formatlara dökme (`strftime`).",
          "Parsing unstructured log strings and formatting timestamps."
        ],
        items: [
          {
            id: "strptime",
            name: "datetime.strptime(date_string, format)",
            kind: "function",
            sig: "datetime.datetime.strptime(date_string: str, format: str) -> datetime",
            sum: [
              "Bir metin dizesini belirtilen biçim kuralına göre `datetime` nesnesine dönüştürür.",
              "Parses a string representing a time according to a format string."
            ],
            desc: [
              "'String Parse Time' anlamına gelir. Sunucu log dosyalarındaki (`10/May/2026:15:30:00`) metinsel tarihleri ayrıştırıp matematiksel sıralamaya sokabilmek için en kritik fonksiyondur.",
              "Stands for 'String Parse Time'. Indispensable for converting text log timestamps into queryable datetime objects."
            ],
            ex: {
              code: R`import datetime

log_tarihi = "2026-11-08 14:35:10"
dt = datetime.datetime.strptime(log_tarihi, "%Y-%m-%d %H:%M:%S")
print(dt.year, dt.minute)`,
              out: R`2026 35`
            },
            cyber: [
              "Syslog, Nginx ve firewall logları farklı tarih biçimleri kullanır. Her format için doğru `%` belirteçleri ile `strptime` şablonu hazırlanmalıdır.",
              "Security telemetry features varying datetime formats; craft explicit `%` specifiers to normalize logs into searchable objects."
            ]
          },
          {
            id: "strftime",
            name: "datetime.strftime(format)",
            kind: "method",
            sig: "dt.strftime(format: str) -> str",
            sum: [
              "`datetime` nesnesini belirtilen formata göre metin dizesine çevirir.",
              "Formats a datetime instance into an explicit string representation."
            ],
            desc: [
              "'String Format Time' anlamına gelir. Örneğin adli raporlarda tarihleri `2026/11/08 - 14:35` gibi şablonlara dökmek için kullanılır.",
              "Formats datetime objects into custom reporting strings using `%Y`, `%m`, `%d`, etc."
            ],
            ex: {
              code: R`import datetime

dt = datetime.datetime(2026, 3, 15, 9, 30, 0)
rapor_formati = dt.strftime("%d.%m.%Y - %H:%M")
print(rapor_formati)`,
              out: R`15.03.2026 - 09:30`
            }
          },
          {
            id: "fromtimestamp",
            name: "datetime.fromtimestamp(ts, tz=None)",
            kind: "function",
            sig: "datetime.datetime.fromtimestamp(ts: float, tz: datetime.tzinfo = None) -> datetime",
            sum: [
              "POSIX zaman damgasını (1970'ten geçen saniye) `datetime` nesnesine çevirir.",
              "Converts a POSIX timestamp (seconds since epoch) into a datetime instance."
            ],
            desc: [
              "Dosya sistemi inode zaman damgaları (`os.stat().st_mtime`), TCP paket başlıkları ve veritabanı epoch sayılarını okunabilir tarihe dönüştürür.",
              "Converts file modification epoch ticks and packet timestamps into human-readable datetime structures."
            ],
            ex: {
              code: R`import datetime

epoch_zamani = 1770000000.0
dt = datetime.datetime.fromtimestamp(epoch_zamani, tz=datetime.timezone.utc)
print(dt.strftime("%Y-%m-%d"))`,
              out: R`2026-02-02`
            }
          },
          {
            id: "isoformat",
            name: "datetime.isoformat(sep='T', timespec='auto')",
            kind: "method",
            sig: "dt.isoformat(sep: str = 'T', timespec: str = 'auto') -> str",
            sum: [
              "Tarih ve saati uluslararası standart ISO-8601 dizesine dönüştürür.",
              "Returns a string representing the date and time in ISO 8601 format."
            ],
            desc: [
              "`YYYY-MM-DDTHH:MM:SS` formatında evrensel bir çıktı üretir. SIEM sistemleri ve RESTful API'lerin veri paylaşımında endüstri standardıdır.",
              "Generates ISO-8601 compliant strings universally recognized by SIEM systems and JSON APIs."
            ],
            ex: {
              code: R`import datetime

dt = datetime.datetime(2026, 6, 1, 10, 0, 0, tzinfo=datetime.timezone.utc)
print(dt.isoformat())`,
              out: R`2026-06-01T10:00:00+00:00`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "web-log-timeline-parser",
        title: [
          "Nginx / Apache Web Log Zaman Çizelgesi Ayrıştırıcı",
          "Web Server Access Log Timeline Normalizer"
        ],
        sum: [
          "Web sunucu loglarındaki metin zaman damgalarını (`10/Oct/2026:13:55:36`) sıralı datetime nesnelerine çevirme.",
          "Parsing custom CLF access log timestamps into chronologically sorted forensic events."
        ],
        code: R`import datetime

# Tipik Apache/Nginx CLF log satirlari: ||| Typical Apache/Nginx CLF log entries:
log_satirlari = [
    '192.168.1.50 - - [10/Oct/2026:14:02:10 +0000] "GET /admin HTTP/1.1" 401',
    '192.168.1.50 - - [10/Oct/2026:14:00:05 +0000] "GET /login HTTP/1.1" 200',
    '192.168.1.50 - - [10/Oct/2026:14:05:00 +0000] "POST /admin/upload HTTP/1.1" 200',
]

def parse_clf_date(log_line: str) -> datetime.datetime:
    # Koseli parantez icindeki zaman damgasini cikar: ||| Extract timestamp inside brackets:
    raw_date = log_line.split("[")[1].split("]")[0]
    # Biçim: 10/Oct/2026:14:02:10 +0000 ||| Format specifier:
    return datetime.datetime.strptime(raw_date, "%d/%b/%Y:%H:%M:%S %z")

olaylar = [parse_clf_date(satir) for satir in log_satirlari]
# Kronolojik olarak sirala: ||| Sort chronologically:
olaylar.sort()

print("Ilk giris saati:", olaylar[0].strftime("%H:%M:%S"))
print("Son olay saati:", olaylar[-1].strftime("%H:%M:%S"))
print("Saldiri suresi (saniye):", (olaylar[-1] - olaylar[0]).total_seconds())`,
        out: R`Ilk giris saati: 14:00:05
Son olay saati: 14:05:00
Saldiri suresi (saniye): 295.0`,
        cyber: true,
        note: [
          "Farklı log dosyalarındaki olayları karşılaştırırken `%z` belirteci ile saat dilimi farkını okumak çok önemlidir; aksi halde farklı ülkelerdeki sunucuların olay sıralaması hatalı görünür.",
          "Using `%z` in strptime captures the UTC offset directly, guaranteeing valid sequencing across distributed servers."
        ]
      },
      {
        id: "session-token-expiration-guard",
        title: [
          "Zaman Aşımı Korumalı Oturum Belirteci Yöneticisi",
          "Session Token Expiration & Anti-Replay Guard"
        ],
        sum: [
          "Oturum ve güvenlik token'ları için kesin son kullanma süresi (`timedelta`) ve zaman aşımı kontrolü.",
          "Managing session token lifecycles and validating expiration boundaries with timedelta."
        ],
        code: R`import datetime

def create_session(user_id: str, lifetime_minutes: int = 15) -> dict:
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    return {
        "user_id": user_id,
        "created_at": now_utc,
        "expires_at": now_utc + datetime.timedelta(minutes=lifetime_minutes)
    }

def is_session_valid(session: dict) -> bool:
    current_time = datetime.datetime.now(datetime.timezone.utc)
    # Su anki saat son kullanma saatini gecmis mi? ||| Has current time exceeded expiry?
    return current_time < session["expires_at"]

sess = create_session("analyst_01", lifetime_minutes=30)
print("Yeni oturum gecerli mi:", is_session_valid(sess))

# Gecmiste kalmis bir oturum simule edelim: ||| Simulate an expired session:
expired_sess = {
    "user_id": "analyst_01",
    "expires_at": datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(seconds=1)
}
print("Suresi dolmus oturum engellendi mi:", not is_session_valid(expired_sess))`,
        out: R`Yeni oturum gecerli mi: True
Suresi dolmus oturum engellendi mi: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "strptime-vs-strftime",
        q: [
          "`strptime` ile `strftime` arasındaki fark nedir, nasıl ayırt edilir?",
          "What is the difference between `strptime` and `strftime`?"
        ],
        a: [
          "`strptime` (parse): Metin dizesini okuyup `datetime` nesnesine çevirir (String -> Object). `strftime` (format): `datetime` nesnesini belirtilen şablona göre metne dönüştürür (Object -> String). 'p' parse, 'f' format demektir.",
          "`strptime` parses a text string into a datetime object (String -> Object). `strftime` formats a datetime object into a formatted string (Object -> String). 'p' stands for Parse, 'f' stands for Format."
        ]
      },
      {
        id: "naive-vs-aware-datetime",
        q: [
          "'Naive' datetime ile 'Aware' datetime arasındaki fark nedir ve güvenlikte hangisi kullanılmalıdır?",
          "What is the difference between naive and aware datetime objects, and which should be used in security?"
        ],
        a: [
          "Naive nesneler saat dilimi (`tzinfo`) bilgisi taşımaz; yerel saatin neye göre olduğunu bilmez. Aware nesneler ise açık bir saat dilimine (örn. `timezone.utc`) bağlıdır. Güvenlik analizinde log karışıklığını önlemek için daima Aware ve UTC kullanılmalıdır.",
          "Naive datetimes omit timezone (`tzinfo`) data, leading to ambiguity. Aware datetimes explicitly define their offset (e.g. `timezone.utc`). Security systems mandate aware UTC datetimes to prevent timeline distortion."
        ]
      },
      {
        id: "timedelta-total-seconds",
        q: [
          "İki `datetime` nesnesi arasındaki fark saniye cinsinden en doğru şekilde nasıl alınır?",
          "How do you accurately retrieve the duration between two datetime objects in seconds?"
        ],
        a: [
          "`(bitis - baslangic).total_seconds()` metodu çağrılarak. Doğrudan `.seconds` özelliğine bakmak mikro saniyeleri veya günleri hesaba katmayabilir; `.total_seconds()` ise tüm süreyi `float` saniye olarak döner.",
          "Invoke `(end - start).total_seconds()`. Directly accessing the `.seconds` attribute ignores elapsed days; `total_seconds()` yields the complete duration in floating-point seconds."
        ]
      },
      {
        id: "isoformat-standard",
        q: [
          "`isoformat()` çıktısının siber güvenlik sistemleri ve SIEM'ler için önemi nedir?",
          "Why is `isoformat()` critical for cyber security platforms and SIEM pipelines?"
        ],
        a: [
          "ISO-8601 formatı (`YYYY-MM-DDTHH:MM:SSZ`), tüm dünyada ve programlama dillerinde standart kabul edilen sıralanabilir ve hatasız ayrıştırılabilir evrensel zaman temsilidir.",
          "ISO-8601 (`YYYY-MM-DDTHH:MM:SSZ`) is the universal, lexically sortable, and unambiguous timestamp standard shared across diverse SIEM aggregators and APIs."
        ]
      },
      {
        id: "posix-epoch-conversion",
        q: [
          "1970'ten bu yana geçen saniye cinsindeki Unix epoch zaman damgası `datetime` nesnesine nasıl dönüştürülür?",
          "How is a Unix epoch timestamp (seconds since 1970) converted into a `datetime` object?"
        ],
        a: [
          "`datetime.datetime.fromtimestamp(epoch_degeri, tz=datetime.timezone.utc)` fonksiyonu kullanılarak.",
          "By invoking `datetime.datetime.fromtimestamp(epoch_value, tz=datetime.timezone.utc)`."
        ]
      }
    ]
  });
})();


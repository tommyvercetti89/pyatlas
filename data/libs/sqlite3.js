(function () {
  const R = String.raw;
  PY.addLib({
    id: "sqlite3",
    name: "sqlite3",
    sym: "sql",
    color: "#3b82f6",
    focus: "both",
    level: 2,
    ext: false,
    cat: "data",
    docs: "https://docs.python.org/3/library/sqlite3.html",
    tagline: [
      "Gömülü ilişkisel veri tabanı: Tarama sonuçlarını saklama ve SQL Enjeksiyonu (SQLi) savunması.",
      "Embedded relational database: Storing scan telemetry and defending against SQL Injection."
    ],
    analogy: [
      "Ayrı bir sunucu kurup yapılandırmak zorunda kaldığın devasa bir veri tabanı (PostgreSQL / MySQL) yerine, tek bir dosyanın içinde (veya doğrudan RAM bellekte `:memory:`) yaşayan minyatür ama tam donanımlı bir SQL motorudur. Kurulum istemez; doğrudan Python'un içinden çalışır.",
      "Instead of deploying and managing a bulky external database server, SQLite lives entirely inside a single disk file or RAM (`:memory:`). A serverless, zero-configuration SQL engine built right into standard Python."
    ],
    intro: [
      [
        "`sqlite3` modülü, hafif, disk tabanlı ve ACID uyumlu bir ilişkisel veri tabanı motorudur. Ayrı bir veritabanı sunucusu süreci gerektirmez; verileri doğrudan yerel dosyalarda saklar.",
        "The `sqlite3` module provides an ACID-compliant embedded relational database, requiring no dedicated server daemon and persisting tables into single-file storage."
      ],
      [
        "Siber güvenlikte iki temel alanda kritiktir: birincisi, güvenlik araçlarınızın bulgularını (taranan portlar, bulunan zaafiyetler) yerel bir veri tabanında düzenli saklamak; ikincisi ise en tehlikeli web zaafiyetlerinden olan 'SQL Enjeksiyonu'nu (SQL Injection) parametreli sorgularla (`?`) nasıl engelleyeceğinizi tam olarak kavramaktır.",
        "Vital in cybersecurity for two main reasons: organizing security scanner findings locally, and mastering parameterized query defense (`?`) to neutralize SQL Injection vulnerabilities."
      ]
    ],
    import: R`import sqlite3`,
    general: [
      [
        "Masaüstü uygulamaları ve küçük-orta ölçekli web servisleri için yerel veri tabanı oluşturmak.",
        "Managing local persistent storage for desktop and standalone tools."
      ],
      [
        "Birim testlerde hızlı ve izole veri tabanı ortamları için bellekte (`:memory:`) çalışmak.",
        "Spinning up ultra-fast ephemeral in-memory databases (`:memory:`) for automated testing."
      ],
      [
        "Büyük CSV veya log verilerini SQL tablolarına aktarıp `SELECT ... GROUP BY` ile sorgulamak.",
        "Ingesting raw telemetry into relational tables for flexible SQL aggregations."
      ]
    ],
    cyberUse: [
      [
        "SQL Enjeksiyonu (SQLi) Önleme: Dize birleştirme (`f'SELECT ... WHERE id={id}'`) yerine güvenli parametreli sorgular (`cursor.execute(sql, (id,))`) kullanmak.",
        "Eradicating SQL Injection by enforcing parameterized placeholders (`?`) over string interpolation."
      ],
      [
        "Güvenlik tarayıcısı sonuçlarını (açık portlar, servisler, sertifika tarihleri) yerel veritabanında saklayıp zaman içindeki değişimleri (Diff) izlemek.",
        "Storing historical network scan baselines to highlight newly exposed attack surfaces."
      ],
      [
        "Tehdit göstergelerini (IOC - IP/Domain/Hash kara listesi) indeksleyip saniyede binlerce log satırına karşı hızlıca eşleştirmek.",
        "Indexing threat intelligence feeds locally to correlate millions of log entries efficiently."
      ]
    ],
    sections: [
      {
        id: "connection-cursor",
        title: ["Bağlantı ve İmleç (Connection & Cursor)", "Connection & Cursor"],
        intro: [
          "Veri tabanını açma, imleç oluşturma ve SQL komutlarını yürütme.",
          "Opening database connections, managing cursors, and executing statements."
        ],
        items: [
          {
            id: "connect",
            name: "sqlite3.connect(database)",
            kind: "function",
            sig: "sqlite3.connect(database, timeout=5.0, ...) -> Connection",
            sum: [
              "SQLite veri tabanına bağlanır veya diskte yoksa yeni bir dosya oluşturur.",
              "Opens a connection to the SQLite database file or initializes an in-memory database."
            ],
            desc: [
              "Dosya yolu olarak `':memory:'` verilirse veritabanı tamamen RAM üzerinde oluşturulur ve Python scripti kapandığında silinir. Testler ve geçici analizler için mükemmeldir.",
              "Passing `':memory:'` creates a lightning-fast ephemeral database in RAM. Closing the connection discards all data automatically."
            ],
            params: [
              { n: "database", d: ["Dosya yolu dizesi veya bellekte çalıştırmak için `':memory:'`.", "File path string or `':memory:'` for in-memory database."] }
            ],
            ret: ["`sqlite3.Connection` nesnesi.", "`sqlite3.Connection` instance."],
            ex: {
              code: R`import sqlite3

conn = sqlite3.connect(":memory:")
print(isinstance(conn, sqlite3.Connection))
conn.close()`,
              out: R`True`
            }
          },
          {
            id: "cursor",
            name: "conn.cursor()",
            kind: "method",
            sig: "conn.cursor() -> Cursor",
            sum: [
              "SQL komutlarını çalıştırmak ve sonuçları çekmek için bir imleç (Cursor) oluşturur.",
              "Creates a Cursor object used to execute SQL statements and fetch results."
            ],
            desc: [
              "Veri tabanı üzerinde sorguları yürüten ve dönen satırları adım adım gezen işaretçidir.",
              "A traversal pointer managing SQL query state, parameters, and row retrieval."
            ],
            ret: ["`sqlite3.Cursor` nesnesi.", "`sqlite3.Cursor` object."],
            ex: {
              code: R`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
print(isinstance(cur, sqlite3.Cursor))
conn.close()`,
              out: R`True`
            }
          },
          {
            id: "execute",
            name: "cur.execute(sql, parameters)",
            kind: "method",
            sig: "cur.execute(sql, parameters=()) -> Cursor",
            sum: [
              "Tek bir SQL komutunu güvenli parametre desteğiyle çalıştırır.",
              "Executes a single SQL statement, safely binding optional parameters."
            ],
            desc: [
              "Sorgu içindeki `?` işaretleri yerine `parameters` demetindeki değerleri güvenle yerleştirir. SQL enjeksiyonunu önlemenin standart yoludur.",
              "Substitutes `?` placeholders with values from `parameters`. Prevents SQL injection by treating input strictly as literals rather than SQL syntax."
            ],
            params: [
              { n: "sql", d: ["Çalıştırılacak SQL komutu dizesi.", "SQL statement string."] },
              { n: "parameters", d: ["`?` yerine geçecek değerler demeti (`tuple`) veya listesi.", "Tuple or sequence of parameter values."] }
            ],
            ex: {
              code: R`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE scan (ip TEXT, port INT)")
cur.execute("INSERT INTO scan VALUES (?, ?)", ("192.168.1.1", 80))
conn.commit()

cur.execute("SELECT * FROM scan")
print(cur.fetchone())
conn.close()`,
              out: R`('192.168.1.1', 80)`
            },
            cyber: [
              "ASLA `cur.execute(f'SELECT * FROM users WHERE name={name}')` şeklinde f-string veya dize birleştirme yapmayın. Saldırgan `name = \"' OR '1'='1\"` girdiğinde tüm tabloyu sızdırabilir.",
              "Never format raw inputs directly into SQL strings. Always bind variables via parameterized `?` placeholders."
            ]
          },
          {
            id: "executemany",
            name: "cur.executemany(sql, seq_of_parameters)",
            kind: "method",
            sig: "cur.executemany(sql, seq_of_parameters) -> Cursor",
            sum: [
              "Aynı SQL komutunu bir liste dolusu veri için topluca (batch) hızlıca çalıştırır.",
              "Repeats execution of parameterized SQL statement against an iterable of records."
            ],
            desc: [
              "Binlerce log satırını veya tarama sonucunu tek tek `execute` etmek yerine topluca ekleyerek performansı katbekat artırır.",
              "High-performance batch insertion for bulk database operations."
            ],
            ex: {
              code: R`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE ports (p INT)")

port_list = [(22,), (80,), (443,)]
cur.executemany("INSERT INTO ports VALUES (?)", port_list)
conn.commit()

cur.execute("SELECT COUNT(*) FROM ports")
print(cur.fetchone()[0])
conn.close()`,
              out: R`3`
            }
          }
        ]
      },
      {
        id: "fetching-and-rows",
        title: ["Veri Çekme ve Satır Erişimi", "Fetching Results & Row Factory"],
        intro: [
          "Sorgu sonuçlarını okuma (`fetchone`, `fetchall`) ve sütunlara adıyla erişme.",
          "Retrieving result sets and accessing column fields by dictionary key."
        ],
        items: [
          {
            id: "fetchone-fetchall",
            name: "cur.fetchone() / fetchall()",
            kind: "method",
            sig: "cur.fetchone() -> tuple | None, cur.fetchall() -> list[tuple]",
            sum: [
              "Sorgu sonucundan tek bir satır veya kalan tüm satırları çeker.",
              "Fetches the next individual row or all remaining rows of a query result."
            ],
            desc: [
              "`fetchone()` bir sonraki satırı demet olarak döner; kayıt kalmadıysa `None` döner. `fetchall()` kalan tüm satırları bir liste olarak döner.",
              "`fetchone()` returns the next row tuple or `None`. `fetchall()` returns a list of all remaining result tuples."
            ],
            ex: {
              code: R`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE t (x INT)")
cur.executemany("INSERT INTO t VALUES (?)", [(10,), (20,)])

cur.execute("SELECT x FROM t ORDER BY x")
print("Ilk:", cur.fetchone()[0])
print("Kalanlar:", cur.fetchall())
conn.close()`,
              out: R`Ilk: 10
Kalanlar: [(20,)]`
            }
          },
          {
            id: "row-factory",
            name: "conn.row_factory = sqlite3.Row",
            kind: "attr",
            sig: "conn.row_factory = sqlite3.Row",
            sum: [
              "Sonuç satırlarına sözlük gibi sütun adıyla (`row['kolon']`) erişilmesini sağlar.",
              "Configures cursor to return dictionary-accessible Row objects."
            ],
            desc: [
              "Varsayılan olarak satırlar isimsiz demetler (`row[0]`) olarak döner. `sqlite3.Row` atandığında `row['ip']` veya `row['port']` şeklinde hem isimle hem indeksle erişim sağlanır.",
              "Enables accessing fields by column name (e.g. `row['ip']`) as well as numeric index, drastically boosting code readability."
            ],
            ex: {
              code: R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
cur = conn.cursor()
cur.execute("CREATE TABLE hosts (ip TEXT, status TEXT)")
cur.execute("INSERT INTO hosts VALUES (?, ?)", ("10.0.0.1", "UP"))

cur.execute("SELECT * FROM hosts")
row = cur.fetchone()
print(row["ip"], row["status"])
conn.close()`,
              out: R`10.0.0.1 UP`
            }
          },
          {
            id: "context-manager",
            name: "with conn: (Otomatik Transaction / Commit)",
            kind: "concept",
            sig: "with conn: cur.execute(...)",
            sum: [
              "İşlemler başarılıysa otomatik `commit` eder, hata çıkarsa otomatik `rollback` yapar.",
              "Automatically commits transactions on success or rolls back on exception."
            ],
            desc: [
              "Bağlantıyı `with conn:` bloğunda kullandığınızda manuel `conn.commit()` çağırmanıza gerek kalmaz. Blok içinde bir hata fırlatılırsa tüm işlemler otomatik olarak geri alınır (rollback).",
              "Ensures transactional integrity: changes are committed atomically, or rolled back if an unhandled exception occurs."
            ],
            ex: {
              code: R`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE logs (msg TEXT)")

# with blogu icinde guvenli transaction ||| Transactional context
with conn:
    cur.execute("INSERT INTO logs VALUES (?)", ("SISTEM_BASLADI",))

cur.execute("SELECT msg FROM logs")
print(cur.fetchone()[0])
conn.close()`,
              out: R`SISTEM_BASLADI`
            }
          },
          {
            id: "sqli-prevention",
            name: "Güvenlik: Parametreli Sorgu vs SQL Enjeksiyonu",
            kind: "concept",
            sig: "cur.execute('... ?', (val,)) vs f'... {val}'",
            sum: [
              "SQL Enjeksiyonu (SQLi) zaafiyetinin mekanizması ve parametre bağlama kuralı.",
              "Mechanics of SQL Injection vulnerabilities and parameterized defense."
            ],
            desc: [
              "Dize birleştirme yapıldığında kullanıcı girdisi doğrudan SQL motoru tarafından komut olarak çalıştırılır. Parametreli sorguda ise veritabanı motoru girdiyi asla kod olarak yorumlamaz; sadece düz bir değer (literal) olarak kabul eder.",
              "String concatenation allows malicious syntax to be executed as SQL commands. Parameterized queries bind user values strictly as data literals."
            ],
            ex: {
              code: R`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()
cur.execute("CREATE TABLE users (user TEXT, pass TEXT)")
cur.execute("INSERT INTO users VALUES ('admin', 'Gizli123')")

# Saldirganin SQLi denemesi ||| SQLi attack payload
saldirgan_girdisi = "admin' OR '1'='1"

# Guvenli parametreli sorgu ||| Safe parameterized query
cur.execute("SELECT * FROM users WHERE user = ?", (saldirgan_girdisi,))
print("Guvenli sorgu sonucu:", cur.fetchall())  # Hicbir sey bulamaz (Guvende) ||| Finds nothing (Safe)
conn.close()`,
              out: R`Guvenli sorgu sonucu: []`
            },
            cyber: [
              "OWASP Top 10'un en klasik zaafiyetlerinden biri olan SQL Injection'ın kesin ve tartışmasız tek çözümü parametreli sorgulardır.",
              "Parameterized queries are the definitive, mathematically sound defense against SQL Injection across all databases."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "vulnerability-store",
        title: [
          "Yerel Zaafiyet ve Port Tarama Veri Tabanı",
          "Local Vulnerability & Port Scanner Store"
        ],
        sum: [
          "Tarama sonuçlarını SQLite tablosuna kaydedip açık portları sorgulama.",
          "Persisting network reconnaissance discoveries and running audit queries."
        ],
        code: R`import sqlite3

conn = sqlite3.connect(":memory:")
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# Tablolari olustur ||| Initialize schema
cur.execute("""
CREATE TABLE scan_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    host TEXT NOT NULL,
    port INTEGER NOT NULL,
    service TEXT,
    state TEXT
)
""")

# Tarama bulgularini kaydet ||| Insert scan findings
findings = [
    ("192.168.1.1", 22, "OpenSSH", "OPEN"),
    ("192.168.1.1", 80, "Nginx", "OPEN"),
    ("192.168.1.5", 445, "SMB", "FILTERED")
]
cur.executemany("INSERT INTO scan_results (host, port, service, state) VALUES (?, ?, ?, ?)", findings)
conn.commit()

# Yalnizca acik (OPEN) servisleri listele ||| Query open services
cur.execute("SELECT host, port, service FROM scan_results WHERE state = 'OPEN'")
for row in cur.fetchall():
    print(f"Acik Servis: {row['host']}:{row['port']} ({row['service']})")

conn.close()`,
        out: R`Acik Servis: 192.168.1.1:22 (OpenSSH)
Acik Servis: 192.168.1.1:80 (Nginx)`,
        cyber: true,
        note: [
          "Güvenlik ekipleri periyodik taramaların sonuçlarını bu şekilde saklayarak ağa sonradan eklenen şüpheli portları anında tespit eder.",
          "Security teams persist periodic scan baselines locally to spot newly opened ports."
        ]
      },
      {
        id: "threat-intel-ioc-checker",
        title: [
          "Tehdit İstihbaratı (IOC) Kara Liste Eşleştirici",
          "Threat Intelligence IOC Fast Matcher"
        ],
        sum: [
          "Zararlı IP adreslerini SQLite üzerinde indeksleyip log kayıtlarını hızla teyit etme.",
          "Indexing malicious IOCs with SQL indexes to cross-reference event logs instantly."
        ],
        code: R`import sqlite3

conn = sqlite3.connect(":memory:")
cur = conn.cursor()

cur.execute("CREATE TABLE blacklisted_ips (ip TEXT PRIMARY KEY, reason TEXT)")
cur.execute("CREATE INDEX idx_ip ON blacklisted_ips(ip)")

# Bilinen zararli IP'leri ekle ||| Ingest threat intel IOCs
iocs = [
    ("198.51.100.4", "C2 Sunucusu"),
    ("203.0.113.88", "Brute Force Kaynagi")
]
cur.executemany("INSERT INTO blacklisted_ips VALUES (?, ?)", iocs)
conn.commit()

# Gelen supheli log IP'sini sorgula ||| Check incoming log IP
gelen_ip = "198.51.100.4"
cur.execute("SELECT reason FROM blacklisted_ips WHERE ip = ?", (gelen_ip,))
res = cur.fetchone()

if res:
    print(f"TEHDIT TESPIT EDILDI: {gelen_ip} -> {res[0]}")
else:
    print("Temiz IP")

conn.close()`,
        out: R`TEHDIT TESPIT EDILDI: 198.51.100.4 -> C2 Sunucusu`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "how-sqli-prevented",
        q: [
          "SQLite'ta SQL Enjeksiyonu zaafiyetini tamamen önlemenin kuralı nedir?",
          "What is the absolute rule to eradicate SQL Injection in SQLite?"
        ],
        a: [
          "Kullanıcı girdilerini asla f-string veya dize birleştirme (`+`) ile sorguya yapıştırmamak; daima `?` yer tutucuları ve parametre demeti (`(deger,)`) kullanmaktır.",
          "Never interpolate user variables via string formatting. Always bind variables strictly using `?` placeholders and parameter tuples."
        ]
      },
      {
        id: "memory-database-advantage",
        q: [
          "`sqlite3.connect(':memory:')` kullanmanın avantajı nedir?",
          "What is the advantage of `sqlite3.connect(':memory:')`?"
        ],
        a: [
          "Veritabanını disk yerine tamamen RAM bellekte açar. Diske dosya yazmadığı için son derece hızlıdır ve script kapandığında arkasında hiçbir geçici kalıntı bırakmaz.",
          "Instantiates the database entirely in RAM with zero disk I/O. Incredibly fast and automatically leaves zero artifacts upon script termination."
        ]
      },
      {
        id: "row-factory-benefit",
        q: [
          "`conn.row_factory = sqlite3.Row` ataması ne kazandırır?",
          "What does setting `conn.row_factory = sqlite3.Row` achieve?"
        ],
        a: [
          "Dönen satırların sütunlarına `row[0]` gibi belirsiz indeksler yerine `row['port']` veya `row['ip']` şeklinde sütun adıyla sözlük gibi erişilmesini sağlar.",
          "Allows accessing result row columns by name (e.g. `row['ip']`) as well as index, greatly improving readability."
        ]
      },
      {
        id: "commit-necessity",
        q: [
          "`INSERT` veya `UPDATE` işlemlerinden sonra neden `conn.commit()` çağrılmalıdır?",
          "Why must `conn.commit()` be called after `INSERT` or `UPDATE` operations?"
        ],
        a: [
          "SQLite varsayılan olarak bir transaction açar. `commit()` çağrılmazsa veya `with conn:` bloğu kullanılmazsa yapılan değişiklikler kalıcı olarak diske kaydedilmez ve kaybolur.",
          "SQLite manages operations inside transactions. Changes remain uncommitted and disappear upon exit unless committed explicitly or wrapped in `with conn:`."
        ]
      },
      {
        id: "executemany-benefit",
        q: [
          "Neden döngüde yüzlerce kez `execute()` çağırmak yerine `executemany()` tercih edilmelidir?",
          "Why prefer `executemany()` over calling `execute()` inside a loop hundreds of times?"
        ],
        a: [
          "`executemany()` SQL sorgusunu tek bir işlem olarak derler ve tüm verileri topluca (batch) kaydeder; disk ve transaction maliyetini düşürerek devasa bir hız artışı sağlar.",
          "`executemany()` prepares the query once and applies the batch within an optimized transaction, vastly outperforming iterative single executions."
        ]
      }
    ]
  });
})();


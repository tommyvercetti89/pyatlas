(function () {
  const R = String.raw;
  PY.addLib({
    id: "re",
    name: "re",
    sym: "re",
    color: "#ec4899",
    focus: "both",
    level: 2,
    ext: false,
    cat: "text",
    docs: "https://docs.python.org/3/library/re.html",
    tagline: [
      "Düzenli ifadeler (Regex): Günlük (log) analizi, IP/hash ayıklama ve metin filtreleme.",
      "Regular expressions engine: Security log parsing, IOC extraction, and text sanitation."
    ],
    analogy: [
      "Bir okyanusta belirli bir balığı aramak yerine özel şekilli bir balık ağı örmek gibidir. Ağa 'üç basamaklı sayı, sonra nokta, sonra yine sayı' dersin (`\\d{1,3}\\.\\d{1,3}...`). Ağ devasa bir sunucu log dosyasının içinden sadece istediğin IP adreslerini veya hash dizelerini tek hamlede çekip çıkarır.",
      "Instead of inspecting text word-by-word, you weave a pattern-matching filter net. You define rules like 'digits, dot, digits' (`\\d+\\.\\d+...`), and dragging the pattern through gigabytes of raw logs cleanly nets every matching IP address or hash."
    ],
    intro: [
      [
        "`re` modülü, Perl uyumlu düzenli ifadeler (PCRE) motorunu Python'a getirir. Metinler içinde karmaşık kalıpları arama, eşleştirme, gruplama ve değiştirme operasyonlarını yüksek C hızında yürütür.",
        "The `re` module delivers a Perl-compatible regular expression engine to Python, evaluating complex text pattern matching, extraction, and substitution at C speed."
      ],
      [
        "Siber güvenlik operasyonlarında ve SOC (Güvenlik Operasyon Merkezi) analistliğinde regex temel yetenektir: Güvenlik Duvarı (Firewall), Web Sunucusu (Nginx/Apache) ve Windows Olay Günlüklerinden (Event Logs) IP adreslerini, kullanıcı adlarını, zaafiyet tarama imzalarını ve zararlı yazılım hash'lerini ayıklamak regex ile yapılır.",
        "In cyber defense and SOC analysis, regex is indispensable: parsing Firewall/Nginx/Windows logs, carving out IOCs (IPs, domains, hashes), and crafting intrusion detection rules."
      ]
    ],
    import: R`import re`,
    general: [
      [
        "Metin belgeleri ve büyük veri kümelerinde gelişmiş arama ve veri ayıklama.",
        "Performing advanced pattern queries across unstructured text corpora."
      ],
      [
        "Kullanıcı form girdilerini (e-posta, telefon numarası) biçim doğrulamasına tabi tutmak.",
        "Validating user input syntax such as emails and phone numbers."
      ],
      [
        "Metin şablonlarında belirli kalıpları dinamik olarak değiştirmek (`re.sub`).",
        "Executing sophisticated search-and-replace transformations using regex groups."
      ]
    ],
    cyberUse: [
      [
        "Sunucu loglarından şüpheli IP adreslerini, başarısız giriş denemelerini ve SQL enjeksiyon kalıplarını ayıklamak.",
        "Extracting suspicious source IPs, failed login alerts, and SQLi attack strings from raw logs."
      ],
      [
        "Tehdit İstihbaratında (Threat Intel) tehdit göstergelerini (IOC: IP, Domain, MD5/SHA256) otomatik tespit etmek.",
        "Automating extraction of Indicators of Compromise (IOCs) from intelligence feeds."
      ],
      [
        "ReDoS (Regular Expression Denial of Service) zaafiyetlerini anlamak ve katastrofik geri izleme (catastrophic backtracking) oluşturan kalıplardan kaçınmak.",
        "Detecting and defending against ReDoS vulnerabilities stemming from catastrophic backtracking."
      ]
    ],
    sections: [
      {
        id: "core-functions",
        title: ["Arama ve Eşleme Fonksiyonları", "Search & Matching Functions"],
        intro: [
          "Metin içinde desen aramak için kullanılan en temel modül fonksiyonları.",
          "Core module-level functions for searching and matching patterns."
        ],
        items: [
          {
            id: "search",
            name: "re.search(pattern, string)",
            kind: "function",
            sig: "re.search(pattern, string, flags=0) -> Match | None",
            sum: [
              "Metnin HERHANGİ bir yerinde desene uyan ilk eşleşmeyi arar.",
              "Scans through string looking for the first location where pattern produces a match."
            ],
            desc: [
              "`match()` fonksiyonundan farklı olarak metnin en başından başlamak zorunda değildir; tüm metni tarar. İlk eşleşmeyi bulduğunda bir `Match` nesnesi döner; bulamazsa `None` döner.",
              "Scans across the entire text, unlike `match()` which only checks the beginning. Returns a `Match` instance if found, or `None` if no match occurs."
            ],
            params: [
              { n: "pattern", d: ["Düzenli ifade kalıbı (genelde `r'...'` ham dize olarak verilir).", "Regular expression pattern string (preferably raw string `r'...'`)."] },
              { n: "string", d: ["İçinde arama yapılacak hedef metin.", "Target text to inspect."] }
            ],
            ret: ["Eşleşme varsa `re.Match` nesnesi, yoksa `None`.", "`re.Match` object on success, or `None`."],
            ex: {
              code: R`import re

log = "Failed password for admin from 192.168.1.105 port 22"
m = re.search(r"\d+\.\d+\.\d+\.\d+", log)
print(m.group() if m else "Yok")`,
              out: R`192.168.1.105`
            },
            cyber: [
              "Log analizinde tek satırlık bir alarm mesajından hedef veya kaynak IP'yi çekmek için en pratik yöntem `re.search`tir.",
              "The most common way to isolate source IP addresses from individual security alert lines."
            ]
          },
          {
            id: "findall",
            name: "re.findall(pattern, string)",
            kind: "function",
            sig: "re.findall(pattern, string, flags=0) -> list[str] | list[tuple]",
            sum: [
              "Metindeki çakışmayan TÜM eşleşmeleri bir liste olarak döner.",
              "Returns a list of all non-overlapping matches in the string."
            ],
            desc: [
              "Tek bir eşleşmeyle durmaz; tüm metni baştan sona tarayıp uyan tüm sonuçları string listesi olarak döner. Eşleşme yoksa boş liste (`[]`) döner.",
              "Finds every occurrence throughout the text, returning them as a list of strings (or tuples if groups are defined). Returns `[]` if none match."
            ],
            ex: {
              code: R`import re

text = "Bagli IP'ler: 10.0.0.1, 10.0.0.5 ve 192.168.1.1"
ips = re.findall(r"\b\d{1,3}(?:\.\d{1,3}){3}\b", text)
print(ips)`,
              out: R`['10.0.0.1', '10.0.0.5', '192.168.1.1']`
            }
          },
          {
            id: "finditer",
            name: "re.finditer(pattern, string)",
            kind: "function",
            sig: "re.finditer(pattern, string, flags=0) -> Iterator[Match]",
            sum: [
              "Tüm eşleşmeleri Match nesneleri üreten bir jeneratör (iterator) olarak döner.",
              "Returns an iterator yielding Match objects over all non-overlapping matches."
            ],
            desc: [
              "`findall()` sadece metinleri dönerken, `finditer()` her eşleşmenin metindeki tam başlangıç ve bitiş konumlarını (`m.start()`, `m.end()`) da öğrenmenizi sağlar. Büyük log dosyalarında belleği korur.",
              "Yields full `Match` objects including span offsets (`start`, `end`). Ideal for streaming through huge files without allocating large lists."
            ],
            ex: {
              code: R`import re

data = "ERR_404 at 10, ERR_500 at 50"
for m in re.finditer(r"ERR_\d+", data):
    print(m.group(), m.span())`,
              out: R`ERR_404 (0, 7)
ERR_500 (15, 22)`
            }
          },
          {
            id: "sub",
            name: "re.sub(pattern, repl, string)",
            kind: "function",
            sig: "re.sub(pattern, repl, string, count=0, flags=0) -> str",
            sum: [
              "Desene uyan yerleri belirtilen yeni metinle değiştirir (Sanitization / Maskeleme).",
              "Substitutes occurrences of pattern with replacement string or function."
            ],
            desc: [
              "Metindeki hassas verileri maskelemek (örn: kredi kartı veya parola gizleme) ya da metin temizlemek için kullanılır. `repl` parametresine bir fonksiyon da verilebilir.",
              "Replaces matching substrings with `repl`. Used extensively in log sanitization (masking credit card digits or tokens) before publishing."
            ],
            params: [
              { n: "pattern", d: ["Aranan regex deseni.", "Target regex pattern."] },
              { n: "repl", d: ["Yerine konulacak metin dizesi veya fonksiyon.", "Replacement string or callback function."] },
              { n: "string", d: ["İşlenecek metin.", "Input source string."] }
            ],
            ex: {
              code: R`import re

log = "Kullanici: admin, Parola: GizliSifre99!, IP: 1.1.1.1"
# Parolayi maskele ||| Mask the password
temiz = re.sub(r"Parola:\s*[^,\s]+", "Parola: [MASKE_EDILDI]", log)
print(temiz)`,
              out: R`Kullanici: admin, Parola: [MASKE_EDILDI], IP: 1.1.1.1`
            },
            cyber: [
              "Loglarda kişisel verileri (PII) ve şifreleri maskelemeden tutmak GDPR ve KVKK uyumluluk ihlalidir. `re.sub` ile otomatik log sanitizasyonu yapılır.",
              "Writing unmasked credentials into logs violates data protection regulations; `re.sub` is the standard tool for log redaction."
            ]
          },
          {
            id: "compile",
            name: "re.compile(pattern, flags=0)",
            kind: "function",
            sig: "re.compile(pattern, flags=0) -> Pattern",
            sum: [
              "Düzenli ifadeyi önceden derleyip yeniden kullanılabilir Pattern nesnesine dönüştürür.",
              "Compiles a regular expression pattern into a reusable Pattern object."
            ],
            desc: [
              "Aynı deseni bir döngüde binlerce kez kullanacaksanız, deseni her defasında yeniden derleme maliyetinden kurtararak hızı ciddi şekilde artırır.",
              "Precompiles patterns for high-throughput loops, saving repeated compilation overhead across millions of log records."
            ],
            ret: ["Derlenmiş `re.Pattern` nesnesi.", "Compiled `re.Pattern` object."],
            ex: {
              code: R`import re

pat = re.compile(r"^#\s*(.*)$")
print(type(pat).__name__)
m = pat.search("# yorum satiri")
print(m.group(1) if m else "Yok")`,
              out: R`Pattern
yorum satiri`
            }
          },
          {
            id: "escape",
            name: "re.escape(pattern)",
            kind: "function",
            sig: "re.escape(pattern) -> str",
            sum: [
              "Metindeki tüm özel regex karakterlerini (`.`, `*`, `+`, `?`, `[`, `$`) ters bölüyle kaçışlar.",
              "Escapes special regex metacharacters in string so they are treated literally."
            ],
            desc: [
              "Kullanıcıdan gelen bir metni regex içinde arayacaksanız ve bu metindeki noktaların, parantezlerin özel karakter değil düz karakter olarak algılanmasını istiyorsanız `re.escape()` kullanmalısınız.",
              "Escapes characters that have special regex meanings. Essential when interpolating user-supplied search queries into regex patterns."
            ],
            ex: {
              code: R`import re

aranan = "192.168.1.1 (LAN)"
kacisli = re.escape(aranan)
print(kacisli)`,
              out: R`192\.168\.1\.1\ \(LAN\)`
            }
          }
        ]
      },
      {
        id: "match-object",
        title: ["Match Nesnesi ve Gruplar", "Match Object & Capturing Groups"],
        intro: [
          "Eşleşen kısımlara erişmek, adlandırılmış grupları ayıklamak ve indeksleri okumak.",
          "Accessing captured substrings, named groups, and boundary spans."
        ],
        items: [
          {
            id: "group",
            name: "match.group() / groups() / groupdict()",
            kind: "method",
            sig: "match.group(*args), match.groupdict()",
            sum: [
              "Eşleşen tüm metni veya parantez içine alınmış alt grupları döndürür.",
              "Retrieves full matched text, numbered capture groups, or named group dict."
            ],
            desc: [
              "`m.group(0)` tüm eşleşmeyi, `m.group(1)` ilk parantez grubunu döner. `(?P<ad>...)` ile adlandırılmış gruplar tanımlandıysa `m.groupdict()` tüm alanları bir sözlük (`dict`) olarak sunar.",
              "`m.group(0)` returns the full match; `m.group(1)` returns the first subgroup. `groupdict()` returns named capture groups as a native Python dictionary."
            ],
            ex: {
              code: R`import re

pattern = r"(?P<ip>\d+\.\d+\.\d+\.\d+):(?P<port>\d+)"
m = re.search(pattern, "Baglanti: 10.0.0.1:8080 kuruldu")
if m:
    print(m.groupdict())`,
              out: R`{'ip': '10.0.0.1', 'port': '8080'}`
            },
            cyber: [
              "Log ayrıştırıcılarında `(?P<ip>...)`, `(?P<user>...)`, `(?P<status>...)` şeklinde adlandırılmış gruplar kullanmak, logları doğrudan JSON veya SIEM formatına çevirmeyi sağlar.",
              "Named groups (`?P<name>...`) allow raw text logs to be directly mapped into structured SIEM data dictionaries."
            ]
          },
          {
            id: "flags",
            name: "Regex Bayrakları: re.I, re.M, re.S, re.X",
            kind: "const",
            sig: "re.IGNORECASE (re.I), re.MULTILINE (re.M), re.DOTALL (re.S), re.VERBOSE (re.X)",
            sum: [
              "Büyük/küçük harf duyarsızlığı, çok satırlı arama ve açıklamalı regex bayrakları.",
              "Modifier flags altering regex engine matching semantics."
            ],
            desc: [
              "`re.I` (IGNORECASE): Harf büyüklüğünü önemsemez (`a` ile `A` aynıdır).\n`re.M` (MULTILINE): `^` ve `$` işaretlerinin her satır başında/sonunda eşleşmesini sağlar.\n`re.S` (DOTALL): `.` noktanın yeni satır (`\\n`) karakterini de kapsamasını sağlar.\n`re.X` (VERBOSE): Regex içine boşluk ve yorum satırları ekleyerek okunabilirliği artırır.",
              "`re.I`: Case-insensitive matching.\n`re.M`: `^` and `$` match start/end of every line.\n`re.S`: `.` matches newlines too.\n`re.X`: Allows whitespace and inline comments inside the pattern."
            ],
            ex: {
              code: R`import re

# re.I ornegi ||| Case-insensitive example
print(bool(re.search(r"SELECT.*FROM", "select * from users", re.I)))`,
              out: R`True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "extract-iocs",
        title: [
          "Tehdit Göstergeleri (IOC) Ayıklayıcı: IP ve SHA-256",
          "Automated Threat Intelligence IOC Harvester"
        ],
        sum: [
          "Ham metin içindeki tüm IPv4 adreslerini ve SHA-256 zararlı hash'lerini tek hamlede bulma.",
          "Parsing IPv4 addresses and 64-character SHA-256 hashes from unstructured incident reports."
        ],
        code: R`import re

rapor = """
Supheli IP 192.168.1.42 uzerinden gelen saldiri tespit edildi.
Zararli dosya hash degeri: d1937bbc3fcb73bfc6e6eb97c44cebd40d1584790f84a0e7b7f195c053431fd7
Ayrica yedek C2 sunucusu: 10.10.10.5
"""

# Regex desenleri ||| Regex patterns
ip_pattern = r"\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b"
sha256_pattern = r"\b[a-fA-F0-9]{64}\b"

ips = re.findall(ip_pattern, rapor)
hashes = re.findall(sha256_pattern, rapor)

print("Bulunan IP'ler:", ips)
print("Bulunan Hash'ler:", hashes)`,
        out: R`Bulunan IP'ler: ['192.168.1.42', '10.10.10.5']
Bulunan Hash'ler: ['d1937bbc3fcb73bfc6e6eb97c44cebd40d1584790f84a0e7b7f195c053431fd7']`,
        cyber: true,
        note: [
          "Tehdit istihbaratı (TI) raporları ve OSINT analizlerinde yüzlerce sayfalık PDF veya e-posta metninden IOC'ler bu şekilde çekilir.",
          "Standard technique used by threat hunters to harvest IOCs from unstructured intelligence reports."
        ]
      },
      {
        id: "apache-log-parser",
        title: [
          "Web Sunucu Erişim Günlüğü (Log) Ayrıştırıcı",
          "Web Server Access Log Parser"
        ],
        sum: [
          "Standart Common Log Formatındaki (CLF) erişim günlüklerini regex ile yapısal verilere çevirme.",
          "Parsing Common Log Format (CLF) access lines into structured fields."
        ],
        code: R`import re

log_line = '192.168.1.100 - admin [08/Nov/2026:20:00:00] "GET /api/v1/users HTTP/1.1" 200 1420'

pattern = r'^(?P<ip>\S+) \S+ (?P<user>\S+) \[(?P<time>[^\]]+)\] "(?P<method>\S+) (?P<path>\S+) [^"]+" (?P<status>\d+) (?P<bytes>\d+)'

m = re.match(pattern, log_line)
if m:
    d = m.groupdict()
    print(f"IP: {d['ip']} | Metod: {d['method']} | Yol: {d['path']} | Kod: {d['status']}")`,
        out: R`IP: 192.168.1.100 | Metod: GET | Yol: /api/v1/users | Kod: 200`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "search-vs-match",
        q: [
          "`re.search()` ile `re.match()` arasındaki temel fark nedir?",
          "What is the key difference between `re.search()` and `re.match()`?"
        ],
        a: [
          "`re.match()` deseni yalnızca metnin EN BAŞINDA arar (başlangıç uyuşmazsa `None` döner). `re.search()` ise metnin başından bağımsız olarak metnin tamamını tarar.",
          "`re.match()` only checks for a match at the beginning of the string. `re.search()` scans the entire string looking for the first occurrence anywhere."
        ]
      },
      {
        id: "raw-string-r-prefix",
        q: [
          "Regex desenlerini yazarken neden her zaman `r'...'` (raw string) ön eki kullanmalıyız?",
          "Why should you always write regex patterns as raw strings (`r'...'`)?"
        ],
        a: [
          "Çünkü Python'ın kendi kaçış karakteri (`\n`, `\t`) ile regex'in özel kaçış karakterleri (`\d`, `\w`, `\.`) çakışır. `r` ön eki Python'a ters bölüleri yorumlamadan doğrudan regex motoruna teslim etmesini söyler.",
          "Because Python string literal escape rules (`\n`, `\t`) clash with regex escapes (`\d`, `\w`). The `r` prefix suppresses Python's escape parsing, preserving backslashes for regex."
        ]
      },
      {
        id: "redos-vulnerability",
        q: [
          "Siber güvenlikte ReDoS (Regular Expression Denial of Service) zaafiyeti nedir?",
          "What is a ReDoS (Regular Expression Denial of Service) vulnerability?"
        ],
        a: [
          "İç içe quantifiers (`(a+)+$`) içeren kötü tasarlanmış regex desenlerinin, eşleşmeyen özel girdilerde aşırı işlemci tüketerek (catastrophic backtracking) sunucuyu kilitlemesi ve hizmet dışı bırakmasıdır.",
          "An algorithmic denial-of-service where poorly-crafted nested quantifiers cause exponential (catastrophic) backtracking on crafted non-matching input, freezing the CPU."
        ]
      },
      {
        id: "re-sub-sanitization",
        q: [
          "`re.sub()` fonksiyonu log güvenliğinde hangi amaçla kullanılır?",
          "How is `re.sub()` leveraged in log security pipelines?"
        ],
        a: [
          "Parola, oturum anahtarı veya kredi kartı gibi hassas verilerin log dosyalarına açıkça yazılmasını önlemek için ilgili alanları `[MASKELENDİ]` şeklinde sansürlemek (redaction) amacıyla kullanılır.",
          "To sanitize logs by finding and redacting sensitive data (passwords, tokens, PII) with placeholder markers before long-term storage."
        ]
      },
      {
        id: "re-escape-security",
        q: [
          "Kullanıcıdan gelen bir metin dinamik regex içine yerleştirilecekse neden `re.escape()` zorunludur?",
          "Why is `re.escape()` mandatory when embedding user inputs into dynamic regexes?"
        ],
        a: [
          "Kullanıcı `.*` veya `[a-z]+` gibi regex özel karakterleri girerse arama mantığını bozabilir veya ReDoS atağı tetikleyebilir. `re.escape()` bu karakterleri etkisiz kılarak düz metin olarak arar.",
          "If the user submits regex metacharacters (`.*`, `(x+)+`), it could manipulate query semantics or trigger ReDoS. `re.escape()` neutralizes them into literal text."
        ]
      }
    ]
  });
})();

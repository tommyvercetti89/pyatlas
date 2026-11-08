(function () {
  const R = String.raw;
  PY.addLib({
    id: "csv",
    name: "csv",
    sym: "cs",
    color: "#10b981",
    focus: "both",
    level: 1,
    ext: false,
    cat: "basics",
    docs: "https://docs.python.org/3/library/csv.html",
    tagline: [
      "Virgülle ayrılmış tablo verilerini okuma, yazma, zafiyet raporlama ve CSV Enjeksiyonu savunması.",
      "Reading and writing tabular CSV data, vulnerability reporting, and CSV Injection defense."
    ],
    analogy: [
      "Bir metin dosyasını `split(',')` ile bölmeye çalışmak tehlikelidir; çünkü cümlenin içinde virgül veya tırnak (`\"Istanbul, Kadikoy\"`) varsa her şey birbirine girer. `csv` modülü profesyonel bir muhasebeci gibidir: tırnakları, kaçış karakterlerini ve yeni satırları hatasız anlar ve her veriyi ait olduğu sütuna yerleştirir.",
      "Splitting text with `split(',')` breaks easily when values contain embedded commas or quotes (`\"London, UK\"`). The `csv` module acts as a strict tabulator: it handles delimiters, escaping, and multiline values without corrupting columns."
    ],
    intro: [
      [
        "`csv` modülü, CSV (Comma-Separated Values) formatındaki tabular verileri okumak ve yazmak için standart sınıflar (`reader`, `writer`, `DictReader`, `DictWriter`) sunar.",
        "The `csv` module provides classes (`reader`, `writer`, `DictReader`, `DictWriter`) to read and write tabular data formatted according to RFC 4180."
      ],
      [
        "Siber güvenlikte güvenlik tarama sonuçlarını (Nmap, Nessus, ZAP) raporlama, sızıntı veritabanlarını ayrıştırma ve en önemlisi Excel kullanıcılarını hedef alan **CSV/Formül Enjeksiyonu (Formula Injection)** saldırılarını önleme tarafında kritik bir role sahiptir.",
        "In cyber security, exporting audit findings, parsing threat intelligence feeds, and defending against **CSV / Formula Injection** targeting spreadsheet applications are key responsibilities."
      ]
    ],
    import: R`import csv`,
    general: [
      ["Veritabanı dökümlerini ve kullanıcı tablolarını standart CSV formatında dışa aktarma.", "Exporting database dumps and user lists into standardized CSV files."],
      ["Excel veya Google E-Tablolar'dan indirilen dosyaları satır satır okuyup işleme.", "Reading and processing spreadsheets downloaded from Excel or Google Sheets."],
      ["Bilinmeyen ayraçlı dosyaların (virgül, noktalı virgül, tab) biçimini `Sniffer` ile otomatik tespit etme.", "Auto-detecting delimiters (comma, semicolon, tab) via `csv.Sniffer`."]
    ],
    cyberUse: [
      ["CSV/Formül Enjeksiyonu Savunması: Saldırganlar form alanlarına `=cmd|' /C calc'!A0` veya `@SUM(...)` yazarak CSV'yi açan güvenlik yöneticisinin bilgisayarında kod çalıştırmayı hedefler. Dışa aktarmadan önce baştaki `=`, `+`, `-`, `@` işaretlerini etkisiz hale getirme.", "CSV / Formula Injection defense: attackers inject leading `=`, `+`, `-`, `@` characters to execute commands in Excel; sanitizing output before writing is a vital defensive practice."],
      ["Zafiyet Tarama Raporlaması: Pentest çıktılarında tespit edilen açık portları, servisleri ve risk seviyelerini `DictWriter` ile kurumsal standartlarda CSV raporuna dökme.", "Vulnerability triage reporting: structuring discovered findings, severity scores, and remediations into clean CSV deliverables using `DictWriter`."],
      ["Tehdit İstihbaratı (Threat Intel) Ayrıştırma: Kötü niyetli IP ve domain listelerini içeren devasa CSV beslemelerini satır satır akıtarak SIEM kurallarına aktarma.", "Threat intel parsing: consuming massive malicious IP/hash feed exports line-by-line for ingestion into SIEM threat indicators."]
    ],
    sections: [
      {
        id: "readers-and-writers",
        title: ["Okuyucular ve Yazıcılar", "Readers & Writers"],
        intro: [
          "Dizi tabanlı (`reader`, `writer`) ve sözlük tabanlı (`DictReader`, `DictWriter`) araçlar.",
          "List-based and mapping-based CSV parsers and generators."
        ],
        items: [
          {
            id: "reader",
            name: "csv.reader(csvfile, dialect='excel', **fmtparams)",
            kind: "function",
            sig: "csv.reader(csvfile: Iterable[str], dialect='excel', **fmtparams) -> reader",
            sum: [
              "CSV dosyasını satır satır liste (`list[str]`) olarak okuyan bir iterator döner.",
              "Returns a reader object which will iterate over lines in the given csvfile."
            ],
            desc: [
              "Her satırı ayrılmış dize elemanları olarak verir. Dosya `open(..., newline='')` parametresi ile açılmalıdır; aksi halde Windows satır sonları (`\\r\\n`) hatalı yorumlanabilir.",
              "Yields each row as a list of strings. The file must be opened with `newline=''` to preserve carriage returns across operating systems."
            ],
            ex: {
              code: R`import csv
import io

veri = "ip,port,servis\n192.168.1.1,80,http\n10.0.0.1,22,ssh"
f = io.StringIO(veri)

okuyucu = csv.reader(f)
basliklar = next(okuyucu)
satirlar = list(okuyucu)

print("Basliklar:", basliklar)
print("Ilk kayit:", satirlar[0])`,
              out: R`Basliklar: ['ip', 'port', 'servis']
Ilk kayit: ['192.168.1.1', '80', 'http']`
            }
          },
          {
            id: "writer",
            name: "csv.writer(csvfile, dialect='excel', **fmtparams)",
            kind: "function",
            sig: "csv.writer(csvfile: SupportsWrite[str], dialect='excel', **fmtparams) -> writer",
            sum: [
              "Verileri CSV kurallarına uygun olarak dosyaya yazan yazıcı nesnesi döner.",
              "Returns a writer object responsible for converting the user's data into delimited strings."
            ],
            desc: [
              "Virgül veya tırnak içeren metinleri otomatik olarak RFC 4180 standartlarına göre çift tırnak içine alır.",
              "Encapsulates values containing special delimiters with standard double quotes automatically."
            ],
            ex: {
              code: R`import csv
import io

f = io.StringIO()
yazici = csv.writer(f, lineterminator="\n")
yazici.writerow(["hedef", "durum"])
yazici.writerow(["10.0.0.1", "ACIK"])

print(f.getvalue().strip())`,
              out: R`hedef,durum
10.0.0.1,ACIK`
            }
          },
          {
            id: "dictreader",
            name: "csv.DictReader(f, fieldnames=None, ...)",
            kind: "class",
            sig: "csv.DictReader(f: Iterable[str], fieldnames=None, restkey=None, restval=None, ...)",
            sum: [
              "CSV dosyasının her satırını sütun başlıklarını anahtar alan sözlük (`dict`) olarak okur.",
              "Create an object that operates like a regular reader but maps information into a dict."
            ],
            desc: [
              "İlk satırdaki başlıkları otomatik olarak sözlük anahtarları yapar. Sütunların sırası değişse bile kodun bozulmasını engeller; log ve rapor analizinde en temiz yöntemdir.",
              "Maps each row to a dict using header column names as keys. Eliminates brittle index-based parsing."
            ],
            ex: {
              code: R`import csv
import io

veri = "cve,skor,durum\nCVE-2026-1111,9.8,KRITIK\nCVE-2026-2222,4.3,DUSUK"
okuyucu = csv.DictReader(io.StringIO(veri))

for satir in okuyucu:
    print(satir["cve"], satir["skor"])`,
              out: R`CVE-2026-1111 9.8
CVE-2026-2222 4.3`
            },
            cyber: [
              "Zafiyet listelerinde sütun sırasına güvenmeyin (`row[2]` yerine `row['risk']`). `DictReader` sütun sıralaması değişen araç çıktılarını güvenle ayrıştırır.",
              "Never depend on positional indices in vulnerability triage; use `DictReader` for resilient key-based lookups."
            ]
          },
          {
            id: "dictwriter",
            name: "csv.DictWriter(f, fieldnames, ...)",
            kind: "class",
            sig: "csv.DictWriter(f: SupportsWrite[str], fieldnames: Sequence[str], ...)",
            sum: [
              "Sözlükleri belirtilen sütun başlıklarına göre CSV formatında yazan sınıf.",
              "Create an object which operates like a regular writer but maps dictionaries onto output rows."
            ],
            desc: [
              "`.writeheader()` çağrısı ile ilk satıra başlıkları basar, ardından `.writerow(sozluk)` ile kayıtları ekler. Eksik anahtarlar için hata vermez (varsayılan boşluk basar).",
              "Writes headers via `.writeheader()` and maps dictionaries onto output columns via `.writerow(dict)`."
            ],
            ex: {
              code: R`import csv
import io

f = io.StringIO()
basliklar = ["ip", "zafiyet", "seviye"]
yazici = csv.DictWriter(f, fieldnames=basliklar, lineterminator="\n")

yazici.writeheader()
yazici.writerow({"ip": "192.168.1.5", "zafiyet": "SQLi", "seviye": "HIGH"})
print(f.getvalue().strip())`,
              out: R`ip,zafiyet,seviye
192.168.1.5,SQLi,HIGH`
            }
          }
        ]
      },
      {
        id: "dialects-and-security",
        title: ["Lehçeler ve Formül Enjeksiyonu", "Dialects & Injection Mitigation"],
        intro: [
          "`Sniffer`, tırnaklama kuralları ve CSV Formül Enjeksiyonu.",
          "Dialect sniffing, quotation strategies, and CSV formula sanitization."
        ],
        items: [
          {
            id: "writerow",
            name: "csvwriter.writerow(row) / writerows",
            kind: "method",
            sig: "w.writerow(row: Iterable[Any]) -> Any, w.writerows(rows: Iterable[Iterable[Any]])",
            sum: [
              "Tek bir satırı veya toplu satır listesini CSV hedefine yazar.",
              "Writes a single row or batch rows to the writer's file object."
            ],
            desc: [
              "`writerows` büyük hacimli pentest bulgularını tek seferde akıtarak disk I/O maliyetini düşürür.",
              "Optimizes disk I/O by dumping bulk row sequences in batch operations."
            ],
            ex: {
              code: R`import csv
import io

f = io.StringIO()
w = csv.writer(f, lineterminator="\n")
w.writerows([["a", "1"], ["b", "2"]])
print(f.getvalue().strip())`,
              out: R`a,1
b,2`
            }
          },
          {
            id: "sniffer",
            name: "csv.Sniffer()",
            kind: "class",
            sig: "csv.Sniffer() -> Sniffer",
            sum: [
              "CSV dosyasının ayracını (virgül, tab, noktalı virgül) ve başlık olup olmadığını otomatik tespit eder.",
              "A class to deduce the format (dialect) of a CSV file and determine if a header is present."
            ],
            desc: [
              "`.sniff(sample)` metodu verilen metin örneğini inceleyip uygun `Dialect` nesnesini döner. Farklı firewall ve araçların çıktı formatını bilmeden dinamik ayrıştırma yapmayı sağlar.",
              "Inspects sample text via `.sniff()` to return matching dialect, handling unknown delimiters gracefully."
            ],
            ex: {
              code: R`import csv

ornek_log = "host;port;durum\n10.0.0.1;443;open\n10.0.0.2;80;closed"
diyalekt = csv.Sniffer().sniff(ornek_log)

print("Tespit edilen ayrac:", diyalekt.delimiter)`,
              out: R`Tespit edilen ayrac: ;`
            }
          },
          {
            id: "quote-minimal",
            name: "csv.QUOTE_MINIMAL / QUOTE_ALL / QUOTE_NONNUMERIC",
            kind: "const",
            sig: "csv.QUOTE_MINIMAL, csv.QUOTE_ALL, csv.QUOTE_NONNUMERIC, csv.QUOTE_NONE",
            sum: [
              "Değerlerin ne zaman tırnak içine alınacağını belirleyen sabitler.",
              "Constants dictating when quotes should be generated by the writer."
            ],
            desc: [
              "`QUOTE_MINIMAL` (varsayılan): Sadece içinde ayraç veya tırnak olan değerleri tırnaklar. `QUOTE_ALL`: Her alanı istisnasız tırnaklar.",
              "`QUOTE_MINIMAL` quotes only fields with delimiters or quotes. `QUOTE_ALL` quotes all fields indiscriminately."
            ],
            ex: {
              code: R`import csv
import io

f = io.StringIO()
w = csv.writer(f, quoting=csv.QUOTE_ALL)
w.writerow(["admin", 123])
print(f.getvalue().strip())`,
              out: R`"admin","123"`
            }
          },
          {
            id: "formula-injection-guard",
            name: "CSV Injection / Formula Injection Defense",
            kind: "concept",
            sig: "# Defense against Formula Injection in CSV outputs",
            sum: [
              "Excel ve LibreOffice'te komut çalıştıran formül karakterlerini (`=`, `+`, `-`, `@`) etkisizleştirme.",
              "Sanitizing leading formula tokens to prevent remote code execution in spreadsheet apps."
            ],
            desc: [
              "Bir kullanıcı adını veya girdi alanını `=1+cmd|' /C calc'!A0` olarak kaydederse, bu veri CSV'ye ham basıldığında ve Excel'de açıldığında dinamik veri değişimi (DDE) ile zararlı kod tetiklenebilir. Savunma kuralı: Hücre `=,+,-,@` ile başlıyorsa önüne tek tırnak (`'`) ekleyerek metin olarak algılanmasını sağlamaktır.",
              "Attackers injecting `=1+cmd|' /C calc'!A0` exploit DDE code execution when spreadsheets open raw CSVs. Defensive mitigation prepends a single quote (`'`) to any cell beginning with `=,+,-,@`."
            ],
            ex: {
              code: R`def sanitize_csv_cell(value: str) -> str:
    # Eger hucre tehlikeli formul baslatici karakterle basliyorsa: ||| If cell starts with dangerous formula tokens:
    if value and str(value)[0] in ("=", "+", "-", "@", "\t", "\r"):
        return "'" + str(value)
    return str(value)

saldirgan_girdi = "=cmd|' /C calc'!A0"
temizlenmis = sanitize_csv_cell(saldirgan_girdi)

print("Saldirgan girdi temizlendi mi:", temizlenmis.startswith("'="))`,
              out: R`Saldirgan girdi temizlendi mi: True`
            },
            cyber: [
              "Kullanıcı girdisini CSV olarak dışa aktaran her web uygulaması (raporlar, kullanıcı listeleri) CSV Injection testine tabi tutulmalıdır.",
              "All administrative CSV export features must sanitize formula triggers to shield analysts from DDE exploits."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "safe-vulnerability-exporter",
        title: [
          "Güvenli Zafiyet Raporlayıcı (CSV Enjeksiyon Korumalı)",
          "Secure Vulnerability Report Exporter with Anti-Injection Guard"
        ],
        sum: [
          "Pentest ve tarama bulgularını formül enjeksiyonuna karşı filtreleyerek CSV raporuna aktarma.",
          "Generating executive vulnerability triage CSV reports with strict cell sanitization."
        ],
        code: R`import csv
import io

bulgular = [
    {"hedef": "192.168.1.10", "aciklama": "SSH Zayif Parola", "risk": "MEDIUM"},
    {"hedef": "192.168.1.20", "aciklama": "=SUM(1+1)*cmd|' /C calc'!A0", "risk": "CRITICAL"},
]

def sanitize_cell(val):
    s = str(val)
    if s and s[0] in ("=", "+", "-", "@"):
        return "'" + s
    return s

output = io.StringIO()
alanlar = ["hedef", "aciklama", "risk"]
yazici = csv.DictWriter(output, fieldnames=alanlar)
yazici.writeheader()

for b in bulgular:
    temiz_kayit = {k: sanitize_cell(v) for k, v in b.items()}
    yazici.writerow(temiz_kayit)

sonuc = output.getvalue()
print("Rapor basariyla uretildi mi:", "CRITICAL" in sonuc)
print("Zararli formul etkisizlestirildi mi:", "'=SUM" in sonuc)`,
        out: R`Rapor basariyla uretildi mi: True
Zararli formul etkisizlestirildi mi: True`,
        cyber: true,
        note: [
          "Tek tırnak (`'`) eklemek, Excel ve benzeri programlara bu hücrenin bir formül değil düz bir metin dizesi olduğunu söyler ve komut çalıştırmayı engeller.",
          "Prepending a single quote (`'`) forces spreadsheet interpreters to evaluate the cell strictly as literal text, defusing DDE command execution."
        ]
      },
      {
        id: "threat-intel-csv-parser",
        title: [
          "Tehdit İstihbaratı Kötücül IP/Hash Besleme Ayrıştırıcısı",
          "Threat Intel Malicious Feed CSV Dissector"
        ],
        sum: [
          "Dış tehdit istihbaratı CSV beslemelerinden yüksek riskli IP adreslerini süzme.",
          "Parsing external threat intelligence CSV feeds to extract malicious indicators."
        ],
        code: R`import csv
import io

feed_csv = """indicator,type,confidence,actor
198.51.100.24,ipv4,90,APT29
203.0.113.88,ipv4,35,Unknown
evil.attacker-c2.com,domain,95,FIN7"""

reader = csv.DictReader(io.StringIO(feed_csv))
bloklanacak_ipler = []

for row in reader:
    if row["type"] == "ipv4" and int(row["confidence"]) >= 80:
        bloklanacak_ipler.append((row["indicator"], row["actor"]))

print("Yuksek guvenlikli zararli IP'ler:", bloklanacak_ipler)`,
        out: R`Yuksek guvenlikli zararli IP'ler: [('198.51.100.24', 'APT29')]`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "csv-injection-definition",
        q: [
          "CSV Injection (Formül Enjeksiyonu) nedir ve nasıl çalışır?",
          "What is CSV / Formula Injection, and how does it operate?"
        ],
        a: [
          "Saldırganın girdi alanlarına `=`, `+`, `-`, `@` gibi Excel formül karakterleriyle başlayan komutlar enjekte etmesidir. Yönetici bu verileri CSV olarak indirip Excel'de açtığında DDE üzerinden kurbana ait bilgisayarda zararlı kodlar çalıştırılabilir.",
          "Attackers prepend Excel formula characters (`=`, `+`, `-`, `@`) to input fields. When an analyst opens the exported CSV, spreadsheet apps trigger DDE protocols executing arbitrary host commands."
        ]
      },
      {
        id: "csv-injection-mitigation",
        q: [
          "CSV Injection saldırısına karşı en basit ve etkili yazılımsal savunma nedir?",
          "What is the simplest and most effective code defense against CSV Injection?"
        ],
        a: [
          "CSV hücresine yazılacak metin `=`, `+`, `-`, `@` karakterlerinden biriyle başlıyorsa, önüne tek tırnak (`'`) karakteri eklemektir (`'=1+1'`). Bu işlem Excel'e veriyi formül değil düz yazı olarak okutur.",
          "Prepend a single quote (`'`) to any cell value that starts with `=`, `+`, `-`, or `@`, instructing spreadsheet engines to render the value strictly as literal text."
        ]
      },
      {
        id: "dictreader-vs-reader",
        q: [
          "Neden log ve güvenlik analizlerinde `csv.reader` yerine `csv.DictReader` tercih edilir?",
          "Why is `csv.DictReader` preferred over `csv.reader` for log and security triage?"
        ],
        a: [
          "`csv.reader` indeksle (`row[3]`) erişim gerektirir; araç sürümü güncellenip sütun sırası değiştiğinde kod kırılır. `csv.DictReader` ise sütun başlıklarını anahtar yapar (`row['severity']`) ve sıra değişimlerinden etkilenmez.",
          "`csv.reader` relies on brittle index offsets (`row[3]`). `csv.DictReader` maps columns to descriptive keys (`row['severity']`), insulating analysis scripts against column reordering."
        ]
      },
      {
        id: "csv-newline-parameter",
        q: [
          "CSV dosyası açılırken neden `open('dosya.csv', 'w', newline='')` şeklinde `newline=''` parametresi verilmelidir?",
          "Why must CSV files be opened with `newline=''` in Python?"
        ],
        a: [
          "Python'un evrensel yeni satır çeviricisi Windows'ta fazladan boş satırlar (`\\r\\r\\n`) oluşmasına yol açabilir. `newline=''` ayarı satır sonu denetimini tamamen `csv` modülünün kendi algoritmasına bırakır.",
          "Python's default newline translation can produce double carriage returns (`\\r\\r\\n`) on Windows. `newline=''` delegates newline handling cleanly to the `csv` module."
        ]
      },
      {
        id: "csv-sniffer-utility",
        q: [
          "`csv.Sniffer` sınıfının pratik faydası nedir?",
          "What is the practical benefit of `csv.Sniffer`?"
        ],
        a: [
          "Dosyayı açmadan önce içeriğinden bir parça okuyarak ayracın virgül mü, noktalı virgül mü yoksa tab mı olduğunu ve ilk satırın başlık olup olmadığını otomatik olarak çözer.",
          "It analyzes a sample of delimited text to automatically deduce the delimiter (comma, tab, semicolon) and determine whether a header row exists."
        ]
      }
    ]
  });
})();

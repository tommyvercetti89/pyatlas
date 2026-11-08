(function () {
  const R = String.raw;
  PY.addLib({
    id: "json",
    name: "json",
    sym: "{}",
    color: "#f59e0b",
    focus: "both",
    level: 1,
    ext: false,
    cat: "data",
    docs: "https://docs.python.org/3/library/json.html",
    tagline: [
      "JSON serileştirme ve ayrıştırma: Web API'leri, yapılandırma dosyaları ve güvenli veri değişimi.",
      "JSON encoding and decoding: Web APIs, configuration files, and safe data interchange."
    ],
    analogy: [
      "Farklı diller konuşan iki insanın (örneğin Python ile JavaScript) ortak bir anlaşma kağıdı kullanması gibidir. Python kendi belleğindeki karmaşık sözlüğü bu evrensel yazıya döker (`dumps`), JavaScript de bu yazıyı okuyup kendi nesnesine çevirir. Kimse birbirinin iç yapısını bilmek zorunda kalmaz.",
      "Like two people speaking different native languages (Python and JavaScript) exchanging notes in a universal lingua franca. Python serializes its internal dictionary into standard text (`dumps`), and any other platform parses it back unambiguously into its native objects."
    ],
    intro: [
      [
        "`json` modülü, modern web dünyasının fiili veri değişim standardı olan JSON (JavaScript Object Notation) formatını Python veri tipleriyle (`dict`, `list`, `str`, `int`, `bool`, `None`) eşleyen standart kütüphanedir.",
        "The `json` module provides serialization and deserialization between JSON (JavaScript Object Notation) and Python native types (`dict`, `list`, `str`, `int`, `bool`, `None`)."
      ],
      [
        "Siber güvenlikte JSON güvenli veri aktarımının altın standardıdır: tehlikeli `pickle` modülünün aksine kod çalıştırma (RCE) riski taşımaz. REST API güvenliği, SIEM log çıktıları, JWT token gövdeleri ve güvenlik aracı ayarları tamamen JSON ile taşınır.",
        "In cyber security, JSON is the gold standard for safe serialization: unlike dangerous `pickle`, it cannot execute arbitrary code (RCE). REST APIs, SIEM logs, JWT claims, and cloud telemetry all rely on JSON."
      ]
    ],
    import: R`import json`,
    general: [
      [
        "REST API'lerden dönen metin yanıtlarını Python sözlüklerine (`dict`) dönüştürmek (`json.loads`).",
        "Parsing HTTP API JSON response bodies into native dictionaries via `json.loads`."
      ],
      [
        "Uygulama ayarlarını ve yapılandırma dosyalarını (`config.json`) okuyup yazmak (`dump` / `load`).",
        "Reading and persisting application configuration files (`config.json`)."
      ],
      [
        "Karmaşık veri yapılarını okunabilir (pretty-print) formatta konsola basmak (`indent=2`).",
        "Pretty-printing nested data structures for debugging and terminal output."
      ]
    ],
    cyberUse: [
      [
        "Güvensiz Deserializasyon Önleme: Python nesnelerini saklarken asla RCE zaafiyeti üreten `pickle` kullanmamak; daima `json` tercih etmek.",
        "Preventing insecure deserialization: strictly choosing `json` over code-executing `pickle`."
      ],
      [
        "SIEM ve Güvenlik Duvarı JSON loglarını ayrıştırıp şüpheli etkinlikleri filtrelemek.",
        "Ingesting and filtering JSON telemetry streams emitted by modern cloud SIEMs."
      ],
      [
        "Tehdit istihbaratı (MISP, VirusTotal, Shodan) API yanıtlarını yapısal olarak sorgulamak.",
        "Interrogating Threat Intelligence API responses (MISP, Shodan, VirusTotal)."
      ]
    ],
    sections: [
      {
        id: "serialization",
        title: ["Dize Dönüşümleri: dumps & loads", "String Transformations: dumps & loads"],
        intro: [
          "Python nesnelerini JSON metnine çevirme ve JSON metnini Python nesnesine dönüştürme.",
          "Serializing in-memory objects to JSON strings and parsing strings back to objects."
        ],
        items: [
          {
            id: "dumps",
            name: "json.dumps(obj, ...)",
            kind: "function",
            sig: "json.dumps(obj, *, indent=None, sort_keys=False, ensure_ascii=True, separators=None) -> str",
            sum: [
              "Python nesnesini (dict, list vb.) JSON biçimli bir dizeye (`str`) dönüştürür.",
              "Serializes Python object `obj` to a JSON formatted string (`str`)."
            ],
            desc: [
              "`dumps` (Dump String), nesneyi metne serileştirir. `indent=2` okunabilir girintili çıktı üretir; `sort_keys=True` anahtarları alfabetik sıralar.",
              "Serializes objects into text. `indent=2` pretty-prints the output; `sort_keys=True` guarantees deterministic key ordering."
            ],
            params: [
              { n: "obj", d: ["Serileştirilecek Python nesnesi (`dict`, `list`, vb.).", "Python object to serialize."] },
              { n: "indent", d: ["Girinti boşluk sayısı (okunabilirlik için örn: `2` veya `4`).", "Indentation level for pretty-printing."] },
              { n: "sort_keys", d: ["Anahtarları alfabetik sıralamak için `True` yapın.", "Sort dictionary keys alphabetically."] }
            ],
            ret: ["JSON biçimli metin (`str`).", "JSON formatted string (`str`)."],
            ex: {
              code: R`import json

data = {"servis": "ssh", "port": 22, "acik": True}
json_str = json.dumps(data, sort_keys=True)
print(json_str)`,
              out: R`{"acik": true, "port": 22, "servis": "ssh"}`
            }
          },
          {
            id: "loads",
            name: "json.loads(s, ...)",
            kind: "function",
            sig: "json.loads(s, *, object_hook=None, ...) -> Any",
            sum: [
              "JSON biçimli bir metni (`str` veya `bytes`) Python nesnesine ayrıştırır.",
              "Deserializes JSON string or bytes `s` into a native Python object."
            ],
            desc: [
              "`loads` (Load String), JSON metnini okur; JSON nesnelerini Python `dict`ine, dizilerini `list`e, boolean ve null değerleri `True/False/None`a dönüştürür. Hatalı sözdiziminde `json.JSONDecodeError` fırlatır.",
              "Parses JSON text into Python structures. Invalid syntax raises `json.JSONDecodeError`."
            ],
            params: [
              { n: "s", d: ["Ayrıştırılacak JSON dizesi veya baytları.", "JSON string or bytes-like object to deserialize."] }
            ],
            ret: ["Ayrıştırılmış Python nesnesi (`dict`, `list`, vb.).", "Deserialized Python object."],
            ex: {
              code: R`import json

raw_json = '{"hedef": "192.168.1.1", "zaafiyetler": [80, 443], "kritik": false}'
data = json.loads(raw_json)
print(data["hedef"])
print(data["zaafiyetler"][0])
print(data["kritik"])`,
              out: R`192.168.1.1
80
False`
            }
          },
          {
            id: "json-decode-error",
            name: "json.JSONDecodeError",
            kind: "exception",
            sig: "json.JSONDecodeError(msg, doc, pos)",
            sum: [
              "Geçersiz veya bozuk JSON sözdiziminde fırlatılan istisna.",
              "Subclass of ValueError raised when JSON parsing fails."
            ],
            desc: [
              "API'den HTML hata sayfası döndüğünde veya kesik JSON geldiğinde fırlatılır. `e.lineno` ve `e.colno` öznitelikleri hatanın tam satır ve sütununu verir.",
              "Raised when deserializing malformed JSON. Exposes exact line and column offsets via `lineno` and `colno`."
            ],
            ex: {
              code: R`import json

bozuk_json = '{"ad": "test",}'  # Sondaki virgul gecersizdir ||| Trailing comma is invalid
try:
    json.loads(bozuk_json)
except json.JSONDecodeError as e:
    print("YAKALANDI: Gecersiz JSON syntax")`,
              out: R`YAKALANDI: Gecersiz JSON syntax`
            }
          }
        ]
      },
      {
        id: "file-io",
        title: ["Dosya Giriş/Çıkış: dump & load", "File Operations: dump & load"],
        intro: [
          "Doğrudan diskteki dosya tanıtıcıları (file pointer) üzerinden JSON okuma ve yazma.",
          "Streaming JSON directly to and from open file descriptors."
        ],
        items: [
          {
            id: "dump",
            name: "json.dump(obj, fp, ...)",
            kind: "function",
            sig: "json.dump(obj, fp, *, indent=None, sort_keys=False, ...)",
            sum: [
              "Python nesnesini doğrudan açık bir dosyaya JSON olarak yazar.",
              "Serializes Python object `obj` directly as JSON into a writeable file-like object `fp`."
            ],
            desc: [
              "`s = json.dumps(); f.write(s)` yapmak yerine doğrudan dosyaya akış olarak yazar. Büyük veri setlerinde fazladan bellek tüketmez.",
              "Streams JSON directly into an open file descriptor without allocating a full string in memory."
            ],
            params: [
              { n: "obj", d: ["Yazılacak Python nesnesi.", "Object to serialize."] },
              { n: "fp", d: ["Yazma modunda açık dosya nesnesi.", "Writeable file-like object."] }
            ],
            ex: {
              code: R`import json
import io

buf = io.StringIO()
json.dump({"durum": "ok"}, buf)
print(buf.getvalue())`,
              out: R`{"durum": "ok"}`
            }
          },
          {
            id: "load",
            name: "json.load(fp, ...)",
            kind: "function",
            sig: "json.load(fp, ...) -> Any",
            sum: [
              "Açık bir dosyadan JSON verisini okuyup Python nesnesine dönüştürür.",
              "Deserializes JSON content directly from a readable file-like object `fp`."
            ],
            desc: [
              "Diskteki yapılandırma dosyasını (`settings.json`) doğrudan tek adımda okur.",
              "Reads directly from a disk file into native Python types."
            ],
            params: [
              { n: "fp", d: ["Okuma modunda açık dosya nesnesi.", "Readable file-like object."] }
            ],
            ret: ["Ayrıştırılan Python nesnesi.", "Deserialized object."],
            ex: {
              code: R`import json
import io

buf = io.StringIO('{"ayar": 42}')
res = json.load(buf)
print(res["ayar"])`,
              out: R`42`
            }
          }
        ]
      },
      {
        id: "security-concepts",
        title: ["Güvenlik Karşılaştırması: json vs pickle", "Security Comparison: json vs pickle"],
        intro: [
          "JSON neden güvenlidir ve neden asla güvenilmeyen kaynaklardan `pickle` yüklenmemelidir?",
          "Why JSON is safe for untrusted payloads while pickle leads to remote code execution."
        ],
        items: [
          {
            id: "json-vs-pickle",
            name: "Güvenlik: json vs pickle (RCE Savunması)",
            kind: "concept",
            sig: "json (veri) vs pickle (calistirilabilir kod)",
            sum: [
              "JSON yalnızca statik veri taşır; pickle ise keyfi kod çalıştırabilir (RCE zaafiyeti).",
              "JSON transfers pure data; pickle can execute arbitrary code resulting in Remote Code Execution."
            ],
            desc: [
              "Python'ın `pickle` modülü nesnelerin metodlarını ve çalışma durumlarını da serileştirir. Saldırgan özel hazırlanmış bir pickle verisi gönderirse `pickle.loads` anında sunucuda ters kabuk (reverse shell) açabilir. `json` ise yalnızca temel tipleri (sayı, metin, dizi) temsil eder; hiçbir koşulda kod çalıştıramaz.",
              "Pickle deserializes Python bytecodes and callables, making untrusted input prone to Remote Code Execution (RCE). JSON is strictly declarative data with zero execution capability."
            ],
            ex: {
              code: R`import json

# JSON yalnizca veri tasir, hicbir executable komut calistiramaz ||| JSON is safe data
payload = '{"cmd": "whoami"}'
parsed = json.loads(payload)
print(isinstance(parsed, dict) and parsed["cmd"] == "whoami")`,
              out: R`True`
            },
            cyber: [
              "Web uygulamalarında ve API'lerde kullanıcılardan veya ağdan gelen veriler için daima `json` kullanılmalıdır. `pickle` kullanımı en yüksek dereceli (Critical) güvenlik zaafiyetidir.",
              "Never accept pickled data from untrusted networks. JSON is the industry-standard safe serialization format."
            ]
          },
          {
            id: "ensure-ascii",
            name: "ensure_ascii parametresi (Türkçe Karakter Desteği)",
            kind: "concept",
            sig: "json.dumps(..., ensure_ascii=False)",
            sum: [
              "Türkçe karakterlerin `\\u0131` yerine doğrudan `ı, ş, ğ` olarak kaydedilmesini sağlar.",
              "Preserves UTF-8 characters as native glyphs instead of escaping to `\\uXXXX` sequences."
            ],
            desc: [
              "Varsayılan olarak `ensure_ascii=True`'dur ve ASCII dışı tüm karakterleri (Türkçe karakterler dahil) `\\u011f` gibi unicode kaçış dizelerine çevirir. Dosyanın insanlar tarafından rahat okunabilmesi için `ensure_ascii=False` yapılmalıdır.",
              "By default `ensure_ascii=True` escapes non-ASCII characters to `\\uXXXX`. Setting `ensure_ascii=False` preserves readable UTF-8."
            ],
            ex: {
              code: R`import json

data = {"sehir": "İzmir"}
print(json.dumps(data, ensure_ascii=False))`,
              out: R`{"sehir": "İzmir"}`
            }
          },
          {
            id: "type-mapping",
            name: "Python - JSON Tip Eşleme Tablosu",
            kind: "concept",
            sig: "dict -> object, list -> array, None -> null, bool -> boolean",
            sum: [
              "Python ve JSON temel tipleri arasındaki karşılık tablosu.",
              "Direct correspondence mapping between native Python and JSON data types."
            ],
            desc: [
              "`dict` <-> JSON Object (`{}`)\n`list, tuple` <-> JSON Array (`[]`)\n`str` <-> JSON String (`\"\"`)\n`int, float` <-> JSON Number\n`True / False` <-> JSON `true / false`\n`None` <-> JSON `null`",
              "`dict` maps to Object, `list/tuple` to Array, `str` to String, `int/float` to Number, `True/False` to `true/false`, and `None` to `null`."
            ],
            ex: {
              code: R`import json

print(json.dumps([None, True, False, 10]))`,
              out: R`[null, true, false, 10]`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "siem-log-filter",
        title: [
          "SIEM JSON Güvenlik Günlüğü Filtreleyici",
          "SIEM JSON Security Telemetry Filter"
        ],
        sum: [
          "JSON formatındaki log akışından 'CRITICAL' seviyesindeki güvenlik olaylarını ayıklama.",
          "Parsing and extracting high-severity security incidents from JSON telemetry lines."
        ],
        code: R`import json

log_kayitlari = [
    '{"seviye": "INFO", "ip": "10.0.0.1", "olay": "Basarili giris"}',
    '{"seviye": "CRITICAL", "ip": "192.168.1.50", "olay": "Brute Force Saldirisi"}',
    '{"seviye": "WARNING", "ip": "10.0.0.2", "olay": "Yuksek trafik"}'
]

alarmlar = []
for satir in log_kayitlari:
    kayit = json.loads(satir)
    if kayit["seviye"] == "CRITICAL":
        alarmlar.append(f"ALARM: {kayit['ip']} -> {kayit['olay']}")

for a in alarmlar:
    print(a)`,
        out: R`ALARM: 192.168.1.50 -> Brute Force Saldirisi`,
        cyber: true,
        note: [
          "Modern bulut ortamlarında (AWS CloudWatch, Splunk, ElasticSearch) tüm loglar tek satırlık JSON (NDJSON) olarak akar ve bu mantıkla işlenir.",
          "Cloud log telemetry (AWS CloudWatch, Splunk) is universally framed in line-delimited JSON (NDJSON)."
        ]
      },
      {
        id: "pretty-config-writer",
        title: [
          "Güvenlik Aracı Ayar Dosyası Yazıcı (Pretty Config Writer)",
          "Security Scanner Configuration Generator"
        ],
        sum: [
          "Okunabilir ve sıralı JSON yapılandırma dosyaları oluşturma.",
          "Generating formatted, deterministic scanner settings files with indentation."
        ],
        code: R`import json

config = {
    "arac": "PortChecker",
    "timeout": 1.5,
    "hedefler": ["192.168.1.1", "10.0.0.1"],
    "portlar": [22, 80, 443]
}

# Girintili ve anahtarlari sirali olarak metne cevir ||| Pretty-print with sorted keys
cikis = json.dumps(config, indent=2, sort_keys=True)
print(cikis[:45])  # Ilk birkac satiri goster ||| Show first lines`,
        out: R`{
  "arac": "PortChecker",
  "hedefler": [`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "loads-vs-dumps",
        q: [
          "`json.dumps()` ile `json.loads()` arasındaki fark nedir?",
          "What is the difference between `json.dumps()` and `json.loads()`?"
        ],
        a: [
          "`json.dumps()` Python nesnesini JSON dizesine (`str`) serileştirir (Dump String). `json.loads()` ise JSON dizesini okuyup Python nesnesine ayrıştırır (Load String).",
          "`json.dumps()` serializes a Python object into a JSON string. `json.loads()` parses a JSON string back into native Python objects."
        ]
      },
      {
        id: "why-json-over-pickle",
        q: [
          "Güvenlik açısından ağdan gelen verilerde neden `pickle` yerine daima `json` kullanılmalıdır?",
          "Why must untrusted incoming network payloads be parsed with `json` rather than `pickle`?"
        ],
        a: [
          "`pickle` karmaşık nesne yapılarıyla birlikte çalıştırılabilir kod da taşıyabilir ve saldırganın sisteme sızmasına (Uzaktan Kod Çalıştırma / RCE) neden olur. `json` ise yalnızca pasif veridir; hiçbir koşulda kod çalıştıramaz.",
          "`pickle` deserializes Python execution state, allowing malicious payloads to trigger Remote Code Execution (RCE). `json` is purely passive data with zero execution capability."
        ]
      },
      {
        id: "none-to-null-mapping",
        q: [
          "Python'daki `None` değeri JSON'a dönüştürüldüğünde ne olur?",
          "What does Python's `None` value translate to in JSON?"
        ],
        a: [
          "JSON standardındaki `null` değerine dönüşür (örn: `json.dumps({'k': None})` çıktısı `{\"k\": null}` olur).",
          "It maps directly to the standard JSON `null` literal."
        ]
      },
      {
        id: "ensure-ascii-benefit",
        q: [
          "`json.dumps()` içindeki `ensure_ascii=False` seçeneği ne işe yarar?",
          "What does `ensure_ascii=False` accomplish in `json.dumps()`?"
        ],
        a: [
          "Türkçe veya UTF-8 karakterlerin `\\u0131` gibi Unicode kaçış dizeleri yerine doğrudan okunabilir Türkçe harflerle (`ı`, `ş`, `ğ`) kaydedilmesini sağlar.",
          "It preserves UTF-8 characters as human-readable native letters instead of escaping them to `\\uXXXX` sequences."
        ]
      },
      {
        id: "json-decode-error-cause",
        q: [
          "`json.JSONDecodeError` hatası hangi durumlarda ortaya çıkar?",
          "When is `json.JSONDecodeError` raised?"
        ],
        a: [
          "Ayrıştırılmak istenen metin geçerli bir JSON sözdizimine sahip olmadığında (örn: tek tırnak kullanımı, sonda fazladan virgül veya kesilmiş veri).",
          "When the input string violates JSON syntax rules (e.g. single quotes, trailing commas, or truncated payloads)."
        ]
      }
    ]
  });
})();

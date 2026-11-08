(function () {
  const R = String.raw;
  PY.addLib({
    id: "urllib",
    name: "urllib",
    sym: "url",
    color: "#f59e0b",
    focus: "both",
    level: 2,
    ext: false,
    cat: "web",
    docs: "https://docs.python.org/3/library/urllib.html",
    tagline: [
      "URL ayrıştırma, kodlama ve HTTP istekleri: Oltalama (phishing) tespiti ve SSRF doğrulaması.",
      "URL parsing, handling, and requests: Phishing host dissection and SSRF validation."
    ],
    analogy: [
      "Bir web adresini (URL) karmaşık bir zarf gibi düşünün. `urllib.parse`, bu zarfı titizlikle parçalarına ayırır: mektup hangi dille yazılmış (`scheme`), hangi alıcıya gidecek (`netloc` / host), evin hangi odasına bırakılacak (`path`) ve içinde hangi özel soru işaretleri var (`query`). Karışık oltalama adreslerinin ardındaki gerçek hedefi bu büyüteçle görürsün.",
      "Treat a URL like a complex shipping label. `urllib.parse` dissects each fragment: protocol scheme, destination host (`netloc`), endpoint path, and query parameters. A magnifying glass that exposes obfuscated phishing URLs instantly."
    ],
    intro: [
      [
        "`urllib`, Python standart kütüphanesinin URL'lerle çalışmak için sunduğu modüller paketidir: `urllib.parse` (URL ayrıştırma ve kodlama), `urllib.request` (HTTP istekleri açma) ve `urllib.error` (hata sınıfları).",
        "`urllib` is Python's standard package for working with URLs, containing `urllib.parse` (parsing and encoding), `urllib.request` (fetching URLs), and `urllib.error` (HTTP exceptions)."
      ],
      [
        "Siber güvenlikte URL ayrıştırma kritik bir savunma hattıdır: Oltalama (Phishing) analizinde sahte alan adlarını (örn: `https://banka.com@saldirgan.com/`) tespit etmek, SSRF açığına karşı host doğrulaması yapmak ve URL kodlama (percent-encoding) bypass denemelerini incelemek için `urllib.parse` kullanılır.",
        "In cyber defense, parsing URLs is critical for phishing analysis (detecting username@host tricks), preventing Server-Side Request Forgery (SSRF), and decoding percent-encoded payload bypasses."
      ]
    ],
    import: R`import urllib.parse
import urllib.request`,
    general: [
      [
        "Karmaşık web adreslerini protokol, alan adı, yol ve parametrelerine ayırmak (`urlparse`).",
        "Deconstructing complex URLs into scheme, netloc, path, and query components."
      ],
      [
        "Sözlükleri URL sorgu dizesine (`?k=v&a=b`) güvenle dönüştürmek (`urlencode`).",
        "Encoding dictionaries into standard URL query strings via `urlencode`."
      ],
      [
        "Göreceli bağlantıları mutlak URL'lerle güvenle birleştirmek (`urljoin`).",
        "Constructing absolute URLs from relative links using `urljoin`."
      ]
    ],
    cyberUse: [
      [
        "Oltalama (Phishing) Analizi: `http://google.com@evil.com` gibi kullanıcıyı yanıltan `userinfo` hilelerini `urlparse.netloc` ve `hostname` ile ifşa etmek.",
        "Exposing deceptive phishing URLs by analyzing parsed `hostname` and `netloc` components."
      ],
      [
        "Açık Yönlendirme (Open Redirect) Tespiti: Parametredeki hedef URL'in kendi siteniz dışına çıkıp çıkmadığını doğrulamak.",
        "Detecting Open Redirect flaws by verifying whether redirection parameters leave target domain bounds."
      ],
      [
        "WAF / Filtre Bypass İncelemesi: Çift URL kodlamalı (`%252e%252e%252f`) saldırı payload'larını `unquote()` ile çözerek incelemek.",
        "Decoding double-encoded payloads using `unquote()` during forensic payload triage."
      ]
    ],
    sections: [
      {
        id: "url-parsing",
        title: ["URL Ayrıştırma: urlparse & urlsplit", "URL Parsing: urlparse & urlsplit"],
        intro: [
          "Web adreslerini bileşenlerine ayıran ve inceleyen ana fonksiyonlar.",
          "Deconstructing URL strings into RFC-compliant tuple components."
        ],
        items: [
          {
            id: "urlparse",
            name: "urllib.parse.urlparse(urlstring)",
            kind: "function",
            sig: "urllib.parse.urlparse(urlstring, scheme='', allow_fragments=True) -> ParseResult",
            sum: [
              "Bir URL'i 6 bileşene (scheme, netloc, path, params, query, fragment) ayırır.",
              "Parses a URL into six components: scheme, netloc, path, params, query, fragment."
            ],
            desc: [
              "Adresin protokolünü (`scheme`), sunucu adını (`netloc` / `hostname`), portunu ve sorgu parametrelerini (`query`) tek tek nesne öznitelikleri olarak sunar.",
              "Breaks a URL string into standardized components. Provides `hostname` and `port` helper properties."
            ],
            params: [
              { n: "urlstring", d: ["Ayrıştırılacak URL adresi dizesi.", "URL string to dissect."] }
            ],
            ret: ["`ParseResult` adlandırılmış demeti.", "`ParseResult` named tuple."],
            ex: {
              code: R`import urllib.parse

u = urllib.parse.urlparse("https://api.hedef.com:8443/v1/auth?token=xyz#sonuc")
print("Scheme:", u.scheme)
print("Host:", u.hostname)
print("Port:", u.port)
print("Path:", u.path)
print("Query:", u.query)`,
              out: R`Scheme: https
Host: api.hedef.com
Port: 8443
Path: /v1/auth
Query: token=xyz`
            },
            cyber: [
              "Oltalama analizinde `u.hostname` gerçekte hangi sunucuya gidileceğini netleştirir. Örneğin `https://paypal.com@saldirgan.com/` adresinde `u.hostname` değeri `saldirgan.com`dur; `paypal.com` sadece kullanıcı adı alanıdır!",
              "In phishing analysis, `u.hostname` isolates the true destination host, unmasking deceptive `user@evil.com` tricks."
            ]
          },
          {
            id: "parse-qs",
            name: "urllib.parse.parse_qs(qs)",
            kind: "function",
            sig: "urllib.parse.parse_qs(qs, keep_blank_values=False, ...) -> dict[str, list[str]]",
            sum: [
              "URL sorgu dizesini (`k1=v1&k2=v2`) ayrıştırıp Python sözlüğü döner.",
              "Parses a query string into a dictionary where values are lists of strings."
            ],
            desc: [
              "Bir anahtarın birden çok kez geçebilme olasılığına karşı değerleri her zaman bir liste (`list`) olarak saklar (HTTP Parameter Pollution - HPP analizinde önemlidir).",
              "Extracts query key-value pairs into a dictionary. Values are lists to account for repeated parameters."
            ],
            params: [
              { n: "qs", d: ["Sorgu metni (örn: `'id=10&kategori=kitap'`).", "Query string to parse."] }
            ],
            ret: ["`dict[str, list[str]]` sözlüğü.", "Parsed query dictionary."],
            ex: {
              code: R`import urllib.parse

qs = "target=192.168.1.1&scan=fast&scan=deep"
parsed = urllib.parse.parse_qs(qs)
print(parsed["target"])
print(parsed["scan"])`,
              out: R`['192.168.1.1']
['fast', 'deep']`
            }
          },
          {
            id: "urljoin",
            name: "urllib.parse.urljoin(base, url)",
            kind: "function",
            sig: "urllib.parse.urljoin(base, url, allow_fragments=True) -> str",
            sum: [
              "Kök adres ile göreceli (relative) bir yolu tarayıcı mantığıyla birleştirir.",
              "Constructs a full (absolute) URL by combining a base URL with another URL."
            ],
            desc: [
              "Web tarayıcılarının link çözme algoritmasını (RFC 3986) uygular. Web crawler ve güvenlik tarayıcılarında sayfadaki `<a href='/login'>` linklerini tam adrese çevirmek için kullanılır.",
              "Implements RFC 3986 URL resolution rules. Used in web spiders to convert relative page links into full target URLs."
            ],
            ex: {
              code: R`import urllib.parse

base = "https://hedef.com/api/v1/users"
print(urllib.parse.urljoin(base, "details"))
print(urllib.parse.urljoin(base, "/logout"))`,
              out: R`https://hedef.com/api/v1/details
https://hedef.com/logout`
            }
          }
        ]
      },
      {
        id: "encoding-decoding",
        title: ["URL Kodlama ve Çözme (Percent-Encoding)", "URL Percent-Encoding & Decoding"],
        intro: [
          "`quote` ve `unquote` ile özel karakterlerin `%XX` dönüşümleri.",
          "Sanitizing and decoding percent-encoded URL parameters."
        ],
        items: [
          {
            id: "quote-unquote",
            name: "quote() ve unquote()",
            kind: "function",
            sig: "urllib.parse.quote(string, safe='/'), urllib.parse.unquote(string)",
            sum: [
              "Özel karakterleri `%XX` formatında kodlar veya tersine çözer.",
              "Percent-encodes or decodes special and non-ASCII characters."
            ],
            desc: [
              "`quote` boşluk ve Türkçe karakterleri URL uyumlu hale getirir (`%20` vb.). `unquote` ise saldırganların gizlediği kodları orijinal haline açar.",
              "`quote` replaces unsafe characters with `%XX` hex escapes. `unquote` reverses percent escapes back into plain text."
            ],
            ex: {
              code: R`import urllib.parse

encoded = urllib.parse.quote("admin@hedef.com?durum=açık")
print("Kodlanmis:", encoded)
print("Cozulmus:", urllib.parse.unquote(encoded))`,
              out: R`Kodlanmis: admin%40hedef.com%3Fdurum%3Da%C3%A7%C4%B1k
Cozulmus: admin@hedef.com?durum=açık`
            },
            cyber: [
              "Saldırganlar WAF filtrelerini atlatmak için `../` karakterlerini `%2e%2e%2f` şeklinde URL kodlayarak gönderir. Girdi analizinde `unquote` uygulanarak gizli kalıplar açığa çıkarılır.",
              "Attackers use percent-encoding to evade basic string filters; security analyzers apply `unquote` before pattern inspection."
            ]
          },
          {
            id: "urlencode",
            name: "urllib.parse.urlencode(query)",
            kind: "function",
            sig: "urllib.parse.urlencode(query, doseq=False, ...) -> str",
            sum: [
              "Bir sözlüğü (dict) URL sorgu dizesine veya POST form gövdesine dönüştürür.",
              "Converts a mapping object or sequence of two-element tuples to a percent-encoded query string."
            ],
            desc: [
              "`{'q': 'test', 'sayfa': 1}` sözlüğünü `'q=test&sayfa=1'` dizesine dönüştürür.",
              "Standard helper converting key-value maps to HTTP query strings."
            ],
            ex: {
              code: R`import urllib.parse

parametreler = {"hedef": "127.0.0.1", "kategori": "guvenlik"}
print(urllib.parse.urlencode(parametreler))`,
              out: R`hedef=127.0.0.1&kategori=guvenlik`
            }
          }
        ]
      },
      {
        id: "request-module",
        title: ["HTTP İstekleri: urllib.request", "HTTP Requests: urllib.request"],
        intro: [
          "Harici kütüphane kurmadan standart kütüphaneyle temel HTTP istekleri gönderme.",
          "Sending HTTP requests natively using Python's standard library."
        ],
        items: [
          {
            id: "urlopen",
            name: "urllib.request.urlopen(url)",
            kind: "function",
            sig: "urllib.request.urlopen(url, data=None, timeout=None, ...) -> HTTPResponse",
            sum: [
              "Belirtilen URL adresine bağlantı açar ve yanıt nesnesi döner.",
              "Opens the URL `url`, which can be either a string or a Request object."
            ],
            desc: [
              "Standart kütüphanenin dahili HTTP istemcisidir. Dönen nesne bir dosya gibi `.read()` ile okunur ve `.status` ile yanıt kodu öğrenilir.",
              "Basic standard library HTTP client. The response behaves like an open stream readable via `.read()`."
            ],
            ex: {
              code: R`import urllib.request
import http.server
import threading

class MiniHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"URLLIB_OK")
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), MiniHandler)
port = srv.server_port
threading.Thread(target=srv.serve_forever, daemon=True).start()

with urllib.request.urlopen(f"http://127.0.0.1:{port}", timeout=2.0) as resp:
    print(resp.status)
    print(resp.read().decode())

srv.shutdown()`,
              out: R`200
URLLIB_OK`
            }
          },
          {
            id: "request-class",
            name: "urllib.request.Request(url, ...)",
            kind: "class",
            sig: "urllib.request.Request(url, data=None, headers={}, method=None)",
            sum: [
              "Özel HTTP başlıkları (User-Agent vb.) ve metod tanımlayan istek nesnesi.",
              "An abstraction of a URL request, supporting custom headers and HTTP methods."
            ],
            desc: [
              "Varsayılan `Python-urllib/3.x` User-Agent başlığı yerine özel başlıklar tanımlamak veya POST verisi eklemek için kullanılır.",
              "Encapsulates customized request headers such as custom User-Agent tokens."
            ],
            ex: {
              code: R`import urllib.request

req = urllib.request.Request("http://example.com", headers={"User-Agent": "PyAtlasScanner/1.0"})
print(req.get_header("User-agent"))`,
              out: R`PyAtlasScanner/1.0`
            }
          },
          {
            id: "urllib-error",
            name: "urllib.error.HTTPError / URLError",
            kind: "exception",
            sig: "urllib.error.HTTPError(url, code, msg, hdrs, fp)",
            sum: [
              "HTTP hatalarında (404, 500 vb.) veya ağ bağlantı sorunlarında fırlatılan istisnalar.",
              "Exception hierarchy for URL fetch failures and HTTP status error codes."
            ],
            desc: [
              "`HTTPError`, sunucu 4xx veya 5xx döndüğünde fırlatılır; `e.code` yanıt kodunu verir. `URLError` ise sunucuya ulaşılamadığında (DNS hatası vb.) ortaya çıkar.",
              "`HTTPError` is raised for 4xx/5xx responses; `URLError` indicates network-level failure."
            ],
            ex: {
              code: R`import urllib.error

print(issubclass(urllib.error.HTTPError, urllib.error.URLError))`,
              out: R`True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "phishing-url-dissector",
        title: [
          "Oltalama (Phishing) ve Yanıltıcı Host Dedektörü",
          "Phishing & Deceptive Host Dissector"
        ],
        sum: [
          "`userinfo` ve sahte alan adı hilelerini `urlparse` ile çözümleme.",
          "Detecting deceptive credentials embedding and identifying true destination hosts."
        ],
        code: R`import urllib.parse

# Saldirganin kurbani kandirmak icin hazirladigi adres: ||| Phishing URL trick
phishing_url = "https://online.guvenlibanka.com@evil-attacker.com/login"

parsed = urllib.parse.urlparse(phishing_url)

print("Kullanicinin gordugu sahte alan adi:", parsed.username)
print("GERCEK BAGLANILAN HEDEF SUNUCU:", parsed.hostname)
print("Saldiri tespit edildi mi:", parsed.username is not None and "banka" in parsed.username)`,
        out: R`Kullanicinin gordugu sahte alan adi: online.guvenlibanka.com
GERCEK BAGLANILAN HEDEF SUNUCU: evil-attacker.com
Saldiri tespit edildi mi: True`,
        cyber: true,
        note: [
          "Saldırganlar meşru site adını kullanıcı adı (`userinfo`) olarak ekler. Tarayıcılar ise `@` işaretinden sonrasını asıl hedef olarak kabul eder. `urlparse.hostname` bu hileyi anında ortaya çıkarır.",
          "Browsers route to the authority following the `@` delimiter. Inspecting `parsed.hostname` exposes deceptive userinfo masking."
        ]
      },
      {
        id: "open-redirect-validator",
        title: [
          "Açık Yönlendirme (Open Redirect) Güvenlik Doğrulayıcısı",
          "Open Redirect URL Validator"
        ],
        sum: [
          "Login sonrası yönlendirme URL'inin kendi alan adımızda kaldığını teyit etme.",
          "Enforcing that post-login redirection targets do not escape authorized domain scope."
        ],
        code: R`import urllib.parse

GUVENLI_DOMAIN = "benimsitem.com"

def is_safe_redirect(target_url):
    parsed = urllib.parse.urlparse(target_url)
    # Eger hostname bossa (/profil) veya guvenli alan adimizsa izin ver ||| Allow relative paths or exact domain matches:
    if not parsed.hostname:
        return True
    return parsed.hostname == GUVENLI_DOMAIN

print("Guvenli yonlendirme (/panel):", is_safe_redirect("/panel"))
print("Saldiri (https://evil.com):", is_safe_redirect("https://evil.com/zararli"))`,
        out: R`Guvenli yonlendirme (/panel): True
Saldiri (https://evil.com): False`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "urlparse-hostname-vs-netloc",
        q: [
          "`urlparse` sonucunda `netloc` ile `hostname` arasındaki fark nedir ve neden güvenlikte `hostname` kullanılır?",
          "What is the difference between `netloc` and `hostname` in `urlparse`, and why use `hostname` for security?"
        ],
        a: [
          "`netloc` kullanıcı adını ve portu da içerir (`user:pass@host:8080`). `hostname` ise port ve kullanıcı adından arındırılmış saf hedef sunucu adını döner; güvenlik kontrollerinde şaşırtmacaları engellemek için `hostname` kullanılmalıdır.",
          "`netloc` retains credentials and port (`user:pass@host:8080`). `hostname` isolates strictly the target host without distraction, essential for security checks."
        ]
      },
      {
        id: "parse-qs-list-values",
        q: [
          "`urllib.parse.parse_qs()` fonksiyonu sözlük değerlerini neden tek bir metin yerine bir liste (`list`) olarak saklar?",
          "Why does `urllib.parse.parse_qs()` store values as lists rather than simple strings?"
        ],
        a: [
          "Çünkü HTTP standardında aynı parametre adı URL'de birden fazla kez tekrarlanabilir (örn: `?id=1&id=2`). Her iki değeri de kaybetmemek ve parametre kirliliği (HPP) analizine izin vermek için liste kullanılır.",
          "Because query strings can repeat keys (e.g. `?id=1&id=2`). Using lists preserves all parameter occurrences, critical for HTTP Parameter Pollution (HPP) inspection."
        ]
      },
      {
        id: "unquote-waf-evasion",
        q: [
          "WAF (Web Application Firewall) loglarını incelerken neden `unquote()` uygulanmalıdır?",
          "Why should `unquote()` be executed when analyzing WAF bypass logs?"
        ],
        a: [
          "Saldırganlar zararlı SQL veya XSS kodlarını tespit edilmesin diye URL percent-encoding (`%27`, `%3Cscript%3E`) ile kodlar. `unquote()` bu maskeyi kaldırarak gerçek saldırı yükünü açığa çıkarır.",
          "Attackers mask SQLi or XSS payloads behind percent-encoding (`%27`, `%3Cscript%3E`). `unquote()` normalizes the input, exposing the raw attack payload."
        ]
      },
      {
        id: "urljoin-relative-resolution",
        q: [
          "`urllib.parse.urljoin('https://site.com/dizin/sayfa', '/login')` ifadesinin çıktısı ne olur?",
          "What is the evaluation of `urllib.parse.urljoin('https://site.com/dizin/sayfa', '/login')`?"
        ],
        a: [
          "`https://site.com/login` olur. Çünkü `/login` başında eğik çizgi olduğu için doğrudan alan adının kökünden başlar.",
          "`https://site.com/login`. The leading slash signals that the path resolves relative to the domain root."
        ]
      },
      {
        id: "open-redirect-defense",
        q: [
          "Açık Yönlendirme (Open Redirect) açığı nedir ve `urllib.parse` ile nasıl önlenir?",
          "What is an Open Redirect vulnerability and how is it defended via `urllib.parse`?"
        ],
        a: [
          "Web sitesinin kullanıcıyı güvenilmeyen harici bir adrese yönlendirmesidir. `urlparse` ile yönlendirme hedefinin `hostname` değeri okunur ve yalnızca şirket alan adıyla eşleşiyorsa izin verilir.",
          "An attacker exploits unvalidated redirect endpoints to send victims to malicious sites. Dissecting the target via `urlparse` validates that `hostname` matches authorized domains."
        ]
      }
    ]
  });
})();

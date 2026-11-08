(function () {
  const R = String.raw;
  PY.addLib({
    id: "requests",
    name: "requests",
    sym: "rq",
    color: "#f59e0b",
    focus: "both",
    level: 2,
    ext: true,
    install: "pip install requests",
    cat: "web",
    docs: "https://requests.readthedocs.io/",
    tagline: [
      "İnsanlar için HTTP istemcisi: REST API istekleri, web kazıma ve güvenlik başlık denetimi.",
      "HTTP for Humans: REST API calls, web scraping, and HTTP security auditing."
    ],
    analogy: [
      "Düşük seviyeli `urllib` veya ham soketlerle HTTP konuşmak, mektubu telgrafla mors alfabesiyle çekmeye benzer. `requests` ise sana tek bir düğmeyle çalışan modern, lüks bir kurye servisi verir: adresi verirsin (`get`), kurye gider, yanıtı alır, çerezleri ve oturumu hatırlar, JSON geldiyse otomatik sözlüğe dönüştürür.",
      "Using low-level sockets for HTTP is like sending morse code manually. `requests` is an automated VIP courier service: give it a URL (`get`), and it handles connection pooling, cookies, redirects, and parses JSON automatically."
    ],
    intro: [
      [
        "`requests`, Python dünyasının en popüler üçüncü taraf kütüphanesidir. Standart kütüphanedeki `urllib.request` modülünün karmaşık ve hantal yapısını tamamen ortadan kaldırır; temiz, zarif ve sezgisel bir sözdizimi sunar.",
        "`requests` is one of the most celebrated third-party packages in Python, eliminating `urllib.request` verbosity with an elegant, intuitive interface."
      ],
      [
        "Siber güvenlikte ve web testlerinde temel silahtır: API uç noktalarını denetlemek, güvenlik başlıklarını (HSTS, CSP, X-Frame-Options) incelemek, çerez güvenlik bayraklarını (Secure, HttpOnly) teyit etmek ve test payload'ları göndermek tamamen `requests` ile yapılır.",
        "In application security testing, it is fundamental: auditing API endpoints, checking security response headers (HSTS, CSP), verifying cookie flags (Secure, HttpOnly), and sending custom payloads."
      ]
    ],
    import: R`import requests`,
    general: [
      [
        "REST API'lere GET, POST, PUT, DELETE istekleri göndermek ve JSON yanıtlarını tüketmek.",
        "Sending GET, POST, PUT, DELETE requests to REST APIs and parsing JSON payloads."
      ],
      [
        "Web sitelerinden otomatik veri çekmek (scraping) ve içerik indirmek.",
        "Automating data extraction, web scraping, and file downloads."
      ],
      [
        "Kullanıcı girişlerini ve oturumlarını (`requests.Session`) çerezlerle sürdürmek.",
        "Maintaining persistent authenticated user sessions and cookies with `requests.Session`."
      ]
    ],
    cyberUse: [
      [
        "Hedef web sunucularının güvenlik başlıklarını (`Content-Security-Policy`, `X-Content-Type-Options`) programatik olarak denetlemek.",
        "Programmatically verifying presence of essential hardening headers (CSP, HSTS, X-Frame-Options)."
      ],
      [
        "Oturum çerezlerinde `HttpOnly`, `Secure` ve `SameSite` bayraklarının açık olduğunu doğrulamak.",
        "Auditing session cookies to confirm `HttpOnly`, `Secure`, and `SameSite` flags are configured."
      ],
      [
        "Yetkili lab ortamlarında web uygulaması parametrelerine yönelik hata ayıklama ve test istekleri göndermek.",
        "Automating test request routines against lab web targets with custom headers and user-agents."
      ]
    ],
    sections: [
      {
        id: "requests-methods",
        title: ["HTTP İstek Metodları", "HTTP Request Methods"],
        intro: [
          "Temel HTTP metodlarını tetikleyen en üst seviye fonksiyonlar.",
          "Top-level functions corresponding to core HTTP verbs."
        ],
        items: [
          {
            id: "get",
            name: "requests.get(url, ...)",
            kind: "function",
            sig: "requests.get(url, params=None, headers=None, timeout=None, verify=True, ...) -> Response",
            sum: [
              "Belirtilen URL adresine bir HTTP GET isteği gönderir.",
              "Sends an HTTP GET request to the specified URL."
            ],
            desc: [
              "En sık kullanılan HTTP metodudur. Sunucudan veri okumak için kullanılır. `params` sözlüğü URL'e `?key=val` olarak eklenir. Asla `timeout` belirtmeden çağırmayınız.",
              "The most ubiquitous HTTP method. Retrieves data from the server. `params` dictionary is automatically query-encoded into the URL. Always specify a `timeout`."
            ],
            params: [
              { n: "url", d: ["Hedef web adresi (örn: `'https://httpbin.org/get'`).", "Target URL string."] },
              { n: "params", d: ["Sorgu parametreleri sözlüğü (`dict`).", "Dictionary of URL query parameters."] },
              { n: "headers", d: ["Özel HTTP başlıkları sözlüğü (örn: `User-Agent`).", "Dictionary of custom HTTP request headers."] },
              { n: "timeout", d: ["Maksimum bekleme süresi saniye cinsinden (örn: `3.0`).", "Float timeout in seconds to prevent indefinite blocking."] }
            ],
            ret: ["`requests.Response` nesnesi.", "`requests.Response` instance."],
            ex: {
              code: R`import requests
import http.server
import threading

# Yerel test HTTP sunucusu baslat ||| Spin up local mock HTTP server
class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"PYATLAS_OK")
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), Handler)
port = srv.server_port
threading.Thread(target=srv.serve_forever, daemon=True).start()

# requests ile istek at ||| Send request using requests
res = requests.get(f"http://127.0.0.1:{port}", timeout=2.0)
print(res.status_code)
print(res.text.strip())
srv.shutdown()`,
              out: R`200
PYATLAS_OK`
            },
            cyber: [
              "İstek atarken varsayılan User-Agent `'python-requests/x.x'` dir. WAF (Web Application Firewall) sistemleri bu başlığı anında engelleyebilir. Güvenlik testlerinde gerçekçi bir tarayıcı User-Agent başlığı tanımlanmalıdır.",
              "The default user-agent header is `'python-requests/x.x'`. WAFs frequently drop this by default. Custom headers should be supplied during authorized audits."
            ],
            gotcha: [
              "Eğer `timeout` belirtmezseniz ve sunucu yanıt vermezse Python scriptiniz sonsuza kadar askıda kalabilir. Her istekte daima bir `timeout` (örn: `5.0`) belirtin.",
              "If no `timeout` is passed, `requests` will hang indefinitely if the socket drops. Always supply a timeout."
            ]
          },
          {
            id: "post",
            name: "requests.post(url, ...)",
            kind: "function",
            sig: "requests.post(url, data=None, json=None, headers=None, ...) -> Response",
            sum: [
              "Hedef adrese HTTP POST isteği ile veri veya JSON gönderir.",
              "Sends an HTTP POST request carrying form-data or JSON payload."
            ],
            desc: [
              "Sunucuya yeni veri göndermek için kullanılır. `json={'k': 'v'}` parametresi verildiğinde `requests` veriyi otomatik JSON formatına çevirir ve `Content-Type: application/json` başlığını ekler.",
              "Transmits data to the server. Supplying `json={...}` automatically serializes the dictionary and attaches the `Content-Type: application/json` header."
            ],
            params: [
              { n: "data", d: ["Form verisi veya ham baytlar.", "Form-encoded dictionary or raw bytes."] },
              { n: "json", d: ["Otomatik JSON'a çevrilecek Python sözlüğü (`dict`).", "Dictionary automatically encoded into JSON body."] }
            ],
            ret: ["`requests.Response` nesnesi.", "`requests.Response` instance."],
            ex: {
              code: R`import requests
import http.server
import threading
import json

class PostHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)
        data = json.loads(body.decode("utf-8"))
        self.send_response(201)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"alindi": data["kullanici"]}).encode("utf-8"))
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), PostHandler)
port = srv.server_port
threading.Thread(target=srv.serve_forever, daemon=True).start()

r = requests.post(f"http://127.0.0.1:{port}", json={"kullanici": "admin"}, timeout=2.0)
print(r.status_code)
print(r.json()["alindi"])
srv.shutdown()`,
              out: R`201
admin`
            }
          },
          {
            id: "head",
            name: "requests.head(url, ...)",
            kind: "function",
            sig: "requests.head(url, ...) -> Response",
            sum: [
              "Gövdeyi (body) indirmeden yalnızca HTTP başlıklarını çeker.",
              "Sends a HEAD request, fetching headers without downloading the body payload."
            ],
            desc: [
              "Gövdeyi indirmediği için son derece hızlıdır ve bant genişliği tüketmez. Güvenlik başlıklarını denetlerken veya sunucu türünü belirlerken (banner reconnaissance) idealdir.",
              "Extremely lightweight as it skips the response body. Perfect for inspecting response headers and discovering server banners during security scans."
            ],
            ex: {
              code: R`import requests
import http.server
import threading

class HeadHandler(http.server.BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.send_response(200)
        self.send_header("X-Service-Name", "LabAuth/1.0")
        self.send_header("X-Frame-Options", "DENY")
        self.end_headers()
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), HeadHandler)
port = srv.server_port
threading.Thread(target=srv.serve_forever, daemon=True).start()

res = requests.head(f"http://127.0.0.1:{port}", timeout=2.0)
print(res.headers.get("X-Service-Name"))
print(res.headers.get("X-Frame-Options"))
print(len(res.text))  # Govde bos olmalidir ||| Body should be empty
srv.shutdown()`,
              out: R`LabAuth/1.0
DENY
0`
            }
          }
        ]
      },
      {
        id: "response-object",
        title: ["Response Nesnesi ve Veri Okuma", "Response Object & Data Inspection"],
        intro: [
          "Sunucudan dönen durum kodunu, başlıkları, metni ve JSON içeriğini ayrıştırma.",
          "Inspecting HTTP status codes, headers, raw text, and parsed JSON payloads."
        ],
        items: [
          {
            id: "status-code",
            name: "response.status_code / ok",
            kind: "attr",
            sig: "response.status_code: int, response.ok: bool",
            sum: [
              "HTTP durum kodu (örn: 200, 404) ve başarı doğrulaması.",
              "HTTP integer status code (e.g. 200, 404) and boolean success flag."
            ],
            desc: [
              "`status_code`, 200 (OK), 301 (Yönlendirme), 403 (Yasak), 404 (Bulunamadı), 500 (Sunucu Hatası) gibi tamsayı kodudur. `response.ok`, kod 400'den küçükse `True` döner.",
              "`status_code` holds the integer response code. `response.ok` is a boolean convenience attribute returning `True` if `status_code < 400`."
            ],
            ex: {
              code: R`import requests

# Test Response ornegi ||| Construct mock Response
r = requests.Response()
r.status_code = 200
print(r.status_code, r.ok)
r.status_code = 404
print(r.status_code, r.ok)`,
              out: R`200 True
404 False`
            }
          },
          {
            id: "json-method",
            name: "response.json()",
            kind: "method",
            sig: "response.json() -> dict | list",
            sum: [
              "JSON gövdesini doğrudan Python sözlük veya listesine ayrıştırır.",
              "Parses the HTTP response body as JSON into native Python objects."
            ],
            desc: [
              "`json.loads(response.text)` işlemini otomatik yapar. Gövde geçerli bir JSON formatında değilse `requests.exceptions.JSONDecodeError` fırlatır.",
              "Convenience wrapper around `json.loads(response.text)`. Raises `JSONDecodeError` if the response body is not valid JSON."
            ],
            ex: {
              code: R`import requests

r = requests.Response()
r._content = b'{"durum": "aktif", "id": 101}'
r.encoding = "utf-8"
data = r.json()
print(data["durum"], data["id"])`,
              out: R`aktif 101`
            }
          },
          {
            id: "raise-for-status",
            name: "response.raise_for_status()",
            kind: "method",
            sig: "response.raise_for_status()",
            sum: [
              "Hata durumunda (4xx veya 5xx) otomatik olarak HTTPError fırlatır.",
              "Raises `HTTPError` if the response status code indicates a 4xx or 5xx error."
            ],
            desc: [
              "İstek başarısız olduğunda manuel `if r.status_code != 200:` kontrolü yazmak yerine bu metodu çağırabilirsiniz. Durum kodu 200-399 arasındaysa hiçbir şey yapmaz.",
              "Enables clean failure-handling without repetitive status-code checks. Throws `requests.exceptions.HTTPError` for client or server errors."
            ],
            ex: {
              code: R`import requests

r = requests.Response()
r.status_code = 403
r.url = "http://example.com/admin"
try:
    r.raise_for_status()
except requests.exceptions.HTTPError as err:
    print("HATA_YAKALANDI:", err.response.status_code)`,
              out: R`HATA_YAKALANDI: 403`
            }
          },
          {
            id: "session",
            name: "requests.Session()",
            kind: "class",
            sig: "requests.Session()",
            sum: [
              "Çerezleri, TCP bağlantı havuzunu ve oturum başlıklarını saklayan kalıcı oturum.",
              "Maintains persistent cookies, connection pooling, and shared headers across requests."
            ],
            desc: [
              "Aynı sunucuya ardışık istekler atarken her defasında yeni bir TCP bağlantısı ve TLS el sıkışması yapmaz; bağlantıyı canlı tutar (`keep-alive`). Bu sayede tarama ve testlerde %300'e varan hız artışı sağlar. Sunucudan dönen `Set-Cookie` başlıklarını otomatik saklar.",
              "Reuses underlying TCP connections via HTTP Keep-Alive, dramatically accelerating multi-request loops. Automatically stores and attaches cookies across successive calls."
            ],
            ret: ["Yeni bir `requests.Session` nesnesi.", "A new `requests.Session` object."],
            ex: {
              code: R`import requests

with requests.Session() as s:
    s.headers.update({"User-Agent": "PyAtlasAuditor/1.0"})
    print("User-Agent" in s.headers)`,
              out: R`True`
            },
            cyber: [
              "Web oturumu gerektiren zaafiyet testlerinde (CSRF, IDOR, yetki yükseltme) giriş yaptıktan sonra alınan `session_id` çerezi `Session` nesnesi sayesinde tüm test isteklerine otomatik eklenir.",
              "In automated vulnerability audits, authenticated cookies set during login persist effortlessly across all subsequent requests via `Session`."
            ]
          },
          {
            id: "verify-param",
            name: "verify (TLS/SSL Sertifika Doğrulama)",
            kind: "concept",
            sig: "requests.get(url, verify=True/False)",
            sum: [
              "HTTPS sertifikasının güvenilir CA tarafından imzalandığını denetler.",
              "Enforces SSL/TLS certificate chain validation against trusted CA bundles."
            ],
            desc: [
              "Varsayılan olarak `True`'dur ve sahte/geçersiz sertifikalarda `requests.exceptions.SSLError` fırlatarak sizi Ortadaki Adam (MITM) saldırılarından korur. `verify=False` yapılırsa sertifika kontrolü devre dışı kalır.",
              "Enabled by default (`verify=True`) to protect against Man-in-the-Middle (MITM) certificate spoofing. Setting `verify=False` bypasses all TLS checks."
            ],
            ex: {
              code: R`import requests

print(isinstance(requests.exceptions.SSLError, type))`,
              out: R`True`
            },
            cyber: [
              "Siber güvenlikte `verify=False` YALNIZCA kendi yerel test labınızdaki kendinden imzalı (self-signed) sertifikalarda veya Burp Suite / OWASP ZAP proxy'si arkasında hata ayıklarken kullanılmalıdır. Canlı üretim kodlarında asla kapatılmamalıdır.",
              "Disabling TLS verification (`verify=False`) opens you to MITM spoofing. Only use it when proxying through interceptors like Burp Suite in authorized labs."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "security-headers-audit",
        title: [
          "Web Güvenlik Başlıkları Denetleyicisi (Security Headers Auditor)",
          "Web Security Headers Auditor"
        ],
        sum: [
          "Bir web sunucusunun HSTS, CSP, X-Frame-Options ve X-Content-Type başlıklarını kontrol etme.",
          "Verifying whether a target website implements vital defense-in-depth security headers."
        ],
        code: R`import requests
import http.server
import threading

# Test sunucusu baslat ||| Mock web server with some headers
class SecHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("X-Frame-Options", "DENY")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.end_headers()
        self.wfile.write(b"guvenli sayfa")
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), SecHandler)
port = srv.server_port
threading.Thread(target=srv.serve_forever, daemon=True).start()

url = f"http://127.0.0.1:{port}"
r = requests.get(url, timeout=2.0)

# Denetlenecek kritik guvenlik basliklari ||| Vital headers to check
wanted = ["X-Frame-Options", "X-Content-Type-Options", "Content-Security-Policy"]
for h in wanted:
    val = r.headers.get(h)
    print(f"{h}: {val if val else 'EKSIK'}")

srv.shutdown()`,
        out: R`X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Content-Security-Policy: EKSIK`,
        cyber: true,
        note: [
          "Web uygulama güvenliği denetimlerinde eksik güvenlik başlıkları raporların en sık karşılaşılan 'Defense in Depth' bulgularıdır.",
          "Missing security headers are common baseline findings in external web application penetration tests."
        ]
      },
      {
        id: "cookie-flag-checker",
        title: [
          "Oturum Çerezleri Güvenlik Bayrağı Denetimi",
          "Session Cookie Security Flag Auditor"
        ],
        sum: [
          "Sunucunun yolladığı çerezlerde `HttpOnly` ve `Secure` bayraklarının varlığını doğrulama.",
          "Verifying whether session cookies enable `HttpOnly` and `Secure` hardening flags."
        ],
        code: R`import requests
import http.server
import threading

class CookieHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        # Guvenli bir cerez ayarla ||| Set hardened cookie
        self.send_header("Set-Cookie", "session_token=XYZ123; Secure; HttpOnly; SameSite=Strict")
        self.end_headers()
        self.wfile.write(b"OK")
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), CookieHandler)
port = srv.server_port
threading.Thread(target=srv.serve_forever, daemon=True).start()

res = requests.get(f"http://127.0.0.1:{port}", timeout=2.0)
for cookie in res.cookies:
    print(cookie.name, "Secure:", cookie.secure, "HttpOnly:", cookie.has_nonstandard_attr("HttpOnly"))

srv.shutdown()`,
        out: R`session_token Secure: True HttpOnly: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "why-timeout-mandatory",
        q: [
          "`requests` kütüphanesinde neden her istekte açıkça `timeout` belirtilmelidir?",
          "Why is it mandatory to explicitly supply a `timeout` on every `requests` call?"
        ],
        a: [
          "Varsayılan olarak `timeout=None`'dur. Yani sunucu bağlantıyı kabul edip hiçbir yanıt vermezse veya paket düşerse Python kodunuz sonsuza kadar donar (hang) ve program kilitlenir.",
          "By default `timeout=None`. If the server accepts the TCP link but drops silence, your Python application will freeze forever, exhausting threads."
        ]
      },
      {
        id: "session-connection-pooling",
        q: [
          "`requests.Session()` kullanmanın düz `requests.get()` çağrılarına göre avantajı nedir?",
          "What is the operational advantage of `requests.Session()` over isolated `requests.get()` calls?"
        ],
        a: [
          "TCP bağlantı havuzunu (connection pool) canlı tutarak el sıkışmaları tekrarlamaz (hız artar) ve sunucudan dönen oturum çerezlerini ardışık tüm isteklere otomatik olarak taşır.",
          "It reuses underlying TCP sockets (HTTP Keep-Alive), vastly accelerating multi-request loops, and automatically persists session cookies."
        ]
      },
      {
        id: "verify-false-danger",
        q: [
          "`verify=False` parametresini canlı bir sistemde kullanmak ne tür bir güvenlik riski doğurur?",
          "What vulnerability is introduced if `verify=False` is set in production scripts?"
        ],
        a: [
          "TLS/SSL sertifika zinciri denetimi kapatıldığı için ağdaki saldırganlar araya girip sahte sertifikalarla trafiği dinleyebilir ve değiştirebilir (Ortadaki Adam - MITM saldırısı).",
          "It disables TLS certificate validation, making the communication trivially interceptable and alterable via Man-in-the-Middle (MITM) certificate spoofing."
        ]
      },
      {
        id: "raise-for-status-utility",
        q: [
          "`response.raise_for_status()` metodu ne işe yarar?",
          "What is the role of `response.raise_for_status()`?"
        ],
        a: [
          "HTTP yanıt kodu bir hata belirtiyorsa (4xx İstemci Hatası veya 5xx Sunucu Hatası) otomatik olarak `requests.exceptions.HTTPError` istisnası fırlatır; 2xx kodlarında sessizce geçer.",
          "Throws a `requests.exceptions.HTTPError` if the HTTP response code reflects a 4xx or 5xx error, eliminating manual if/else checks."
        ]
      },
      {
        id: "json-param-vs-data",
        q: [
          "`requests.post(url, json={...})` ile `data={...}` arasındaki fark nedir?",
          "What is the difference between `requests.post(url, json={...})` and `data={...}`?"
        ],
        a: [
          "`json={...}` sözlüğü otomatik JSON dizesine dönüştürür ve `Content-Type: application/json` başlığını ekler. `data={...}` ise standart form verisi (`application/x-www-form-urlencoded`) formatında kodlar.",
          "`json={...}` auto-serializes the dictionary and sets `Content-Type: application/json`. `data={...}` encodes inputs as standard form-urlencoded key-value pairs."
        ]
      }
    ]
  });
})();

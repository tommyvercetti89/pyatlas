(function () {
  const R = String.raw;
  PY.addLib({
    id: "http.server",
    name: "http.server",
    sym: "hs",
    color: "#06b6d4",
    focus: "both",
    level: 2,
    ext: false,
    cat: "network",
    docs: "https://docs.python.org/3/library/http.server.html",
    tagline: [
      "Dahili HTTP sunucusu: yerel test dinleyicileri, OAST callback yakalama ve hafif bal küpü (honeypot).",
      "Built-in HTTP server: local test listeners, OAST callback inspection, and lightweight honeypots."
    ],
    analogy: [
      "`requests` ve `urllib` restorandaki müşteri gibidir: sipariş verir (istek gönderir) ve yemeği bekler. `http.server` ise siparişi karşılayan şef ve garsonun kendisidir: kapıyı açar, gelen istekleri dinler ve istemciye HTTP durum kodu ve HTML/JSON yanıtı döner.",
      "`requests` and `urllib` act as the customer: they place orders (send HTTP requests) and wait for the response. `http.server` is the restaurant host: it binds to a port, listens for incoming connections, and serves HTTP status codes and responses."
    ],
    intro: [
      [
        "`http.server` modülü, harici hiçbir kütüphane (`flask`, `fastapi`, `nginx`) kurmaya ihtiyaç duymadan saf Python standart kütüphanesiyle temel HTTP sunucuları ayağa kaldırmayı sağlar.",
        "The `http.server` module provides basic HTTP server abstractions using pure Python standard library without third-party frameworks."
      ],
      [
        "Siber güvenlik lablarında ve sızma testlerinde; bant dışı (OAST / Out-of-Band) SSRF zafiyetlerini test etmek, exploit callback'lerini yakalamak, canary belirteçlerini izlemek veya hızlı bir bal küpü (honeypot) dinleyicisi çalıştırmak için en pratik araçtır.",
        "In offensive and defensive security labs, `http.server` is widely used to capture SSRF callbacks, verify Out-of-Band (OAST) telemetry, track canary triggers, and run lightweight credential honeypots."
      ]
    ],
    import: R`import http.server
from http.server import HTTPServer, BaseHTTPRequestHandler, SimpleHTTPRequestHandler`,
    general: [
      ["Yerel web projelerini ve statik HTML/JS dosyalarını tek satırda test sunucusunda yayınlama (`python -m http.server`).", "Serving static HTML/JS assets locally via `python -m http.server` for rapid testing."],
      ["Mikroservis testlerinde sahte (mock) API yanıtları dönen hafif uç noktalar kurma.", "Creating mock API endpoints returning simulated JSON payloads in integration tests."],
      ["Gelen HTTP başlıklarını ve gövdelerini terminale basarak hata ayıklama.", "Inspecting raw HTTP headers and request bodies on stdout for debugging."]
    ],
    cyberUse: [
      ["Bant Dışı (OAST) ve SSRF Testi: Sunucu Tarafı İstek Sahteciliği (SSRF) veya XSS zafiyeti ararken hedef sunucunun bizim yerel IP'mize istek atıp atmadığını yakalayan callback sunucusu çalıştırma.", "SSRF & OAST verification: spinning up an ephemeral callback listener to confirm Out-of-Band HTTP interactions from vulnerable target services."],
      ["Bal Küpü (Honeypot) ve Canary Dinleyicisi: Saldırganların sıkça taradığı yolları (`/wp-login.php`, `/.env`) dinleyip istek atan IP'leri loglayan erken uyarı tuzakları kurma.", "Canary token & honeypot listeners: monitoring deceptive trap endpoints (`/.env`, `/admin`) to capture offensive reconnaissance IPs."],
      ["Güvenlik Uyarısı: `SimpleHTTPRequestHandler` dizin listeleme ve dosya okuma sunduğundan ve hiçbir yetkilendirme içermediğinden asla internete açık kurumsal ortamlarda çalıştırılmamalıdır.", "Security caution: `SimpleHTTPRequestHandler` exposes directory browsing without authentication and must never be bound to untrusted public interfaces."]
    ],
    sections: [
      {
        id: "server-core",
        title: ["Sunucu Mimarisi ve Sınıfları", "Server Architecture & Classes"],
        intro: [
          "`HTTPServer`, `ThreadingHTTPServer` ve dinleme döngüsü.",
          "Instantiating HTTP servers and managing lifecycle event loops."
        ],
        items: [
          {
            id: "httpserver",
            name: "http.server.HTTPServer(server_address, RequestHandlerClass)",
            kind: "class",
            sig: "http.server.HTTPServer(server_address: tuple[str, int], RequestHandlerClass: type)",
            sum: [
              "Belirtilen IP ve port üzerinde HTTP isteklerini dinleyen temel sunucu sınıfı.",
              "Constructs an HTTP server instance listening on the given host address and port."
            ],
            desc: [
              "`server_address` olarak `('127.0.0.1', 8080)` verilir. `port=0` verilirse işletim sistemi boşta olan rastgele bir portu otomatik tahsis eder (testler için idealdir).",
              "Binds to `(host, port)`. Passing `port=0` assigns an ephemeral OS port automatically, ideal for conflict-free test suites."
            ],
            ex: {
              code: R`import http.server

class BoşHandler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), BoşHandler)
print("Sunucu baglandi mi:", srv.server_port > 0)
srv.server_close()`,
              out: R`Sunucu baglandi mi: True`
            }
          },
          {
            id: "threading-httpserver",
            name: "http.server.ThreadingHTTPServer",
            kind: "class",
            sig: "http.server.ThreadingHTTPServer(server_address, RequestHandlerClass)",
            sum: [
              "Her yeni HTTP isteğini ayrı bir thread'de işleyen çok iş parçacıklı sunucu (Python 3.7+).",
              "A multi-threaded HTTPServer variant processing each connection in a dedicated thread."
            ],
            desc: [
              "Standart `HTTPServer` tek iş parçacıklıdır; bir istek takılırsa diğer tüm istemciler bloke olur. `ThreadingHTTPServer` ise eşzamanlı gelen istekleri birbirini bekletmeden işler.",
              "Overcomes single-threaded blocking limitations by spawning independent worker threads for concurrent inbound connections."
            ],
            ex: {
              code: R`import http.server

class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args): pass

tsrv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
print("Threading sunucu hazir:", tsrv.server_port > 0)
tsrv.server_close()`,
              out: R`Threading sunucu hazir: True`
            }
          },
          {
            id: "serve-forever",
            name: "server.serve_forever(poll_interval=0.5)",
            kind: "method",
            sig: "srv.serve_forever(poll_interval: float = 0.5) -> None",
            sum: [
              "Sunucuyu kesintisiz dinleme döngüsüne sokar; `shutdown()` çağrılana kadar çalışır.",
              "Runs the server loop until an explicit shutdown() invocation."
            ],
            desc: [
              "Arka plan thread'inde çalıştırıldığında testler sırasında ana programı kilitlemeden HTTP isteklerini karşılayabilir.",
              "Typically started in a background daemon thread during automated test sweeps."
            ],
            ex: {
              code: R`import http.server
import threading

class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), Handler)
t = threading.Thread(target=srv.serve_forever, daemon=True)
t.start()
print("Sunucu thread'de calisiyor mu:", t.is_alive())
srv.shutdown()
srv.server_close()`,
              out: R`Sunucu thread'de calisiyor mu: True`
            }
          },
          {
            id: "server-close",
            name: "server.server_close()",
            kind: "method",
            sig: "srv.server_close() -> None",
            sum: [
              "Sunucu soketini kapatır ve portu işletim sistemine geri iade eder.",
              "Closes the server listening socket and releases the bound port."
            ],
            desc: [
              "Sunucu sonlandırıldığında çağrılmazsa soket `TIME_WAIT` durumunda kalabilir ve `Address already in use` hatasına yol açabilir.",
              "Releases listening socket resources, preventing socket port exhaustion and bind errors."
            ],
            ex: {
              code: R`import http.server

class Dummy(http.server.BaseHTTPRequestHandler):
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), Dummy)
srv.server_close()
print("Soket kapatildi")`,
              out: R`Soket kapatildi`
            }
          }
        ]
      },
      {
        id: "handler-mechanics",
        title: ["İstek Yöneticisi ve Yanıt Üretimi", "Request Handlers & Response Construction"],
        intro: [
          "`BaseHTTPRequestHandler`, `do_GET`, `do_POST` ve HTTP başlıkları.",
          "Overriding dispatch methods and crafting HTTP response envelopes."
        ],
        items: [
          {
            id: "base-handler",
            name: "http.server.BaseHTTPRequestHandler",
            kind: "class",
            sig: "http.server.BaseHTTPRequestHandler(request, client_address, server)",
            sum: [
              "HTTP isteklerini ayrıştıran ve `do_GET()`, `do_POST()` metotlarını tetikleyen temel sınıf.",
              "Base class for handling incoming HTTP requests and dispatching to do_METHOD hooks."
            ],
            desc: [
              "Bu sınıftan miras alınarak özel sunucular yazılır. Gelen yol `self.path`, istemci adresi `self.client_address`, başlıklar `self.headers` özelliği üzerinden okunur.",
              "Subclassed to implement custom servers. Exposes `self.path`, `self.headers`, and `self.client_address`."
            ],
            ex: {
              code: R`import http.server
import urllib.request
import urllib.error
import threading

class MiniTest(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.end_headers()
        self.wfile.write(b"OK_TEST")
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), MiniTest)
threading.Thread(target=srv.serve_forever, daemon=True).start()

with urllib.request.urlopen(f"http://127.0.0.1:{srv.server_port}") as resp:
    print(resp.status, resp.read().decode())

srv.shutdown()
srv.server_close()`,
              out: R`200 OK_TEST`
            }
          },
          {
            id: "send-response",
            name: "handler.send_response(code, message=None)",
            kind: "method",
            sig: "self.send_response(code: int, message: str = None) -> None",
            sum: [
              "HTTP durum kodunu (örn. 200, 404, 500) ve sunucu başlıklarını yanıt kuyruğuna ekler.",
              "Sends the response header and logs the accepted request with given status code."
            ],
            desc: [
              "HTTP yanıtının ilk satırını (`HTTP/1.0 200 OK`) oluşturur. Yanıt gönderme akışında mutlaka ilk çağrılan metot olmalıdır.",
              "Emits status line and standard Server/Date headers. Must precede any other header calls."
            ],
            ex: {
              code: R`import http.server

class Simple(http.server.BaseHTTPRequestHandler):
    pass

print(isinstance(Simple, type))`,
              out: R`True`
            }
          },
          {
            id: "rfile-wfile",
            name: "handler.rfile / handler.wfile",
            kind: "attr",
            sig: "self.rfile: BinaryIO, self.wfile: BinaryIO",
            sum: [
              "İstemciden gelen gövdeyi okuyan (`rfile`) ve istemciye yanıt baytlarını yazan (`wfile`) akışlar.",
              "File-like input and output binary streams representing client socket communication."
            ],
            desc: [
              "`self.rfile.read(uzunluk)` ile POST isteklerindeki payload'lar okunur. `self.wfile.write(baytlar)` ile istemciye yanıt gövdesi gönderilir.",
              "Raw socket communication streams. `self.rfile` streams incoming payload bytes; `self.wfile` streams outgoing responses."
            ],
            ex: {
              code: R`import http.server

# Handler icinde tipik kullanim kalibi: ||| Standard handler pattern:
def ornek_yanit(handler, mesaj: bytes):
    handler.send_response(200)
    handler.end_headers()
    handler.wfile.write(mesaj)

print("Kural tanimli:", callable(ornek_yanit))`,
              out: R`Kural tanimli: True`
            }
          },
          {
            id: "simple-handler",
            name: "http.server.SimpleHTTPRequestHandler",
            kind: "class",
            sig: "http.server.SimpleHTTPRequestHandler(request, client_address, server, directory=None)",
            sum: [
              "Mevcut dizindeki dosya ve klasörleri doğrudan web üzerinden servis eden hazır yönetici.",
              "A request handler that serves files from the current directory and below."
            ],
            desc: [
              "`python -m http.server` komutunu çalıştıran sınıftır. Belirtilen klasördeki dosyaları indirilebilir kılar. Kimlik doğrulama veya şifreleme içermediği için sadece yerel geliştirme amaçlıdır.",
              "Underlying engine for `python -m http.server`. Exposes local filesystem directories without access control; restricted to local development."
            ],
            ex: {
              code: R`import http.server

print(issubclass(http.server.SimpleHTTPRequestHandler, http.server.BaseHTTPRequestHandler))`,
              out: R`True`
            },
            cyber: [
              "Hedef sistemde yetki elde edildiğinde dosya aktarımı için `python -m http.server` sıkça kullanılır. Savunma tarafında bu işlem ağ izleme alarmlarını tetikler.",
              "`python -m http.server` is a common quick-and-dirty file exfiltration/staging technique flagged aggressively by SOC baseline rules."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "ssrf-oast-listener",
        title: [
          "Bant Dışı (OAST) ve SSRF Callback Yakalama Dinleyicisi",
          "Out-of-Band (OAST) & SSRF Interaction Listener"
        ],
        sum: [
          "Hedef sunucunun tetiklediği geri arama (callback) isteklerini ve IP adresini yakalayan test sunucusu.",
          "Capturing inbound HTTP webhooks and SSRF verification probes in automated testing suites."
        ],
        code: R`import http.server
import urllib.request
import urllib.error
import threading

yakalanan_istekler = []

class OASTCallbackHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # Gelen istemci adresini ve talep edilen yolu kaydet: ||| Record client IP and requested path:
        istemci_ip = self.client_address[0]
        yakalanan_istekler.append((istemci_ip, self.path))
        
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"CALLBACK_RECEIVED")
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), OASTCallbackHandler)
port = srv.server_port
threading.Thread(target=srv.serve_forever, daemon=True).start()

# SSRF zafiyetinin tetiklendigi anin simulasyonu: ||| Simulate target server reaching back:
callback_url = f"http://127.0.0.1:{port}/ssrf-token-12345"
with urllib.request.urlopen(callback_url) as resp:
    cevap = resp.read().decode()

srv.shutdown()
srv.server_close()

print("Callback basariyla alindi mi:", cevap == "CALLBACK_RECEIVED")
print("Gelen istek yolu dogru mu:", yakalanan_istekler[0][1] == "/ssrf-token-12345")`,
        out: R`Callback basariyla alindi mi: True
Gelen istek yolu dogru mu: True`,
        cyber: true,
        note: [
          "Kör SSRF (Blind SSRF) zafiyetlerinde sunucu yanıtı doğrudan ekrana basmaz; tek kanıt hedef sunucunun bizim dinleyicimize attığı HTTP isteğidir.",
          "In Blind SSRF scenarios, targets return no visible feedback; an inbound connection to your listener provides definitive proof of vulnerability."
        ]
      },
      {
        id: "canary-token-honeypot",
        title: [
          "Hafif Bal Küpü ve Tuzak URL (Canary) İzleyicisi",
          "Lightweight Honeypot & Canary Trap URL Monitor"
        ],
        sum: [
          "`/.env` veya `/admin` gibi sahte yollara gelen saldırgan taramalarını kaydedip alarm üretme.",
          "Logging exploratory scans targeting deceptive traps to alert defense teams instantly."
        ],
        code: R`import http.server
import urllib.request
import urllib.error
import threading

alarmlar = []

class HoneypotHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # Tuzak yollar: ||| Deceptive trap paths:
        if self.path in ["/.env", "/wp-login.php", "/config.json"]:
            alarmlar.append(f"ALARM: {self.client_address[0]} adresi {self.path} yolunu taradi!")
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b"Erisim Yasak")
        else:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Normal Sayfa")
    def log_message(self, *args): pass

srv = http.server.HTTPServer(("127.0.0.1", 0), HoneypotHandler)
port = srv.server_port
threading.Thread(target=srv.serve_forever, daemon=True).start()

# Saldirgan taramasini simule edelim: ||| Simulate attacker probe:
try:
    with urllib.request.urlopen(f"http://127.0.0.1:{port}/.env") as resp:
        pass
except urllib.error.HTTPError:
    pass

srv.shutdown()
srv.server_close()

print("Tuzak tetiklendi mi:", len(alarmlar) == 1)
print("Alarm icerigi tespit edildi:", ".env" in alarmlar[0])`,
        out: R`Tuzak tetiklendi mi: True
Alarm icerigi tespit edildi: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "http-server-security-risk",
        q: [
          "`python -m http.server` komutu kurumsal ağlarda veya genel internette neden çalıştırılmamalıdır?",
          "Why should `python -m http.server` never be exposed to corporate networks or the public internet?"
        ],
        a: [
          "Hiçbir kimlik doğrulama, şifreleme (HTTPS), hız sınırlama veya erişim kontrolü içermez. Çalıştırıldığı dizindeki tüm dosyaları herkese açık hale getirir ve sistem bilgilerini ifşa eder.",
          "It provides zero authentication, rate limiting, or encryption. Anyone who connects can browse directory trees and download sensitive project files freely."
        ]
      },
      {
        id: "threading-vs-standard-httpserver",
        q: [
          "`HTTPServer` ile `ThreadingHTTPServer` arasındaki fark nedir?",
          "What is the difference between `HTTPServer` and `ThreadingHTTPServer`?"
        ],
        a: [
          "`HTTPServer` tek thread ile çalışır; bir istemcinin isteği uzun sürerse diğer tüm istekler sıraya girer ve bloklanır. `ThreadingHTTPServer` her yeni bağlantı için ayrı bir iş parçacığı açarak eşzamanlı yanıt verir.",
          "`HTTPServer` blocks synchronously on a single thread. `ThreadingHTTPServer` handles each client in a separate thread, enabling concurrent request processing."
        ]
      },
      {
        id: "port-zero-binding",
        q: [
          "`HTTPServer(('127.0.0.1', 0), ...)` yazıldığında `0` portunun özel anlamı nedir?",
          "What is the special meaning of port `0` in `HTTPServer(('127.0.0.1', 0), ...)`?"
        ],
        a: [
          "İşletim sistemine boşta olan herhangi bir dinamik/geçici (ephemeral) portu otomatik olarak tahsis etmesini söyler. Testlerde port çakışmalarını (`Address already in use`) önler.",
          "It instructs the OS kernel to assign an available ephemeral port dynamically, preventing port conflict errors during automated testing."
        ]
      },
      {
        id: "rfile-wfile-streams",
        q: [
          "`BaseHTTPRequestHandler` içinde `rfile` ve `wfile` nesneleri ne işe yarar?",
          "What are `rfile` and `wfile` in `BaseHTTPRequestHandler`?"
        ],
        a: [
          "`rfile` istemciden gelen HTTP istek gövdesini (POST verisi) ikili olarak okuyan akıştır; `wfile` ise istemciye yanıt gövdesini (HTML, JSON) göndermek için kullanılan yazma akışıdır.",
          "`rfile` is a binary stream to read the client request body (e.g. POST payloads); `wfile` is a binary stream to write HTTP response bodies back to the client."
        ]
      },
      {
        id: "oast-testing-utility",
        q: [
          "Siber güvenlikte 'Bant Dışı (OAST)' testlerinde neden Python HTTP dinleyicileri kullanılır?",
          "Why are Python HTTP listeners used in Out-of-Band (OAST) security testing?"
        ],
        a: [
          "Kör SSRF veya kör komut enjeksiyonu zafiyetlerinde hedef sistem ekrana çıktı vermez. Ancak hedefin bizim kurduğumuz geçici Python dinleyicisine HTTP isteği atması zafiyetin kesin kanıtıdır.",
          "Blind vulnerabilities (Blind SSRF, blind RCE) do not reflect outputs in the target's HTTP responses. An inbound callback to an ephemeral Python listener provides irrefutable proof of execution."
        ]
      }
    ]
  });
})();

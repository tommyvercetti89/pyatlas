(function () {
  const R = String.raw;
  PY.addLib({
    id: "socket",
    name: "socket",
    sym: "sk",
    color: "#6366f1",
    focus: "cyber",
    level: 2,
    ext: false,
    cat: "network",
    docs: "https://docs.python.org/3/library/socket.html",
    tagline: [
      "Ağ üzerinden iletişim kurmanın temel taşı: TCP ve UDP soketleri.",
      "The foundational low-level networking interface: TCP and UDP sockets."
    ],
    analogy: [
      "Soket, işletim sisteminin sana verdiği çift yönlü bir telsiz veya telefon ahizesidir. Telefon numarasını çevirir (IP ve port), karşı taraf ahizeyi kaldırınca (accept) konuşur (send) ve dinlersin (recv).",
      "A socket is like a two-way phone handset provided by the OS. You dial a number (IP and port), the other side picks up (accept), and then you talk (send) and listen (recv)."
    ],
    intro: [
      [
        "`socket` modülü, Berkeley Soket API'sini doğrudan Python'a taşır. İnternet üzerindeki her şey (web siteleri, veri tabanı bağlantıları, SSH, oyun sunucuları) arka planda birer soket üzerinde çalışır.",
        "The `socket` module provides direct access to the Berkeley socket API in Python. Everything across the Internet (websites, databases, SSH, game servers) operates over sockets under the hood."
      ],
      [
        "Siber güvenlikte soketler vazgeçilmezdir: port tarayıcılar (port scanner), servis afişi yakalayıcılar (banner grabber), yerel honeypot'lar veya basit istemci-sunucu denemeleri tamamen bu modülle yazılır.",
        "In cyber security, sockets are fundamental: port scanners, service banner grabbers, local honeypots, and test clients or servers are all crafted with this module."
      ]
    ],
    import: R`import socket`,
    general: [
      [
        "Özel ikili (binary) veya metin tabanlı ağ protokolleri geliştirmek.",
        "Implementing custom binary or text-based network communication protocols."
      ],
      [
        "Mikroservisler veya süreçler arası TCP/Unix domain soket haberleşmesi.",
        "Facilitating inter-process or microservice TCP/Unix domain socket links."
      ],
      [
        "IoT cihazları ve gömülü sistemlerle doğrudan UDP/TCP üzerinden konuşmak.",
        "Direct UDP/TCP communications with IoT devices and embedded hardware."
      ]
    ],
    cyberUse: [
      [
        "Yerel laboratuvar ortamında açık portları tespit eden hafif port tarayıcıları yazmak (`connect_ex`).",
        "Writing lightweight port checkers to detect open ports in your lab (`connect_ex`)."
      ],
      [
        "Ağ servislerinin sürüm afişlerini (service banner) çekerek zaafiyet analizi öncesi keşif yapmak.",
        "Grabbing service version banners to identify listening daemons during authorized audits."
      ],
      [
        "Laboratuvarında izinsiz bağlantı girişimlerini kaydeden basit honeypot / dinleyici soketler kurmak.",
        "Setting up simple local honeypot listeners to detect and log connection attempts."
      ]
    ],
    sections: [
      {
        id: "create",
        title: ["Soket Nesnesi ve Temeller", "Socket Object & Fundamentals"],
        intro: [
          "Bir soket oluştururken hangi adres ailesini (IPv4 / IPv6) ve hangi protokol türünü (TCP / UDP) kullanacağını belirtirsin.",
          "When creating a socket, you specify the address family (IPv4 / IPv6) and the transport protocol (TCP / UDP)."
        ],
        items: [
          {
            id: "socket",
            name: "socket.socket(family, type)",
            kind: "class",
            sig: "socket.socket(family=AF_INET, type=SOCK_STREAM, proto=0)",
            sum: [
              "Yeni bir ağ soketi nesnesi oluşturur.",
              "Instantiates a new network socket object."
            ],
            desc: [
              "İşletim sisteminden yeni bir soket dosya tanıtıcısı ister. Varsayılan olarak IPv4 (`AF_INET`) ve TCP (`SOCK_STREAM`) kullanılır. İşi bittiğinde kapatmak için `with` bloğu içinde kullanılması önerilir.",
              "Requests a new socket file descriptor from the operating system. Defaults to IPv4 (`AF_INET`) and TCP (`SOCK_STREAM`). Always close it after use or wrap in a `with` statement."
            ],
            params: [
              { n: "family", d: ["Adres ailesi: `socket.AF_INET` (IPv4) veya `AF_INET6` (IPv6).", "Address family: `socket.AF_INET` (IPv4) or `AF_INET6` (IPv6)."] },
              { n: "type", d: ["Soket tipi: `socket.SOCK_STREAM` (TCP) veya `SOCK_DGRAM` (UDP).", "Socket type: `socket.SOCK_STREAM` (TCP) or `SOCK_DGRAM` (UDP)."] }
            ],
            ret: ["Yeni oluşturulan `socket.socket` nesnesi.", "Newly created `socket.socket` instance."],
            ex: {
              code: R`import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print(type(s).__name__)
print(s.family == socket.AF_INET)
print(s.type == socket.SOCK_STREAM)
s.close()`,
              out: R`socket
True
True`
            },
            cyber: [
              "Ham (raw) soketler oluşturmak için `SOCK_RAW` sabiti de mevcuttur ancak işletim sisteminde yönetici (root/admin) yetkisi gerektirir.",
              "To construct raw packets, `SOCK_RAW` is available, though it requires administrative (root) privileges on the operating system."
            ],
            gotcha: [
              "Açılan soketleri kapatmayı unutmak soket tanıtıcısı sızıntısına (socket leak) yol açar. Her zaman `s.close()` çağır veya `with socket.socket(...) as s:` kullan.",
              "Forgetting to close sockets causes file descriptor exhaustion. Always call `s.close()` or use a `with` context."
            ]
          },
          {
            id: "af-inet",
            name: "socket.AF_INET / AF_INET6",
            kind: "const",
            sig: "socket.AF_INET",
            sum: [
              "IPv4 ve IPv6 adres ailesi sabitleri.",
              "IPv4 and IPv6 address family constants."
            ],
            desc: [
              "`AF_INET`, standart 32-bit IPv4 adreslerini (`'127.0.0.1'`), `AF_INET6` ise 128-bit IPv6 adreslerini (`'::1'`) temsil eden adres ailesidir.",
              "`AF_INET` designates standard 32-bit IPv4 addresses (`'127.0.0.1'`), while `AF_INET6` is used for 128-bit IPv6 addresses (`'::1'`)."
            ],
            ex: {
              code: R`import socket

print(isinstance(socket.AF_INET, int))
print(isinstance(socket.AF_INET6, int))`,
              out: R`True
True`
            }
          },
          {
            id: "sock-stream",
            name: "socket.SOCK_STREAM / SOCK_DGRAM",
            kind: "const",
            sig: "socket.SOCK_STREAM",
            sum: [
              "TCP (akış) ve UDP (veri paketi) protokol sabitleri.",
              "TCP (stream) and UDP (datagram) transport constants."
            ],
            desc: [
              "`SOCK_STREAM`, güvenilir, sıralı ve bağlantı odaklı TCP protokolünü ifade eder. `SOCK_DGRAM` ise bağlantısız, hızlı ve kayıp garantisi olmayan UDP protokolünü seçer.",
              "`SOCK_STREAM` specifies connection-oriented, reliable TCP transport. `SOCK_DGRAM` specifies connectionless, lightweight UDP packets."
            ],
            ex: {
              code: R`import socket

print(socket.SOCK_STREAM != socket.SOCK_DGRAM)`,
              out: R`True`
            }
          }
        ]
      },
      {
        id: "client",
        title: ["İstemci Operasyonları (Bağlantı & İletişim)", "Client Operations (Connecting & IO)"],
        intro: [
          "Bir uzak hedefe bağlanmak, veri göndermek ve gelen yanıtı okumak için kullanılan temel metodlar.",
          "Core methods for establishing connections, sending payloads, and receiving responses."
        ],
        items: [
          {
            id: "connect",
            name: "sock.connect(address)",
            kind: "method",
            sig: "sock.connect(address)",
            sum: [
              "Uzak bir sunucuya TCP bağlantısı kurar.",
              "Initiates a TCP connection to a remote server."
            ],
            desc: [
              "Hedef sunucuya 3 yollu TCP el sıkışması (SYN, SYN-ACK, ACK) başlatır. Hedef port kapalıysa veya ulaşılamıyorsa `ConnectionRefusedError` veya `socket.timeout` fırlatır.",
              "Initiates the 3-way TCP handshake (SYN, SYN-ACK, ACK) with the remote host. Raises `ConnectionRefusedError` or `socket.timeout` if the target is closed or unreachable."
            ],
            params: [
              { n: "address", d: ["IPv4 için `(host, port)` demeti (örn: `('127.0.0.1', 80)`).", "For IPv4, a `(host, port)` tuple (e.g. `('127.0.0.1', 80)`)."] }
            ],
            ex: {
              code: R`import socket
import threading

# Yerel test sunucusu kur ||| Spin up local test server
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(("127.0.0.1", 0))
port = server.getsockname()[1]
server.listen(1)

def run_server():
    conn, _ = server.accept()
    conn.sendall(b"OK")
    conn.close()

threading.Thread(target=run_server, daemon=True).start()

# İstemci ile bağlan ||| Connect as client
client = socket.socket()
client.connect(("127.0.0.1", port))
data = client.recv(1024)
print(data.decode("ascii"))
client.close()
server.close()`,
              out: R`OK`
            },
            cyber: [
              "Bir servis afişini çekmek (banner grabbing) için `connect` sonrası ilk baytları okumak en temel keşif adımıdır.",
              "Connecting to a target port and reading greeting bytes (banner grabbing) is a primary reconnaissance technique."
            ]
          },
          {
            id: "connect-ex",
            name: "sock.connect_ex(address)",
            kind: "method",
            sig: "sock.connect_ex(address) -> int",
            sum: [
              "Hata fırlatmak yerine C dönüş kodunu (0 = açık) döndürür.",
              "Returns a C-style error code (0 = success/open) instead of throwing exceptions."
            ],
            desc: [
              "`connect()` ile aynı işi yapar fakat bağlantı başarısız olduğunda `ConnectionRefusedError` fırlatmaz; hata kodunu (`errno`) tamsayı olarak döner. Bağlantı başarılıysa `0` döner. Bu sayede port tarayıcılar için mükemmeldir.",
              "Behaves like `connect()`, but returns an error indicator (`errno`) integer instead of raising exceptions. Returns `0` if the connection succeeds, making it ideal for port scanning."
            ],
            params: [
              { n: "address", d: ["Hedef `(host, port)` demeti.", "Target `(host, port)` tuple."] }
            ],
            ret: ["Başarılı bağlantıda `0`, aksi halde hata kodu (tamsayı).", "`0` on success, or an errno integer on failure."],
            ex: {
              code: R`import socket

s = socket.socket()
s.settimeout(0.5)
# Bilerek muhtemelen kapalı bir porta bağlanmayı dene ||| Attempt connection to closed port
res = s.connect_ex(("127.0.0.1", 65500))
print("acik" if res == 0 else "kapali")
s.close()`,
              out: R`kapali`
            },
            cyber: [
              "Port tarayıcılarda `try/except` bloğu kurmak yerine `connect_ex() == 0` kontrolü yapmak kodun çok daha hızlı ve temiz çalışmasını sağlar.",
              "Using `connect_ex() == 0` instead of `try/except` overhead makes custom Python port scanners significantly faster and cleaner."
            ]
          },
          {
            id: "sendall",
            name: "sock.sendall(data)",
            kind: "method",
            sig: "sock.sendall(data, flags=0)",
            sum: [
              "Verilen tüm baytlar iletilene kadar göndermeye devam eder.",
              "Sends the entirety of data bytes without requiring manual loop tracking."
            ],
            desc: [
              "Standart `send()` metodu tek seferde verinin sadece bir kısmını iletebilir ve gönderilen bayt sayısını döner. `sendall()` ise tüm baytlar ağ tamponuna aktarılana kadar döngüde kalır. Veri kaybını önlemek için daima `sendall()` tercih edilmelidir.",
              "Unlike `send()`, which may transmit only a partial chunk of data, `sendall()` repeatedly sends bytes until the entire buffer is transmitted or an error occurs."
            ],
            params: [
              { n: "data", d: ["Gönderilecek bayt nesnesi (`bytes` veya `bytearray`).", "Bytes-like object to send (`bytes` or `bytearray`)."] }
            ],
            ret: ["`None` (Hata durumunda istisna fırlatır).", "`None` (Raises exception on failure)."],
            ex: {
              code: R`import socket

msg = "PING".encode("utf-8")
print(type(msg).__name__, len(msg))`,
              out: R`bytes 4`
            },
            gotcha: [
              "Sokete asla doğrudan `str` gönderilemez; önce `.encode('utf-8')` veya `b'...'` ön eki ile `bytes` tipine dönüştürülmelidir.",
              "You cannot pass `str` directly to sockets; always encode to `bytes` using `.encode('utf-8')` or literal `b'...'`."
            ]
          },
          {
            id: "recv",
            name: "sock.recv(bufsize)",
            kind: "method",
            sig: "sock.recv(bufsize, flags=0) -> bytes",
            sum: [
              "Soketten belirtilen boyuta kadar bayt okur.",
              "Receives data up to `bufsize` bytes from the socket."
            ],
            desc: [
              "Ağ tamponundaki veriyi okur. Eğer karşı taraf soketi düzgünce kapattıysa (FIN paketi) boş bayt (`b''`) döner. Bu, bağlantının bittiğini anlamanın evrensel yoludur.",
              "Reads up to `bufsize` bytes from the network buffer. If the remote side closes the connection cleanly (FIN packet), it returns empty bytes (`b''`), signaling EOF."
            ],
            params: [
              { n: "bufsize", d: ["Tek seferde okunabilecek maksimum bayt miktarı (genelde 1024 veya 4096).", "Maximum bytes to read in one call (typically 1024 or 4096)."] }
            ],
            ret: ["Alınan baytlar (`bytes`).", "Received `bytes` object."],
            ex: {
              code: R`import socket

empty = b""
print(len(empty) == 0)  # Baglanti koptugunda recv bunu doner ||| recv returns this on EOF`,
              out: R`True`
            }
          },
          {
            id: "settimeout",
            name: "sock.settimeout(value)",
            kind: "method",
            sig: "sock.settimeout(value)",
            sum: [
              "Soket işlemlerinin maksimum bekleme süresini ayarlar.",
              "Sets a blocking timeout threshold for socket operations."
            ],
            desc: [
              "`None` verilirse soket sonsuza kadar bekler (varsayılan). Saniye cinsinden bir sayı (`float` veya `int`) verilirse, `connect`, `recv` veya `accept` süresi aşılınca `socket.timeout` hatası fırlatılır.",
              "Sets a timeout on blocking socket operations in seconds. If omitted or `None`, socket operations block indefinitely. Prevents your script from hanging forever on silent hosts."
            ],
            params: [
              { n: "value", d: ["Saniye cinsinden süre (örn: `1.5`) veya sonsuz için `None`.", "Timeout in seconds (`float` or `int`), or `None` for blocking mode."] }
            ],
            ex: {
              code: R`import socket

s = socket.socket()
s.settimeout(2.5)
print(s.gettimeout())
s.close()`,
              out: R`2.5`
            },
            cyber: [
              "Siber güvenlik araçlarında (özellikle tarayıcılarda) timeout değeri kritik önemdedir: çok uzun tutulursa tarama saatler sürer, çok kısa tutulursa gecikmeli açık portlar kaçırılır.",
              "In security tools, tuning timeout is vital: too long makes scans sluggish, while too short causes you to miss responses across latent networks."
            ]
          }
        ]
      },
      {
        id: "server",
        title: ["Sunucu Operasyonları (Dinleme & Kabul)", "Server Operations (Listening & Accepting)"],
        intro: [
          "Gelen bağlantıları kabul etmek için bir soketi sunucu haline getiren metodlar.",
          "Methods used to configure a socket as a listening server and accept inbound connections."
        ],
        items: [
          {
            id: "bind",
            name: "sock.bind(address)",
            kind: "method",
            sig: "sock.bind(address)",
            sum: [
              "Soketi belirli bir ağ arayüzü ve porta bağlar.",
              "Binds the socket to a specific local interface and port."
            ],
            desc: [
              "İşletim sistemine bu soketin hangi yerel IP ve port üzerinde var olacağını bildirir. `'0.0.0.0'` verilirse makinenin tüm ağ kartlarından gelen bağlantılar kabul edilir; `'127.0.0.1'` verilirse yalnızca yerel makineden erişilebilir.",
              "Associates the socket with a specific network interface IP and port number. Binding to `'0.0.0.0'` exposes the service to all interfaces; `'127.0.0.1'` confines it to localhost."
            ],
            params: [
              { n: "address", d: ["`(ip_adresi, port_numarasi)` demeti.", "Tuple of `(ip_address, port_number)`."] }
            ],
            ex: {
              code: R`import socket

s = socket.socket()
s.bind(("127.0.0.1", 0))  # 0: sistem bos bir port atar ||| 0: OS allocates ephemeral port
ip, port = s.getsockname()
print(ip, port > 0)
s.close()`,
              out: R`127.0.0.1 True`
            },
            cyber: [
              "Hassas servisleri `'0.0.0.0'` yerine mutlaka `'127.0.0.1'` adresine bind etmek, servisin internete kazara ifşa olmasını önleyen temel bir savunma kuralıdır.",
              "Binding internal administrative listeners to `'127.0.0.1'` rather than `'0.0.0.0'` prevents accidental public network exposure."
            ]
          },
          {
            id: "listen",
            name: "sock.listen(backlog)",
            kind: "method",
            sig: "sock.listen(backlog=128)",
            sum: [
              "Soketi gelen bağlantıları kabul edecek dinleme moduna alır.",
              "Puts the socket into passive listening mode for incoming connections."
            ],
            desc: [
              "İşletim sistemine bu soketin artık bir istemci değil sunucu olduğunu bildirir. `backlog`, kabul edilmeyi bekleyen kuyruktaki maksimum bağlantı sayısını belirler.",
              "Flags the socket as passive, ready to accept inbound connection requests. `backlog` governs the queue length of unaccepted pending connections."
            ],
            params: [
              { n: "backlog", d: ["Kuyruktaki azami bekleyen bağlantı sayısı (varsayılan sistem sınırıdır).", "Queue limit for pending unaccepted connections."] }
            ],
            ex: {
              code: R`import socket

s = socket.socket()
s.bind(("127.0.0.1", 0))
s.listen(5)
print("dinliyor")  # Basariyla dinleme moduna gecti ||| Successfully entered listen state
s.close()`,
              out: R`dinliyor`
            }
          },
          {
            id: "accept",
            name: "sock.accept()",
            kind: "method",
            sig: "sock.accept() -> (conn, address)",
            sum: [
              "Gelen bağlantıyı kabul eder ve yeni bir iletişim soketi döner.",
              "Accepts a pending incoming connection and returns a new connected socket."
            ],
            desc: [
              "Bağlantı gelene kadar bekler (bloklar). Bağlantı geldiğinde iki şey döner: sadece o istemciyle konuşmak için ayrılmış yeni bir `conn` soketi ve istemcinin `(ip, port)` bilgisi. Ana soket dinlemeye devam eder.",
              "Blocks until an incoming connection arrives. Returns a pair: `(conn, address)` where `conn` is a brand-new socket dedicated to that client, leaving the original socket listening."
            ],
            ret: ["`(conn_socket, (client_ip, client_port))` demeti.", "Tuple of `(conn_socket, (client_ip, client_port))`."],
            ex: {
              code: R`import socket
import threading

server = socket.socket()
server.bind(("127.0.0.1", 0))
port = server.getsockname()[1]
server.listen(1)

def client_task():
    c = socket.socket()
    c.connect(("127.0.0.1", port))
    c.close()

threading.Thread(target=client_task).start()

conn, addr = server.accept()
print(addr[0])  # Istemci IP adresi ||| Client IP address
conn.close()
server.close()`,
              out: R`127.0.0.1`
            }
          },
          {
            id: "setsockopt",
            name: "sock.setsockopt(level, optname, value)",
            kind: "method",
            sig: "sock.setsockopt(level, optname, value)",
            sum: [
              "Soket seçeneklerini yapılandırır (örn: SO_REUSEADDR).",
              "Manipulates low-level socket options (e.g. SO_REUSEADDR)."
            ],
            desc: [
              "Soketin işletim sistemi düzeyindeki davranışını değiştirir. En yaygın kullanımı, sunucu kapatıldığında portun `TIME_WAIT` durumunda kalarak 'Address already in use' hatası vermesini önlemek için `SO_REUSEADDR` bayrağını açmaktır.",
              "Configures underlying socket layer settings. The most common pattern is enabling `SO_REUSEADDR` to avoid 'Address already in use' errors during rapid server restarts."
            ],
            params: [
              { n: "level", d: ["Protokol düzeyi: genel soket için `socket.SOL_SOCKET`.", "Protocol level: `socket.SOL_SOCKET` for generic socket options."] },
              { n: "optname", d: ["Seçenek adı: `socket.SO_REUSEADDR` vb.", "Option identifier: `socket.SO_REUSEADDR` etc."] },
              { n: "value", d: ["Açmak için `1`, kapatmak için `0`.", "`1` to enable, `0` to disable."] }
            ],
            ex: {
              code: R`import socket

s = socket.socket()
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
print(s.getsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR) != 0)
s.close()`,
              out: R`True`
            }
          }
        ]
      },
      {
        id: "helpers",
        title: ["Ağ Yardımcıları ve IP Dönüşümleri", "Network Utilities & IP Conversion"],
        intro: [
          "Alan adı çözme (DNS) ve IP adreslerini ikili formata dönüştürme fonksiyonları.",
          "Functions for hostname resolution and binary IP transformations."
        ],
        items: [
          {
            id: "gethostname",
            name: "socket.gethostname()",
            kind: "function",
            sig: "socket.gethostname() -> str",
            sum: [
              "Çalışılan makinenin yerel adını (hostname) döndürür.",
              "Returns the standard host name for the local machine."
            ],
            desc: [
              "İşletim sisteminde tanımlı olan yerel bilgisayar adını öğrenir.",
              "Retrieves the local computer name defined in the operating system."
            ],
            ret: ["Makine adı (`str`).", "Hostname (`str`)."],
            ex: {
              code: R`import socket

name = socket.gethostname()
print(isinstance(name, str) and len(name) > 0)`,
              out: R`True`
            }
          },
          {
            id: "inet-aton",
            name: "socket.inet_aton(ip_string)",
            kind: "function",
            sig: "socket.inet_aton(ip_string) -> bytes",
            sum: [
              "Noktalı IPv4 adresini 4 baytlık ikili (binary) formata çevirir.",
              "Converts a dotted-quad IPv4 string to 4-byte packed binary format."
            ],
            desc: [
              "`'192.168.1.1'` gibi metinsel bir IP'yi ağ bayt sırasındaki 4 bayta dönüştürür. Ham paket başlıkları hazırlarken veya hızlı IP filtrelemelerinde kullanılır.",
              "Converts standard ASCII dotted IPv4 strings into 4-byte network-order packed bytes, essential when crafting raw packet headers."
            ],
            params: [
              { n: "ip_string", d: ["IPv4 adresi dizesi.", "IPv4 address string."] }
            ],
            ret: ["4 baytlık `bytes` nesnesi.", "4-byte `bytes` object."],
            ex: {
              code: R`import socket

b = socket.inet_aton("127.0.0.1")
print(len(b))
print(b == b"\x7f\x00\x00\x01")`,
              out: R`4
True`
            },
            see: ["inet-ntoa"]
          },
          {
            id: "inet-ntoa",
            name: "socket.inet_ntoa(packed_ip)",
            kind: "function",
            sig: "socket.inet_ntoa(packed_ip) -> str",
            sum: [
              "4 baytlık ikili IP verisini noktalı metin formatına çevirir.",
              "Converts 4-byte packed binary IP data back into a dotted string."
            ],
            desc: [
              "`inet_aton` fonksiyonunun tersidir; gelen ham ağ paketlerinden okunan 4 baytı okunabilir IP adresine dönüştürür.",
              "The inverse of `inet_aton`; converts raw 4-byte packet header IP fields into human-readable strings."
            ],
            params: [
              { n: "packed_ip", d: ["4 baytlık `bytes` verisi.", "4-byte packed `bytes`."] }
            ],
            ret: ["Noktalı IPv4 adresi dizesi.", "Dotted-quad IPv4 string."],
            ex: {
              code: R`import socket

ip = socket.inet_ntoa(b"\x7f\x00\x00\x01")
print(ip)`,
              out: R`127.0.0.1`
            },
            see: ["inet-aton"]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "port-scanner",
        title: [
          "Mini Port Tarayıcı (Kendi Laboratuvarında Test)",
          "Mini Port Checker (For Your Local Lab)"
        ],
        sum: [
          "`connect_ex` kullanarak belirli bir port aralığını tarayan ve açık olanları raporlayan araç.",
          "A fast utility scanning a port range using `connect_ex` and reporting open services."
        ],
        code: R`import socket
import threading

# 1. Test amaciyla yerel bir sahte servis baslat ||| Start dummy listener for demonstration
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(("127.0.0.1", 0))
open_port = server.getsockname()[1]
server.listen(1)

# 2. Port kontrol fonksiyonu ||| Port scanning function
def check_port(host, port, timeout=0.2):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        result = s.connect_ex((host, port))
        return result == 0

# 3. Test edilecek portlar ||| Ports to evaluate
test_ports = [open_port, open_port + 1]
for p in test_ports:
    status = "ACIK" if check_port("127.0.0.1", p) else "KAPALI"
    print(f"Port {p}: {status}")

server.close()`,
        out: R`Port {open_port}: ACIK
Port {open_port + 1}: KAPALI`,
        nocheck: true,
        cyber: true,
        note: [
          "Gerçek dünyada yüzlerce portu hızlıca kontrol etmek için her porta bir `threading.Thread` açılır veya `asyncio` kullanılır.",
          "In real production tools, thread pools or async event loops are combined with `connect_ex` to audit port ranges in seconds."
        ]
      },
      {
        id: "banner-grabber",
        title: [
          "Servis Afişi (Banner) Yakalayıcı",
          "Service Banner Grabber"
        ],
        sum: [
          "Bir porta bağlanıp servisin kendini tanıttığı karşılama metnini okuma.",
          "Connecting to a port and capturing the service version greeting banner."
        ],
        code: R`import socket
import threading

# Sahte bir SSH/FTP afis sunucusu baslat ||| Start dummy mock banner server
server = socket.socket()
server.bind(("127.0.0.1", 0))
port = server.getsockname()[1]
server.listen(1)

def banner_service():
    conn, _ = server.accept()
    conn.sendall(b"SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6\r\n")
    conn.close()

threading.Thread(target=banner_service, daemon=True).start()

# Afisi yakala ||| Grab the banner
with socket.socket() as client:
    client.settimeout(1.0)
    client.connect(("127.0.0.1", port))
    banner = client.recv(1024).decode("utf-8", errors="ignore").strip()
    print("Yakalanan:", banner)

server.close()`,
        out: R`Yakalanan: SSH-2.0-OpenSSH_8.9p1 Ubuntu-3ubuntu0.6`,
        cyber: true,
        note: [
          "Servis afişleri (banner), sunucuda hangi yazılımın ve hangi sürümün çalıştığını ele verir. Savunma tarafında afişleri gizlemek (banner masking) sıkça uygulanan bir güvenlik önlemidir.",
          "Service banners reveal daemon names and exact versions. Masking banners is a common defense-in-depth hardening step."
        ]
      }
    ],
    cards: [
      {
        id: "connect-vs-connect-ex",
        q: [
          "`connect()` ile `connect_ex()` arasındaki en temel fark nedir ve port tarayıcılarda neden `connect_ex` tercih edilir?",
          "What is the key difference between `connect()` and `connect_ex()`, and why is `connect_ex` preferred in scanners?"
        ],
        a: [
          "`connect()` bağlantı başarısız olduğunda istisna (exception) fırlatır; `connect_ex()` ise C düzeyindeki hata kodunu (başarılıysa `0`) döner. İstisna yakalama maliyeti olmadığı için port tarayıcılarda çok daha hızlıdır.",
          "`connect()` raises exceptions on failure; `connect_ex()` returns a C errno integer (`0` on success). Avoiding exception handling overhead makes scanners much faster."
        ]
      },
      {
        id: "why-sendall",
        q: [
          "Neden `sock.send()` yerine neredeyse her zaman `sock.sendall()` kullanmalısın?",
          "Why should you almost always use `sock.sendall()` instead of `sock.send()`?"
        ],
        a: [
          "`send()` işletim sisteminin tamponu dolduğunda verinin yalnızca bir kısmını gönderebilir. `sendall()` ise tüm baytlar iletilene kadar arka planda döngüyü sürdürür ve veri kaybını engeller.",
          "`send()` may only transmit a partial slice of data if network buffers are full. `sendall()` loops under the hood until the whole buffer is sent, preventing data truncation."
        ]
      },
      {
        id: "recv-eof-detection",
        q: [
          "Bir TCP soketinden `recv()` çağrısı yapıldığında karşı tarafın bağlantıyı kapattığı nasıl anlaşılır?",
          "When calling `recv()` on a TCP socket, how do you know the remote peer has closed the connection?"
        ],
        a: [
          "`recv()` sıfır uzunluklu boş bayt (`b''`) döner. Bu TCP'de EOF (End-of-File / FIN) sinyalidir.",
          "`recv()` returns empty bytes (`b''`). In TCP, this denotes an EOF / FIN packet from the remote endpoint."
        ]
      },
      {
        id: "so-reuseaddr-purpose",
        q: [
          "`SO_REUSEADDR` soket seçeneği ne işe yarar?",
          "What is the purpose of the `SO_REUSEADDR` socket option?"
        ],
        a: [
          "Sunucu kapatıldığında portun `TIME_WAIT` durumunda takılı kalmasını ve sunucuyu hemen yeniden başlatırken 'Address already in use' hatası alınmasını engeller.",
          "It prevents the port from getting stuck in `TIME_WAIT` state, eliminating 'Address already in use' errors during server restarts."
        ]
      },
      {
        id: "bind-0-vs-127",
        q: [
          "Bir soketi `'0.0.0.0'` yerine `'127.0.0.1'` adresine bind etmenin siber güvenlik açısından farkı nedir?",
          "What is the security difference between binding a socket to `'0.0.0.0'` vs `'127.0.0.1'`?"
        ],
        a: [
          "`'0.0.0.0'` makinenin tüm ağ arayüzlerine (WiFi, Ethernet, dış IP) dinleme açar; `'127.0.0.1'` ise yalnızca o bilgisayarın içinden gelen bağlantıları kabul eder ve dış saldırılara kapalıdır.",
          "`'0.0.0.0'` exposes the port to all external network interfaces, while `'127.0.0.1'` binds strictly to localhost, protecting internal tools from external probing."
        ]
      }
    ]
  });
})();


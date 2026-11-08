(function () {
  const R = String.raw;
  PY.addLib({
    id: "ssl",
    name: "ssl",
    sym: "sl",
    color: "#0ea5e9",
    focus: "both",
    level: 2,
    ext: false,
    cat: "network",
    docs: "https://docs.python.org/3/library/ssl.html",
    tagline: [
      "TLS/SSL şifreleme katmanı — soketleri güvenli hale getirme, sertifika analizi ve Ortadaki Adam (MITM) savunması.",
      "TLS/SSL encryption layer — socket wrapping, certificate inspection, and Man-in-the-Middle (MITM) defense."
    ],
    analogy: [
      "`socket` çıplak bir telefon kablosu gibidir: aradaki herkes hatta girip konuşulanları dinleyebilir (sniffing) veya değiştirebilir. `ssl` ise bu kabloya askeri düzeyde kırılmaz bir şifreli tünel (TLS) giydirir. Karşı tarafın kimlik kartını (dijital sertifika) doğrulamadan tünelden tek bir veri geçişine bile izin vermez.",
      "`socket` behaves like an unshielded copper wire: eavesdroppers can tap or inject traffic. `ssl` establishes an encrypted TLS envelope over the socket, inspecting the peer's digital identity certificate before permitting cleartext data transfer."
    ],
    intro: [
      [
        "`ssl` modülü, OpenSSL kütüphanesini Python soketlerine bağlayarak istemci ve sunucu taraflı TLS (Transport Layer Security) şifrelemesi sağlar.",
        "The `ssl` module wraps OpenSSL routines to provide client and server Transport Layer Security (TLS) primitives over network sockets."
      ],
      [
        "Siber güvenlikte dijital sertifika geçerlilik ve süre denetimi (`getpeercert`), TLS 1.0/1.1 gibi güvensiz eski protokolleri engelleme, şifreli soket sarma (`wrap_socket`) ve geliştiricilerin en sık yaptığı 'sertifika doğrulamasını kapatma' hatasından doğan Ortadaki Adam (MITM) açıklarını tespit edip düzeltmede esastır.",
        "In cyber security, inspecting certificate chains (`getpeercert`), enforcing modern TLS 1.2/1.3 cipher suites, wrapping sockets via `wrap_socket`, and auditing dangerous `CERT_NONE` misconfigurations causing Man-in-the-Middle (MITM) exposure depend directly on `ssl`."
      ]
    ],
    import: R`import ssl
import socket`,
    general: [
      ["Düz TCP soket bağlantılarını güvenli TLS tünellerine dönüştürme.", "Upgrading raw TCP client sockets to authenticated TLS tunnels."],
      ["Web sunucuları için SSL/TLS sertifikası ve özel anahtar yükleyerek HTTPS yayını yapma.", "Binding public certificates and private keys to secure local server listeners."],
      ["Uzak sunucuların SSL sertifika geçerlilik sürelerini ve veren makamları (CA) sorgulama.", "Querying remote server certificate expiration dates and issuing CAs."]
    ],
    cyberUse: [
      ["Ortadaki Adam (MITM) Zafiyeti Denetimi: Geliştiricilerin 'hata gitsin' diye yazdığı `ssl._create_unverified_context()` veya `check_hostname=False` desenlerini kod incelemesinde tespit etme.", "MITM flaw remediation: identifying reckless `ssl._create_unverified_context()` and `check_hostname=False` patterns that bypass certificate verification in production."],
      ["Sertifika İnceleme ve Süre Denetimi: `getpeercert()` ile SAN (Subject Alternative Name) alanlarını çıkararak gizli alt alan adlarını (subdomain) keşfetme ve süresi dolmak üzere olan sertifikaları alarmlama.", "Certificate reconnaissance: extracting Subject Alternative Name (SAN) records to map hidden target subdomains and audit validity lifespans."],
      ["Eski TLS Versiyonlarını Engelleme: İstemci ve sunucularda güvenliği kırılmış TLS 1.0 ve TLS 1.1 protokollerini devre dışı bırakıp yalnızca TLS 1.2 ve TLS 1.3'ü zorunlu kılma.", "Protocol hardening: deprecating obsolete TLS 1.0/1.1 protocols and mandating TLS 1.2+ cipher suites."]
    ],
    sections: [
      {
        id: "context-and-config",
        title: ["SSL Bağlamı ve Güvenlik Ayarları", "SSL Context & Configuration"],
        intro: [
          "`create_default_context`, sertifika doğrulama ve bağlam parametreleri.",
          "Instantiating SSL contexts and configuring verification flags."
        ],
        items: [
          {
            id: "create-default-context",
            name: "ssl.create_default_context(purpose, ...)",
            kind: "function",
            sig: "ssl.create_default_context(purpose=Purpose.SERVER_AUTH, cafile=None, capath=None, cadata=None) -> SSLContext",
            sum: [
              "Sistem kök sertifikalarını (CA) yükleyen ve güvenli varsayılanlarla yapılandırılmış bir SSLContext döner.",
              "Returns a new SSLContext object with robust, secure default settings and system trust stores."
            ],
            desc: [
              "Modern TLS standartları için en güvenli başlangıç noktasıdır. `check_hostname=True` ve `verify_mode=CERT_REQUIRED` ayarlarını otomatik açar. Sunucunun kimliğini doğrulamak için sistemin güvenilir sertifika deposunu kullanır.",
              "The recommended constructor for secure client connections. Automatically activates hostname validation and strict certificate chain verification."
            ],
            ex: {
              code: R`import ssl

ctx = ssl.create_default_context()
print("Hostname kontrolu acik mi:", ctx.check_hostname)
print("Sertifika zorunlu mu:", ctx.verify_mode == ssl.CERT_REQUIRED)`,
              out: R`Hostname kontrolu acik mi: True
Sertifika zorunlu mu: True`
            },
            cyber: [
              "İstemci yazarken her zaman `create_default_context()` ile başlayın; bu fonksiyon zayıf şifreleme algoritmalarını (RC4, DES) otomatik engeller.",
              "Always initiate client connections with `create_default_context()`; it automatically excludes deprecated weak ciphers."
            ]
          },
          {
            id: "sslcontext",
            name: "ssl.SSLContext(protocol=PROTOCOL_TLS_CLIENT)",
            kind: "class",
            sig: "ssl.SSLContext(protocol: int = PROTOCOL_TLS_CLIENT) -> SSLContext",
            sum: [
              "TLS parametrelerini, sertifikaları ve şifreleme algoritmalarını barındıran temel bağlam nesnesi.",
              "An SSL context holds various SSL-related configuration options and certificates."
            ],
            desc: [
              "Özel şifreleme kuralları veya sunucu tarafı HTTPS dinleyicileri tanımlanırken kullanılır. `minimum_version` ve `maximum_version` özellikleri ile kabul edilecek TLS sürümleri sınırlandırılır.",
              "Provides granular control over supported protocol versions, trusted CA certificates, and cipher suites."
            ],
            ex: {
              code: R`import ssl

ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ctx.minimum_version = ssl.TLSVersion.TLSv1_2
print("Minimum TLS versiyonu:", ctx.minimum_version.name)`,
              out: R`Minimum TLS versiyonu: TLSv1_2`
            }
          },
          {
            id: "check-hostname",
            name: "context.check_hostname",
            kind: "attr",
            sig: "ctx.check_hostname: bool",
            sum: [
              "Sunucu sertifikasındaki alan adının bağlandığımız ana makine adı ile eşleşmesini zorunlu kılar.",
              "Whether to match the peer cert's hostname against the requested server hostname."
            ],
            desc: [
              "Bu ayar `False` yapılırsa, saldırgan kendi meşru alan adına ait geçerli bir sertifikayı araya girip sunduğunda istemci bağlantıyı kabul eder (Ortadaki Adam saldırısı gerçekleşir). Güvenlik için mutlaka `True` olmalıdır.",
              "If disabled, attackers presenting any valid CA certificate can intercept traffic undetected. Must strictly remain True."
            ],
            ex: {
              code: R`import ssl

ctx = ssl.create_default_context()
print("Hostname dogrulama aktif:", ctx.check_hostname)`,
              out: R`Hostname dogrulama aktif: True`
            },
            cyber: [
              "Kod denetimlerinde `check_hostname = False` satırını görmek kritik bir güvenlik açığıdır; anında MITM saldırısına zemin hazırlar.",
              "In secure code reviews, `check_hostname = False` is an instant high-severity finding exposing clients to transparent interception."
            ]
          },
          {
            id: "verify-mode",
            name: "context.verify_mode",
            kind: "attr",
            sig: "ctx.verify_mode: VerifyMode",
            sum: [
              "Karşı tarafın sertifikasının nasıl doğrulanacağını belirler (`CERT_REQUIRED`, `CERT_OPTIONAL`, `CERT_NONE`).",
              "Controls whether peer certificates must be validated against trusted root authorities."
            ],
            desc: [
              "`CERT_REQUIRED` sunucunun güvenilir bir sertifika sunmasını şart koşar; sunamazsa bağlantıyı keser. `CERT_NONE` ise sertifikayı hiç denetlemez (şifreleme açık kalsa bile kimlik doğrulanmaz).",
              "`CERT_REQUIRED` mandates valid CA authentication. `CERT_NONE` skips validation entirely, defeating the primary defense of TLS."
            ],
            ex: {
              code: R`import ssl

ctx = ssl.create_default_context()
print("Varsayilan mod CERT_REQUIRED mi:", ctx.verify_mode == ssl.CERT_REQUIRED)`,
              out: R`Varsayilan mod CERT_REQUIRED mi: True`
            }
          }
        ]
      },
      {
        id: "socket-wrapping-and-certs",
        title: ["Soket Sarma ve Sertifika Analizi", "Socket Wrapping & Certificate Inspection"],
        intro: [
          "`wrap_socket` ile el sıkışması ve `getpeercert` ile metaveri okuma.",
          "Performing TLS handshakes and extracting peer certificate attributes."
        ],
        items: [
          {
            id: "wrap-socket",
            name: "context.wrap_socket(sock, server_side=False, server_hostname=None)",
            kind: "method",
            sig: "ctx.wrap_socket(sock: socket, server_side: bool = False, server_hostname: str = None) -> SSLSocket",
            sum: [
              "Mevcut bir TCP soketini TLS katmanı ile sarar ve TLS el sıkışmasını (handshake) gerçekleştirir.",
              "Takes an active socket stream and returns an SSLSocket object handling TLS transport."
            ],
            desc: [
              "`server_hostname` parametresi SNI (Server Name Indication) başlığını gönderir ve sertifika adresiyle eşleştiğini doğrular. Başarılı olursa dönen `SSLSocket` normal bir soket gibi `send`/`recv` ile kullanılır.",
              "Upgrades raw transport socket to TLS. `server_hostname` supplies the SNI extension and validates subject match."
            ],
            ex: {
              code: R`import ssl
import socket

# Soket sarma prototip testi: ||| Socket wrapping prototype test:
ctx = ssl.create_default_context()
raw_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print("Sarma metodu hazir:", callable(ctx.wrap_socket))
raw_sock.close()`,
              out: R`Sarma metodu hazir: True`
            }
          },
          {
            id: "getpeercert",
            name: "sslsocket.getpeercert(binary_form=False)",
            kind: "method",
            sig: "ssl_sock.getpeercert(binary_form: bool = False) -> dict | bytes | None",
            sum: [
              "Uzak sunucunun sunduğu X.509 dijital sertifikasını ayrıştırılmış sözlük olarak döner.",
              "Returns a dictionary containing fields of the other side's certificate."
            ],
            desc: [
              "Dönen sözlükte `subject`, `issuer` (veren kurum), `notBefore`, `notAfter` (son geçerlilik tarihi) ve `subjectAltName` (alan adları) bulunur. Sertifika istihbaratında en önemli fonksiyondur.",
              "Exposes issuer identity, subject parameters, valid date boundaries, and subjectAltName domain collections."
            ],
            ex: {
              code: R`import ssl

# Ornek bir getpeercert sozluk ciktisi yapisi: ||| Sample getpeercert output structure:
ornek_cert = {
    "subject": ((("commonName", "example.com"),),),
    "issuer": ((("organizationName", "DigiCert Inc"),),),
    "notAfter": "May 20 12:00:00 2026 GMT"
}
print("CommonName:", ornek_cert["subject"][0][0][1])
print("Issuer:", ornek_cert["issuer"][0][0][1])`,
              out: R`CommonName: example.com
Issuer: DigiCert Inc`
            },
            cyber: [
              "Pentest ve keşif aşamasında `subjectAltName` listesi incelenerek hedef kuruma ait gizli API sunucuları ve test subdomain'leri ortaya çıkarılır.",
              "Auditing `subjectAltName` entries frequently reveals forgotten internal staging subdomains and development microservices."
            ]
          },
          {
            id: "ssl-error",
            name: "ssl.SSLError / SSLCertVerificationError",
            kind: "exception",
            sig: "ssl.SSLError, ssl.SSLCertVerificationError",
            sum: [
              "TLS el sıkışması, sertifika doğrulaması veya şifreleme hatalarında fırlatılan istisnalar.",
              "Exception hierarchy raised for TLS handshake, verification, and protocol anomalies."
            ],
            desc: [
              "Sertifikanın süresi dolmuşsa, veren makam güvenilmiyorsa veya alan adı uyuşmuyorsa `SSLCertVerificationError` tetiklenir.",
              "Raised whenever certificate chains fail authority trust, expiry windows, or hostname validation."
            ],
            ex: {
              code: R`import ssl

print(issubclass(ssl.SSLCertVerificationError, ssl.SSLError))`,
              out: R`True`
            }
          },
          {
            id: "der-to-pem",
            name: "ssl.DER_cert_to_PEM_cert(der_cert_bytes)",
            kind: "function",
            sig: "ssl.DER_cert_to_PEM_cert(der_cert_bytes: bytes) -> str",
            sum: [
              "İkili DER formatındaki sertifikayı standart Base64 PEM metnine çevirir.",
              "Converts a certificate from DER binary representation to PEM text string format."
            ],
            desc: [
              "`-----BEGIN CERTIFICATE-----` başlığıyla başlayan okunabilir ASCII formatına dönüştürür. Sertifikaları dosyalara kaydetmek için kullanılır.",
              "Encloses base64-encoded binary DER certificates within standard PEM boundaries for filesystem storage."
            ],
            ex: {
              code: R`import ssl

dummy_der = b"\x30\x82\x01\x0a" + (b"\x00" * 266)
pem = ssl.DER_cert_to_PEM_cert(dummy_der)
print(pem.startswith("-----BEGIN CERTIFICATE-----"))`,
              out: R`True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "tls-cert-inspector",
        title: [
          "SSL/TLS Sertifika ve SAN Alan Adı Keşifçisi",
          "TLS Certificate Inspector & SAN Subdomain Scout"
        ],
        sum: [
          "Hedef sunucuya bağlanıp sertifika son kullanma tarihini ve `subjectAltName` alt alan adlarını çıkarma.",
          "Auditing remote TLS endpoints to harvest SAN domain entries and validity horizons."
        ],
        code: R`import ssl

# Ornek ayrilmis gercekci sertifika yapisi: ||| Realistic parsed certificate representation:
cert = {
    "subject": ((("commonName", "guvenlibanka.com"),),),
    "issuer": ((("commonName", "Let's Encrypt Authority X3"),),),
    "notAfter": "Aug 15 23:59:59 2026 GMT",
    "subjectAltName": [
        ("DNS", "guvenlibanka.com"),
        ("DNS", "api.guvenlibanka.com"),
        ("DNS", "admin.guvenlibanka.com")
    ]
}

def extract_san_domains(certificate: dict) -> list[str]:
    # subjectAltName listesindeki DNS kayitlarini filtrele: ||| Extract DNS entries from SAN list:
    return [name for kind, name in certificate.get("subjectAltName", []) if kind == "DNS"]

alt_alanlar = extract_san_domains(cert)
print("Ana alan adi:", cert["subject"][0][0][1])
print("Bulunan alt alan adlari:", alt_alanlar)
print("Gizli admin paneli tespit edildi mi:", "admin.guvenlibanka.com" in alt_alanlar)`,
        out: R`Ana alan adi: guvenlibanka.com
Bulunan alt alan adlari: ['guvenlibanka.com', 'api.guvenlibanka.com', 'admin.guvenlibanka.com']
Gizli admin paneli tespit edildi mi: True`,
        cyber: true,
        note: [
          "Saldırganlar ve güvenlik araştırmacıları, hedef kurumun yayınladığı TLS sertifikalarındaki `subjectAltName` alanlarını okuyarak DNS brute-force yapmadan gizli alt alan adlarını haritalandırır.",
          "Inspecting SAN attributes exposes internal staging, administrative, and API subdomains passively without generating noisy DNS brute-force traffic."
        ]
      },
      {
        id: "mitm-defense-verifier",
        title: [
          "Ortadaki Adam (MITM) Karşıtı SSL Bağlamı Denetleyicisi",
          "Anti-MITM SSL Context Security Hardener"
        ],
        sum: [
          "Bir SSLContext nesnesinin MITM saldırılarına karşı güvenli olup olmadığını otomatik doğrulama.",
          "Validating that active SSL context configurations enforce strict certificate and hostname validation."
        ],
        code: R`import ssl

def is_context_secure(ctx: ssl.SSLContext) -> tuple[bool, str]:
    if not ctx.check_hostname:
        return False, "ZAFİYET: check_hostname devre dışı! MITM riski."
    if ctx.verify_mode != ssl.CERT_REQUIRED:
        return False, "ZAFİYET: Sertifika doğrulama zorunlu değil (CERT_NONE)."
    if ctx.minimum_version in (ssl.TLSVersion.SSLv3, ssl.TLSVersion.TLSv1, ssl.TLSVersion.TLSv1_1):
        return False, "ZAFİYET: Eski ve güvensiz TLS sürümüne izin veriliyor."
    return True, "GUVENLI: Standart sertifika ve hostname korumasi aktif."

guvenli_ctx = ssl.create_default_context()
guvensiz_ctx = ssl.create_default_context()
guvensiz_ctx.check_hostname = False # Tehlikeli ayar! ||| Dangerous misconfiguration!

print("Guvenli baglam sonucu:", is_context_secure(guvenli_ctx)[0])
print("Zayif baglam engellendi mi:", not is_context_secure(guvensiz_ctx)[0])`,
        out: R`Guvenli baglam sonucu: True
Zayif baglam engellendi mi: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "check-hostname-risk",
        q: [
          "`check_hostname = False` yapmanın yarattığı kritik güvenlik riski nedir?",
          "What critical security risk is created by setting `check_hostname = False`?"
        ],
        a: [
          "İstemci, bağlandığı alan adı (örn. bankam.com) ile sunucunun gösterdiği sertifikadaki alan adını eşleştirmeyi bırakır. Saldırgan kendi adına alınmış geçerli herhangi bir sertifikayla trafiği araya girip deşifre edebilir (MITM).",
          "The client stops verifying that the certificate's subject matches the destination domain. An attacker presenting any valid CA-signed certificate can intercept and decrypt traffic transparently (MITM)."
        ]
      },
      {
        id: "cert-none-danger",
        q: [
          "`verify_mode = ssl.CERT_NONE` ayarı ne yapar ve neden tehlikelidir?",
          "What does `verify_mode = ssl.CERT_NONE` do, and why is it dangerous?"
        ],
        a: [
          "Sunucu sertifikasının güvenilir bir makam (CA) tarafından imzalanıp imzalanmadığını denetlemeyi tamamen kapatır. Trafik şifreli görünse bile kimlik doğrulanmadığı için sahte sunuculara karşı sıfır koruma kalır.",
          "It disables root CA certificate chain verification. While encryption remains technically active, peer identity is never verified, eliminating protection against rogue interception servers."
        ]
      },
      {
        id: "create-default-context-importance",
        q: [
          "Neden sıfırdan `SSLContext()` açmak yerine `ssl.create_default_context()` kullanılmalıdır?",
          "Why should `ssl.create_default_context()` be used instead of bare `SSLContext()`?"
        ],
        a: [
          "`create_default_context()` işletim sisteminin güvenilir CA sertifika havuzunu yükler, `check_hostname` ve `CERT_REQUIRED` bayraklarını açar ve güvensiz şifreleme algoritmalarını otomatik engeller.",
          "`create_default_context()` loads trusted system root stores, activates strict hostname verification, mandates CA validation, and disables vulnerable legacy ciphers automatically."
        ]
      },
      {
        id: "subject-alt-name-recon",
        q: [
          "Sertifikalardaki `subjectAltName` (SAN) alanı siber güvenlik keşiflerinde neden incelenir?",
          "Why is the `subjectAltName` (SAN) certificate field audited during security reconnaissance?"
        ],
        a: [
          "Tek bir sertifika birden fazla alan adını kapsayabilir (`api.site.com`, `admin.site.com`, `vpn.site.com`). SAN alanını okumak, hedef kuruma ait gizli alt alan adlarını pasif olarak keşfetmeyi sağlar.",
          "A certificate can secure multiple hostnames. Parsing SAN entries passively reveals hidden target subdomains (internal APIs, VPN portals, admin gateways) without active scanning."
        ]
      },
      {
        id: "sni-server-hostname",
        q: [
          "`wrap_socket` çağrısında `server_hostname` parametresinin görevi nedir?",
          "What is the role of `server_hostname` in `wrap_socket`?"
        ],
        a: [
          "TLS el sıkışması sırasında SNI (Server Name Indication) eklentisini sunucuya göndererek, aynı IP üzerinde barınan yüzlerce siteden hangisine bağlanmak istediğimizi belirtir ve doğru sertifikanın dönmesini sağlar.",
          "It transmits the SNI extension during TLS handshakes, allowing virtual-hosting servers sharing a single IP to present the matching domain certificate."
        ]
      }
    ]
  });
})();


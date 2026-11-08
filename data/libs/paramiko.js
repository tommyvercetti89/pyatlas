(function () {
  const R = String.raw;
  PY.addLib({
    id: "paramiko",
    name: "paramiko",
    sym: "ssh",
    color: "#6366f1",
    focus: "cyber",
    level: 3,
    ext: true,
    install: "pip install paramiko",
    cat: "network",
    docs: "https://www.paramiko.org/",
    tagline: [
      "Python ile SSHv2 protokolü: Güvenli uzak komut çalıştırma, SFTP dosya transferi ve anahtar yönetimi.",
      "Python SSHv2 protocol implementation: Secure remote execution, SFTP file transfer, and key management."
    ],
    analogy: [
      "Telnet ile sunucu yönetmek, şifreleri sokakta bağırmak gibidir (herkes dinleyebilir). Paramiko ise sunucuyla aranda kriptografik zırhla kaplı, uçtan uca şifreli bir SSH tüneli açar. Tünelin içinde güvenle komut çalıştırır (`exec_command`), sunucu dosyalarını şifreli kopyalar (`SFTPClient`) ve sunucunun kimliğini parmak izinden doğrularsın (`host_keys`).",
      "Managing servers over Telnet is like shouting passwords in a public square. Paramiko forges an end-to-end encrypted SSHv2 tunnel: execute remote commands securely (`exec_command`), transfer files via encrypted SFTP (`SFTPClient`), and verify server identity via cryptographic fingerprints."
    ],
    intro: [
      [
        "`paramiko`, Python için geliştirilmiş saf Python SSHv2 protokol kütüphanesidir. Hem istemci (SSHClient, SFTPClient) hem de sunucu yeteneklerine sahiptir. Kriptografik anahtar doğrulamalarını ve güvenli oturum kanallarını yönetir.",
        "`paramiko` is the definitive pure-Python implementation of the SSHv2 protocol, providing high-level client wrappers (`SSHClient`, `SFTPClient`) and underlying transport primitives."
      ],
      [
        "Siber güvenlikte ve sistem sıkılaştırmada (Hardening) kritik role sahiptir: yüzlerce sunucunun konfigürasyonunu SSH üzerinden denetlemek, sunucu anahtarı parmak izini (Host Key) doğrulayarak Ortadaki Adam (MITM) saldırılarını engellemek ve parola yerine RSA/Ed25519 anahtarlı kimlik doğrulamasını otomatize etmek Paramiko ile yapılır.",
        "In infrastructure security and DevSecOps, Paramiko is fundamental: auditing remote server configurations, preventing MITM attacks via strict Host Key verification, and automating asymmetric key-based authentication."
      ]
    ],
    import: R`import paramiko`,
    general: [
      [
        "Linux ve ağ cihazlarına uzaktan güvenli SSH bağlantısı kurup komut çalıştırmak.",
        "Connecting to remote Linux servers and network gear via SSH to execute commands."
      ],
      [
        "Sunucular arasında şifreli dosya yükleme ve indirme işlemleri (`open_sftp`).",
        "Uploading and downloading files securely over encrypted SFTP tunnels."
      ],
      [
        "SSH anahtar çiftleri (RSA, Ed25519) üretmek ve yönetmek.",
        "Generating, exporting, and managing asymmetric SSH key pairs."
      ]
    ],
    cyberUse: [
      [
        "Sunucu Güvenlik Denetimi: Uzak sunucularda `sshd_config`, açık portlar ve kullanıcı izinlerini otomatik sorgulayan audit araçları yazmak.",
        "Auditing remote system configurations (sshd_config, open listeners, sudoers) at scale."
      ],
      [
        "Anahtar Doğrulama (Host Key Verification): `RejectPolicy` kullanarak bilinmeyen veya değişmiş sunucu parmak izlerini reddetmek (MITM savunması).",
        "Enforcing strict host key policies (`RejectPolicy`) to prevent SSH Man-in-the-Middle impersonation."
      ],
      [
        "Parola yerine asimetrik anahtar tabanlı kimlik doğrulamasını (`pkey` / `key_filename`) zorunlu kılmak.",
        "Automating hardened key-based authentication while deprecating weak password auth."
      ]
    ],
    sections: [
      {
        id: "ssh-client",
        title: ["SSHClient ve Bağlantı Yönetimi", "SSHClient & Connection Management"],
        intro: [
          "Uzak sunucuya bağlanma, anahtar politikası belirleme ve oturum yönetimi.",
          "High-level interface for connecting to remote hosts and executing commands."
        ],
        items: [
          {
            id: "sshclient-class",
            name: "paramiko.SSHClient()",
            kind: "class",
            sig: "paramiko.SSHClient()",
            sum: [
              "Uzak bir SSH sunucusuna bağlanmak için yüksek seviyeli istemci sınıfı.",
              "Primary high-level client class for establishing secure SSH sessions."
            ],
            desc: [
              "Sunucuya bağlanma, komut yürütme ve SFTP oturumu başlatma işlemlerini tek bir çatı altında toplar. Kullanımdan sonra `client.close()` ile oturum kapatılmalıdır.",
              "Encapsulates connection lifecycle, host key validation, authentication, and execution channels. Close via `close()` when finished."
            ],
            ret: ["Yeni bir `paramiko.SSHClient` nesnesi.", "A new `paramiko.SSHClient` instance."],
            ex: {
              code: R`import paramiko

client = paramiko.SSHClient()
print(isinstance(client, paramiko.SSHClient))
client.close()`,
              out: R`True`
            }
          },
          {
            id: "set-missing-host-key-policy",
            name: "client.set_missing_host_key_policy(policy)",
            kind: "method",
            sig: "client.set_missing_host_key_policy(policy)",
            sum: [
              "Bilinmeyen bir sunucuya bağlanırken izlenecek anahtar doğrulama politikasını ayarlar.",
              "Sets policy to use when connecting to servers not in known_hosts."
            ],
            desc: [
              "Üç temel politika mevcuttur:\n`RejectPolicy()`: Bilinmeyen sunucuyu derhal reddeder (En güvenli / MITM koruması).\n`WarningPolicy()`: Uyarı basar ama bağlanır.\n`AutoAddPolicy()`: Bilinmeyen sunucuyu otomatik olarak `known_hosts`a ekler.",
              "Three primary policies exist:\n`RejectPolicy()`: Aborts connection if host is unknown (Most secure against MITM).\n`WarningPolicy()`: Emits warning but proceeds.\n`AutoAddPolicy()`: Blindly adds untrusted host key."
            ],
            params: [
              { n: "policy", d: ["Politika sınıfı örneği (örn: `paramiko.AutoAddPolicy()`).", "Policy class instance."] }
            ],
            ex: {
              code: R`import paramiko

client = paramiko.SSHClient()
# Otomatik ekleme politikasini ata ||| Set auto-add policy
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
print(paramiko.RejectPolicy.__name__)
client.close()`,
              out: R`RejectPolicy`
            },
            cyber: [
              "Üretim ortamlarında `AutoAddPolicy()` KULLANILMAMALIDIR! Çünkü araya giren bir saldırgan sahte bir SSH anahtarı sunduğunda bu politika sorgusuz sualsiz kabul eder. Güvenli sistemlerde `RejectPolicy()` kullanılmalıdır.",
              "Never use `AutoAddPolicy()` in high-security production! It blindly accepts MITM attacker keys. Always enforce `RejectPolicy()` with pre-seeded `known_hosts`."
            ]
          },
          {
            id: "connect",
            name: "client.connect(hostname, ...)",
            kind: "method",
            sig: "client.connect(hostname, port=22, username=None, password=None, pkey=None, key_filename=None, timeout=None)",
            sum: [
              "Uzak SSH sunucusuna şifreli oturum başlatır.",
              "Authenticates and connects to the remote SSH server."
            ],
            desc: [
              "Kullanıcı adı, parola veya özel anahtar (`pkey` / `key_filename`) kullanarak kimlik doğrulamasını tamamlar. Başarısız olursa `AuthenticationException` fırlatır.",
              "Establishes TCP transport, negotiates ciphers, verifies host key, and authenticates via credentials or private keys."
            ],
            params: [
              { n: "hostname", d: ["Hedef sunucunun IP adresi veya alan adı.", "Target server IP or domain."] },
              { n: "port", d: ["SSH portu (varsayılan 22).", "Remote SSH port (default 22)."] },
              { n: "username", d: ["Giriş yapılacak kullanıcı adı.", "Login username."] },
              { n: "pkey", d: ["Özel anahtar nesnesi (`PKey`).", "Private key object."] }
            ],
            ex: {
              code: R`import paramiko

# Paramiko istisna siniflarini kontrol et ||| Check exception types
print(issubclass(paramiko.AuthenticationException, Exception))
print(issubclass(paramiko.SSHException, Exception))`,
              out: R`True
True`
            }
          },
          {
            id: "exec-command",
            name: "client.exec_command(command)",
            kind: "method",
            sig: "client.exec_command(command, timeout=None) -> (stdin, stdout, stderr)",
            sum: [
              "Uzak sunucuda kabuk komutu çalıştırır ve 3 standart akış döner.",
              "Executes a command on the remote server and returns (stdin, stdout, stderr)."
            ],
            desc: [
              "Sunucuda yeni bir kanal (channel) açarak belirtilen komutu yürütür. `stdin`, `stdout` ve `stderr` boruları (`ChannelFile`) döner. Çıktı `stdout.read().decode()` ile okunur.",
              "Opens a session channel and executes the command on the remote host, returning streaming handles for `stdin`, `stdout`, and `stderr`."
            ],
            ret: ["`(stdin, stdout, stderr)` akışları demeti.", "Tuple of `(stdin, stdout, stderr)` streaming handles."],
            ex: {
              code: R`import paramiko

# ChannelFile dosya benzeri bir nesnedir ||| ChannelFile behaves like file object
print(hasattr(paramiko.ChannelFile, "read"))`,
              out: R`True`
            }
          }
        ]
      },
      {
        id: "sftp-and-keys",
        title: ["SFTP ve SSH Anahtar Yönetimi", "SFTP File Transfer & Key Generation"],
        intro: [
          "Dosya transferi ve asimetrik RSA/Ed25519 anahtar çiftleri üretme metodları.",
          "Encrypted SFTP client operations and asymmetric key generation."
        ],
        items: [
          {
            id: "rsa-key-generate",
            name: "paramiko.RSAKey.generate(bits=2048)",
            kind: "function",
            sig: "paramiko.RSAKey.generate(bits=2048, progress_func=None) -> RSAKey",
            sum: [
              "Yeni bir kriptografik RSA özel anahtarı üretir.",
              "Generates a new RSA private key object of specified bit length."
            ],
            desc: [
              "Uzak sunuculara parola yerine asimetrik anahtarla bağlanmak için 2048 veya 4096 bitlik RSA anahtarı üretir.",
              "Generates a new asymmetric RSA key pair (minimum 2048 bits recommended) for passwordless SSH authentication."
            ],
            params: [
              { n: "bits", d: ["Anahtar bit uzunluğu (en az 2048).", "Key bit length (2048 or 4096)."] }
            ],
            ret: ["`paramiko.RSAKey` nesnesi.", "`paramiko.RSAKey` instance."],
            ex: {
              code: R`import paramiko

key = paramiko.RSAKey.generate(2048)
print(key.get_bits())
print(key.get_name())`,
              out: R`2048
ssh-rsa`
            }
          },
          {
            id: "write-private-key-file",
            name: "key.write_private_key_file(filename)",
            kind: "method",
            sig: "key.write_private_key_file(filename, password=None)",
            sum: [
              "Özel anahtarı PEM formatında diskteki bir dosyaya yazar.",
              "Writes the private key to an OpenSSH/PEM formatted file on disk."
            ],
            desc: [
              "Üretilen özel anahtarı (`id_rsa`) diske kaydeder. `password` parametresi verilirse anahtar AES ile parola korumalı olarak şifrelenir.",
              "Persists private key bytes to disk. Supplying a password encrypts the key file symmetrically."
            ],
            ex: {
              code: R`import paramiko
import tempfile
import os

with tempfile.TemporaryDirectory() as td:
    key_path = os.path.join(td, "id_rsa")
    key = paramiko.RSAKey.generate(2048)
    key.write_private_key_file(key_path)
    
    loaded = paramiko.RSAKey.from_private_key_file(key_path)
    print("Anahtar eslesti mi:", loaded.get_fingerprint() == key.get_fingerprint())`,
              out: R`Anahtar eslesti mi: True`
            }
          },
          {
            id: "open-sftp",
            name: "client.open_sftp()",
            kind: "method",
            sig: "client.open_sftp() -> SFTPClient",
            sum: [
              "Mevcut SSH bağlantısı üzerinde şifreli SFTP dosya transfer istemcisi açar.",
              "Opens an encrypted SFTP session over the active SSH transport."
            ],
            desc: [
              "Sunucudan dosya indirmek (`get`) veya yüklemek (`put`) için güvenli SFTP oturumu döner.",
              "Instantiates an `SFTPClient` multiplexed over the SSH transport for secure file transfers."
            ],
            ret: ["`paramiko.SFTPClient` nesnesi.", "`paramiko.SFTPClient` instance."],
            ex: {
              code: R`import paramiko

print(hasattr(paramiko.SFTPClient, "get"))
print(hasattr(paramiko.SFTPClient, "put"))`,
              out: R`True
True`
            }
          },
          {
            id: "ecdsa-key",
            name: "paramiko.ECDSAKey",
            kind: "class",
            sig: "paramiko.ECDSAKey.generate() -> ECDSAKey",
            sum: [
              "Modern ve yüksek performanslı eliptik eğri (ECDSA) anahtarı sınıfı.",
              "Modern high-security elliptic curve ECDSA asymmetric key implementation."
            ],
            desc: [
              "RSA'ya göre çok daha kısa anahtar boyutuyla (256-bit) yüksek güvenlik ve hızlı el sıkışma sunar. NIST P-256 eğrisini kullanır.",
              "Provides elliptic-curve cryptography over NIST P-256, offering superior performance compared to legacy RSA."
            ],
            ex: {
              code: R`import paramiko

key = paramiko.ECDSAKey.generate()
print(key.get_name())`,
              out: R`ecdsa-sha2-nistp256`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "key-generator-and-fingerprint",
        title: [
          "SSH Anahtar Çifti Üretici ve Parmak İzi Çıkarıcı",
          "SSH Key Pair Generator & Fingerprint Extractor"
        ],
        sum: [
          "Parola korumalı 2048-bit RSA anahtarı oluşturup SHA-256 parmak izini hesaplama.",
          "Generating a 2048-bit RSA key and computing its cryptographic SHA-256 fingerprint."
        ],
        code: R`import paramiko
import base64
import hashlib

# 2048-bit RSA anahtari uret ||| Generate 2048-bit RSA key
key = paramiko.RSAKey.generate(2048)

# Genel anahtar parmak izini (SHA256) hesapla ||| Compute SHA-256 fingerprint
raw_key = base64.b64decode(key.get_base64())
fp_sha256 = base64.b64encode(hashlib.sha256(raw_key).digest()).decode().rstrip("=")

print(f"Anahtar Tipi: {key.get_name()}")
print(f"Anahtar Uzunlugu: {key.get_bits()} bit")
print(f"Parmak Izi SHA256: {len(fp_sha256)} karakter")`,
        out: R`Anahtar Tipi: ssh-rsa
Anahtar Uzunlugu: 2048 bit
Parmak Izi SHA256: 43 karakter`,
        cyber: true,
        note: [
          "Sunuculara bağlanırken SSH istemcisinin ekrana bastığı `SHA256:43karakter` parmak izi bu formülle doğrulanır.",
          "SSH clients display this SHA-256 fingerprint prompt to authenticate servers during first-time connections."
        ]
      },
      {
        id: "remote-audit-runner",
        title: [
          "Uzak Sunucu Güvenlik Denetleyicisi Şablonu",
          "Remote Security Auditing Client Template"
        ],
        sum: [
          "Uzak sunucuya SSH ile bağlanıp konfigürasyon dosyalarını denetleme kalıbı.",
          "Pattern for issuing security configuration audit commands over authenticated SSH."
        ],
        code: R`import paramiko

def build_audit_client():
    client = paramiko.SSHClient()
    # Bilinmeyen sunuculari guvenlik icin reddet ||| Reject unknown hosts strictly
    client.set_missing_host_key_policy(paramiko.RejectPolicy())
    return client

c = build_audit_client()
print("Istemci hazir mi:", isinstance(c, paramiko.SSHClient))
c.close()`,
        out: R`Istemci hazir mi: True`,
        cyber: true,
        note: [
          "Yetkili lab ortamlarında `client.connect('192.168.1.50', username='audit', pkey=key)` ile bağlanılıp `cat /etc/ssh/sshd_config` çıktısı incelenir.",
          "In authorized enterprise audits, read-only audit keys query configurations like `/etc/ssh/sshd_config`."
        ]
      }
    ],
    cards: [
      {
        id: "auto-add-policy-mitm-risk",
        q: [
          "`client.set_missing_host_key_policy(paramiko.AutoAddPolicy())` neden üretimde MITM zaafiyeti yaratır?",
          "Why does `AutoAddPolicy()` introduce a critical MITM vulnerability in production?"
        ],
        a: [
          "Çünkü sunucunun kimliğini hiç sorgulamadan, ağdaki herhangi bir cihazın sunduğu SSH anahtarını otomatik kabul eder. Araya giren bir saldırgan (MITM) sahte anahtar sunduğunda tüm trafik saldırganın üzerinden geçer.",
          "It blindly trusts whatever host key the server responds with. If a Man-in-the-Middle attacker intercepts the connection, Paramiko accepts the attacker's fake key without alerting."
        ]
      },
      {
        id: "rsa-vs-ed25519",
        q: [
          "Modern SSH altyapılarında neden RSA yerine Ed25519 anahtarları tercih edilir?",
          "Why are Ed25519 keys preferred over RSA in modern SSH deployments?"
        ],
        a: [
          "Ed25519 eliptik eğri kriptografisi kullanır. Yalnızca 256 bit uzunluğundadır (çok kompakt ve hızlıdır) ancak 3072-bitlik hantal bir RSA anahtarından daha yüksek güvenlik sunar.",
          "Ed25519 uses elliptic-curve cryptography. At just 256 bits, it is faster, lighter, and more resilient than a 3072-bit RSA key."
        ]
      },
      {
        id: "exec-command-streams",
        q: [
          "`client.exec_command()` çağrısı hangi üç akışı döndürür?",
          "Which three streams are returned by `client.exec_command()`?"
        ],
        a: [
          "`(stdin, stdout, stderr)` üçlüsünü döner. Komuta girdi vermek için `stdin.write()`, çıktıyı okumak için `stdout.read()` kullanılır.",
          "Returns `(stdin, stdout, stderr)`. Use `stdin.write()` to pipe input and `stdout.read()` / `stderr.read()` to capture responses."
        ]
      },
      {
        id: "sftp-purpose",
        q: [
          "Paramiko'daki `open_sftp()` metodunun görevi nedir?",
          "What is the role of `open_sftp()` in Paramiko?"
        ],
        a: [
          "Aynı SSH oturumu üzerinde güvenli dosya transfer protokolü (SFTP) başlatır; `put()` ile sunucuya dosya yüklemeyi, `get()` ile sunucudan dosya indirmeyi sağlar.",
          "Spawns an encrypted SFTP session over the SSH channel to upload (`put`) and download (`get`) files securely."
        ]
      },
      {
        id: "key-based-auth-advantage",
        q: [
          "SSH güvenliğinde parola yerine asimetrik anahtar (SSH Key) kullanmanın en büyük avantajı nedir?",
          "What is the foremost security advantage of SSH key pairs over passwords?"
        ],
        a: [
          "Anahtarlar kaba kuvvet (brute-force) veya sözlük (dictionary) saldırılarıyla tahmin edilemez; sunucuda parola sızıntısı olsa dahi özel anahtar istemcide kaldığından hesap ele geçirilemez.",
          "SSH keys are mathematically immune to brute-force and dictionary guessing; the private key never leaves the client, preventing credential theft."
        ]
      }
    ]
  });
})();

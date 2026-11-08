(function () {
  const R = String.raw;
  PY.addLib({
    id: "hmac",
    name: "hmac",
    sym: "hm",
    color: "#ec4899",
    focus: "both",
    level: 2,
    ext: false,
    cat: "crypto",
    docs: "https://docs.python.org/3/library/hmac.html",
    tagline: [
      "Gizli anahtarla mesaj doğrulama (HMAC): veri bütünlüğü ve zamanlama saldırılarına karşı güvenli karşılaştırma.",
      "Keyed-hashing for message authentication (HMAC): data integrity and timing-attack-safe comparison."
    ],
    analogy: [
      "`hashlib` mühürsüz bir parmak izi gibidir: herkes verinin özetini çıkarabilir. `hmac` ise parmak izinin içine gizli bir mühür (özel anahtar) katar. Mesajı yolda değiştiren biri gizli anahtarı bilmediği için geçerli bir HMAC mührü üretemez. Böylece alıcı hem mesajın bozulmadığını hem de gerçekten güvenilir taraftan geldiğini anlar.",
      "`hashlib` is like an open fingerprint: anyone can compute the hash of data. `hmac` embeds a secret wax seal (a shared private key) into the hash. An interceptor cannot forge a valid seal without knowing the key. The receiver verifies both that data was not tampered with and that it originated from the authorized peer."
    ],
    intro: [
      [
        "`hmac` modülü, RFC 2104 ile tanımlanan **HMAC (Hash-based Message Authentication Code)** algoritmasını sunar. Basitçe `hash(anahtar + veri)` yapmak 'uzunluk uzatma' (length extension) gibi kriptografik zayıflıklara yol açar; HMAC ise iç içe iki aşamalı karmaşık bir anahtarlama mimarisiyle bu zaafiyeti tamamen ortadan kaldırır.",
        "The `hmac` module implements the **HMAC (Hash-based Message Authentication Code)** algorithm specified in RFC 2104. Simply doing `hash(key + msg)` exposes cryptography to length extension attacks; HMAC completely eliminates this flaw via a two-pass nested keyed structure."
      ],
      [
        "Web kancaları (GitHub/Stripe webhook), API imzalama (AWS SigV4), JWT HS256 belirteçleri ve oturum güvenliği neredeyse istisnasız HMAC kullanır. Ayrıca modül içindeki `hmac.compare_digest` fonksiyonu, parolaları ve token'ları zamanlama saldırılarına (timing attacks) karşı sabit zamanda (constant-time) kıyaslamak için siber güvenliğin en temel kalkanıdır.",
        "Webhooks (GitHub/Stripe), API signing (AWS SigV4), JWT HS256 tokens, and session integrity rely almost universally on HMAC. Furthermore, `hmac.compare_digest` provides a constant-time comparison primitive essential for shielding password and token checks from timing attacks."
      ]
    ],
    import: R`import hmac
import hashlib`,
    general: [
      ["Mikroservisler ve dağıtık sistemler arasında mesajların kurcalanmadığını kanıtlama.", "Verifying that inter-service payload messages have not been modified in transit."],
      ["Veritabanındaki hassas kayıtların değiştirilmediğini doğrulayan dijital sağlama imzaları.", "Digital checksum signatures verifying sensitive database records remain intact."],
      ["Statik dosya ve medya indirmeleri için süre sınırlı, imzalı erişim linkleri (signed URLs).", "Generating signed, expiring URLs for authorized media and download access."]
    ],
    cyberUse: [
      ["Webhook doğrulama: GitHub, Stripe ve Shopify gibi servislerden gelen HTTP isteklerinin imzasını (`X-Hub-Signature-256`) teyit etme.", "Webhook verification: validating incoming HTTP payload signatures (`X-Hub-Signature-256`) from GitHub, Stripe, or payment gateways."],
      ["Zamanlama saldırısı (timing attack) önleme: Normal `==` operatörü ilk uyuşmayan karakterde dururken, `hmac.compare_digest` sabit sürede çalışarak saldırganın parola/token tahmin etmesini engeller.", "Timing attack defense: standard `==` short-circuits on first mismatch, whereas `hmac.compare_digest` executes in constant time to thwart byte-by-byte timing inference."],
      ["API istek imzalama: İstek gövdesi, HTTP metodu ve zaman damgasını gizli anahtarla imzalayarak kimlik sahteciliği ve replay saldırılarını engelleme.", "API request signing: binding payload, method, and timestamps to eliminate replay attacks and impersonation."]
    ],
    sections: [
      {
        id: "hmac-operations",
        title: ["HMAC Oluşturma ve Özet Alma", "HMAC Creation & Digest"],
        intro: [
          "HMAC nesneleri oluşturma, veri besleme ve onaltılık (hex) özet üretme.",
          "Instantiating HMAC objects, streaming message blocks, and generating hex digests."
        ],
        items: [
          {
            id: "new",
            name: "hmac.new(key, msg=None, digestmod='')",
            kind: "function",
            sig: "hmac.new(key: bytes, msg: bytes = None, digestmod: str | callable = '') -> HMAC",
            sum: [
              "Yeni bir HMAC nesnesi başlatır.",
              "Initializes a new HMAC object with a secret key and chosen hash algorithm."
            ],
            desc: [
              "`key` gizli anahtardır ve mutlaka `bytes` olmalıdır. `digestmod` olarak `'sha256'`, `'sha512'` gibi algoritma adı veya `hashlib.sha256` geçilir.",
              "`key` must be a bytes sequence. `digestmod` specifies the underlying hash algorithm (e.g. `'sha256'` or `hashlib.sha256`)."
            ],
            ex: {
              code: R`import hmac
import hashlib

key = b"super-secret-key"
h = hmac.new(key, b"hello world", hashlib.sha256)
print(h.hexdigest())`,
              out: R`62702cb79bceeba4d3f64ffd8253c3d44fbe19870d83e099f6498af265c83b61`
            }
          },
          {
            id: "hexdigest",
            name: "hmac.hexdigest()",
            kind: "method",
            sig: "h.hexdigest() -> str",
            sum: [
              "HMAC imzasını okunabilir onaltılık (hex) dize olarak döner.",
              "Returns the HMAC digest as a string of hexadecimal digits."
            ],
            desc: [
              "API başlıklarında ve webhook imzalarında en yaygın paylaşılan format hex formatıdır. 64 karakter (SHA-256 için) uzunluğundadır.",
              "The standard representation used across webhook headers and API tokens, yielding 64 characters for SHA-256."
            ],
            ex: {
              code: R`import hmac

h = hmac.new(b"secret", b"payload", "sha256")
res = h.hexdigest()
print(len(res), isinstance(res, str))`,
              out: R`64 True`
            }
          },
          {
            id: "digest",
            name: "hmac.digest() / hmac.digest(key, msg, digest)",
            kind: "function",
            sig: "hmac.digest(key: bytes, msg: bytes, digest: str) -> bytes",
            sum: [
              "Ham ikili (binary) HMAC özetini döner veya nesne kurmadan tek satırda hesaplar.",
              "Returns raw binary HMAC digest or computes it in a single fast call (Python 3.7+)."
            ],
            desc: [
              "Python 3.7+ ile modül düzeyinde `hmac.digest(key, msg, 'sha256')` doğrudan çağrılabilir; ara nesne tahsis etmediği için yüksek frekanslı işlemlerde çok daha hızlıdır.",
              "Module-level `hmac.digest` bypasses HMAC object instantiation for optimized high-throughput workloads."
            ],
            ex: {
              code: R`import hmac

raw = hmac.digest(b"my-key", b"my-message", "sha256")
print(len(raw), isinstance(raw, bytes))`,
              out: R`32 True`
            }
          },
          {
            id: "update",
            name: "hmac.update(msg)",
            kind: "method",
            sig: "h.update(msg: bytes) -> None",
            sum: [
              "HMAC nesnesine parçalı veri besler.",
              "Feeds additional byte chunks into the running HMAC calculation."
            ],
            desc: [
              "Büyük dosyaları veya gelen ağ akışlarını belleğe tek seferde yüklemeden parça parça imzalamak için kullanılır.",
              "Streams chunked data into HMAC calculation to handle large payloads without high memory usage."
            ],
            ex: {
              code: R`import hmac

h = hmac.new(b"key123", digestmod="sha256")
h.update(b"parca-1") # ilk blok ||| first block
h.update(b"parca-2") # ikinci blok ||| second block
print(h.hexdigest())`,
              out: R`84d5ac0e727d2c0af1494d15e452a40d84aa9c2b9a8e6d07f5c5241999291aa0`
            }
          }
        ]
      },
      {
        id: "security-comparison",
        title: ["Zamanlama Koruması ve Kıyaslama", "Timing Defense & Verification"],
        intro: [
          "Yan kanal (side-channel) saldırılarına karşı sabit zamanlı imza doğrulaması.",
          "Guarding authentication checks against side-channel timing leaks."
        ],
        items: [
          {
            id: "compare-digest",
            name: "hmac.compare_digest(a, b)",
            kind: "function",
            sig: "hmac.compare_digest(a: bytes | str, b: bytes | str) -> bool",
            sum: [
              "İki özeti veya parolayı zamanlama saldırılarına karşı sabit zamanda kıyaslar.",
              "Compares two digests or strings in constant time to prevent timing attacks."
            ],
            desc: [
              "Standart `a == b` kontrolü, iki dizgi arasında ilk uyuşmayan karakterde hemen `False` dönüp durur (short-circuit). Saldırgan mikrosaniye seviyesinde yanıt sürelerini ölçerek doğru karakterleri tek tek keşfedebilir (timing leak). `compare_digest` ise hata olsa bile tüm diziyi baştan sona aynı sürede tarar.",
              "Standard `==` terminates immediately upon the first differing byte. Attackers measuring sub-microsecond latency variations can deduce correct characters iteratively. `compare_digest` runs in constant time regardless of where differences occur."
            ],
            ex: {
              code: R`import hmac

beklenen = "734cc62f32841568ab4b79b5c3fe8fca8a411ec54181f95304192dd19ae46a87"
gelen_dogru = "734cc62f32841568ab4b79b5c3fe8fca8a411ec54181f95304192dd19ae46a87"
gelen_sahte = "0000c62f32841568ab4b79b5c3fe8fca8a411ec54181f95304192dd19ae46a87"

print(hmac.compare_digest(beklenen, gelen_dogru))
print(hmac.compare_digest(beklenen, gelen_sahte))`,
              out: R`True
False`
            },
            cyber: [
              "Token, API anahtarı veya parola kıyaslamasında ASLA `==` kullanmayın. Her zaman `hmac.compare_digest` tercih edin.",
              "Never use `==` for comparing secrets, tokens, or hashes. Always invoke `hmac.compare_digest`."
            ]
          },
          {
            id: "copy",
            name: "hmac.copy()",
            kind: "method",
            sig: "h.copy() -> HMAC",
            sum: [
              "HMAC nesnesinin o anki iç durumunu klonlar.",
              "Returns a clone of the HMAC object with identical internal state."
            ],
            desc: [
              "Ortak bir başlığı imzaladıktan sonra farklı gövdeler için dallanma yaparken anahtarlama maliyetinden tasarruf sağlar.",
              "Clones the HMAC state to compute digests for varying suffix data while reusing a common prefix computation."
            ],
            ex: {
              code: R`import hmac

h1 = hmac.new(b"secret", b"ortak_on_ek-", "sha256")
h2 = h1.copy()

h1.update(b"kullanici_A")
h2.update(b"kullanici_B")

print(h1.hexdigest() != h2.hexdigest())`,
              out: R`True`
            }
          },
          {
            id: "digest-size",
            name: "hmac.digest_size / block_size",
            kind: "attr",
            sig: "h.digest_size -> int, h.block_size -> int",
            sum: [
              "Özetin bayt uzunluğunu ve karma algoritmasının blok boyutunu döner.",
              "Attributes exposing digest byte length and hash internal block size."
            ],
            desc: [
              "SHA-256 için `digest_size` 32 (bayt), `block_size` 64'tür. İmzaların boyut doğrulamasında kullanılır.",
              "For SHA-256, `digest_size` is 32 bytes and `block_size` is 64 bytes."
            ],
            ex: {
              code: R`import hmac

h = hmac.new(b"key", digestmod="sha256")
print(h.digest_size, h.block_size)`,
              out: R`32 64`
            }
          },
          {
            id: "name-attr",
            name: "hmac.name",
            kind: "attr",
            sig: "h.name -> str",
            sum: [
              "Kullanılan HMAC algoritmasının kanonik adını döner.",
              "Canonical algorithm descriptor of the active HMAC instance."
            ],
            desc: [
              "Örneğin `'hmac-sha256'` veya `'hmac-sha512'` dizesi döner. Loglama ve şema teyidinde faydalıdır.",
              "Returns string representation such as `'hmac-sha256'`."
            ],
            ex: {
              code: R`import hmac

h = hmac.new(b"key", digestmod="sha256")
print(h.name)`,
              out: R`hmac-sha256`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "webhook-verifier",
        title: [
          "GitHub Webhook Güvenlik Doğrulayıcısı",
          "GitHub Webhook Signature Validator"
        ],
        sum: [
          "Gelen HTTP istek gövdesini ve `X-Hub-Signature-256` başlığını doğrulama.",
          "Verifying inbound HTTP webhook payloads against secret HMAC signatures."
        ],
        code: R`import hmac
import hashlib

WEBHOOK_SECRET = b"github_webhook_shared_secret_99"

def verify_webhook(payload_body: bytes, signature_header: str) -> bool:
    if not signature_header.startswith("sha256="):
        return False
    received_hash = signature_header.split("sha256=")[1]
    expected_hash = hmac.new(WEBHOOK_SECRET, payload_body, hashlib.sha256).hexdigest()
    # Zamanlama saldirisina karsi sabit zamanli kiyas: ||| Constant-time comparison against timing attack:
    return hmac.compare_digest(expected_hash, received_hash)

# Mesaj simulasyonu ||| Payload simulation
body = b'{"action": "opened", "issue": {"number": 42}}'
valid_sig = "sha256=" + hmac.new(WEBHOOK_SECRET, body, hashlib.sha256).hexdigest()
fake_sig = "sha256=1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff"

print("Gecerli webhook:", verify_webhook(body, valid_sig))
print("Saldirgan webhook:", verify_webhook(body, fake_sig))`,
        out: R`Gecerli webhook: True
Saldirgan webhook: False`,
        cyber: true,
        note: [
          "Webhook doğrulamasında istek gövdesini JSON'a çevirmeden önceki ham `bytes` haliyle imzalamak şarttır. Karakter boşlukları bile özeti tamamen değiştirir.",
          "Verify webhooks strictly over the raw request bytes before JSON deserialization; subtle whitespace differences alter the digest entirely."
        ]
      },
      {
        id: "signed-url-token",
        title: [
          "Süre Sınırlı İmzalı İndirme Linki Üretici",
          "Expiring Signed Download URL Generator"
        ],
        sum: [
          "Gizli anahtarla kurcalanamaz ve zaman aşımı olan dosya indirme URL'i oluşturma.",
          "Generating tamper-proof download URLs bound to expiry timestamps using HMAC."
        ],
        code: R`import hmac
import hashlib
import time

SECRET_SIGNING_KEY = b"asset_vault_master_key"

def create_signed_token(file_id: str, expires_at: int) -> str:
    message = f"{file_id}:{expires_at}".encode()
    signature = hmac.new(SECRET_SIGNING_KEY, message, hashlib.sha256).hexdigest()[:16]
    return f"{file_id}?exp={expires_at}&sig={signature}"

def verify_signed_token(token_str: str) -> bool:
    try:
        file_part, query = token_str.split("?")
        params = dict(q.split("=") for q in query.split("&"))
        exp = int(params["exp"])
        sig = params["sig"]
        # Sure dolmus mu? ||| Is token expired?
        if time.time() > exp:
            return False
        expected_sig = hmac.new(SECRET_SIGNING_KEY, f"{file_part}:{exp}".encode(), hashlib.sha256).hexdigest()[:16]
        return hmac.compare_digest(expected_sig, sig)
    except Exception:
        return False

# Gelecekte bir zamana imzali link uret: ||| Generate signed link valid for future:
token = create_signed_token("backup_2026.zip", int(time.time()) + 3600)
print("Link gecerli mi:", verify_signed_token(token))
# Kurcalanmis link testi: ||| Tampered token test:
tampered = token.replace("backup_2026.zip", "shadow_passwords.txt")
print("Kurcalanmis link:", verify_signed_token(tampered))`,
        out: R`Link gecerli mi: True
Kurcalanmis link: False`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "hmac-vs-hash",
        q: [
          "`hashlib` (SHA-256) ile `hmac` arasındaki temel fark nedir?",
          "What is the fundamental difference between `hashlib` (SHA-256) and `hmac`?"
        ],
        a: [
          "`hashlib` verinin özetini çıkarır, herkes aynı girdiden aynı özeti hesaplayabilir. `hmac` ise gizli bir simetrik anahtar kullanır; anahtarı bilmeyen kimse meşru bir imza üretemez.",
          "`hashlib` produces public digests without a key. `hmac` incorporates a shared secret key, ensuring only holders of the secret key can generate or authenticate signatures."
        ]
      },
      {
        id: "compare-digest-purpose",
        q: [
          "Neden gizli dizgileri kıyaslarken `==` yerine `hmac.compare_digest` kullanmalıyız?",
          "Why should we use `hmac.compare_digest` instead of `==` for secrets comparison?"
        ],
        a: [
          "`==` ilk farklı baytta erken çıkarak zamanlama sızıntısı (timing leak) yaratır. `hmac.compare_digest` ise sabit sürede kıyaslama yaparak saldırganın süreyi ölçüp şifreyi çözmesini önler.",
          "`==` short-circuits on the first mismatched byte, creating timing leaks. `hmac.compare_digest` evaluates in constant time, preventing attackers from deducing secrets via response latency."
        ]
      },
      {
        id: "hmac-digest-function",
        q: [
          "Python 3.7+ ile gelen `hmac.digest(key, msg, digest)` fonksiyonunun avantajı nedir?",
          "What is the advantage of module-level `hmac.digest(key, msg, digest)` introduced in Python 3.7+?"
        ],
        a: [
          "HMAC nesnesi oluşturmadan doğrudan C seviyesinde tek çağrıda ham bayt çıktısı üretir; yüksek frekanslı imzalama işlemlerinde çok daha az bellek ve CPU harcar.",
          "It computes raw digest bytes in a single call without allocating intermediate HMAC Python objects, providing optimal memory and throughput performance."
        ]
      },
      {
        id: "hmac-length-extension",
        q: [
          "Neden `hashlib.sha256(key + message)` yazmak güvensizdir?",
          "Why is `hashlib.sha256(key + message)` insecure for authentication?"
        ],
        a: [
          "Merkle-Damgård mimarisine dayanan hash algoritmaları (MD5, SHA-1, SHA-256) uzunluk uzatma (length extension) saldırılarına açıktır. Saldırgan anahtarı bilmeden mesajın sonuna veri ekleyip geçerli hash üretebilir. HMAC bu açığı iki aşamalı iç içe yapısıyla kapatır.",
          "Merkle-Damgård hash functions are vulnerable to length extension attacks where an attacker can append data without knowing the key. HMAC eliminates this via nested two-pass hashing."
        ]
      },
      {
        id: "hmac-key-type",
        q: [
          "`hmac.new` fonksiyonuna anahtar olarak string (`str`) verilebilir mi?",
          "Can a string (`str`) be passed directly as the key to `hmac.new`?"
        ],
        a: [
          "Hayır, anahtar mutlaka `bytes` veya `bytearray` türünde olmalıdır (`b'gizli'`). String verilirse `TypeError` hatası alınır.",
          "No, the key must strictly be `bytes` or `bytearray`. Passing a string raises a `TypeError`."
        ]
      }
    ]
  });
})();

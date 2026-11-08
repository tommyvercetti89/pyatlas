(function () {
  const R = String.raw;
  PY.addLib({
    id: "cryptography",
    name: "cryptography",
    sym: "cr",
    color: "#ec4899",
    focus: "cyber",
    level: 3,
    ext: true,
    install: "pip install cryptography",
    cat: "crypto",
    docs: "https://cryptography.io/",
    tagline: [
      "Modern ve endüstri standardı kriptografi — Fernet simetrik şifreleme, AES-GCM, RSA ve PBKDF2.",
      "Modern production cryptography — Fernet symmetric encryption, AES-GCM, RSA, and PBKDF2 key derivation."
    ],
    analogy: [
      "`hashlib` tek yönlü bir parmak izidir (asla geri açılamaz). `cryptography` ise gerçek bir çelik kasa ve anahtardır: Gizli bir veriyi şifreler (kilitler), anahtarı olan kişi ise veriyi orijinal haline geri çözer (açar). Şifreli metne tek bir bayt bile eklense veya değiştirilse, kasa kendini kilitler ve sahte veriyi açmayı reddeder (kimlik doğrulamalı şifreleme).",
      "`hashlib` is a one-way fingerprint: you can never reverse a hash. `cryptography` is an actual vault and key: it locks plaintext into ciphertext, allowing only authorized keyholders to decrypt it. If an attacker modifies even a single byte of ciphertext, the cryptographic seal rejects decryption (authenticated encryption)."
    ],
    intro: [
      [
        "`cryptography` paketi, Python dünyasında modern ve güvenli kriptografik işlemler için fiili endüstri standardıdır. Hem yüksek seviyeli ve kullanımı hatasız güvenli arayüzler (`Fernet`), hem de donanımsal düşük seviyeli kriptografik yapı taşları (`hazmat` - Hazardous Materials) sunar.",
        "The `cryptography` package is the premier industry standard for cryptographic engineering in Python. It provides high-level secure-by-default recipes (`Fernet`) alongside audited low-level primitives (`hazmat`)."
      ],
      [
        "Siber güvenlikte uçtan uca veri şifreleme (E2EE), fidye yazılımı (ransomware) analizi, AES-GCM ile kimlik doğrulamalı şifreleme, parolalardan güvenli anahtar türetme (PBKDF2) ve asimetrik RSA anahtar çifti yönetimi için birincil kütüphanedir.",
        "In offensive and defensive cyber security, building end-to-end encrypted tunnels, analyzing ransomware cryptographic patterns, enforcing authenticated encryption (AES-GCM), and deriving keys via PBKDF2 depend squarely on `cryptography`."
      ]
    ],
    import: R`from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.asymmetric import rsa`,
    general: [
      ["Veritabanındaki hassas müşteri verilerini (TCKN, Kredi Kartı) şifreleyerek saklama.", "Securing sensitive PII and financial records at rest using authenticated symmetric encryption."],
      ["Kullanıcı parolalarından PBKDF2 ile kriptografik olarak güçlü şifreleme anahtarları türetme.", "Deriving 256-bit encryption keys safely from human passwords using PBKDF2."],
      ["Dosyaları zaman aşımı korumalı (TTL) token'lar halinde güvenle paketleme.", "Encrypting files into self-authenticating, expiring tokens with Fernet."]
    ],
    cyberUse: [
      ["Kimlik Doğrulamalı Şifreleme (AEAD): Veriyi sadece gizlemek yetmez; yolda değiştirilmediğini de kanıtlamak gerekir. AES-GCM ve Fernet, şifreli metin kurcalandığında anında `InvalidToken` / `InvalidSignature` fırlatarak manipülasyonu engeller.", "Authenticated Encryption (AEAD): Secrecy alone is insufficient; integrity is mandatory. Fernet and AES-GCM abort decryption upon the slightest ciphertext tampering."],
      ["Parola Tabanlı Anahtar Türetme (KDF): Düz metin parolaları doğrudan AES anahtarı yapmak felakettir. `PBKDF2HMAC` ile yüz binlerce tur karma ve tuz (salt) eklenerek gökkuşağı tabloları ve kaba kuvvet saldırıları etkisiz kılınır.", "Password-Based Key Derivation (KDF): Human passwords must never be used directly as AES keys; `PBKDF2HMAC` enforces hundreds of thousands of hashing rounds with unique salts."],
      ["Asimetrik Anahtar ve İmzalar: RSA anahtar çifti üreterek verileri genel anahtarla (public key) şifreleme ve sadece özel anahtarla (private key) deşifre etme.", "Asymmetric Keypairs: Generating RSA public/private keypairs for secure key exchange and non-repudiable digital signatures."]
    ],
    sections: [
      {
        id: "fernet-symmetric",
        title: ["Fernet: Yüksek Seviyeli Güvenli Şifreleme", "Fernet: High-Level Symmetric Encryption"],
        intro: [
          "AES-128-CBC, HMAC-SHA256 ve zaman damgasını tek pakette birleştiren hatasız simetrik şifreleme.",
          "Tamper-proof authenticated symmetric encryption combining AES, HMAC, and timestamps."
        ],
        items: [
          {
            id: "fernet-generate-key",
            name: "Fernet.generate_key()",
            kind: "function",
            sig: "Fernet.generate_key() -> bytes",
            sum: [
              "Kriptografik olarak güvenli, Base64 formatında 32 baytlık (256-bit) yeni bir Fernet anahtarı üretir.",
              "Generates a fresh cryptographically secure, URL-safe base64-encoded 32-byte key."
            ],
            desc: [
              "İşletim sisteminin CSPRNG kaynağından (`os.urandom`) beslenir. Fernet nesnesi oluşturmak için bu anahtar kullanılır ve son derece gizli tutulmalıdır.",
              "Sourced directly from the OS CSPRNG. Produces the 256-bit key required to instantiate Fernet cipher instances."
            ],
            ex: {
              code: R`from cryptography.fernet import Fernet

anahtar = Fernet.generate_key()
print("Anahtar uzunlugu:", len(anahtar))
print("Base64 bytes turunde mi:", isinstance(anahtar, bytes))`,
              out: R`Anahtar uzunlugu: 44
Base64 bytes turunde mi: True`
            }
          },
          {
            id: "fernet-encrypt",
            name: "f.encrypt(data)",
            kind: "method",
            sig: "f.encrypt(data: bytes) -> bytes",
            sum: [
              "Veriyi AES-128-CBC ile şifreler, HMAC ile imzalar ve zaman damgası ekler.",
              "Encrypts data using AES-128-CBC with HMAC-SHA256 authentication and a timestamp."
            ],
            desc: [
              "Her şifrelemede rastgele 16 baytlık yeni bir IV (Initialization Vector) üretildiği için, aynı veri aynı anahtarla defalarca şifrelense bile her seferinde tamamen farklı bir şifreli metin ortaya çıkar.",
              "Generates a unique random 16-byte IV per invocation, producing completely distinct ciphertext outputs even for identical plaintexts."
            ],
            ex: {
              code: R`from cryptography.fernet import Fernet

f = Fernet(Fernet.generate_key())
sifreli_1 = f.encrypt(b"gizli-belge")
sifreli_2 = f.encrypt(b"gizli-belge")

print("Ayni metin farkli cikti mi:", sifreli_1 != sifreli_2)`,
              out: R`Ayni metin farkli cikti mi: True`
            }
          },
          {
            id: "fernet-decrypt",
            name: "f.decrypt(token, ttl=None)",
            kind: "method",
            sig: "f.decrypt(token: bytes, ttl: int = None) -> bytes",
            sum: [
              "Şifreli veriyi doğrular ve çözer; isteğe bağlı zaman aşımı (`ttl`) denetimi yapar.",
              "Decrypts a Fernet token, verifying HMAC integrity and optional time-to-live expiration."
            ],
            desc: [
              "Veri kurcalanmışsa veya yanlış anahtar verilmişse `cryptography.fernet.InvalidToken` fırlatır. `ttl=60` verilirse, 60 saniyeden eski token'lar otomatik reddedilir.",
              "Raises `InvalidToken` upon key mismatch or ciphertext alteration. `ttl` parameters enforce strict token lifespans."
            ],
            ex: {
              code: R`from cryptography.fernet import Fernet

key = Fernet.generate_key()
f = Fernet(key)

token = f.encrypt(b"sistem-parolasi-99")
cozulmus = f.decrypt(token)

print("Basariyla deşifre edildi:", cozulmus.decode())`,
              out: R`Basariyla deşifre edildi: sistem-parolasi-99`
            },
            cyber: [
              "Şifreli metindeki tek bir harf değiştirilse bile Fernet HMAC imzasının tutmadığını fark eder ve veriyi asla açmaz (Padding Oracle ve manipülasyon savunması).",
              "Altering even a single bit in the ciphertext invalidates the HMAC signature, completely blocking padding oracle and bit-flipping attacks."
            ]
          },
          {
            id: "fernet-invalid-token",
            name: "cryptography.fernet.InvalidToken",
            kind: "exception",
            sig: "cryptography.fernet.InvalidToken",
            sum: [
              "Şifre çözme sırasında anahtar uyuşmazlığında, veri manipülasyonunda veya süre aşımında fırlatılır.",
              "Exception raised when decryption fails due to invalid signatures, tampering, or TTL expiry."
            ],
            desc: [
              "Saldırganın şifreli metni kurcaladığını veya yanlış bir anahtarla deneme yapıldığını haber verir.",
              "Signifies ciphertext corruption, unauthorized tampering, or key mismatch."
            ],
            ex: {
              code: R`from cryptography.fernet import Fernet, InvalidToken

f = Fernet(Fernet.generate_key())
token = f.encrypt(b"veri")
# Saldirgan bir bayti tahrif etsin: ||| Attacker corrupts one byte:
bozuk_token = token[:-1] + b"A"

try:
    f.decrypt(bozuk_token)
except InvalidToken:
    print("Saldiri tespit edildi: InvalidToken!")`,
              out: R`Saldiri tespit edildi: InvalidToken!`
            }
          }
        ]
      },
      {
        id: "hazmat-modern",
        title: ["Modern Primitives: AES-GCM ve RSA", "Modern Primitives: AES-GCM & RSA"],
        intro: [
          "AES-GCM ile kimlik doğrulamalı simetrik şifreleme ve asimetrik RSA anahtar üretimi.",
          "Authenticated AEAD encryption with AES-GCM and asymmetric RSA keypair generation."
        ],
        items: [
          {
            id: "aesgcm",
            name: "cryptography.hazmat.primitives.ciphers.aead.AESGCM",
            kind: "class",
            sig: "AESGCM(key: bytes)",
            sum: [
              "Modern donanımsal hızlandırmalı ve kimlik doğrulamalı şifreleme (AEAD) sınıfı.",
              "Authenticated Encryption with Associated Data (AEAD) using the AES-GCM cipher suite."
            ],
            desc: [
              "TLS 1.3 ve modern VPN'lerin temel şifreleme modudur. 128 veya 256 bit anahtar alır. Şifreleme sırasında verinin yanı sıra kimlik doğrulama etiketi (auth tag) üretir; böylece şifreli verinin kurcalanması imkansızdır.",
              "Underpins TLS 1.3 and WireGuard. Generates integrated authentication tags to eliminate bit-flipping vulnerabilities."
            ],
            ex: {
              code: R`import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

key = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(key)
nonce = os.urandom(12) # 12-baytlik benzersiz nonce ||| 12-byte unique nonce

ciphertext = aesgcm.encrypt(nonce, b"gizli askeri veri", None)
plaintext = aesgcm.decrypt(nonce, ciphertext, None)

print("AES-GCM basarili:", plaintext.decode())`,
              out: R`AES-GCM basarili: gizli askeri veri`
            },
            cyber: [
              "AES-GCM'de AYNI anahtar ve AYNI nonce (number used once) ASLA iki kez kullanılmamalıdır. Nonce tekrarı, saldırganın anahtarı ve şifreli metinleri çözmesine yol açar.",
              "CRITICAL RULE: Never reuse a nonce with the same AES-GCM key. Nonce reuse completely shatters GCM authenticity and leaks key parameters."
            ]
          },
          {
            id: "rsa-generate-private-key",
            name: "rsa.generate_private_key(public_exponent, key_size)",
            kind: "function",
            sig: "rsa.generate_private_key(public_exponent: int, key_size: int) -> RSAPrivateKey",
            sum: [
              "Asimetrik kriptografi için yeni bir RSA özel anahtarı (private key) üretir.",
              "Generates a new RSA private key instance using specified public exponent and key size."
            ],
            desc: [
              "`public_exponent=65537` ve `key_size=2048` (veya 4096) günümüz endüstri standardıdır. 1024-bit RSA günümüzde kırılabilir kabul edilir ve asla kullanılmamalıdır.",
              "Standard parameters mandate `public_exponent=65537` and minimum `key_size=2048`. 1024-bit RSA is deprecated and cryptographically broken."
            ],
            ex: {
              code: R`from cryptography.hazmat.primitives.asymmetric import rsa

private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
public_key = private_key.public_key()

print("Ozel anahtar boyutu:", private_key.key_size)
print("Genel anahtar uretildi mi:", public_key is not None)`,
              out: R`Ozel anahtar boyutu: 2048
Genel anahtar uretildi mi: True`
            }
          },
          {
            id: "pbkdf2hmac",
            name: "PBKDF2HMAC(algorithm, length, salt, iterations)",
            kind: "class",
            sig: "PBKDF2HMAC(algorithm: HashAlgorithm, length: int, salt: bytes, iterations: int)",
            sum: [
              "Parolalardan kriptografik şifreleme anahtarı türeten standart KDF algoritması.",
              "Password-Based Key Derivation Function 2 for deriving symmetric encryption keys from passwords."
            ],
            desc: [
              "Kullanıcının girdiği 'Parola123!' gibi zayıf metinleri yüz binlerce kez SHA-256 ile özetleyip rastgele tuz (salt) ile harmanlayarak 32 baytlık güçlü bir AES anahtarına dönüştürür. Donanımsal brute-force saldırılarını yavaşlatır.",
              "Stretches human passwords through hundreds of thousands of HMAC iterations with unique cryptographic salts, impeding GPU brute-force attacks."
            ],
            ex: {
              code: R`import os
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

salt = os.urandom(16)
kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=100000)
anahtar = kdf.derive(b"GucluKullaniciParolasi!")

print("Turetilen anahtar 32 bayt mi:", len(anahtar) == 32)`,
              out: R`Turetilen anahtar 32 bayt mi: True`
            }
          },
          {
            id: "public-bytes",
            name: "key.public_bytes(encoding, format)",
            kind: "method",
            sig: "pub_key.public_bytes(encoding: Encoding, format: PublicFormat) -> bytes",
            sum: [
              "RSA anahtarını PEM veya DER formatında dışa aktarılabilir baytlara döker.",
              "Serializes an asymmetric key into standard PEM or DER encoded bytes."
            ],
            desc: [
              "`-----BEGIN PUBLIC KEY-----` formatında kaydederek diğer sistemlerle veya istemcilerle paylaşmayı sağlar.",
              "Serializes keys into standard OpenSSL-compatible PEM representations for disk persistence and distribution."
            ],
            ex: {
              code: R`from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

priv = rsa.generate_private_key(public_exponent=65537, key_size=2048)
pub = priv.public_key()
pem = pub.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)
print("PEM basligi var mi:", pem.startswith(b"-----BEGIN PUBLIC KEY-----"))`,
              out: R`PEM basligi var mi: True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "fernet-password-vault",
        title: [
          "Parola Korumalı Güvenli Veri Kasası (PBKDF2 + Fernet)",
          "Password-Locked Secure Storage Vault (PBKDF2 + Fernet)"
        ],
        sum: [
          "Kullanıcı parolasından türetilen anahtarla hassas dosyaları kırılmaz biçimde şifreleme ve çözme.",
          "Deriving Fernet keys from human passphrases via salted PBKDF2 to encrypt sensitive payloads."
        ],
        code: R`import os
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

def sifrele_metin(parola: str, gizli_mesaj: bytes) -> tuple[bytes, bytes]:
    # Her sifrelemede benzersiz 16 baytlik tuz (salt) uret: ||| Generate unique 16-byte salt:
    salt = os.urandom(16)
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=100000)
    anahtar = base64.urlsafe_b64encode(kdf.derive(parola.encode()))
    f = Fernet(anahtar)
    token = f.encrypt(gizli_mesaj)
    return salt, token

def coz_metin(parola: str, salt: bytes, token: bytes) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt, iterations=100000)
    anahtar = base64.urlsafe_b64encode(kdf.derive(parola.encode()))
    f = Fernet(anahtar)
    return f.decrypt(token)

salt, token = sifrele_metin("SuperGucluParola_2026", b"Hedef Sunucu Root Parolasi: root#1234")
cozulmus = coz_metin("SuperGucluParola_2026", salt, token)

print("Kasa basariyla deşifre edildi mi:", cozulmus == b"Hedef Sunucu Root Parolasi: root#1234")`,
        out: R`Kasa basariyla deşifre edildi mi: True`,
        cyber: true,
        note: [
          "Tuz (salt) gizli tutulmak zorunda değildir; şifreli metinle birlikte açıkça saklanabilir. Asıl görevi her kullanıcının aynı parolayı seçse bile tamamen farklı şifreleme anahtarlarına sahip olmasını sağlamaktır.",
          "Salts do not require confidentiality and may be stored alongside ciphertexts. Their role is ensuring identical passwords yield distinct keys, thwarting rainbow tables."
        ]
      },
      {
        id: "aes-gcm-tamper-detector",
        title: [
          "AES-GCM Kurcalama ve Bütünlük Denetim Laboratuvarı",
          "AES-GCM Authenticated Tamper-Resistance Lab"
        ],
        sum: [
          "AES-GCM ile şifrelenmiş veride tek bir bit değiştirildiğinde manipülasyonun anında yakalanması.",
          "Demonstrating immediate detection of ciphertext bit-flipping via AEAD authentication tags."
        ],
        code: R`import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.exceptions import InvalidTag

key = AESGCM.generate_key(bit_length=256)
aesgcm = AESGCM(key)
nonce = os.urandom(12)

# Kritik bir yetkilendirme mesaji: ||| Critical authorization message:
orijinal_mesaj = b"role=user;action=read"
ciphertext = aesgcm.encrypt(nonce, orijinal_mesaj, None)

# Saldirgan sifreli metinde bir bayti degistirip 'role=admin' yapmaya calissin: ||| Attacker flips bits:
manipule_edilmis = bytearray(ciphertext)
manipule_edilmis[5] ^= 0x01 # 1 bit tersine cevrildi ||| 1 bit flipped

yakalandi = False
try:
    aesgcm.decrypt(nonce, bytes(manipule_edilmis), None)
except InvalidTag:
    yakalandi = True

print("Manipulasyon girisimi engellendi mi:", yakalandi)`,
        out: R`Manipulasyon girisimi engellendi mi: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "fernet-vs-raw-aes",
        q: [
          "Neden doğrudan ham AES-CBC yerine `Fernet` kullanılması tavsiye edilir?",
          "Why is `Fernet` recommended over raw AES-CBC implementations?"
        ],
        a: [
          "Ham AES-CBC kimlik doğrulaması sunmaz; saldırganlar Padding Oracle ve bit-çevirme saldırıları yapabilir. Fernet ise AES şifrelemesinin üzerine HMAC-SHA256 imzası ve zaman damgası ekleyerek kurcalanmaya karşı tam koruma sağlar.",
          "Raw AES-CBC lacks authentication, leaving payloads vulnerable to padding oracle and bit-flipping exploits. Fernet wraps AES with HMAC-SHA256 signatures and timestamps, rendering tampering impossible."
        ]
      },
      {
        id: "aes-gcm-nonce-rule",
        q: [
          "AES-GCM algoritmasında 'Nonce Tekrarı' (Nonce Reuse) neden en ölümcül hatadır?",
          "Why is 'Nonce Reuse' the most critical vulnerability in AES-GCM?"
        ],
        a: [
          "Aynı anahtar ve aynı nonce ile iki farklı mesaj şifrelenirse, iki şifreli metin XOR'lanarak düz metinler ve GCM'in kimlik doğrulama anahtarı (GHASH key) matematiksel olarak tamamen çözülebilir.",
          "Reusing a nonce under the same key allows adversaries to XOR ciphertexts, eliminating secrecy and exposing the internal GHASH key to forge arbitrary authentication tags."
        ]
      },
      {
        id: "pbkdf2-salt-purpose",
        q: [
          "Paroladan anahtar türetirken (`PBKDF2`) 'Tuz' (Salt) kullanmanın amacı nedir?",
          "What is the purpose of using a cryptographic Salt in PBKDF2 key derivation?"
        ],
        a: [
          "İki kullanıcının parolası aynı olsa bile tuz sayesinde üretilen anahtarların tamamen farklı olmasını sağlar. Önceden hesaplanmış gökkuşağı tablolarını (rainbow tables) ve toplu kaba kuvvet saldırılarını etkisiz kılar.",
          "It guarantees that identical passwords generate completely different keys, completely neutralizing precomputed rainbow table dictionaries and multi-target attacks."
        ]
      },
      {
        id: "rsa-minimum-key-size",
        q: [
          "Günümüz siber güvenlik standartlarında güvenli kabul edilen minimum RSA anahtar boyutu nedir?",
          "What is the minimum secure RSA key size in modern cyber security standards?"
        ],
        a: [
          "En az 2048-bit (önerilen 4096-bit). 1024-bit RSA günümüz işlemci ve bulut hesaplama güçleriyle kırılabilir kabul edildiğinden kesinlikle kullanılmamalıdır.",
          "At least 2048 bits (4096 bits recommended). 1024-bit RSA is considered mathematically vulnerable to cloud factorization and must never be used."
        ]
      },
      {
        id: "aead-definition",
        q: [
          "Kriptografide 'AEAD' ne anlama gelir ve hangi algoritmalar bu gruptadır?",
          "What does 'AEAD' stand for in cryptography, and which algorithms belong to this group?"
        ],
        a: [
          "'Authenticated Encryption with Associated Data' anlamına gelir. Hem gizlilik (şifreleme) hem de veri bütünlüğü (kurcalanamazlık) sağlar. AES-GCM ve ChaCha20-Poly1305 en yaygın AEAD algoritmalarıdır.",
          "It stands for 'Authenticated Encryption with Associated Data', delivering both confidentiality and tamper-proof integrity verification. AES-GCM and ChaCha20-Poly1305 are premier examples."
        ]
      }
    ]
  });
})();


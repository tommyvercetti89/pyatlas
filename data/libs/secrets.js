(function () {
  const R = String.raw;
  PY.addLib({
    id: "secrets",
    name: "secrets",
    sym: "sec",
    color: "#10b981",
    focus: "cyber",
    level: 2,
    ext: false,
    cat: "crypto",
    docs: "https://docs.python.org/3/library/secrets.html",
    tagline: [
      "Kriptografik güvenli rastgelelik: token, parola, API anahtarı ve zamanlama saldırısı koruması.",
      "Cryptographically secure randomness: tokens, keys, and timing-attack-safe comparison."
    ],
    analogy: [
      "`random` modülü sahte bir zar atar; matematiksel bir formülü takip eder ve başlangıç değeri (seed) bilinirse sonraki tüm zarlar tahmin edilebilir. `secrets` modülü ise işletim sisteminin fiziksel gürültüsünden (donanım kesmeleri, fare hareketleri) beslenen gerçek bir kriptografik zardır; gelecekteki sonuçları kimse tahmin edemez.",
      "`random` rolls a pseudo-random die that follows a formula; knowing the seed reveals every future roll. `secrets` relies on OS kernel entropy (hardware interrupts, thermal noise), creating unpredictable random values suitable for security tokens."
    ],
    intro: [
      [
        "`secrets` modülü (Python 3.6+ / PEP 506), güvenlik ve kriptografi için tasarlanmış tek resmi rastgele sayı modülüdür. İşletim sisteminin en güvenilir kriptografik rastgelelik kaynağını (`os.urandom()`, Linux'ta `getrandom()`, Windows'ta `BCryptGenRandom`) kullanır.",
        "The `secrets` module (PEP 506) is the standard library module specifically engineered for cryptographic security, backed by kernel CSPRNGs (`os.urandom()`, `BCryptGenRandom`)."
      ],
      [
        "Siber güvenlikte parola sıfırlama bağlantıları, API anahtarları, CSRF koruma token'ları, oturum kimlikleri (session ID) ve tek kullanımlık kodlar (OTP) ASLA `random` ile değil, MUTLAKA `secrets` ile üretilmelidir.",
        "In cyber security, session IDs, CSRF tokens, password reset tokens, and API credentials must NEVER be created with `random`; `secrets` is the mandatory requirement."
      ]
    ],
    import: R`import secrets`,
    general: [
      [
        "Web uygulamaları için güvenli oturum kimlikleri ve şifre sıfırlama bağlantıları oluşturmak.",
        "Generating secure session identifiers and password-reset URL tokens."
      ],
      [
        "REST API servisleri için tahmin edilemez API anahtarları (API key) üretmek.",
        "Generating unguessable API authorization tokens and bearer keys."
      ],
      [
        "Hassas dizeleri zamanlama saldırılarına (timing attack) karşı sabit sürede kıyaslamak.",
        "Comparing secret strings in constant time to defeat timing analysis."
      ]
    ],
    cyberUse: [
      [
        "CSRF (Cross-Site Request Forgery) koruma belirteçlerini `token_urlsafe` ile üretmek.",
        "Crafting unguessable CSRF prevention tokens via `token_urlsafe`."
      ],
      [
        "Zamanlama saldırılarını (Timing Attack) önlemek için HMAC ve token doğrulamalarında `compare_digest` kullanmak.",
        "Neutralizing timing side-channel attacks by enforcing `compare_digest`."
      ],
      [
        "Kullanıcılar için yüksek entropili rastgele geçici parolalar ve aktivasyon kodları oluşturmak.",
        "Producing high-entropy one-time passwords and cryptographic salts."
      ]
    ],
    sections: [
      {
        id: "token-generation",
        title: ["Güvenli Belirteç (Token) Üretimi", "Secure Token Generation"],
        intro: [
          "URL uyumlu, onaltılık veya ham bayt formatında yüksek entropili belirteçler üretme fonksiyonları.",
          "High-entropy token generation functions formatted as URL-safe strings, hex, or raw bytes."
        ],
        items: [
          {
            id: "token-hex",
            name: "secrets.token_hex(nbytes=None)",
            kind: "function",
            sig: "secrets.token_hex(nbytes=None) -> str",
            sum: [
              "Onaltılık (hexadecimal) formatta rastgele güvenlik belirteci üretir.",
              "Generates a random cryptographic text token in hexadecimal format."
            ],
            desc: [
              "`nbytes` adet rastgele bayt üretip bunu iki katı uzunluğunda onaltılık (`0-9a-f`) dizeye çevirir. `nbytes=16` verildiğinde 32 karakterlik dize döner. API anahtarları ve session id'ler için standarttır.",
              "Generates `nbytes` random bytes formatted as a lowercase hex string (2 characters per byte). For example, `nbytes=16` produces a 32-character token."
            ],
            params: [
              { n: "nbytes", d: ["Üretilecek rastgele bayt sayısı (varsayılan 32'dir, 64 hex karakter üretir).", "Number of random bytes (defaults to 32, generating 64 hex characters)."] }
            ],
            ret: ["Onaltılık rastgele dize (`str`).", "Random hexadecimal string (`str`)."],
            ex: {
              code: R`import secrets

token = secrets.token_hex(16)
print(len(token))
print(all(c in "0123456789abcdef" for c in token))`,
              out: R`32
True`
            },
            cyber: [
              "32 karakterlik (16 bayt = 128 bit) bir hex token'ı kaba kuvvetle (brute-force) tahmin etmek evrenin ömründen uzun sürer.",
              "Brute-forcing a 128-bit (16-byte) random token requires $2^{128}$ evaluations, practically impossible."
            ]
          },
          {
            id: "token-urlsafe",
            name: "secrets.token_urlsafe(nbytes=None)",
            kind: "function",
            sig: "secrets.token_urlsafe(nbytes=None) -> str",
            sum: [
              "URL'lerde ve e-postalarda güvenle taşınabilen Base64 formatında token üretir.",
              "Generates a URL-safe Base64-encoded random token string."
            ],
            desc: [
              "URL güvenli Base64 (`-` ve `_` kullanan) formatında rastgele dize üretir. E-posta ile gönderilen şifre sıfırlama linklerinde veya doğrulama URL'lerinde (`?token=...`) kullanılır; özel URL encoding gerektirmez.",
              "Produces URL-safe Base64 random strings (substituting `-` and `_`). Ideal for password reset links and activation emails query strings."
            ],
            params: [
              { n: "nbytes", d: ["Üretilecek rastgele bayt sayısı (varsayılan 32'dir).", "Number of random bytes (defaults to 32)."] }
            ],
            ret: ["URL güvenli Base64 dize (`str`).", "URL-safe Base64 string (`str`)."],
            ex: {
              code: R`import secrets

token = secrets.token_urlsafe(16)
print(isinstance(token, str))
print(len(token) >= 20)`,
              out: R`True
True`
            }
          },
          {
            id: "token-bytes",
            name: "secrets.token_bytes(nbytes=None)",
            kind: "function",
            sig: "secrets.token_bytes(nbytes=None) -> bytes",
            sum: [
              "Belirtilen sayıda kriptografik ham rastgele bayt döner.",
              "Returns specified number of cryptographically secure raw random bytes."
            ],
            desc: [
              "Doğrudan ham `bytes` nesnesi döner. Kriptografik anahtarlar (AES-256 anahtarı için 32 bayt), IV (Initialization Vector) veya tuz (salt) üretirken temel fonksiyon budur.",
              "Generates raw random `bytes`. Used for symmetric encryption keys (32 bytes for AES-256), nonces, IVs, and cryptographic salts."
            ],
            params: [
              { n: "nbytes", d: ["Bayt sayısı (varsayılan 32).", "Number of bytes to generate (defaults to 32)."] }
            ],
            ret: ["Rastgele `bytes` nesnesi.", "Random `bytes` object."],
            ex: {
              code: R`import secrets

key = secrets.token_bytes(32)  # 256-bit anahtar ||| 256-bit key
print(len(key))
print(type(key).__name__)`,
              out: R`32
bytes`
            }
          }
        ]
      },
      {
        id: "secure-choice",
        title: ["Güvenli Seçim ve Sayı Üretimi", "Secure Choice & Numbers"],
        intro: [
          "Dizilerden güvenli eleman seçme ve belirli aralıkta sayı üretme araçları.",
          "Selecting items cryptographically from sequences and generating secure integers."
        ],
        items: [
          {
            id: "choice",
            name: "secrets.choice(sequence)",
            kind: "function",
            sig: "secrets.choice(sequence)",
            sum: [
              "Boş olmayan bir diziden kriptografik rastgele bir eleman seçer.",
              "Returns a cryptographically secure random element from a non-empty sequence."
            ],
            desc: [
              "`random.choice` ile aynı imzaya sahiptir ancak işletim sistemi entropisiyle çalışır. Rastgele parola üreticilerinde alfabe karakterleri arasından seçim yapmak için mükemmeldir.",
              "Matches `random.choice` interface but uses kernel entropy. Ideal for picking characters when generating complex passwords."
            ],
            params: [
              { n: "sequence", d: ["Boş olmayan bir liste, demet veya dize.", "Non-empty sequence (list, tuple, str)."] }
            ],
            ret: ["Seçilen eleman.", "Chosen element from sequence."],
            ex: {
              code: R`import secrets

pool = "ABCDEFGH"
chosen = secrets.choice(pool)
print(chosen in pool)
print(len(chosen))`,
              out: R`True
1`
            }
          },
          {
            id: "randbelow",
            name: "secrets.randbelow(n)",
            kind: "function",
            sig: "secrets.randbelow(n) -> int",
            sum: [
              "[0, n) aralığında kriptografik rastgele tamsayı üretir.",
              "Returns a cryptographically secure integer in the range [0, n)."
            ],
            desc: [
              "Sıfır dahil, `n` hariç aralıkta sayı üretir. Modülo sapması (modulo bias) içermez.",
              "Produces integers uniformly distributed in $[0, n)$ without modulo bias."
            ],
            params: [
              { n: "n", d: ["Üst sınır tamsayısı (hariç). Pozitif olmalıdır.", "Upper bound integer (exclusive). Must be positive."] }
            ],
            ret: ["Tamsayı (`int`).", "Random integer (`int`)."],
            ex: {
              code: R`import secrets

val = secrets.randbelow(100)
print(0 <= val < 100)
print(isinstance(val, int))`,
              out: R`True
True`
            }
          },
          {
            id: "randbits",
            name: "secrets.randbits(k)",
            kind: "function",
            sig: "secrets.randbits(k) -> int",
            sum: [
              "`k` adet rastgele bitten oluşan negatif olmayan bir tamsayı döner.",
              "Returns a non-negative integer with `k` random bits."
            ],
            desc: [
              "Belirli bit uzunluğunda kriptografik tamsayılar üretir.",
              "Generates cryptographic integers with exact bit length `k`."
            ],
            params: [
              { n: "k", d: ["Bit sayısı (örn: 64, 128).", "Bit length (e.g. 64, 128)."] }
            ],
            ex: {
              code: R`import secrets

num = secrets.randbits(32)
print(num >= 0)
print(num < (1 << 32))`,
              out: R`True
True`
            }
          }
        ]
      },
      {
        id: "timing-attack",
        title: ["Zamanlama Saldırılarına Karşı Koruma", "Timing Attack Defense"],
        intro: [
          "Sabit süreli kıyaslama fonksiyonu ile yan kanal saldırılarını engelleme.",
          "Constant-time comparison function to eliminate side-channel timing leaks."
        ],
        items: [
          {
            id: "compare-digest",
            name: "secrets.compare_digest(a, b)",
            kind: "function",
            sig: "secrets.compare_digest(a, b) -> bool",
            sum: [
              "İki dizeyi veya baytı sabit sürede (constant time) kıyaslar.",
              "Compares two strings or bytes-like objects in constant time to prevent timing attacks."
            ],
            desc: [
              "Standart Python eşitlik kontrolü (`a == b`) ilk uyuşmayan karakterde kıyaslamayı hemen keser (erken dönüş / early exit). Saldırganlar mikrosaniyelik süre farklarını ölçerek parolayı veya API anahtarını harf harf çözebilir (Timing Attack). `compare_digest` ise karakterler ne olursa olsun her zaman tam olarak aynı sürede çalışır.",
              "Standard equality (`a == b`) short-circuits on the first mismatched byte, creating timing leaks. `compare_digest` runs in constant time regardless of where mismatches occur."
            ],
            params: [
              { n: "a", d: ["Birinci dize veya bayt nesnesi.", "First string or bytes-like object."] },
              { n: "b", d: ["İkinci dize veya bayt nesnesi.", "Second string or bytes-like object."] }
            ],
            ret: ["Eşitse `True`, değilse `False`.", "`True` if identical, `False` otherwise."],
            ex: {
              code: R`import secrets

gizli_token = "SUPER_SECRET_TOKEN_XYZ"
kullanici_girdisi = "SUPER_SECRET_TOKEN_XYZ"
print(secrets.compare_digest(gizli_token, kullanici_girdisi))
print(secrets.compare_digest("tokenA", "tokenB"))`,
              out: R`True
False`
            },
            cyber: [
              "Webhook imzaları, CSRF token doğrulamaları ve API anahtarı kontrollerinde `==` yerine daima `compare_digest` kullanmak temel güvenli kodlama kuralıdır.",
              "Enforcing `compare_digest` across all authorization token and HMAC checks is mandatory to eliminate timing side-channels."
            ]
          },
          {
            id: "system-random",
            name: "secrets.SystemRandom",
            kind: "class",
            sig: "secrets.SystemRandom()",
            sum: [
              "İşletim sistemi CSPRNG'sini `random` modülü API'siyle sunan sınıf.",
              "Class exposing kernel CSPRNG via standard `random` interface."
            ],
            desc: [
              "`random.Random` sınıfının işletim sistemi entropisi (`os.urandom`) kullanan güvenli versiyonudur. `SystemRandom().shuffle(liste)` gibi metodları güvenle kullanabilirsiniz.",
              "Subclass of `random.Random` that pulls entropy from `os.urandom`. Safe for shuffling or sampling sensitive elements."
            ],
            ex: {
              code: R`import secrets

sr = secrets.SystemRandom()
lst = [1, 2, 3, 4]
sr.shuffle(lst)
print(len(lst) == 4 and set(lst) == {1, 2, 3, 4})`,
              out: R`True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "secure-password-generator",
        title: [
          "Yüksek Entropili Güvenli Parola Üretici",
          "High-Entropy Secure Password Generator"
        ],
        sum: [
          "Büyük harf, küçük harf, rakam ve sembol içeren tahmin edilemez parola üretimi.",
          "Generating robust, unguessable passwords mixing uppercase, lowercase, digits, and symbols."
        ],
        code: R`import secrets
import string

def generate_strong_password(length=16):
    chars = string.ascii_letters + string.digits + "!@#$%^&*"
    # Her karakteri kriptografik olarak sec ||| Cryptographically pick each character
    return "".join(secrets.choice(chars) for _ in range(length))

pw = generate_strong_password(20)
print(len(pw))
print(isinstance(pw, str))`,
        out: R`20
True`,
        cyber: true,
        note: [
          "Bu şekilde üretilen 20 karakterlik bir parola trilyonlarca kombinasyon içerir ve kaba kuvvet (brute-force) saldırılarına tamamen dirençlidir.",
          "A 20-character password generated this way possesses over 120 bits of entropy, thwarting brute-force."
        ]
      },
      {
        id: "safe-api-key-verifier",
        title: [
          "Zamanlama Saldırısına Karşı Korumalı API Anahtarı Doğrulayıcı",
          "Timing-Attack Proof API Key Validator"
        ],
        sum: [
          "`compare_digest` ile gelen API anahtarını güvenli şekilde teyit etme.",
          "Validating inbound API authorization tokens safely using constant-time comparison."
        ],
        code: R`import secrets

GERCEK_API_KEY = "sec_live_99a81f0d3c52e4b7"

def verify_request(provided_key):
    # Zamanlama analizini engellemek icin sabit sureli karsilastir ||| Constant time comparison
    return secrets.compare_digest(GERCEK_API_KEY, provided_key)

print("Gecerli:", verify_request("sec_live_99a81f0d3c52e4b7"))
print("Gecersiz:", verify_request("sec_live_sahte_key"))`,
        out: R`Gecerli: True
Gecersiz: False`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "why-not-random-for-security",
        q: [
          "Neden web güvenliğinde veya token üretiminde `random` modülü ASLA kullanılmamalıdır?",
          "Why must the `random` module NEVER be used for security tokens?"
        ],
        a: [
          "`random` modülü Mersenne Twister algoritmasını kullanır ve kriptografik değildir. Saldırgan üretilen 624 ardışık sayıyı gözlemlerse sonraki ve önceki TÜM sayıları matematiksel olarak kesin şekilde tahmin edebilir.",
          "`random` uses the Mersenne Twister PRNG. Observing 624 consecutive outputs allows an attacker to completely reconstruct internal state and predict every future token."
        ]
      },
      {
        id: "compare-digest-purpose",
        q: [
          "`secrets.compare_digest()` fonksiyonu hangi siber saldırı türünü engeller ve nasıl çalışır?",
          "What cyber attack does `secrets.compare_digest()` prevent and how does it work?"
        ],
        a: [
          "Zamanlama Saldırılarını (Timing Attack) engeller. Normal `==` ilk yanlış karakterde dururken, `compare_digest` tüm karakterleri sonuna kadar tarar ve her zaman sabit sürede (constant time) yanıt verir.",
          "Neutralizes Timing Attacks. While `==` short-circuits at the first mismatch, `compare_digest` always executes in constant time regardless of byte positions."
        ]
      },
      {
        id: "token-urlsafe-advantage",
        q: [
          "`secrets.token_urlsafe()` metodunun `token_hex()` metoduna göre avantajı nedir?",
          "What is the advantage of `secrets.token_urlsafe()` over `token_hex()`?"
        ],
        a: [
          "Base64 kullandığı için aynı bayt miktarını daha kısa dizeyle ifade eder (daha kompakt) ve URL sorgularında (`?token=...`) özel karakter kaçışına (URL encoding) ihtiyaç duymaz.",
          "It uses URL-safe Base64 encoding, producing a more compact string representation that can be embedded directly into URL query parameters without escaping."
        ]
      },
      {
        id: "csprng-entropy-source",
        q: [
          "`secrets` modülü rastgelelik için gücünü nereden alır?",
          "Where does the `secrets` module obtain its randomness?"
        ],
        a: [
          "İşletim sistemi çekirdeğinin kriptografik rastgele sayı üretecinden (CSPRNG: Linux'ta `getrandom`/`urandom`, Windows'ta CryptGenRandom / BCrypt).",
          "Directly from the OS kernel's Cryptographically Secure PRNG (CSPRNG), seeded by hardware interrupt noise."
        ]
      },
      {
        id: "randbelow-advantage",
        q: [
          "Neden `random.randint(0, n-1)` yerine `secrets.randbelow(n)` tercih edilmelidir?",
          "Why prefer `secrets.randbelow(n)` over `random.randint(0, n-1)`?"
        ],
        a: [
          "`randbelow(n)` hem kriptografik çekirdek entropisini kullanır hem de modülo işleminden kaynaklanabilecek istatistiksel sapmayı (modulo bias) önleyecek algoritmaya sahiptir.",
          "`randbelow(n)` leverages CSPRNG kernel entropy and eliminates statistical modulo bias."
        ]
      }
    ]
  });
})();

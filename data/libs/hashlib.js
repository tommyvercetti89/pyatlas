(function () {
  const R = String.raw;
  PY.addLib({
    id: "hashlib",
    name: "hashlib",
    sym: "h#",
    color: "#ec4899",
    focus: "cyber",
    level: 2,
    ext: false,
    cat: "crypto",
    docs: "https://docs.python.org/3/library/hashlib.html",
    tagline: [
      "Kriptografik özet fonksiyonları: SHA-256, MD5, dosya doğrulama ve parola güvenliği.",
      "Cryptographic secure hashing: SHA-256, MD5, file integrity checks, and password safety."
    ],
    analogy: [
      "Özet (hash) fonksiyonu bir dijital parmak izi makinesidir. Bir kütüphane dolusu kitabı da soksan, tek bir harfi de soksan sana her zaman sabit uzunlukta benzersiz bir parmak izi verir. Parmak izinden kitabı geri oluşturamazsın ama kitaptaki tek bir virgül değişse parmak izi tamamen tanınmaz hale gelir (çığ etkisi).",
      "A hash function is a digital fingerprinting press. Whether you feed in a single letter or an entire encyclopedia, it returns a fixed-length unique fingerprint. You cannot reconstruct the text from the fingerprint, but changing a single comma completely mutates the resulting fingerprint (avalanche effect)."
    ],
    intro: [
      [
        "`hashlib`, CPython'un OpenSSL destekli güvenli özet fonksiyonları modülüdür. SHA-256, SHA-512, SHA-3, BLAKE2 gibi modern algoritmaları ve geriye dönük uyumluluk için MD5 ve SHA-1'i içerir.",
        "`hashlib` provides OpenSSL-backed cryptographic hash algorithms in CPython, featuring SHA-256, SHA-512, SHA-3, BLAKE2, alongside legacy algorithms like MD5 and SHA-1."
      ],
      [
        "Siber güvenlikte hash her yerdedir: indirilen dosyaların bozulmadığını kontrol etme, zararlı yazılım (malware) IOC tespiti, dijital imzalar, parola saklama ve veri tabanı bütünlük doğrulamaları tamamen hash algoritmalarıyla yapılır.",
        "In cyber security, hashing is everywhere: verifying downloaded tool integrity, querying malware threat intelligence databases (IOCs), validating digital signatures, and storing passwords safely."
      ]
    ],
    import: R`import hashlib`,
    general: [
      [
        "İndirilen dosyaların veya yedeklerin veri bozulmasına uğramadığını doğrulamak.",
        "Verifying integrity of downloaded packages and backup archives against corruption."
      ],
      [
        "Veri tabanlarında veya önbelleklerde (cache) benzersiz kimlik anahtarları üretmek.",
        "Generating consistent unique cache keys and content-addressable identifiers."
      ],
      [
        "Büyük dosyaların kopyalarını (duplicate) tespit etmek için hızlı kıyaslama yapmak.",
        "Finding duplicate files efficiently by hashing file contents."
      ]
    ],
    cyberUse: [
      [
        "Zararlı yazılımların (malware) SHA-256 özetini çıkararak VirusTotal gibi tehdit istihbaratı servislerinde sorgulamak.",
        "Computing SHA-256 malware digests to check against threat intelligence repositories."
      ],
      [
        "Dosya Bütünlüğü İzleme (FIM - File Integrity Monitoring) ajanları yazarak sistem dosyalarındaki değişiklikleri anında yakalamak.",
        "Building File Integrity Monitoring (FIM) scripts that alert whenever critical OS files mutate."
      ],
      [
        "Parolaları tuzlama (salt) ve `pbkdf2_hmac` veya `scrypt` ile güvenli şekilde saklamak.",
        "Safely hashing passwords using cryptographic salts and `pbkdf2_hmac` or `scrypt`."
      ]
    ],
    sections: [
      {
        id: "hash-objects",
        title: ["Özet Fonksiyonları ve Nesne Metodları", "Hash Functions & Object Methods"],
        intro: [
          "Bir hash nesnesi oluşturma, veriyi besleme (update) ve nihai özeti alma metodları.",
          "Instantiating hash objects, feeding data chunks, and retrieving digest outputs."
        ],
        items: [
          {
            id: "sha256",
            name: "hashlib.sha256(data)",
            kind: "function",
            sig: "hashlib.sha256(data=b'', *, usedforsecurity=True)",
            sum: [
              "256-bit (32 bayt / 64 hex karakter) SHA-256 hash nesnesi döner.",
              "Returns a SHA-256 hash object (256-bit / 32-byte / 64-hex length)."
            ],
            desc: [
              "NIST onaylı güvenli SHA-2 ailesinin en yaygın algoritmasıdır. Çakışma (collision) saldırılarına karşı halen son derece dirençlidir ve modern güvenlik standartlarının temelidir.",
              "The industry standard algorithm from the SHA-2 family. Highly resistant to collision attacks and widely recommended for data integrity and threat intelligence."
            ],
            params: [
              { n: "data", d: ["Özeti çıkarılacak ilk baytlar (`bytes`).", "Initial bytes to feed into the hasher."] }
            ],
            ret: ["Yeni bir `hashlib.HASH` nesnesi.", "A new `hashlib.HASH` object."],
            ex: {
              code: R`import hashlib

h = hashlib.sha256(b"pyatlas")
print(h.hexdigest())`,
              out: R`d1937bbc3fcb73bfc6e6eb97c44cebd40d1584790f84a0e7b7f195c053431fd7`
            },
            cyber: [
              "Tehdit istihbaratında (Threat Intel) bir dosyanın veya zararlının parmak izi neredeyse her zaman SHA-256 ile ifade edilir.",
              "In threat intelligence, malware artifacts and suspicious binaries are universally indexed by their SHA-256 digest."
            ]
          },
          {
            id: "sha512",
            name: "hashlib.sha512(data)",
            kind: "function",
            sig: "hashlib.sha512(data=b'', *, usedforsecurity=True)",
            sum: [
              "512-bit (64 bayt / 128 hex karakter) ultra güvenli özet üretir.",
              "Generates a 512-bit (64-byte / 128-hex) ultra-secure cryptographic digest."
            ],
            desc: [
              "SHA-2 ailesinin 64-bit işlemcilere optimize edilmiş en güçlü üyesidir. 128 karakterlik onaltılık çıktı üretir ve yüksek güvenlik gerektiren kriptografik imzalarda standarttır.",
              "The strongest SHA-2 member, highly optimized for 64-bit architectures. Produces 128 hex characters and is standard in high-assurance digital signatures."
            ],
            ex: {
              code: R`import hashlib

h = hashlib.sha512(b"abc")
print(len(h.hexdigest()))`,
              out: R`128`
            }
          },
          {
            id: "blake2b",
            name: "hashlib.blake2b(data, ...)",
            kind: "function",
            sig: "hashlib.blake2b(data=b'', *, digest_size=64, key=b'', ...)",
            sum: [
              "MD5 kadar hızlı fakat SHA-3 kadar güvenli modern 64-bit özet algoritması.",
              "Modern 64-bit algorithm as fast as MD5 yet as secure as SHA-3."
            ],
            desc: [
              "RFC 7693 standardıdır. Doğrudan anahtarlı hash (keyed hash / MAC) desteği sunar ve çıktı boyutu (`digest_size`) 1 ile 64 bayt arasında ayarlanabilir.",
              "Compliant with RFC 7693. Natively supports keyed hashing and variable digest sizes from 1 to 64 bytes."
            ],
            params: [
              { n: "digest_size", d: ["Çıktı bayt uzunluğu (1-64 arası).", "Output digest byte length (1 to 64)."] }
            ],
            ex: {
              code: R`import hashlib

b = hashlib.blake2b(b"abc", digest_size=16)
print(b.hexdigest())`,
              out: R`cf4ab791c62b8d2b2109c90275287816`
            }
          },
          {
            id: "md5",
            name: "hashlib.md5(data)",
            kind: "function",
            sig: "hashlib.md5(data=b'', *, usedforsecurity=True)",
            sum: [
              "128-bit (16 bayt / 32 hex karakter) MD5 hash nesnesi döner.",
              "Returns a 128-bit MD5 hash object (legacy/broken for security)."
            ],
            desc: [
              "Eski ve hızlı bir algoritmadır. Kriptografik çakışma zaafiyeti (collision vulnerability) bulunduğu için güvenlik ve parola saklama amacıyla KULLANILMAMALIDIR. Yalnızca dosya bozulma kontrollerinde ve eski sistemlerle uyumlulukta kullanılır.",
              "A legacy 128-bit algorithm. Cryptographically broken regarding collision attacks and MUST NOT be used for security or passwords. Still commonly seen for non-cryptographic checksums."
            ],
            params: [
              { n: "data", d: ["İsteğe bağlı başlangıç baytları.", "Optional initial bytes."] }
            ],
            ex: {
              code: R`import hashlib

h = hashlib.md5(b"admin")
print(h.hexdigest())`,
              out: R`21232f297a57a5a743894a0e4a801fc3`
            },
            cyber: [
              "Güvenlik denetimlerinde MD5 kullanımı gördüğünüzde 'zayıf kriptografi' bulgusu olarak raporlanır.",
              "In penetration tests and code reviews, finding MD5 used for security tokens flags a weak-cryptography vulnerability."
            ],
            gotcha: [
              "FIPS uyumlu ortamlarda `hashlib.md5()` doğrudan hata fırlatabilir. Güvenlik dışı amaçlarla kullanıyorsanız `usedforsecurity=False` parametresini ekleyin.",
              "Under FIPS-compliant systems, calling `md5()` raises an error unless explicitly tagged with `usedforsecurity=False`."
            ]
          },
          {
            id: "update",
            name: "hasher.update(data)",
            kind: "method",
            sig: "hasher.update(data)",
            sum: [
              "Hash nesnesine yeni veri baytları ekler.",
              "Feeds additional bytes into the active hash calculation."
            ],
            desc: [
              "Hash hesaplamasını sürdürür. `h.update(a); h.update(b)` çağrısı ile `h.update(a + b)` çağrısı tamamen aynı sonucu üretir. Bu sayede gigabaytlarca büyüklükteki dosyalar RAM'i doldurmadan parça parça (chunk) okunup özetlenebilir.",
              "Appends new byte chunks into the digest state. `h.update(a); h.update(b)` is mathematically equivalent to `h.update(a + b)`, enabling multi-gigabyte files to be hashed in streaming chunks without memory bloat."
            ],
            params: [
              { n: "data", d: ["Eklenecek `bytes` nesnesi.", "Bytes chunk to append."] }
            ],
            ex: {
              code: R`import hashlib

h1 = hashlib.sha256(b"hello world")
h2 = hashlib.sha256()
h2.update(b"hello ")
h2.update(b"world")
print(h1.hexdigest() == h2.hexdigest())`,
              out: R`True`
            }
          },
          {
            id: "hexdigest",
            name: "hasher.hexdigest()",
            kind: "method",
            sig: "hasher.hexdigest() -> str",
            sum: [
              "Hesaplanan özeti onaltılık (hexadecimal) metin dizesi olarak döner.",
              "Returns the computed digest as a hexadecimal ASCII string."
            ],
            desc: [
              "Özeti 0-9 ve a-f karakterlerinden oluşan okunabilir bir metin olarak verir. SHA-256 için uzunluğu tam olarak 64 karakterdir.",
              "Formats the digest as lowercase hex characters. For SHA-256, it is always exactly 64 hex digits."
            ],
            ret: ["Onaltılık dize (`str`).", "Hex string (`str`)."],
            ex: {
              code: R`import hashlib

h = hashlib.sha256(b"abc")
res = h.hexdigest()
print(len(res), res[:8])`,
              out: R`64 ba7816bf`
            }
          },
          {
            id: "digest",
            name: "hasher.digest()",
            kind: "method",
            sig: "hasher.digest() -> bytes",
            sum: [
              "Hesaplanan özeti ham baytlar (`bytes`) olarak döner.",
              "Returns the raw binary digest bytes."
            ],
            desc: [
              "Hex yerine ham bayt çıktısı verir. Örneğin SHA-256 için 32 bayt uzunluğundadır. İmzalar ve ikili ağ paketleri için bu metod kullanılır.",
              "Returns raw binary output (32 bytes for SHA-256) rather than hex strings, required for binary network protocols and signatures."
            ],
            ret: ["Ham özet baytları (`bytes`).", "Raw digest `bytes`."],
            ex: {
              code: R`import hashlib

d = hashlib.sha256(b"abc").digest()
print(len(d), type(d).__name__)`,
              out: R`32 bytes`
            }
          },
          {
            id: "copy",
            name: "hasher.copy()",
            kind: "method",
            sig: "hasher.copy() -> HASH",
            sum: [
              "Mevcut hesaplama durumunun bağımsız bir kopyasını (klonunu) alır.",
              "Clones the active hash calculation state into a new independent object."
            ],
            desc: [
              "Ortak bir veri önekini paylaşıp farklı son eklerle hash hesaplarken büyük işlemci tasarrufu sağlar.",
              "Efficiently branches hash computation when multiple digests share an identical common prefix."
            ],
            ret: ["Klonlanmış `hashlib.HASH` nesnesi.", "Cloned `hashlib.HASH` instance."],
            ex: {
              code: R`import hashlib

base = hashlib.sha256(b"ORTAK_BASLANGIC_")
branch_a = base.copy()
branch_a.update(b"A")
branch_b = base.copy()
branch_b.update(b"B")
print(branch_a.hexdigest() != branch_b.hexdigest())`,
              out: R`True`
            }
          },
          {
            id: "algorithms-guaranteed",
            name: "hashlib.algorithms_guaranteed",
            kind: "const",
            sig: "hashlib.algorithms_guaranteed",
            sum: [
              "Tüm Python platformlarında her zaman mevcut olması garanti algoritmalar kümesi.",
              "Set of hash algorithms guaranteed to exist across all Python platforms."
            ],
            desc: [
              "`'sha256'`, `'sha512'`, `'md5'`, `'sha1'` gibi platform bağımsız her ortamda çalışan algoritmaların adlarını içeren bir `set`tir.",
              "Contains names of algorithms guaranteed to be supported on every platform regardless of underlying OpenSSL build."
            ],
            ex: {
              code: R`import hashlib

print("sha256" in hashlib.algorithms_guaranteed)
print("md5" in hashlib.algorithms_guaranteed)`,
              out: R`True
True`
            }
          }
        ]
      },
      {
        id: "passwords",
        title: ["Güvenli Parola Özetleme (KDF)", "Secure Password Hashing (KDF)"],
        intro: [
          "Parolaları düz SHA-256 ile saklamak rainbow table saldırılarına karşı yetersizdir. Özel tuzlama ve yinelemeli KDF algoritmaları gerekir.",
          "Storing passwords with plain SHA-256 is vulnerable to GPU cracking and rainbow tables; iterative Key Derivation Functions (KDFs) are essential."
        ],
        items: [
          {
            id: "pbkdf2-hmac",
            name: "hashlib.pbkdf2_hmac(hash_name, ...)",
            kind: "function",
            sig: "hashlib.pbkdf2_hmac(hash_name, password, salt, iterations, dklen=None)",
            sum: [
              "Parolalar için tuzlanmış ve binlerce kez yinelenmiş PBKDF2 özeti üretir.",
              "Computes PBKDF2 password derivation with cryptographic salt and iteration counts."
            ],
            desc: [
              "Parolayı rastgele bir `salt` (tuz) ile birleştirir ve belirtilen özet fonksiyonunu (örn: 'sha256') binlerce kez (`iterations`) ardışık çalıştırır. Bu sayede saldırganların parola deneme hızını donanımsal olarak çok ciddi oranda yavaşlatır.",
              "Derives an encryption key or password hash using the PBKDF2 standard. Applying thousands of iterations drastically slows down brute-force attacks by malicious GPUs."
            ],
            params: [
              { n: "hash_name", d: ["Kullanılacak özet algoritması (örn: `'sha256'`).", "Underlying hash algorithm (e.g. `'sha256'`)."] },
              { n: "password", d: ["Kullanıcı parolası (`bytes`).", "User password (`bytes`)."] },
              { n: "salt", d: ["En az 16 baytlık rastgele tuz verisi (`bytes`).", "Cryptographically random salt (`bytes`)."] },
              { n: "iterations", d: ["Yineleme sayısı (en az 600.000 önerilir).", "Iteration count (600,000+ recommended by OWASP)."] }
            ],
            ret: ["Türetilen anahtar baytları (`bytes`).", "Derived key `bytes`."],
            ex: {
              code: R`import hashlib

pw = b"GizliParola123!"
salt = b"rastgele_tuz_16b"
dk = hashlib.pbkdf2_hmac("sha256", pw, salt, 1000)
print(len(dk), type(dk).__name__)`,
              out: R`32 bytes`
            },
            cyber: [
              "Asla parolaları düz `sha256(password)` olarak veri tabanına kaydetmeyin. Her kullanıcıya özel rastgele bir tuz üretip `pbkdf2_hmac` veya `argon2` ile saklayın.",
              "Never store raw unsalted passwords using `sha256(password)`. Always use unique salts and iterative KDFs like PBKDF2 or Argon2."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "file-hasher",
        title: [
          "Büyük Dosyaları Belleği Şişirmeden Parça Parça Özetleme",
          "Streaming File Hasher (Chunked Memory-Safe)"
        ],
        sum: [
          "Büyük dosyaları 64KB'lık parçalar halinde okuyarak RAM harcamadan SHA-256 hesaplama.",
          "Computing SHA-256 digests of large files in 64KB blocks without exhausting RAM."
        ],
        code: R`import hashlib
import io

# Test amaciyla ornek bir sanal dosya olustur ||| Create mock file in memory
fake_file = io.BytesIO(b"PYATLAS_TEST_PAYLOAD_" * 100)

hasher = hashlib.sha256()
# 64 KB'lik bloklar halinde oku ||| Read in 64KB blocks
while chunk := fake_file.read(65536):
    hasher.update(chunk)

print("SHA256:", hasher.hexdigest())`,
        out: R`SHA256: 87c1a0e6071f449092711a076fbe3003722a1018c32b6d97124fb503cef7273d`,
        cyber: true,
        note: [
          "Bütünlük kontrollerinde (FIM) veya adli bilişim (forensics) incelemelerinde disk imajları bu yöntemle özetlenir.",
          "In forensic incident response, multi-gigabyte disk dumps are hashed using streaming blocks exactly like this."
        ]
      },
      {
        id: "check-hash",
        title: [
          "İndirilen Dosyanın Doğrulama Kontrolü (Integrity Verification)",
          "Downloaded Artifact Verification"
        ],
        sum: [
          "İndirilen bir dosyanın üreticinin verdiği SHA-256 ile eşleşip eşleşmediğini kontrol etme.",
          "Verifying whether a downloaded binary matches the vendor-supplied SHA-256 hash."
        ],
        code: R`import hashlib

dosya_icerigi = b"guvenli_guncelleme_paketi"
beklenen_hash = "4d7ef064c05de30122b4d639c0252970801069dd58843be4c047c3763ade7085"

hesaplanan = hashlib.sha256(dosya_icerigi).hexdigest()

if hesaplanan == beklenen_hash:
    print("DOGRULANDI: Dosya orijinal ve bozulmamis.")
else:
    print("TEHLIKE: Dosya degistirilmis veya bozuk!")`,
        out: R`DOGRULANDI: Dosya orijinal ve bozulmamis.`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "hash-vs-encryption",
        q: [
          "Özetleme (hashing) ile Şifreleme (encryption) arasındaki en kritik fark nedir?",
          "What is the most critical difference between hashing and encryption?"
        ],
        a: [
          "Özetleme tek yönlüdür (one-way); özetten orijinal veriyi geri elde etmek matematiksel olarak imkansızdır. Şifreleme ise çift yönlüdür; uygun anahtar ile şifre çözülebilir (decrypt).",
          "Hashing is one-way: mathematically irreversible. Encryption is two-way: ciphertext can be decrypted back to plaintext using the appropriate key."
        ]
      },
      {
        id: "why-not-plain-sha256-passwords",
        q: [
          "Kullanıcı parolalarını neden düz `hashlib.sha256(parola).hexdigest()` şeklinde saklamamalıyız?",
          "Why must we never store passwords as plain `hashlib.sha256(password).hexdigest()`?"
        ],
        a: [
          "Çünkü SHA-256 son derece hızlıdır. Saldırganlar modern ekran kartlarıyla (GPU) saniyede milyarlarca deneme yapabilir veya önceden hesaplanmış tablolarla (rainbow table) parolayı anında bulabilir.",
          "Because SHA-256 is designed to be extremely fast. Attackers using GPUs can evaluate billions of guesses per second or look up precomputed rainbow tables."
        ]
      },
      {
        id: "avalanche-effect",
        q: [
          "Kriptografik özet fonksiyonlarında 'Çığ Etkisi' (Avalanche Effect) ne anlama gelir?",
          "What does the 'Avalanche Effect' mean in cryptographic hash functions?"
        ],
        a: [
          "Girdi verisindeki tek bir bit veya karakter değiştiğinde bile üretilen özetin tamamen değişmesi ve orijinal özetle hiçbir benzerlik taşımaması prensibidir.",
          "The property that flipping even a single bit in the input causes an unpredictable, drastic change across the entire resulting digest."
        ]
      },
      {
        id: "salt-definition",
        q: [
          "Parola güvenliğinde 'Tuz' (Salt) nedir ve neyi engeller?",
          "What is a 'Salt' in password security and what attack does it thwart?"
        ],
        a: [
          "Her kullanıcı için rastgele üretilen ve parolayla birleştirilen benzersiz baytlardır. İki kullanıcının parolası aynı olsa bile hash'lerinin farklı olmasını sağlar ve rainbow table saldırılarını tamamen etkisiz kılar.",
          "A unique cryptographically random byte sequence appended to each password before hashing. Prevents identical hashes across users and completely neutralizes precomputed rainbow tables."
        ]
      },
      {
        id: "streaming-update-benefit",
        q: [
          "`hasher.update()` metodunun ardışık çağrılabilmesi büyük dosyalarda ne kazandırır?",
          "What advantage does sequential `hasher.update()` calling offer when processing huge files?"
        ],
        a: [
          "Dosyanın tamamını RAM belleğe yüklemek yerine 64KB gibi küçük parçalar halinde akış (stream) olarak okunup özetlenmesini sağlar, bellek taşmasını önler.",
          "Allows multi-gigabyte files to be processed in small streaming chunks (e.g. 64KB) without allocating huge buffers in RAM."
        ]
      }
    ]
  });
})();

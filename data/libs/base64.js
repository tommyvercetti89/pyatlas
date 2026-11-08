(function () {
  const R = String.raw;
  PY.addLib({
    id: "base64",
    name: "base64",
    sym: "64",
    color: "#8b5cf6",
    focus: "cyber",
    level: 1,
    ext: false,
    cat: "crypto",
    docs: "https://docs.python.org/3/library/base64.html",
    tagline: [
      "İkili veriyi metne kodlama: b64, URL-safe, b32, b85 ve adli analizde veri çözme.",
      "Binary-to-text encoding and decoding: standard b64, URL-safe, b32, b85, and forensics."
    ],
    analogy: [
      "Eski telgraf hatları sadece harfleri taşıyabilir; resim veya ses gibi ham elektrik sinyallerini taşıyamaz. Base64, herhangi bir ikili dosyayı (resim, exe, ham bayt) sadece telgrafın anlayacağı 64 temel harfe ve rakama tercüme eden bir paketleyicidir. Karşı taraf bu paketi açtığında orijinal resmi tekrar elde eder.",
      "Old telegraph lines only transmit letters, not raw binary signals. Base64 translates arbitrary binary data into 64 ASCII printable characters. The recipient reverses the encoding to retrieve the exact original bytes."
    ],
    intro: [
      [
        "`base64` modülü, ikili (binary) verileri yazdırılabilir ASCII karakter setlerine (RFC 4648) dönüştürmek için kullanılan standart Python kütüphanesidir. Standart Base64, URL-safe Base64, Base32, Base16 ve Ascii85/Base85 algoritmalarını destekler.",
        "The `base64` module provides data encoding and decoding into printable ASCII subsets as specified in RFC 4648, featuring standard Base64, URL-safe Base64, Base32, Base16, and Base85."
      ],
      [
        "Siber güvenlikte Base64 her gün karşınıza çıkar: HTTP Basic Auth başlıkları, JSON Web Token (JWT) parçaları, PowerShell kodlarının gizlenmesi (obfuscation), e-posta ekleri ve adli bilişim (forensics) incelemeleri Base64 ile doludur.",
        "In cyber security, Base64 is ubiquitous: HTTP Basic Auth headers, JWT token slices, encoded PowerShell payloads, email attachments, and forensic memory artifact decodings."
      ]
    ],
    import: R`import base64`,
    general: [
      [
        "Resim ve dosya eklerini JSON veya e-posta (MIME) gibi yalnızca metin kabul eden protokollere gömmek.",
        "Embedding binary images or files into JSON payloads or email MIME messages."
      ],
      [
        "Web sayfalarında küçük simgeleri doğrudan CSS/HTML içine Data URI formatında yerleştirmek.",
        "Generating inline Data URIs for CSS assets and web icons."
      ],
      [
        "İkili ağ paketlerini log dosyalarında bozulmadan güvenle saklamak.",
        "Safely logging binary packet payloads in plain text log files without corruption."
      ]
    ],
    cyberUse: [
      [
        "Zararlı yazılım scriptlerinde veya loglarda gizlenmiş (obfuscated) Base64 metinlerini çözüp analiz etmek.",
        "Decoding obfuscated PowerShell or macro payloads discovered during incident triage."
      ],
      [
        "HTTP `Authorization: Basic <base64>` başlıklarını çözerek kimlik bilgilerini ayrıştırmak.",
        "Decoding HTTP Basic Authentication headers into username and password credentials."
      ],
      [
        "JWT (JSON Web Token) başlık ve gövdesini `urlsafe_b64decode` ile çözerek güvenlik denetimi yapmak.",
        "Dissecting and inspecting JWT headers and claims via `urlsafe_b64decode`."
      ]
    ],
    sections: [
      {
        id: "standard-b64",
        title: ["Standart Base64 Kodlama & Çözme", "Standard Base64 Encode & Decode"],
        intro: [
          "Standart Base64 alfabe (`A-Z, a-z, 0-9, +, /`) fonksiyonları.",
          "Functions operating on the standard Base64 character set."
        ],
        items: [
          {
            id: "b64encode",
            name: "base64.b64encode(s)",
            kind: "function",
            sig: "base64.b64encode(s, altchars=None) -> bytes",
            sum: [
              "Bayt verisini standart Base64 formatında kodlar.",
              "Encodes bytes-like object `s` using standard Base64."
            ],
            desc: [
              "Her 3 baytlık veriyi (24 bit) 4 adet 6-bitlik Base64 karakterine dönüştürür. Çıktı boyutu yaklaşık %33 oranında büyür. Girdi mutlaka `bytes` olmalıdır; çıktı da `bytes` tipindedir.",
              "Encodes bytes into standard Base64, converting 3 binary bytes into 4 ASCII characters. Output expands by approximately 33%. Both input and return types are `bytes`."
            ],
            params: [
              { n: "s", d: ["Kodlanacak bayt nesnesi (`bytes`).", "Bytes-like object to encode."] }
            ],
            ret: ["Base64 kodlanmış `bytes` nesnesi.", "Base64 encoded `bytes`."],
            ex: {
              code: R`import base64

raw = b"pyatlas"
encoded = base64.b64encode(raw)
print(encoded.decode("ascii"))`,
              out: R`cHlhdGxhcw==`
            },
            gotcha: [
              "`b64encode` doğrudan `str` alamaz; önce `.encode('utf-8')` yapılmalıdır. Çıktıyı ekrana metin basmak için de `.decode('ascii')` çağrılmalıdır.",
              "`b64encode` requires `bytes`. Pass strings encoded via `.encode('utf-8')` and decode the result with `.decode('ascii')`."
            ]
          },
          {
            id: "b64decode",
            name: "base64.b64decode(s)",
            kind: "function",
            sig: "base64.b64decode(s, altchars=None, validate=False) -> bytes",
            sum: [
              "Base64 formatındaki metni orijinal baytlarına geri çözer.",
              "Decodes Base64 encoded bytes or ASCII string back into original bytes."
            ],
            desc: [
              "Kodlanmış Base64 verisini çözerek orijinal ham baytları verir. `validate=True` yapılırsa alfabe dışı geçersiz karakterlerde hata fırlatır.",
              "Reverses Base64 encoding. Setting `validate=True` rejects non-alphabet characters strictly."
            ],
            params: [
              { n: "s", d: ["Çözülecek Base64 dizesi veya baytları.", "Base64 string or bytes to decode."] },
              { n: "validate", d: ["Geçersiz karakterleri reddetmek için `True` yapın.", "When True, non-alphabet characters raise `binascii.Error`."] }
            ],
            ret: ["Çözülen orijinal `bytes` nesnesi.", "Decoded original `bytes`."],
            ex: {
              code: R`import base64

encoded = "cHlhdGxhcw=="
original = base64.b64decode(encoded)
print(original.decode("utf-8"))`,
              out: R`pyatlas`
            },
            cyber: [
              "Zararlı script analizinde şüpheli Base64 dizelerini `b64decode` ile çözmek gizlenen komutları veya IP adreslerini ortaya çıkarır.",
              "Decoding suspicious Base64 blobs extracted from obfuscated scripts instantly exposes C2 IP addresses or dropped commands."
            ]
          }
        ]
      },
      {
        id: "urlsafe-b64",
        title: ["URL-Safe Base64 (JWT & Web)", "URL-Safe Base64 (JWT & Web)"],
        intro: [
          "URL ve dosya adlarında sorun çıkaran `+` ve `/` yerine `-` ve `_` kullanan güvenli varyant.",
          "Variant replacing `+` and `/` with URL-friendly `-` and `_` characters."
        ],
        items: [
          {
            id: "urlsafe-b64encode",
            name: "base64.urlsafe_b64encode(s)",
            kind: "function",
            sig: "base64.urlsafe_b64encode(s) -> bytes",
            sum: [
              "`+` yerine `-`, `/` yerine `_` kullanarak URL uyumlu Base64 üretir.",
              "Encodes bytes using URL-safe alphabet, replacing `+` with `-` and `/` with `_`."
            ],
            desc: [
              "Standart Base64'teki `+` karakteri URL'lerde boşluk olarak algılanabilir; `/` karakteri ise yol ayırıcıyla karışır. Bu fonksiyon URL parametrelerinde ve JWT token'larında sorunsuz çalışan güvenli dize üretir.",
              "Standard `+` and `/` conflict with URL path and query delimiters. This variant ensures friction-free embedding in HTTP requests."
            ],
            ex: {
              code: R`import base64

# Ozel baytlar ||| Bytes that produce + and / in standard b64
data = b"\xfb\xff\xfe"
print("Std:", base64.b64encode(data).decode())
print("URL:", base64.urlsafe_b64encode(data).decode())`,
              out: R`Std: +//+
URL: -__-`
            }
          },
          {
            id: "urlsafe-b64decode",
            name: "base64.urlsafe_b64decode(s)",
            kind: "function",
            sig: "base64.urlsafe_b64decode(s) -> bytes",
            sum: [
              "URL-safe Base64 verisini çözer.",
              "Decodes URL-safe Base64 encoded bytes or string."
            ],
            desc: [
              "`-` ve `_` karakterlerini içeren URL-safe Base64 dizelerini orijinal baytlarına döndürür.",
              "Restores binary payload from URL-safe Base64 inputs."
            ],
            ex: {
              code: R`import base64

decoded = base64.urlsafe_b64decode(b"-__-")
print(len(decoded), decoded.hex())`,
              out: R`3 fbfffe`
            }
          }
        ]
      },
      {
        id: "other-bases",
        title: ["Diğer Tabanlar: Base32, Base16, Base85", "Other Bases: Base32, Base16, Base85"],
        intro: [
          "Büyük/küçük harf duyarsız ortamlarda veya kompakt depolamada kullanılan alternatif kodlamalar.",
          "Alternative encodings for case-insensitive systems or compact serialization."
        ],
        items: [
          {
            id: "b32encode",
            name: "base64.b32encode / b32decode",
            kind: "function",
            sig: "base64.b32encode(s) -> bytes",
            sum: [
              "Büyük/küçük harf duyarsız 32 karakterlik alfabe (A-Z, 2-7) ile kodlar.",
              "Encodes bytes into case-insensitive Base32 alphabet (A-Z and 2-7)."
            ],
            desc: [
              "Harf karmaşasını önlemek için 0, 1, 8, 9 gibi kafa karıştıran karakterleri içermez. İki Faktörlü Kimlik Doğrulama (TOTP/Google Authenticator gizli anahtarları) için standart formattır.",
              "Excludes ambiguous glyphs. The standard encoding for Two-Factor Authentication (TOTP / Google Authenticator) seed keys."
            ],
            ex: {
              code: R`import base64

secret = b"PYATLAS2FA"
encoded = base64.b32encode(secret)
print(encoded.decode("ascii"))
print(base64.b32decode(encoded) == secret)`,
              out: R`KBMUCVCMIFJTERSB
True`
            },
            cyber: [
              "2FA/TOTP gizli tohum anahtarları kullanıcıya sunulurken daima Base32 olarak verilir.",
              "Two-factor authentication secret seeds in QR codes are universally formatted as Base32."
            ]
          },
          {
            id: "b16encode",
            name: "base64.b16encode / b16decode",
            kind: "function",
            sig: "base64.b16encode(s) -> bytes",
            sum: [
              "Baytları 16'lık onaltılık (hex) formata dönüştürür.",
              "Encodes bytes into standard uppercase hexadecimal representation."
            ],
            desc: [
              "Her baytı 2 adet onaltılık karaktere (`0-9, A-F`) dönüştürür. `bytes.hex().upper()` ile aynı çıktıyı üretir.",
              "Encodes every byte into two uppercase hex digits, identical to `bytes.hex().upper()`."
            ],
            ex: {
              code: R`import base64

h = base64.b16encode(b"ABC")
print(h.decode("ascii"))`,
              out: R`414243`
            }
          },
          {
            id: "b85encode",
            name: "base64.b85encode / b85decode",
            kind: "function",
            sig: "base64.b85encode(s, pad=False) -> bytes",
            sum: [
              "Daha verimli ve kompakt (%25 büyüme) modern Base85 kodlaması.",
              "Modern compact Base85 encoding expanding by only 25%."
            ],
            desc: [
              "Base64 veriyi %33 büyütürken Base85 yalnızca %25 büyütür. Git yamalarında ve ikili diff dosyalarında kullanılır.",
              "More space-efficient than Base64 (25% vs 33% overhead). Popular in Git binary diffs."
            ],
            ex: {
              code: R`import base64

raw = b"12345678"
b85 = base64.b85encode(raw)
print(b85.decode("ascii"))
print(base64.b85decode(b85) == raw)`,
              out: R`F)}kWH8wXm
True`
            }
          },
          {
            id: "not-encryption",
            name: "Kavram: Kodlama (Encoding) vs Şifreleme (Encryption)",
            kind: "concept",
            sig: "base64 != encryption",
            sum: [
              "Base64 bir şifreleme DEĞİLDİR; anahtarsızdır ve herkes anında çözebilir.",
              "Base64 is an encoding, NOT encryption; it requires no key and anyone can decode it."
            ],
            desc: [
              "Yeni başlayanların en sık düştüğü yanılgı Base64'ü güvenli bir şifreleme sanmaktır. Base64 veriyi gizlemez; yalnızca formatını değiştirir. İçinde gizli bilgi (parola, API key) olan bir veriyi sadece Base64 yaparak saklamak 'açık metin saklamak' ile tamamen eşdeğer bir güvenlik zaafiyetidir.",
              "Base64 does not provide confidentiality. It requires no secret key. Storing passwords as Base64 is equivalent to storing them in plaintext."
            ],
            ex: {
              code: R`import base64

# Gorunuste anlasilmaz ama guvensiz ||| Looks garbled but completely readable
sahte_guvenlik = "YWRtaW46UGFzc3dvcmQxMjM="
cozulmus = base64.b64decode(sahte_guvenlik).decode("utf-8")
print(cozulmus)`,
              out: R`admin:Password123`
            },
            cyber: [
              "Siber güvenlik denetimlerinde veri tabanında Base64 ile saklanmış parolalar 'Açık Metin Kimlik Bilgisi Saklama' (CWE-256 / OWASP A02) olarak raporlanır.",
              "In penetration tests, storing secrets in Base64 is flagged as plain-text credential exposure (CWE-256)."
            ]
          }
        ]
      }
    ],
    recipes: [
      {
        id: "decode-basic-auth",
        title: [
          "HTTP Basic Authentication Başlığını Çözücü",
          "HTTP Basic Auth Header Decoder"
        ],
        sum: [
          "`Authorization: Basic <base64>` başlığından kullanıcı adı ve parolayı ayrıştırma.",
          "Parsing username and password from an HTTP Basic Auth header string."
        ],
        code: R`import base64

auth_header = "Basic YWRtaW46R3V2ZW5saVBhc3Mh"

# 1. 'Basic ' on ekini kaldir ||| Strip 'Basic ' prefix
prefix, b64_part = auth_header.split(" ", 1)

# 2. Base64 coz ||| Decode base64
creds = base64.b64decode(b64_part).decode("utf-8")

# 3. 'kullanici:parola' seklinde ayir ||| Split user:password
user, pw = creds.split(":", 1)
print(f"Kullanici: {user} | Parola: {pw}")`,
        out: R`Kullanici: admin | Parola: GuvenliPass!`,
        cyber: true,
        note: [
          "HTTP Basic Auth başlıkları şifreli değildir; sadece Base64 ile kodlanmıştır. HTTPS kullanılmazsa ağdaki herkes bu parolaları açıkça görebilir.",
          "Basic Auth credentials travel in plain Base64. Without HTTPS TLS encryption, credentials are exposed in cleartext."
        ]
      },
      {
        id: "fix-missing-padding",
        title: [
          "Eksik Dolgulu (Padding) Base64 Dizelerini Onarma",
          "Fixing Unpadded Base64 Strings"
        ],
        sum: [
          "JWT gibi sondaki `=` dolguları silinmiş dizeleri otomatik tamamlayıp çözme.",
          "Automatically appending missing `=` padding characters before decoding."
        ],
        code: R`import base64

# Bazi sistemler (JWT gibi) sondaki '=' dolgularini kirpar ||| Stripped padding
unpadded = "cHlhdGxhcw"  # Normalde 'cHlhdGxhcw==' olmaliydi ||| Should end with '=='

# 4'un katina tamamlayacak kadar '=' ekle ||| Add padding until len % 4 == 0
padded = unpadded + "=" * (-len(unpadded) % 4)

decoded = base64.b64decode(padded).decode("utf-8")
print("Cozuldu:", decoded)`,
        out: R`Cozuldu: pyatlas`,
        cyber: true,
        note: [
          "JWT token'larının parçaları incelenirken sondaki dolgular silinmiş olduğundan doğrudan `b64decode` hata verebilir. Bu formül dolguyu güvenle onarır.",
          "JWT tokens omit trailing `=` padding. Appending `=' * (-len % 4)` prevents padding-length decoding exceptions."
        ]
      }
    ],
    cards: [
      {
        id: "base64-not-crypto",
        q: [
          "Neden Base64 bir kriptografik güvenlik veya şifreleme mekanizması değildir?",
          "Why is Base64 NOT a cryptographic security or encryption mechanism?"
        ],
        a: [
          "Çünkü gizli bir anahtarı (key) yoktur. Algoritması ve alfabesi evrenseldir; internete erişimi olan herkes Base64 ile yazılmış bir metni tek satırda orijinal haline geri döndürebilir.",
          "Because it involves no secret key. The encoding algorithm is standardized and public; anyone can decode it instantly back to plaintext."
        ]
      },
      {
        id: "why-urlsafe-needed",
        q: [
          "URL-Safe Base64'te hangi iki karakter değiştirilir ve neden?",
          "Which two characters are altered in URL-Safe Base64 and why?"
        ],
        a: [
          "`+` yerine `-`, `/` yerine `_` kullanılır. Çünkü standart Base64'teki `+` URL'lerde boşluk karakteriyle, `/` ise dosya yolu ayırıcıyla çakışır.",
          "`+` is replaced with `-` and `/` with `_`, because `+` conflicts with URL query spaces and `/` with URL path delimiters."
        ]
      },
      {
        id: "padding-equals-meaning",
        q: [
          "Base64 dizelerinin sonundaki `=` karakterleri ne anlama gelir?",
          "What do trailing `=` characters represent in Base64 strings?"
        ],
        a: [
          "Dolgu (padding) karakterleridir. Base64 girdiyi 3 baytlık bloklar halinde işler. Girdi bayt sayısı 3'ün katı değilse eksik kalan baytlar `=` ile tamamlanır (en fazla 2 adet `=` olabilir).",
          "They are padding characters. Base64 processes bytes in 3-byte blocks. If the input length is not a multiple of 3, `=` symbols pad out the final block."
        ]
      },
      {
        id: "base64-size-overhead",
        q: [
          "Bir dosya Base64 ile kodlandığında dosya boyutu yaklaşık ne oranda büyür?",
          "By approximately what percentage does a file expand when encoded in Base64?"
        ],
        a: [
          "Yaklaşık %33 oranında büyür. Çünkü her 3 baytlık ikili veri 4 baytlık ASCII karakterine dönüştürülür (oran 4/3 = %133.3).",
          "Expands by approximately 33%. Every 3 input bytes turn into 4 output ASCII characters (4/3 ratio)."
        ]
      },
      {
        id: "base32-2fa-usage",
        q: [
          "Neden Google Authenticator gibi 2FA uygulamalarında Base64 yerine Base32 tercih edilir?",
          "Why do 2FA apps like Google Authenticator prefer Base32 over Base64?"
        ],
        a: [
          "Base32 büyük/küçük harf duyarsızdır ve `0`, `1`, `8`, `9` gibi insan gözünün birbiriyle veya `O`, `I` harfleriyle karıştırabileceği karakterleri içermez; elle girmeye çok daha uygundur.",
          "Base32 is case-insensitive and omits confusing glyphs (0, 1, 8, 9) that humans easily mix up with O and I when typing secret seeds."
        ]
      }
    ]
  });
})();

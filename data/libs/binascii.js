(function () {
  const R = String.raw;
  PY.addLib({
    id: "binascii",
    name: "binascii",
    sym: "ba",
    color: "#6366f1",
    focus: "both",
    level: 2,
    ext: false,
    cat: "crypto",
    docs: "https://docs.python.org/3/library/binascii.html",
    tagline: [
      "İkili veri (binary) ve ASCII kodlamaları arasında C hızında düşük seviyeli dönüştürme ve CRC32.",
      "Low-level C-speed conversion between binary and ASCII representations plus CRC32 checksums."
    ],
    analogy: [
      "`binascii`, ham makine baytları (görünmeyen ikili baytlar) ile insan/metin protokolleri arasındaki gümrük kapısıdır. Bilgisayarın bellek adreslerini, shellcode'ları veya ağ paketlerini ekranda okuyabileceğin onaltılık (hex) sayılara çevirir ya da tam tersine hex dizesini doğrudan işlemcinin çalıştırabileceği baytlara döker.",
      "`binascii` is the border checkpoint between raw machine bytes and human text protocols. It translates memory addresses, shellcodes, and network packets into readable hexadecimal notations or parses raw hex representations back into machine bytes."
    ],
    intro: [
      [
        "`binascii` modülü, ikili veriler ile çeşitli ASCII tabanlı temsiller (Hexadecimal, Base64, Quoted-Printable) arasında doğrudan C uzantısı hızında dönüşüm sağlar. Yüksek seviyeli `base64` modülü de arka planda bu fonksiyonları kullanır.",
        "The `binascii` module delivers high-performance C-level conversions between binary streams and ASCII representations (Hexadecimal, Base64, Quoted-Printable). High-level modules such as `base64` rely heavily on `binascii` under the hood."
      ],
      [
        "Tersine mühendislik, zararlı yazılım analizi, bellek dökümü (hexdump) inceleme ve paket bütünlüğü doğrulama (CRC32) işlemlerinde `hexlify` ve `unhexlify` siber güvenlik araştırmacılarının elinin altındaki en hızlı araçlardır.",
        "In reverse engineering, malware analysis, memory hexdump inspection, and packet integrity validation (CRC32), `hexlify` and `unhexlify` provide essential speed and precision."
      ]
    ],
    import: R`import binascii`,
    general: [
      ["Ağ soketlerinden veya dosyalardan gelen ham baytları hex formatında ekrana yazdırma.", "Converting raw bytes from sockets or files into readable hex strings."],
      ["Dosya ve ağ paketlerinin iletim sırasında bozulup bozulmadığını kontrol eden hızlı `crc32` sağlama toplamı.", "Fast `crc32` checksumming to detect transmission errors in files and frames."],
      ["E-posta ve MIME protokollerindeki Quoted-Printable metin bloklarını çözme.", "Parsing Quoted-Printable encoded MIME payload blocks in emails."]
    ],
    cyberUse: [
      ["Shellcode ve exploit payload analizinde onaltılık gösterimi ham makine koduna (`unhexlify`) çevirme.", "Converting hex-formatted shellcode strings directly into executable binary payloads via `unhexlify`."],
      ["PCAP ağ analizinde paket başlıklarını ve bayt dizilerini hexdump formatında ayrıştırma.", "Dissecting packet headers and payload byte sequences into inspectable hexdump arrays."],
      ["Bozuk veya manipüle edilmiş dosya formatlarında (örn. PNG, ZIP) CRC32 sağlama değerlerini yeniden hesaplama ve doğrulama.", "Verifying and recalculating CRC32 chunk checksums in forensics and anti-tamper file inspection."]
    ],
    sections: [
      {
        id: "hex-conversions",
        title: ["Hexadecimal Dönüşümleri", "Hexadecimal Conversions"],
        intro: [
          "Ham baytlar ve onaltılık (hex) dizeler arasında iki yönlü hızlı çeviri.",
          "High-performance bidirectional conversions between binary bytes and hex strings."
        ],
        items: [
          {
            id: "hexlify",
            name: "binascii.hexlify(data) / b2a_hex",
            kind: "function",
            sig: "binascii.hexlify(data: bytes, sep: bytes | str = ...) -> bytes",
            sum: [
              "İkili veriyi onaltılık (hex) bayt dizisine dönüştürür.",
              "Converts binary data into a hexadecimal byte sequence."
            ],
            desc: [
              "Her baytı iki karakterlik hex karşılığına çevirir (`b'\\x01\\xff'` -> `b'01ff'`). `b2a_hex` aynı fonksiyonun takma adıdır. Python 3.8+ ile `sep` parametresi verilerek aralara boşluk veya iki nokta üst üste konabilir.",
              "Encodes each byte into two hex characters. `b2a_hex` is an alias. Python 3.8+ supports `sep` parameter for formatted spacing."
            ],
            ex: {
              code: R`import binascii

data = b"DEFENSE"
hex_bytes = binascii.hexlify(data)
print(hex_bytes.decode())`,
              out: R`444546454e5345`
            }
          },
          {
            id: "unhexlify",
            name: "binascii.unhexlify(hexstr) / a2b_hex",
            kind: "function",
            sig: "binascii.unhexlify(hexstr: bytes | str) -> bytes",
            sum: [
              "Onaltılık dizeyi ham ikili (binary) baytlara geri çözer.",
              "Decodes a hexadecimal string back into raw binary bytes."
            ],
            desc: [
              "Exploit payload'ları veya pcap hexdump analizlerinde metin halindeki hex kodlarını ham baytlara dönüştürmek için kullanılır. Girdi çift sayıda karakterden oluşmalıdır, aksi halde `binascii.Error` fırlatılır.",
              "Converts hex strings into raw bytes. Length must be an even number of hex digits; otherwise `binascii.Error` is raised."
            ],
            ex: {
              code: R`import binascii

raw = binascii.unhexlify("444546454e5345")
print(raw)`,
              out: R`b'DEFENSE'`
            },
            cyber: [
              "Saldırganlar payload'ları hex olarak gizleyebilir. `unhexlify` ile bu dizgiler açılarak string analizi ve statik imza kontrolü yapılır.",
              "Malware authors obfuscate payloads as hex strings; `unhexlify` converts them back for inspection."
            ]
          },
          {
            id: "b2a-base64",
            name: "binascii.b2a_base64(data, *, newline=True)",
            kind: "function",
            sig: "binascii.b2a_base64(data: bytes, *, newline: bool = True) -> bytes",
            sum: [
              "Veriyi Base64 formatına C hızında kodlar.",
              "Encodes binary data into Base64 representation at C speed."
            ],
            desc: [
              "Standart `base64.b64encode` fonksiyonunun altında çalışan hızlı çekirdek fonksiyondur. Varsayılan olarak sonuna bir yeni satır (`\\n`) ekler; `newline=False` ile bu kapatılabilir.",
              "Low-level engine powering Base64 encoding. Appends a newline by default unless `newline=False` is set."
            ],
            ex: {
              code: R`import binascii

b64 = binascii.b2a_base64(b"siber-guvenlik", newline=False)
print(b64.decode())`,
              out: R`c2liZXItZ3V2ZW5saWs=`
            }
          },
          {
            id: "a2b-base64",
            name: "binascii.a2b_base64(data)",
            kind: "function",
            sig: "binascii.a2b_base64(data: bytes | str) -> bytes",
            sum: [
              "Base64 veriyi ikili baytlara geri çözer.",
              "Decodes Base64 data back into raw binary bytes."
            ],
            desc: [
              "Geçersiz karakterleri ve satır sonlarını otomatik yoksayarak sağlam bir çözümleme sunar.",
              "Robust Base64 decoder ignoring trailing newlines and padding nuances gracefully."
            ],
            ex: {
              code: R`import binascii

decoded = binascii.a2b_base64("c2liZXItZ3V2ZW5saWs=")
print(decoded.decode())`,
              out: R`siber-guvenlik`
            }
          }
        ]
      },
      {
        id: "checksums-and-errors",
        title: ["Sağlama Toplamı ve Hata Yönetimi", "Checksums & Exception Handling"],
        intro: [
          "CRC32 sağlama hesaplama ve kodlama hatalarını yakalama.",
          "Computing CRC32 cyclic checks and handling conversion exceptions."
        ],
        items: [
          {
            id: "crc32",
            name: "binascii.crc32(data[, value])",
            kind: "function",
            sig: "binascii.crc32(data: bytes, value: int = 0) -> int",
            sum: [
              "Verinin 32-bit CRC (Cyclic Redundancy Check) sağlama toplamını döner.",
              "Computes a 32-bit CRC checksum of binary data."
            ],
            desc: [
              "Kriptografik bir hash DEĞİLDİR (çarpışma saldırılarına karşı korumaz). Ancak donanım ve ağ hatalarını tespit etmek için son derece hızlı bir döngüsel sağlamadır. PNG, ZIP ve Ethernet paketlerinde standarttır.",
              "NOT a cryptographic hash (not collision-resistant). However, it offers lightning-fast frame error detection standard in PNG chunks and Ethernet frames."
            ],
            ex: {
              code: R`import binascii

checksum = binascii.crc32(b"packet-payload-data")
print(f"CRC32: {checksum:#010x}")`,
              out: R`CRC32: 0x98003bcb`
            },
            cyber: [
              "CRC32 bir güvenlik kalkanı değildir; saldırganlar istedikleri CRC değerini üretecek baytları kolayca enjekte edebilir. Doğrulama ve kimlik kanıtı için SHA-256 veya HMAC kullanılmalıdır.",
              "CRC32 is not collision-resistant; attackers can easily manipulate payloads to preserve CRC32 values. Use SHA-256 or HMAC for authentic integrity."
            ]
          },
          {
            id: "crc-hqx",
            name: "binascii.crc_hqx(data, value)",
            kind: "function",
            sig: "binascii.crc_hqx(data: bytes, value: int) -> int",
            sum: [
              "16-bit CRC-CCITT sağlama toplamı hesaplar.",
              "Computes a 16-bit CRC-CCITT checksum."
            ],
            desc: [
              "Telekomünikasyon, eski dosya arşivleri ve gömülü sistem protokollerinde yaygın 16-bit sağlama yöntemidir.",
              "Standard 16-bit CRC algorithm common in telecommunications and embedded protocols."
            ],
            ex: {
              code: R`import binascii

val16 = binascii.crc_hqx(b"telecom", 0)
print(isinstance(val16, int), val16 > 0)`,
              out: R`True True`
            }
          },
          {
            id: "error",
            name: "binascii.Error",
            kind: "exception",
            sig: "binascii.Error",
            sum: [
              "Kodlama veya çözümleme hatalarında fırlatılan genel istisna.",
              "General exception raised upon decoding or encoding formatting errors."
            ],
            desc: [
              "Örneğin tek sayıda karaktere sahip bir hex dizesi `unhexlify`'a verildiğinde veya geçersiz hex karakterleri içerdiğinde tetiklenir.",
              "Raised when an odd-length hex string is passed to `unhexlify` or non-hex characters are encountered."
            ],
            ex: {
              code: R`import binascii

try:
    binascii.unhexlify("abc") # Tek sayida karakter ||| Odd length string
except binascii.Error as e:
    print("Hata yakalandi:", type(e).__name__)`,
              out: R`Hata yakalandi: Error`
            }
          },
          {
            id: "b2a-qp",
            name: "binascii.b2a_qp(data) / a2b_qp",
            kind: "function",
            sig: "binascii.b2a_qp(data: bytes, quotetabs: bool = ...) -> bytes",
            sum: [
              "Quoted-Printable formatında kodlama ve çözme yapar.",
              "Encodes and decodes Quoted-Printable email payload structures."
            ],
            desc: [
              "E-posta spam filtrelerinde veya phish analizlerinde gizlenmiş MIME e-posta içeriklerini ayrıştırmak için kullanılır.",
              "Converts email strings to/from quoted-printable format used in MIME inspection."
            ],
            ex: {
              code: R`import binascii

qp_encoded = binascii.b2a_qp(b"Parola = \xff\xfe")
print(binascii.a2b_qp(qp_encoded).startswith(b"Parola"))`,
              out: R`True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "shellcode-hexdump",
        title: [
          "Shellcode Hex Ayrıştırıcı ve Bellek Dökümü",
          "Shellcode Hex Extractor & Memory Inspector"
        ],
        sum: [
          "C dizisi halindeki shellcode hex dizesini ham baytlara çevirip NOP kızağını analiz etme.",
          "Parsing hex shellcode notation into raw binary and detecting NOP sled patterns."
        ],
        code: R`import binascii

# Tipik exploit shellcode metni: ||| Typical shellcode representation:
shellcode_hex = "9090909031c050682f2f7368682f62696e89e3505389e1b00bcd80"

# Metin halindeki hex dizisini calistirilabilir ham baytlara cevir: ||| Convert hex string to raw binary bytes:
raw_bytes = binascii.unhexlify(shellcode_hex)

print("Toplam bayt uzunlugu:", len(raw_bytes))
print("Ilk 4 bayt NOP kizagi mi (0x90):", raw_bytes[:4] == b"\x90\x90\x90\x90")
print("Icerikte sh ve bin kaliplari var mi:", b"sh" in raw_bytes and b"bin" in raw_bytes)`,
        out: R`Toplam bayt uzunlugu: 27
Ilk 4 bayt NOP kizagi mi (0x90): True
Icerikte sh ve bin kaliplari var mi: True`,
        cyber: true,
        note: [
          "Zararlı yazılım analizinde saldırganlar ikili kodları `\\x90\\x90` şeklinde yazılı belgelerde veya exploit scriptlerinde paylaşır. `unhexlify` bu dizgileri doğrudan statik analize hazır ham ikili baytlara dönüştürür.",
          "In malware forensics, payloads are frequently shared as hex representations. `unhexlify` turns them directly into raw byte arrays for disassembly."
        ]
      },
      {
        id: "png-chunk-crc-validator",
        title: [
          "PNG Dosya Parçası (Chunk) CRC32 Doğrulayıcısı",
          "PNG Chunk Integrity & Anti-Tamper CRC Checker"
        ],
        sum: [
          "PNG görsel dosyalarının parçalarını ve CRC32 sağlamasını doğrulayarak dosya manipülasyonunu tespit etme.",
          "Verifying PNG chunk headers and CRC32 checksums to uncover steganography and tampering."
        ],
        code: R`import binascii
import struct

# Ornek bir PNG IHDR parcasini simule edelim: ||| Simulate a PNG IHDR chunk:
chunk_type = b"IHDR"
chunk_data = b"\x00\x00\x01\x00\x00\x00\x01\x00\x08\x06\x00\x00\x00"
expected_crc = binascii.crc32(chunk_type + chunk_data)

def verify_png_chunk(ctype: bytes, cdata: bytes, reported_crc: int) -> bool:
    # PNG formatinda CRC, tur ve veri alaninin toplamindan hesaplanir: ||| In PNG, CRC covers type + data:
    computed = binascii.crc32(ctype + cdata)
    return computed == reported_crc

print("Orijinal chunk gecerli mi:", verify_png_chunk(chunk_type, chunk_data, expected_crc))
# Saldirgan veri kismina gizli veri (steganografi) eklerse: ||| If attacker alters bytes (steganography):
tampered_data = chunk_data[:-1] + b"\x01"
print("Tahrif edilmis chunk gecerli mi:", verify_png_chunk(chunk_type, tampered_data, expected_crc))`,
        out: R`Orijinal chunk gecerli mi: True
Tahrif edilmis chunk gecerli mi: False`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "hexlify-vs-unhexlify",
        q: [
          "`hexlify` ile `unhexlify` arasındaki yön farkı nedir?",
          "What is the difference in conversion direction between `hexlify` and `unhexlify`?"
        ],
        a: [
          "`hexlify`, ham ikili baytları (`bytes`) okunabilir onaltılık hex baytlarına dönüştürür (`b'A'` -> `b'41'`). `unhexlify` ise hex dizisini ham ikili baytlara geri açar (`'41'` -> `b'A'`).",
          "`hexlify` transforms raw binary bytes into hexadecimal notation (`b'A'` -> `b'41'`). `unhexlify` reverses hex characters back into binary bytes."
        ]
      },
      {
        id: "crc32-not-crypto",
        q: [
          "CRC32 neden parola veya veri güvenliğinde hash olarak kullanılamaz?",
          "Why cannot CRC32 be used as a security hash for passwords or authentication?"
        ],
        a: [
          "CRC32 kriptografik değildir; matematiksel olarak tersine çevrilmesi ve aynı CRC değerine sahip sahte veriler (çarpışma) üretilmesi çok kolaydır. Sadece rastgele donanım hatalarını yakalamak için tasarlanmıştır.",
          "CRC32 lacks collision resistance and one-way cryptographic properties; creating colliding payloads is trivial. It was engineered purely to detect accidental physical transmission errors."
        ]
      },
      {
        id: "unhexlify-odd-length",
        q: [
          "`binascii.unhexlify` fonksiyonuna tek sayıda karaktere sahip (örn. 'abc') bir hex string verilirse ne olur?",
          "What happens if an odd-length hex string (e.g. 'abc') is passed to `binascii.unhexlify`?"
        ],
        a: [
          "Her bir bayt iki adet hex karakterinden oluşmak zorunda olduğu için `binascii.Error: Odd-length string` istisnası fırlatılır.",
          "Since each byte requires exactly two hex characters, a `binascii.Error: Odd-length string` exception is raised."
        ]
      },
      {
        id: "binascii-vs-base64",
        q: [
          "Python'da hem `base64` hem `binascii` modüllerinde Base64 fonksiyonları vardır; aralarındaki ilişki nedir?",
          "Both `base64` and `binascii` provide Base64 methods; what is the relationship between them?"
        ],
        a: [
          "`binascii`, doğrudan C uzantısı ile yazılmış en temel ve en hızlı çekirdektir (`b2a_base64`). `base64` modülü ise bu çekirdeğin üzerine kurulu, URL-safe Base64 gibi kolaylıklar sağlayan yüksek seviyeli bir arayüzdür.",
          "`binascii` is the underlying low-level C extension module providing raw conversion primitives. `base64` is a higher-level Python wrapper adding conveniences such as urlsafe variants."
        ]
      },
      {
        id: "b2a-hex-alias",
        q: [
          "`binascii.b2a_hex` ile `binascii.hexlify` arasında bir performans veya işlev farkı var mıdır?",
          "Is there any functional or performance difference between `binascii.b2a_hex` and `binascii.hexlify`?"
        ],
        a: [
          "Hayır, ikisi tamamen aynı C fonksiyonunu işaret eden eşanlamlı (alias) fonksiyonlardır.",
          "No, they are exact aliases pointing to the identical underlying C implementation."
        ]
      }
    ]
  });
})();

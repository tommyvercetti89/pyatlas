(function () {
  const R = String.raw;
  PY.addLib({
    id: "struct",
    name: "struct",
    sym: "st",
    color: "#6366f1",
    focus: "cyber",
    level: 3,
    ext: false,
    cat: "network",
    docs: "https://docs.python.org/3/library/struct.html",
    tagline: [
      "İkili veri paketleme ve açma: C yapıları, ağ paket başlıkları ve dosya büyü baytları.",
      "Binary packing and unpacking: C structs, network packet headers, and magic bytes."
    ],
    analogy: [
      "Python tamsayıları ve metinleri soyut nesnelerdir. Bir ağ kablosundan veya disk sektöründen geçen veri ise sadece ham 1'ler ve 0'lardan oluşan baytlardır. `struct` modülü, Python nesnelerini C dili tarzında donanımın anladığı ham baytlara paketleyen (`pack`) ve ham baytları tekrar Python nesnelerine çözen (`unpack`) bir ikili tercümandır.",
      "Python numbers and objects are high-level abstractions, whereas hardware network cables and disk sectors only know raw byte arrays. The `struct` module is a binary translator, packing Python integers and strings into packed C memory structs (`pack`) and unmarshalling them back (`unpack`)."
    ],
    intro: [
      [
        "`struct` modülü, Python değerleri ile C yapıları (struct) olarak temsil edilen bayt dizileri arasında çift yönlü dönüşüm yapar. Format dizgileri (`!HHI`) kullanarak bayt sıralamasını (endianness) ve veri tiplerini belirler.",
        "The `struct` module performs conversions between Python values and C structs represented as Python `bytes` objects, driven by format strings (`!HHI`) governing data types and byte order."
      ],
      [
        "Düşük seviyeli siber güvenlikte ve zararlı yazılım analizinde vazgeçilmezdir: ham IP/TCP/UDP başlıklarını elle ayrıştırmak, PE/ELF çalıştırılabilir dosya başlıklarını okumak (magic bytes) ve özel binary exploit payload'ları inşa etmek `struct` ile gerçekleştirilir.",
        "In low-level security and binary analysis, `struct` is essential: parsing raw IP/TCP packet headers, inspecting PE/ELF binary headers (magic numbers), and framing custom protocol frames."
      ]
    ],
    import: R`import struct`,
    general: [
      [
        "C veya C++ ile yazılmış programlarla paylaşılan bellek veya soketler üzerinden ham ikili veri alışverişi yapmak.",
        "Exchanging packed binary structs with C/C++ applications across shared memory or sockets."
      ],
      [
        "PNG, WAV, ZIP gibi dosya formatlarının ikili başlıklarını (header) okuyup doğrulamak.",
        "Parsing and validating binary headers in media and archive formats (PNG, WAV, ZIP)."
      ],
      [
        "Ağ protokollerinde bayt sırasını (Big-Endian vs Little-Endian) yönetmek.",
        "Controlling byte order (Big-Endian vs Little-Endian) across network protocols."
      ]
    ],
    cyberUse: [
      [
        "Ham soketlerden (raw sockets) yakalanan ağ paketlerinin IP ve TCP başlıklarını ayrıştırmak.",
        "Dissecting raw Ethernet, IP, and TCP packet headers captured from network taps."
      ],
      [
        "Dosya tipi tespiti: Dosyaların ilk birkaç baytını (Magic Bytes: PE için `MZ`, ELF için `\\x7fELF`) okuyarak uzantı yanıltmacalarını tespit etmek.",
        "Extracting file magic numbers to verify true file types regardless of spoofed extensions."
      ],
      [
        "Ağ bayt sırasını (`!`: Big-Endian) kullanarak 16-bit port numaralarını ve 32-bit sıra numaralarını paketlemek.",
        "Encoding network port numbers and sequence fields using network byte order (`!`)."
      ]
    ],
    sections: [
      {
        id: "packing-unpacking",
        title: ["Paketleme ve Çözme Fonksiyonları", "Packing & Unpacking Functions"],
        intro: [
          "Python tiplerini baytlara dönüştüren ve baytlardan Python tiplerini çıkaran ana metodlar.",
          "Core functions transforming Python types into packed bytes and vice versa."
        ],
        items: [
          {
            id: "pack",
            name: "struct.pack(format, v1, v2, ...)",
            kind: "function",
            sig: "struct.pack(format, v1, v2, ...) -> bytes",
            sum: [
              "Python değerlerini belirtilen format kuralına göre ikili `bytes` nesnesine paketler.",
              "Packs values according to format string into a binary `bytes` object."
            ],
            desc: [
              "Verilen argümanları (`v1, v2...`) format karakterlerine göre dönüştürür. Örneğin `!H` 16-bitlik bir işaretsiz tamsayıyı (port numarası gibi) tam olarak 2 baytlık ağ sıralı baytlara paketler.",
              "Packs Python values into raw bytes matching format layout. For example, `!H` packs a 16-bit unsigned integer into 2 network-order bytes."
            ],
            params: [
              { n: "format", d: ["Format dizgesi (örn: `'!H'`, `'<I'`, `'4s'`).", "Format string specifying byte layout and endianness."] },
              { n: "v1, v2...", d: ["Paketlenecek Python değerleri.", "Values corresponding to the format specifiers."] }
            ],
            ret: ["Paketlenmiş ham `bytes` nesnesi.", "Packed raw `bytes` object."],
            ex: {
              code: R`import struct

# 2 baytlik port (80) ve 4 baytlik sayi paketle ||| Pack 2-byte port and 4-byte int
packed = struct.pack("!HI", 80, 1000)
print(len(packed))
print(packed.hex())`,
              out: R`6
0050000003e8`
            }
          },
          {
            id: "unpack",
            name: "struct.unpack(format, buffer)",
            kind: "function",
            sig: "struct.unpack(format, buffer) -> tuple",
            sum: [
              "İkili bayt tamponunu format kuralına göre ayrıştırıp bir demet (tuple) döner.",
              "Unpacks binary buffer according to format string into a Python tuple."
            ],
            desc: [
              "Ham baytları çözerek orijinal Python değerlerini içeren bir demet döner. Tek bir değer bile çözülse her zaman bir elemanlı demet (`(val,)`) döner.",
              "Unmarshals raw binary buffers into a tuple of Python values. Always returns a tuple even when unpacking a single field."
            ],
            params: [
              { n: "format", d: ["Format dizgesi.", "Format string describing structure layout."] },
              { n: "buffer", d: ["Tam olarak `calcsize(format)` uzunluğunda bayt verisi.", "Bytes buffer of exact length matching `calcsize(format)`."] }
            ],
            ret: ["Çözülen değerlerin demeti (`tuple`).", "Tuple of unpacked values."],
            ex: {
              code: R`import struct

raw = bytes.fromhex("0050000003e8")
port, num = struct.unpack("!HI", raw)
print(f"Port: {port}, Num: {num}")`,
              out: R`Port: 80, Num: 1000`
            }
          },
          {
            id: "calcsize",
            name: "struct.calcsize(format)",
            kind: "function",
            sig: "struct.calcsize(format) -> int",
            sum: [
              "Verilen format dizgesinin kaç bayt yer kapladığını hesaplar.",
              "Calculates the byte size of the struct corresponding to the format string."
            ],
            desc: [
              "Soketten veya dosyadan kaç bayt okumanız (`recv` veya `read`) gerektiğini önceden bilmek için kullanılır.",
              "Returns total byte length required for format. Essential for determining how many bytes to read from a socket or file."
            ],
            params: [
              { n: "format", d: ["Format dizgesi.", "Format layout string."] }
            ],
            ret: ["Bayt uzunluğu tamsayısı (`int`).", "Byte length integer (`int`)."],
            ex: {
              code: R`import struct

# IP Basligi: 20 bayt ||| IPv4 standard header: 20 bytes
ip_header_format = "!BBHHHBBH4s4s"
print("IP Header Boyutu:", struct.calcsize(ip_header_format))`,
              out: R`IP Header Boyutu: 20`
            }
          },
          {
            id: "unpack-from",
            name: "struct.unpack_from(format, buffer, offset=0)",
            kind: "function",
            sig: "struct.unpack_from(format, buffer, offset=0) -> tuple",
            sum: [
              "Büyük bir bayt tamponunun belirli bir ofsetinden itibaren veri çözer.",
              "Unpacks from buffer starting at specific offset without slicing."
            ],
            desc: [
              "Büyük bir ağ paketinde veya dosya tamponunda yeni bir dilim (`buffer[offset:]`) oluşturmadan, doğrudan bellek ofsetinden okuma yapar. Bellek ve hız tasarrufu sağlar.",
              "Reads struct fields from larger buffers at given offset directly without creating intermediate sliced copies in memory."
            ],
            params: [
              { n: "format", d: ["Format kuralı.", "Format string."] },
              { n: "buffer", d: ["Bayt tamponu.", "Source buffer."] },
              { n: "offset", d: ["Başlangıç bayt konumu (varsayılan 0).", "Byte offset to begin reading from (defaults to 0)."] }
            ],
            ex: {
              code: R`import struct

data = b"PAD_DATA\x00\x16\x00\x00"  # Ofset 8'de 22 (0x0016) portu var ||| Port 22 at offset 8
port, = struct.unpack_from("!H", data, offset=8)
print("Port:", port)`,
              out: R`Port: 22`
            }
          }
        ]
      },
      {
        id: "format-specifiers",
        title: ["Format Karakterleri ve Bayt Sırası (Endianness)", "Format Specifiers & Endianness"],
        intro: [
          "Format karakterleri (`B, H, I, Q, s`) ve bayt sırası ön ekleri (`!, <, >`).",
          "Understanding type characters and endianness modifiers."
        ],
        items: [
          {
            id: "endianness-prefixes",
            name: "Bayt Sırası: ! (Network) / < (Little) / > (Big)",
            kind: "concept",
            sig: "! = Network (Big-Endian), < = Little-Endian, > = Big-Endian",
            sum: [
              "İkili verinin en anlamlı baytının başta mı sonda mı olacağını belirler.",
              "Specifies whether most-significant byte precedes or succeeds in memory."
            ],
            desc: [
              "`!` veya `>`: Big-Endian (Ağ Bayt Sırası). En yüksek değerlikli bayt en başta yer alır. İnternet protokollerinin (TCP/IP) evrensel standardıdır.\n`<`: Little-Endian. En düşük değerlikli bayt başta yer alır. Intel/AMD x86-64 işlemcilerin ve Windows/Linux işletim sistemlerinin yerel bellek standardıdır.",
              "`!` or `>` enforces Network Byte Order (Big-Endian), standard across TCP/IP.\n`<` enforces Little-Endian, the native memory format of x86/x64 processors."
            ],
            ex: {
              code: R`import struct

val = 0x1234
print("Big-Endian   (!):", struct.pack("!H", val).hex())
print("Little-Endian (<):", struct.pack("<H", val).hex())`,
              out: R`Big-Endian   (!): 1234
Little-Endian (<): 3412`
            },
            cyber: [
              "Siber güvenlikte ağdan gelen paketler daima Big-Endian (`!`), bellekten ve binary dosyalardan (EXE/PE) okunan adresler ise neredeyse her zaman Little-Endian (`<`) formatındadır.",
              "In security analysis, network packets require Big-Endian (`!`), while binary exploitation and memory dumps inspect Little-Endian (`<`) x86 pointers."
            ]
          },
          {
            id: "type-chars",
            name: "Temel Tip Karakterleri: B, H, I, Q, s",
            kind: "concept",
            sig: "B=1B uint8, H=2B uint16, I=4B uint32, Q=8B uint64, s=char[]",
            sum: [
              "`B` (1 bayt), `H` (2 bayt), `I` (4 bayt), `Q` (8 bayt) ve `s` (bayt dizesi).",
              "`B` (1-byte uint), `H` (2-byte uint), `I` (4-byte uint), `Q` (8-byte uint), `s` (byte array)."
            ],
            desc: [
              "`B`: unsigned char (0-255, 1 bayt)\n`H`: unsigned short (0-65535, 2 bayt, port numaraları)\n`I`: unsigned int (0-4.2 milyar, 4 bayt, IPv4 ve sıra numaraları)\n`Q`: unsigned long long (8 bayt, 64-bit bellek adresleri)\n`4s`: 4 baytlık sabit karakter dizisi (magic bytes gibi)",
              "`B`: 1-byte unsigned char\n`H`: 2-byte unsigned short (ports)\n`I`: 4-byte unsigned int (IPv4, seq numbers)\n`Q`: 8-byte unsigned long long (64-bit pointers)\n`Ns`: N-byte fixed byte string"
            ],
            ex: {
              code: R`import struct

# Magic header ve sürüm: 4 bayt string, 1 bayt majör, 1 bayt minör ||| Magic header + versions
raw = struct.pack("!4sBB", b"TEST", 1, 4)
magic, maj, min_ver = struct.unpack("!4sBB", raw)
print(magic.decode(), maj, min_ver)`,
              out: R`TEST 1 4`
            }
          },
          {
            id: "struct-class",
            name: "struct.Struct(format)",
            kind: "class",
            sig: "struct.Struct(format)",
            sum: [
              "Format dizgesini bir kez derleyip tekrar tekrar hızlıca çalıştıran nesne.",
              "Precompiled struct layout object for high-throughput packet processing."
            ],
            desc: [
              "Döngü içinde milyonlarca paket işlerken `struct.pack` her defasında formatı baştan ayrıştırmak zorunda kalır. `Struct` nesnesi formatı önceden derler ve performansı %20-30 oranında artırır.",
              "Precompiles the format string, eliminating repetitive parsing overhead in high-velocity packet inspection loops."
            ],
            ret: ["Derlenmiş `struct.Struct` nesnesi.", "Compiled `struct.Struct` instance."],
            ex: {
              code: R`import struct

s = struct.Struct("!HHI")
print(s.size)
packed = s.pack(80, 443, 1000)
print(s.unpack(packed))`,
              out: R`8
(80, 443, 1000)`
            }
          },
          {
            id: "struct-error",
            name: "struct.error",
            kind: "exception",
            sig: "struct.error",
            sum: [
              "Tampon boyutu uyuşmazlığında veya geçersiz argümanda fırlatılan hata.",
              "Exception raised on buffer size mismatch or invalid range arguments."
            ],
            desc: [
              "`unpack` çağrılan bayt verisinin uzunluğu formatın beklediği `calcsize` ile tam olarak örtüşmüyorsa fırlatılır. Eksik veya kesilmiş paketleri yakalamak için kullanılır.",
              "Raised when the buffer length does not exactly match `calcsize(format)` or values exceed numeric limits."
            ],
            ex: {
              code: R`import struct

try:
    # 4 bayt beklerken sadece 2 bayt verelim ||| Provide 2 bytes when 4 are required
    struct.unpack("!I", b"\x00\x01")
except struct.error as e:
    print("HATA_YAKALANDI: Tampon boyutu yetersiz")`,
              out: R`HATA_YAKALANDI: Tampon boyutu yetersiz`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "pe-magic-checker",
        title: [
          "Çalıştırılabilir Dosya (PE/EXE) Başlık Dedektörü",
          "Portable Executable (PE/EXE) Header Verifier"
        ],
        sum: [
          "Bir dosyanın gerçekte Windows PE (EXE/DLL) dosyası olup olmadığını ilk baytlarından anlama.",
          "Verifying whether an uploaded file is actually a Windows PE binary by parsing headers."
        ],
        code: R`import struct

# Sahte bir dosya basligi: 'MZ' (0x5A4D) ile baslar ||| Mock header starting with 'MZ'
fake_exe = b"MZ" + b"\x90\x00\x03\x00\x00\x00\x04\x00"

# Ilk 2 bayti '2s' olarak oku ||| Read first 2 bytes as '2s'
magic, = struct.unpack_from("2s", fake_exe, 0)
if magic == b"MZ":
    print("DURUM: Gecerli Windows Calistirilabilir Dosyasi (MZ)")
else:
    print("DURUM: Calistirilabilir dosya degil")`,
        out: R`DURUM: Gecerli Windows Calistirilabilir Dosyasi (MZ)`,
        cyber: true,
        note: [
          "Saldırganlar zararlı EXE dosyalarını `.jpg` veya `.pdf` olarak yeniden adlandırabilir. Dosya uzantısına güvenmek yerine `struct` ile ilk baytları (magic bytes) okumak kesin tespit sağlar.",
          "Attackers mask malicious EXEs with fake extensions (`.jpg`). Checking binary magic headers using `struct` reveals the true underlying file format."
        ]
      },
      {
        id: "parse-tcp-header",
        title: [
          "Ham TCP Paket Başlığı Ayrıştırıcı",
          "Raw TCP Header Dissector"
        ],
        sum: [
          "20 baytlık ham TCP başlığından Kaynak Port, Hedef Port ve Bayrakları çıkarma.",
          "Extracting Source Port, Destination Port, and TCP Control Flags from a 20-byte raw header."
        ],
        code: R`import struct

# 20 baytlik ornek TCP basligi paketle: ||| Construct 20-byte sample TCP header:
# Kaynak: 54321, Hedef: 80, SiraNo: 100, AckNo: 0, Ofset+Bayraklar: 0x5002 (SYN)
sample_tcp = struct.pack("!HHIIHHHH", 54321, 80, 100, 0, 0x5002, 64240, 0, 0)

# TCP Basligini ayristir: !HHIIHHHH (20 bayt) ||| Dissect TCP Header
src_port, dst_port, seq, ack, flags_raw, win, chk, urg = struct.unpack("!HHIIHHHH", sample_tcp)
is_syn = bool(flags_raw & 0x0002)

print(f"Kaynak Port: {src_port} -> Hedef Port: {dst_port}")
print(f"SYN Bayragi Aktif mi: {is_syn}")`,
        out: R`Kaynak Port: 54321 -> Hedef Port: 80
SYN Bayragi Aktif mi: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "endianness-exclamation-mark",
        q: [
          "`struct` format dizgelerinin başındaki `!` işareti ne anlama gelir ve ağda neden zorunludur?",
          "What does the leading `!` signify in `struct` format strings and why is it mandatory in networking?"
        ],
        a: [
          "`!` işareti 'Ağ Bayt Sırası'nı (Network Byte Order = Big-Endian) zorunlu kılar. İnternet standartlarına göre IP, TCP, UDP başlıklarındaki tüm çok baytlı sayılar Big-Endian iletilmek zorundadır.",
          "`!` enforces Network Byte Order (Big-Endian). RFC standards mandate that all multi-byte header integers across IP, TCP, and UDP must be transmitted Big-Endian."
        ]
      },
      {
        id: "calcsize-purpose",
        q: [
          "`struct.calcsize()` fonksiyonu ne işe yarar?",
          "What is the utility of `struct.calcsize()`?"
        ],
        a: [
          "Verilen format kuralının toplamda tam olarak kaç bayt üreteceğini veya beklediğini tamsayı olarak hesaplar. Soketten kaç bayt okunacağını bilmek için gereklidir.",
          "Computes the exact byte length that a given format string occupies, indispensable for issuing exact `recv(n)` socket reads."
        ]
      },
      {
        id: "unpack-from-vs-unpack",
        q: [
          "Büyük bir ağ paketinde neden `unpack(fmt, data[offset:])` yerine `unpack_from(fmt, data, offset)` tercih edilmelidir?",
          "Why prefer `unpack_from(fmt, data, offset)` over `unpack(fmt, data[offset:])` on large network packets?"
        ],
        a: [
          "Dilimleme (`data[offset:]`) bellekte yeni bir bayt kopyası oluşturur ve yavaştır. `unpack_from` ise mevcut tamponun doğrudan belirtilen ofsetine bakar ve bellek kopyalaması yapmaz.",
          "Slicing (`data[offset:]`) allocates a brand-new byte copy in RAM. `unpack_from` reads directly at the target memory offset with zero-copy performance."
        ]
      },
      {
        id: "unpack-tuple-return",
        q: [
          "`struct.unpack('!H', data)` tek bir port numarası çözüyor olsa bile dönüş değeri neden demettir (`tuple`)?",
          "Why does `struct.unpack('!H', data)` return a tuple even when unpacking a single port field?"
        ],
        a: [
          "Çünkü `struct.unpack` her zaman tutarlı olarak bir `tuple` döndürür. Tek bir değeri değişkenine doğrudan almak için virgüllü atama (`port, = struct.unpack(...)`) kullanılır.",
          "Because `unpack()` API contract strictly always returns a tuple. Unpack it into a scalar using single-element tuple unpacking: `port, = struct.unpack(...)`."
        ]
      },
      {
        id: "magic-bytes-definition",
        q: [
          "Siber güvenlikte 'Sihirli Baytlar' (Magic Bytes) nedir?",
          "What are 'Magic Bytes' in cyber security?"
        ],
        a: [
          "Bir dosyanın en başında (ofset 0) yer alan ve dosyanın gerçek biçimini (EXE için `MZ`, ELF için `\x7fELF`, PDF için `%PDF`) belirten sabit imza baytlarıdır. Saldırganların sahte dosya uzantılarını tespit etmeyi sağlar.",
          "Constant signature bytes located at byte offset 0 identifying true file type (e.g. `MZ` for Windows PE, `\x7fELF` for Linux binaries, `%PDF` for PDF documents), defeating extension spoofing."
        ]
      }
    ]
  });
})();

(function () {
  const R = String.raw;
  PY.addLib({
    id: "builtins",
    name: "builtins (Temel Tipler)",
    sym: "{}",
    color: "#6366f1",
    focus: "both",
    level: 1,
    ext: false,
    cat: "basics",
    docs: "https://docs.python.org/3/library/functions.html",
    tagline: [
      "Python'ın kalbi: Dahili fonksiyonlar, metin/liste/sözlük metodları, bayt işlemleri ve temel sözdizimi.",
      "The core of Python: Built-in functions, string/list/dict methods, bytes, and language fundamentals."
    ],
    analogy: [
      "Python dilinin ana alet çantasıdır. Hiçbir kütüphaneyi `import` etmeden bile elinin altında hazır bulunan tornavidalar (len, print, range), çekiçler (str, int, list, dict) ve güvenlik için ham bayt (`bytes`, `hex`) dönüştürücüleridir. Python'da yeni bir şey inşa etmeden önce bu aletlerin her birini gözün kapalı kullanabilmelisin.",
      "The primary Swiss Army knife of Python. Even without importing anything, you have instant access to essential tools (`len`, `print`, `range`), core data containers (`str`, `list`, `dict`), and low-level binary converters (`bytes`, `hex`). Master these first to build confidence."
    ],
    intro: [
      [
        "`builtins`, Python yorumlayıcısının başlar başlamaz belleğe yüklediği yerleşik fonksiyonları, temel veri tiplerini ve istisna sınıflarını içerir. Herhangi bir `import` gerektirmeden doğrudan her dosyada kullanılabilirler.",
        "The `builtins` namespace contains all built-in functions, primitive data types, and core exception classes automatically loaded at Python startup without requiring import statements."
      ],
      [
        "Uzun zamandır Python kodlamadıysanız veya kütüphanelerin karmaşıklığı gözünüzü korkutuyorsa bu sayfa sizin 'ısınma turunuzdur'. Metin parçalamadan (`split`, `join`), bayt manipülasyonuna (`bytes.fromhex`), sözlük güvenliğinden (`dict.get`) liste üreteçlerine (comprehension) kadar her şey burada somutlaşır.",
        "If you haven't coded in a while or feel intimidated by complex APIs, this module is your complete refresher course: string slicing, binary conversions, dictionary safety, and list comprehensions."
      ]
    ],
    import: R`# builtins fonksiyonlari doğrudan kullanilir, import gerekmez ||| Built-ins are always globally available`,
    general: [
      [
        "Metinleri temizlemek, parçalamak ve biçimlendirmek (`split`, `join`, `strip`, `replace`).",
        "Cleaning, tokenizing, and interpolating text data (`split`, `join`, `strip`)."
      ],
      [
        "Listeler, sözlükler ve kümeler üzerinde döngü kurmak (`enumerate`, `zip`, `dict.items`).",
        "Iterating over collections seamlessly with `enumerate`, `zip`, and `dict.items`."
      ],
      [
        "Dosyaları güvenli bağlam yöneticisi ile açıp kapatmak (`with open(...)`).",
        "Opening and safely closing file handles with context managers (`with open`)."
      ]
    ],
    cyberUse: [
      [
        "Hex dizelerini ham baytlara çevirmek (`bytes.fromhex`), ağ paket payload'ları ve zararlı analizinde bayt incelemek.",
        "Converting hex strings to binary payloads via `bytes.fromhex` and inspecting byte values."
      ],
      [
        "Sözlüklerde `KeyError` çökmesini önlemek için `dict.get(key, default)` kullanarak güvenli veri ayıklamak.",
        "Preventing `KeyError` crashes when parsing inconsistent API/log records using `dict.get`."
      ],
      [
        "Parola veya kural listelerinde `all()` ve `any()` fonksiyonları ile çoklu güvenlik doğrulama kontrolleri yapmak.",
        "Enforcing multi-rule security and password complexity checks with `all()` and `any()`."
      ]
    ],
    sections: [
      {
        id: "built-in-funcs",
        title: ["Temel Dahili Fonksiyonlar", "Core Built-in Functions"],
        intro: [
          "Python'da her gün kullanılan vazgeçilmez temel fonksiyonlar.",
          "Everyday built-in functions for inspection, iteration, and mapping."
        ],
        items: [
          {
            id: "len",
            name: "len(s)",
            kind: "function",
            sig: "len(s) -> int",
            sum: [
              "Bir dizinin, metnin, listenin veya sözlüğün eleman sayısını (uzunluğunu) döner.",
              "Returns the number of items in a container or string length."
            ],
            desc: [
              "Metinlerde karakter sayısını, baytlarda bayt sayısını, listelerde eleman sayısını verir. Kriptografide hash uzunluğunu veya anahtar boyutunu teyit etmek için sıkça kullanılır.",
              "Returns the element count of sequences or collections. Widely used to verify hash and token lengths."
            ],
            ex: {
              code: R`print(len("pyatlas"))
print(len([10, 20, 30]))
print(len(b"\x00\x01\x02"))`,
              out: R`7
3
3`
            }
          },
          {
            id: "range",
            name: "range(stop) / range(start, stop, step)",
            kind: "function",
            sig: "range(stop) / range(start, stop[, step])",
            sum: [
              "Belirli bir aralıkta sıralı tamsayılar üreten verimli bir jeneratör döner.",
              "Represents an immutable sequence of numbers, commonly used for looping."
            ],
            desc: [
              "Bellekte tüm sayıları bir anda oluşturmaz; döngü ilerledikçe sıradaki sayıyı üretir. Port aralıklarını (örn: `range(20, 26)`) döngüye sokarken kullanılır.",
              "Generates numbers on the fly without memory overhead, ideal for iterating over port ranges."
            ],
            ex: {
              code: R`ports = list(range(21, 25))
print(ports)`,
              out: R`[21, 22, 23, 24]`
            }
          },
          {
            id: "enumerate",
            name: "enumerate(iterable, start=0)",
            kind: "function",
            sig: "enumerate(iterable, start=0) -> Iterator[(index, value)]",
            sum: [
              "Döngüde hem elemanın sırasını (indeks) hem de elemanın kendisini birlikte verir.",
              "Returns an enumerate object yielding (index, value) pairs during iteration."
            ],
            desc: [
              "Manuel `i = 0; i += 1` sayacı tutma ihtiyacını tamamen ortadan kaldırır.",
              "Eliminates manual index counter tracking in loops."
            ],
            ex: {
              code: R`hedefler = ["10.0.0.1", "10.0.0.2"]
for i, ip in enumerate(hedefler, start=1):
    print(f"#{i}: {ip}")`,
              out: R`#1: 10.0.0.1
#2: 10.0.0.2`
            }
          },
          {
            id: "zip",
            name: "zip(*iterables)",
            kind: "function",
            sig: "zip(*iterables, strict=False) -> Iterator[tuple]",
            sum: [
              "Birden fazla listeyi veya diziyi paralel olarak birleştirip demetler üretir.",
              "Aggregates elements from each of the iterables in parallel."
            ],
            desc: [
              "İki ayrı listeyi (örn: IP listesi ile Port listesi) birebir eşleştirmek için kullanılır.",
              "Pairs up elements from multiple sequences into tuples."
            ],
            ex: {
              code: R`hosts = ["web", "db"]
ports = [80, 5432]
for h, p in zip(hosts, ports):
    print(f"{h}:{p}")`,
              out: R`web:80
db:5432`
            }
          },
          {
            id: "isinstance",
            name: "isinstance(object, classinfo)",
            kind: "function",
            sig: "isinstance(object, classinfo) -> bool",
            sum: [
              "Bir nesnenin belirtilen sınıftan veya türden olup olmadığını doğrular.",
              "Checks if an object is an instance or subclass of a class or tuple of classes."
            ],
            desc: [
              "Girdi doğrulamasında tip kontrolü için `type(x) == int` yerine her zaman `isinstance(x, int)` tercih edilmelidir.",
              "The recommended method for type verification, correctly accounting for inheritance."
            ],
            ex: {
              code: R`val = 100
print(isinstance(val, int))
print(isinstance("metin", (int, str)))`,
              out: R`True
True`
            }
          },
          {
            id: "any-all",
            name: "any() ve all()",
            kind: "function",
            sig: "any(iterable) -> bool, all(iterable) -> bool",
            sum: [
              "`any()` en az bir eleman doğruysa, `all()` ise tüm elemanlar doğruysa True döner.",
              "`any()` returns True if any element is true; `all()` returns True if all elements are true."
            ],
            desc: [
              "Parola kurallarını teyit ederken veya yasaklı kelime denetiminde kullanılır.",
              "Convenience boolean operators over sequences, useful for rule validations."
            ],
            ex: {
              code: R`pw = "Admin123"
kurallar = [len(pw) >= 8, any(c.isupper() for c in pw), any(c.isdigit() for c in pw)]
print("Parola Guclu mu:", all(kurallar))`,
              out: R`Parola Guclu mu: True`
            }
          }
        ]
      },
      {
        id: "string-methods",
        title: ["Metin (str) Metodları ve Ayıklama", "String (str) Methods & Parsing"],
        intro: [
          "Log satırlarını parçalama, temizleme, değiştirme ve kontrol etme metodları.",
          "Essential string manipulation methods for log parsing and text sanitation."
        ],
        items: [
          {
            id: "str-split",
            name: "str.split(sep=None, maxsplit=-1)",
            kind: "method",
            sig: "str.split(sep=None, maxsplit=-1) -> list[str]",
            sum: [
              "Metni belirtilen ayırıcıya göre bölüp bir kelime listesi döner.",
              "Splits a string by separator delimiter into a list of substrings."
            ],
            desc: [
              "Parametre verilmezse tüm boşluk ve sekme karakterlerine göre böler. Log satırlarını alanlara ayırmada en çok kullanılan metoddur.",
              "Splits by whitespace by default. Ideal for parsing whitespace-delimited server logs."
            ],
            ex: {
              code: R`log = "192.168.1.1 GET /index.html 200"
parcalar = log.split()
print("IP:", parcalar[0], "| Durum:", parcalar[3])`,
              out: R`IP: 192.168.1.1 | Durum: 200`
            }
          },
          {
            id: "str-join",
            name: "str.join(iterable)",
            kind: "method",
            sig: "str.join(iterable) -> str",
            sum: [
              "Bir liste dolusu metni belirtilen ayırıcıyla tek bir metin dizesinde birleştirir.",
              "Concatenates an iterable of strings using the caller string as the delimiter."
            ],
            desc: [
              "`+` ile döngüde metin birleştirmek yavaştır; `','.join(liste)` hem hızlı hem de standart yoldur.",
              "Memory-efficient and standard way to assemble string collections."
            ],
            ex: {
              code: R`ipleri = ["10.0.0.1", "10.0.0.2", "10.0.0.3"]
csv = ",".join(ipleri)
print(csv)`,
              out: R`10.0.0.1,10.0.0.2,10.0.0.3`
            }
          },
          {
            id: "str-strip",
            name: "str.strip([chars])",
            kind: "method",
            sig: "str.strip([chars]) -> str",
            sum: [
              "Metnin başındaki ve sonundaki boşlukları ve yeni satır (`\\n`) karakterlerini siler.",
              "Removes leading and trailing whitespace and newline characters."
            ],
            desc: [
              "Dosyadan satır satır okurken her satırın sonundaki `\\n` karakterini temizlemek için `line.strip()` zorunludur.",
              "Essential when reading lines from files to strip trailing newline markers."
            ],
            ex: {
              code: R`ham = "   admin \n\r"
print(f"'{ham.strip()}'")`,
              out: R`'admin'`
            }
          },
          {
            id: "str-encode-decode",
            name: "str.encode() / bytes.decode()",
            kind: "method",
            sig: "str.encode(encoding='utf-8') -> bytes, bytes.decode(encoding='utf-8') -> str",
            sum: [
              "Metin (`str`) ile ikili ağ/dosya baytları (`bytes`) arasında çift yönlü dönüşüm.",
              "Converts between Unicode strings and binary raw bytes."
            ],
            desc: [
              "Sokete veya dosyaya ham bayt göndermeden önce `.encode('utf-8')` çağrılır; soketten okunan veri ise `.decode('utf-8')` ile metne çevrilir.",
              "The bridge between Unicode text and network wire bytes."
            ],
            ex: {
              code: R`metin = "pyatlas"
b = metin.encode("utf-8")
print(type(b).__name__, b)
print(b.decode("utf-8"))`,
              out: R`bytes b'pyatlas'
pyatlas`
            }
          }
        ]
      },
      {
        id: "bytes-manipulation",
        title: ["İkili Veri (bytes & bytearray)", "Binary Data (bytes & bytearray)"],
        intro: [
          "Kriptografi ve ağ analizinde ham bayt dönüşümleri (`hex`, `fromhex`).",
          "Low-level binary conversions essential for cryptography and packet forensics."
        ],
        items: [
          {
            id: "bytes-hex",
            name: "bytes.hex() / bytes.fromhex()",
            kind: "method",
            sig: "bytes.hex() -> str, bytes.fromhex(string) -> bytes",
            sum: [
              "Baytları onaltılık (hex) metne ve onaltılık metni baytlara dönüştürür.",
              "Converts raw bytes to hex string and hex string to raw bytes."
            ],
            desc: [
              "Shellcode dizilerini, hash çıktılarını veya ikili paket verilerini incelemenin en doğrudan yoludur.",
              "The premier utility for working with hex representations of binary data."
            ],
            ex: {
              code: R`b = b"\xde\xad\xbe\xef"
hex_str = b.hex()
print("Hex:", hex_str)
print("Geri donus:", bytes.fromhex(hex_str) == b)`,
              out: R`Hex: deadbeef
Geri donus: True`
            },
            cyber: [
              "Zararlı yazılım analizinde ve exploit geliştirmede hex kodlu bayt dizileri `bytes.fromhex('41414141')` ile oluşturulur.",
              "Binary payloads and shellcode sequences are routinely unpacked using `bytes.fromhex`."
            ]
          },
          {
            id: "bytearray-class",
            name: "bytearray(source)",
            kind: "class",
            sig: "bytearray(source) -> bytearray",
            sum: [
              "Değiştirilebilir (mutable) bayt dizisi nesnesi.",
              "A mutable sequence of integers in the range 0 <= x < 256."
            ],
            desc: [
              "`bytes` nesnesi değiştirilemezdir (immutable). Bir baytın değerini doğrudan yerinde değiştirmek (in-place XOR veya payload yaması) istediğinizde `bytearray` kullanılır.",
              "Unlike immutable `bytes`, `bytearray` allows in-place mutation of individual bytes."
            ],
            ex: {
              code: R`ba = bytearray(b"AAAA")
ba[0] = 66  # 'B' harfi ||| Mutate first byte to 'B'
print(ba.decode())`,
              out: R`BAAA`
            }
          }
        ]
      },
      {
        id: "dict-list-methods",
        title: ["Sözlük (dict) ve Liste (list) Yönetimi", "Dict & List Data Structures"],
        intro: [
          "Sözlüklerde güvenli erişim (`get`), liste ekleme ve sıralama.",
          "Dictionary lookup safety and list manipulation."
        ],
        items: [
          {
            id: "dict-get",
            name: "dict.get(key, default=None)",
            kind: "method",
            sig: "dict.get(key, default=None) -> Any",
            sum: [
              "Anahtarı sözlükte arar; yoksa hata vermez, sessizce default değer döner.",
              "Retrieves value for key if present, otherwise returns default without throwing KeyError."
            ],
            desc: [
              "`d[k]` bulunamadığında programı çökerten `KeyError` fırlatırken, `d.get(k)` güvenle `None` döner. API yanıtlarını ayrıştırırken hayati bir savunmadır.",
              "Prevents unexpected `KeyError` crashes when parsing incomplete API responses or security logs."
            ],
            ex: {
              code: R`user = {"name": "admin"}
print(user.get("role", "misafir"))`,
              out: R`misafir`
            }
          },
          {
            id: "dict-items",
            name: "dict.items() / keys() / values()",
            kind: "method",
            sig: "dict.items() -> dict_items",
            sum: [
              "Sözlüğün tüm (anahtar, değer) çiftlerini döngüye sokmak için görünüm döner.",
              "Returns a set-like view of the dictionary's (key, value) pairs."
            ],
            desc: [
              "`for k, v in d.items():` kalıbı sözlükleri gezmenin en pythonic yoludur.",
              "Standard iteration pattern over key-value pairs."
            ],
            ex: {
              code: R`services = {"ssh": 22, "http": 80}
for k, v in sorted(services.items()):
    print(f"{k} -> {v}")`,
              out: R`http -> 80
ssh -> 22`
            }
          },
          {
            id: "list-append-extend",
            name: "list.append() / extend()",
            kind: "method",
            sig: "list.append(item), list.extend(iterable)",
            sum: [
              "`append` tek bir eleman ekler; `extend` başka bir listenin tüm elemanlarını uca ekler.",
              "`append` adds a single item; `extend` concatenates all items from an iterable."
            ],
            desc: [
              "İki listeyi birleştirmek için `lst.extend(diger_liste)` kullanılır.",
              "Differentiates single item insertion from collection concatenation."
            ],
            ex: {
              code: R`lst = [1, 2]
lst.append(3)
lst.extend([4, 5])
print(lst)`,
              out: R`[1, 2, 3, 4, 5]`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "xor-byte-cipher",
        title: [
          "XOR Bayt Şifreleyici / Çözücü (Bytearray ile)",
          "XOR Byte Obfuscator / Decrypter"
        ],
        sum: [
          "`bytearray` kullanarak baytları tek bir anahtar ile XOR'lama.",
          "Simple in-place single-byte XOR obfuscation and deobfuscation."
        ],
        code: R`def xor_bytes(data: bytes, key: int) -> bytes:
    ba = bytearray(data)
    for i in range(len(ba)):
        ba[i] ^= key
    return bytes(ba)

orijinal = b"GIZLI_KOMUT"
sifreli = xor_bytes(orijinal, 0x5A)
cozulmus = xor_bytes(sifreli, 0x5A)

print("Sifrelendi mi:", sifreli != orijinal)
print("Geri cozuldu:", cozulmus.decode())`,
        out: R`Sifrelendi mi: True
Geri cozuldu: GIZLI_KOMUT`,
        cyber: true,
        note: [
          "Basit zararlı yazılımlar komutlarını gizlemek için sıklıkla tek baytlık XOR uygular. Bu fonksiyon analizde şifreyi çözmek için kullanılır.",
          "Single-byte XOR is a common malware obfuscation technique; this utility reverses it cleanly."
        ]
      },
      {
        id: "log-wordlist-parser",
        title: [
          "Wordlist / Parola Listesi Temizleyici",
          "Wordlist Sanitizer & Deduplicator"
        ],
        sum: [
          "Metin listesindeki boşlukları temizleyip tekrarlayanları küme (`set`) ile ayıklama.",
          "Trimming whitespace, stripping empty lines, and deduplicating wordlists via sets."
        ],
        code: R`raw_lines = ["  admin  \n", "password\n", "admin\n", "  \n", "123456\n"]

# strip() ile temizle, boslari filtrele ve set ile tekrari kaldir ||| Clean & deduplicate
clean_words = sorted(list({w.strip() for w in raw_lines if w.strip()}))
print("Temizlenmis kelimeler:", clean_words)`,
        out: R`Temizlenmis kelimeler: ['123456', 'admin', 'password']`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "dict-get-keyerror-defense",
        q: [
          "Neden `data['token']` yerine `data.get('token')` kullanmak daha güvenlidir?",
          "Why is `data.get('token')` safer than `data['token']`?"
        ],
        a: [
          "Eğer `'token'` anahtarı sözlükte yoksa, köşeli parantez `KeyError` fırlatıp programı çökertir. `get()` ise sessizce `None` döner ve programın akışını bozmaz.",
          "Square bracket indexing raises `KeyError` on missing keys, crashing scripts. `get()` returns `None` gracefully."
        ]
      },
      {
        id: "bytes-vs-str",
        q: [
          "Python'da `str` ile `bytes` arasındaki temel fark nedir?",
          "What is the fundamental difference between `str` and `bytes` in Python?"
        ],
        a: [
          "`str` insan tarafından okunabilen Unicode metin karakterleridir. `bytes` ise donanımın, ağ kablosunun ve disk dosyalarının anladığı ham 8-bitlik (0-255) ikili veridir.",
          "`str` represents human-readable Unicode text characters. `bytes` represents raw 8-bit machine binary values (0-255)."
        ]
      },
      {
        id: "bytes-fromhex-usage",
        q: [
          "`bytes.fromhex('414243')` çağrısının çıktısı ne olur?",
          "What is the output of `bytes.fromhex('414243')`?"
        ],
        a: [
          "`b'ABC'` bayt nesnesi olur. Çünkü 41='A', 42='B', 43='C' ASCII kodlarıdır.",
          "`b'ABC'` bytes object, corresponding to ASCII hex codes 0x41, 0x42, 0x43."
        ]
      },
      {
        id: "bytearray-mutability",
        q: [
          "`bytes` ile `bytearray` arasındaki en önemli fark nedir?",
          "What is the most significant difference between `bytes` and `bytearray`?"
        ],
        a: [
          "`bytes` değiştirilemezdir (immutable); bir baytını sonradan değiştiremezsiniz. `bytearray` ise değiştirilebilirdir (mutable); `ba[0] = 0xFF` gibi doğrudan bellek üzerinde bayt yamaması yapabilirsiniz.",
          "`bytes` is immutable; `bytearray` is mutable, allowing in-place byte patching (`ba[0] = 0xFF`)."
        ]
      },
      {
        id: "strip-newline-removal",
        q: [
          "Dosyadan satır satır metin okurken neden her satıra `line.strip()` uygulanmalıdır?",
          "Why should `line.strip()` be applied when iterating over file lines?"
        ],
        a: [
          "Çünkü `open()` dosyadan okurken her satırın sonundaki `\\n` (ve Windows'ta `\\r\\n`) yeni satır karakterini metne dahil eder. `strip()` bu fazlalıkları temizler.",
          "Because reading lines retains trailing `\\n` or `\\r\\n` characters. `strip()` sanitizes trailing line breaks."
        ]
      }
    ]
  });
})();

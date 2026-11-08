(function () {
  const R = String.raw;
  PY.addLib({
    id: "itertools",
    name: "itertools",
    sym: "it",
    color: "#6366f1",
    focus: "both",
    level: 2,
    ext: false,
    cat: "basics",
    docs: "https://docs.python.org/3/library/itertools.html",
    tagline: [
      "Verimli döngüler ve kombinatoryal üreteçler: kelime listeleri, brute-force simülasyonları ve bellek tasarrufu.",
      "Fast, memory-efficient looping and combinatorial generators: wordlists, brute-force simulations, and streaming."
    ],
    analogy: [
      "10 milyon olası parolayı bir listeye doldurmaya çalışırsan bilgisayarın RAM'i hemen tükenir ve çöker. `itertools` ise bir fabrika bandı (üreteç) gibidir: Parolaları bellekte saklamaz; sen 'sıradakini ver' dedikçe anında bir sonrakini hesaplayıp verir. Bellek kullanımı her zaman sıfıra yakındır.",
      "Allocating 10 million candidate passwords into a list will exhaust RAM. `itertools` acts as an on-demand assembly line: it stores nothing in memory, computing the next element only when asked (`next()`), maintaining a near-zero memory footprint."
    ],
    intro: [
      [
        "`itertools` modülü, iterator cebiri üzerine kurulmuş yüksek performanslı fonksiyonlar sunar. Tüm fonksiyonlar tembelce (lazy evaluation) çalışır; yani elemanlar sadece döngü döndükçe üretilir.",
        "The `itertools` module implements high-performance iterator building blocks. All utilities evaluate lazily on-demand, generating values sequentially during iteration without pre-allocating memory."
      ],
      [
        "Siber güvenlikte sözlük ve parola listesi üretme (`product`, `permutations`), devasa kelime listelerini belleğe yüklemeden uç uca bağlama (`chain`), proxy listelerini döngüsel döndürme (`cycle`) ve gigabaytlarca log kaydını parçalar halinde süzme (`islice`) için standarttır.",
        "In cyber security, synthesizing credential wordlists (`product`, `permutations`), chaining heterogeneous dictionary files seamlessly (`chain`), rotating proxy endpoints (`cycle`), and streaming gigabytes of logs (`islice`) are foundational use cases."
      ]
    ],
    import: R`import itertools
from itertools import product, permutations, combinations, chain, islice, cycle`,
    general: [
      ["Büyük veri setlerini belleğe almadan parça parça işleme ve akıtma.", "Streaming and processing massive datasets without high memory footprints."],
      ["Dizilerin Kartezyen çarpımını, permütasyonlarını ve kombinasyonlarını hesaplama.", "Generating Cartesian products, permutations, and combinations efficiently."],
      ["Farklı listeleri kopyalama maliyeti olmadan tek bir döngüde birleştirme (`chain`).", "Concatenating heterogeneous collections into a single stream via `chain`."]
    ],
    cyberUse: [
      ["Kaba kuvvet (Brute-Force) Simülasyonu: `product` kullanarak belirli bir karakter setinden (örn. 4 haneli PIN veya alfanümerik) tüm olası parolaları belleği şişirmeden tek tek üretme.", "Brute-force lab modeling: streaming exhaustive keyspaces (e.g. 4-digit PINs or alphanumeric passwords) via `product` without memory overhead."],
      ["Kelime Listesi (Wordlist) Birleştirme: Farklı sızıntı ve parola sözlüklerini (`rockyou`, şirket isimleri, tarihler) `chain` ile birbirine bağlayarak tek bir akışta tarama.", "Wordlist federation: streaming disjoint dictionary files into a single unified generator via `itertools.chain`."],
      ["Döner Proxy (Proxy Rotation): `cycle` ile çalışan bir proxy veya User-Agent havuzu kurarak her istekte sıradaki kimliği otomatik devreye alma.", "Rotating proxy pools: cycling through IP gateways or User-Agent headers with `itertools.cycle`."]
    ],
    sections: [
      {
        id: "combinatorics",
        title: ["Kombinasyon ve Parola Üretimi", "Combinatorics & Password Generators"],
        intro: [
          "`product`, `permutations` ve `combinations` ile olası anahtar uzaylarını tarama.",
          "Navigating candidate keyspaces with Cartesian products and permutations."
        ],
        items: [
          {
            id: "product",
            name: "itertools.product(*iterables, repeat=1)",
            kind: "function",
            sig: "itertools.product(*iterables, repeat: int = 1) -> iterator",
            sum: [
              "Girdilerin Kartezyen çarpımını üretir; iç içe for döngülerinin karşılığıdır.",
              "Cartesian product of input iterables; equivalent to nested for-loops."
            ],
            desc: [
              "`repeat` parametresi ile aynı alfabeden `n` uzunluğunda tüm olası kombinasyonlar üretilir. Örneğin 4 haneli sayısal PIN'ler veya 8 karakterlik parola denemeleri için temel motordur.",
              "Computes full Cartesian product. Setting `repeat=N` enumerates all N-length sequences across an alphabet, ideal for candidate keyspace enumeration."
            ],
            ex: {
              code: R`from itertools import product

# 2 haneli 0-9 arasi tum PIN kombinasyonlari: ||| All 2-digit PIN combinations:
pinler = ["".join(p) for p in product("0123456789", repeat=2)]

print("Toplam PIN sayisi:", len(pinler))
print("Ilk ve son PIN:", pinler[0], pinler[-1])`,
              out: R`Toplam PIN sayisi: 100
Ilk ve son PIN: 00 99`
            },
            cyber: [
              "Kaba kuvvet lablarında liste oluşturup diske yazmak yerine `product` üretecini doğrudan deneme fonksiyonuna aktararak bellek kullanımını sıfırda tutabilirsiniz.",
              "Feed `product` iterators directly into verification routines rather than dumping massive candidate lists to disk."
            ]
          },
          {
            id: "permutations",
            name: "itertools.permutations(iterable, r=None)",
            kind: "function",
            sig: "itertools.permutations(iterable, r: int = None) -> iterator",
            sum: [
              "Elemanların tekrarsız tüm olası sıralı dizilişlerini (permütasyon) döner.",
              "Returns successive r-length permutations of elements in the iterable."
            ],
            desc: [
              "Aynı eleman iki kez seçilmez; sıra önemlidir (`(A, B)` ile `(B, A)` farklıdır). Sosyal mühendislikte hedef hakkında bilinen ipuçlarını (isim, doğum yılı, evcil hayvan) birleştirerek özel kelime listesi üretmede kullanılır.",
              "Generates all ordered arrangements without repetition. Used in targeted password attacks to permute personal target fragments."
            ],
            ex: {
              code: R`from itertools import permutations

parcalar = ["admin", "2026", "!"]
siralamalar = ["".join(p) for p in permutations(parcalar)]

print("Olasilik sayisi:", len(siralamalar))
print("admin2026! mevcut mu:", "admin2026!" in siralamalar)`,
              out: R`Olasilik sayisi: 6
admin2026! mevcut mu: True`
            }
          },
          {
            id: "combinations",
            name: "itertools.combinations(iterable, r)",
            kind: "function",
            sig: "itertools.combinations(iterable, r: int) -> iterator",
            sum: [
              "Tekrarsız ve sırasız `r` elemanlı alt kümeleri üretir.",
              "Returns r-length subsequences of elements from the input iterable."
            ],
            desc: [
              "Sıra önemli değildir; `(A, B)` üretildiyse `(B, A)` üretilmez. Firewall kural kombinasyonlarını test etmek veya ağdaki düğümler arasındaki ikili bağlantıları denetlemek için kullanılır.",
              "Generates subsets where order does not matter. Useful for testing pair combinations in firewall topologies."
            ],
            ex: {
              code: R`from itertools import combinations

hostlar = ["srv1", "srv2", "srv3"]
ciftler = list(combinations(hostlar, 2))

print("Incelenecek baglanti ciftleri:", ciftler)`,
              out: R`Incelenecek baglanti ciftleri: [('srv1', 'srv2'), ('srv1', 'srv3'), ('srv2', 'srv3')]`
            }
          },
          {
            id: "combinations-with-replacement",
            name: "itertools.combinations_with_replacement(iterable, r)",
            kind: "function",
            sig: "itertools.combinations_with_replacement(iterable, r: int) -> iterator",
            sum: [
              "Elemanların kendisiyle tekrarına izin veren kombinasyonları üretir.",
              "Returns r-length subsequences allowing individual elements to be repeated."
            ],
            desc: [
              "`(A, A)` gibi durumları da dahil eder ama `(A, B)` ile `(B, A)` aynı kabul edilir.",
              "Generates combination pairs allowing repeated elements while treating order as symmetric."
            ],
            ex: {
              code: R`from itertools import combinations_with_replacement

res = list(combinations_with_replacement("AB", 2))
print(res)`,
              out: R`[('A', 'A'), ('A', 'B'), ('B', 'B')]`
            }
          }
        ]
      },
      {
        id: "stream-controls",
        title: ["Akış Kontrolü ve Birleştirme", "Stream Control & Chaining"],
        intro: [
          "`chain`, `islice` ve sonsuz döngü aracı `cycle`.",
          "Chaining disjoint inputs, slicing streams, and cycling infinite pools."
        ],
        items: [
          {
            id: "chain",
            name: "itertools.chain(*iterables)",
            kind: "function",
            sig: "itertools.chain(*iterables) -> iterator",
            sum: [
              "Birden fazla iterable nesneyi tek bir kesintisiz akış halinde birbirine bağlar.",
              "Iterates through the first iterable until exhausted, then proceeds to the next."
            ],
            desc: [
              "İki büyük listeyi `list1 + list2` şeklinde birleştirmek yeni bir liste oluşturup çift bellek harcar. `chain(list1, list2)` ise hiç yeni liste tahsis etmeden birinci bitince otomatik ikinciden okumaya devam eder.",
              "Links sequences lazily without creating a combined memory-heavy copy. Seamlessly streams across multiple wordlist sources."
            ],
            ex: {
              code: R`from itertools import chain

varsayilan_kullanicilar = ["admin", "root"]
ozel_kullanicilar = ["test", "analyst"]

for user in chain(varsayilan_kullanicilar, ozel_kullanicilar):
    print(user)`,
              out: R`admin
root
test
analyst`
            },
            cyber: [
              "Milyonlarca satırlık devasa parola dosyalarını birleştirirken RAM çökmesini önlemek için her zaman `itertools.chain` kullanın.",
              "Chain massive password lists together using `itertools.chain` to prevent out-of-memory crashes."
            ]
          },
          {
            id: "islice",
            name: "itertools.islice(iterable, [start,] stop [, step])",
            kind: "function",
            sig: "itertools.islice(iterable, stop) or islice(iterable, start, stop[, step])",
            sum: [
              "Bir iterator veya akıştan belirli bir dilimi (slice) belleği şişirmeden çeker.",
              "Returns selected elements from an iterable without buffering the entire dataset."
            ],
            desc: [
              "Standart dilimleme (`[0:10]`) sadece listelerde çalışır ve nesnenin tamamının bellekte olmasını şart koşar. `islice` ise dosya akışlarında veya sonsuz üreteçlerde ilk 10 elemanı güvenle almak için kullanılır.",
              "Slices arbitrary streams and infinite generators lazily without loading the entire collection into memory."
            ],
            ex: {
              code: R`from itertools import islice, count

# 1000'den baslayip sonsuza kadar sayan akistan ilk 3 tanesini al: ||| Take first 3 from infinite counter:
sayilar = list(islice(count(1000), 3))
print(sayilar)`,
              out: R`[1000, 1001, 1002]`
            }
          },
          {
            id: "cycle",
            name: "itertools.cycle(iterable)",
            kind: "function",
            sig: "itertools.cycle(iterable) -> iterator",
            sum: [
              "Verilen diziyi baştan sona sonsuz bir döngüde tekrarlar.",
              "Cycles through an iterable endlessly in a repeating loop."
            ],
            desc: [
              "Son elemana geldiğinde otomatik olarak tekrar ilk elemana döner. Proxy havuzu, döner anahtarlar veya round-robin hedef dengeleme için standarttır.",
              "Loops endlessly across candidate pools. Standard for proxy rotation and round-robin load distribution."
            ],
            ex: {
              code: R`from itertools import cycle, islice

proxyler = cycle(["proxy1.lan", "proxy2.lan"])
kullanilanlar = list(islice(proxyler, 4))

print(kullanilanlar)`,
              out: R`['proxy1.lan', 'proxy2.lan', 'proxy1.lan', 'proxy2.lan']`
            }
          },
          {
            id: "count",
            name: "itertools.count(start=0, step=1)",
            kind: "function",
            sig: "itertools.count(start: int = 0, step: int = 1) -> iterator",
            sum: [
              "`start` değerinden başlayarak `step` adımlarıyla sonsuza giden tamsayılar üretir.",
              "Produces evenly spaced values starting with n endlessly."
            ],
            desc: [
              "Sayaç, ID üretici veya paket numaralandırma mekanizmalarında sonsuz for döngüsü kurmak için kullanılır.",
              "Generates sequential identifiers and endless packet sequence numbering."
            ],
            ex: {
              code: R`from itertools import count, islice

sayac = count(10, 5)
print(list(islice(sayac, 3)))`,
              out: R`[10, 15, 20]`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "pin-bruteforce-simulator",
        title: [
          "PIN Kaba Kuvvet Simülatörü ve Anahtar Uzayı Tarayıcı",
          "PIN Brute-Force Keyspace Streaming Simulator"
        ],
        sum: [
          "`itertools.product` ile 4 haneli PIN uzayını bellek tüketmeden tarayarak gizli şifreyi çözme.",
          "Streaming 4-digit PIN space through verification logic with near-zero memory footprint."
        ],
        code: R`from itertools import product

HEDEF_PIN = "7342"
deneme_sayisi = 0
bulundu = None

# '0'-'9' arasi 4 basamakli tum PIN kombinasyonlarini tembelce akit: ||| Stream all 4-digit PIN combinations lazily:
for pin_tuple in product("0123456789", repeat=4):
    deneme_sayisi += 1
    pin = "".join(pin_tuple)
    if pin == HEDEF_PIN:
        bulundu = pin
        break

print("Hedef PIN basariyla bulundu mu:", bulundu == HEDEF_PIN)
print("Hedef PIN:", bulundu)
print("Kac denemede bulundu:", deneme_sayisi)`,
        out: R`Hedef PIN basariyla bulundu mu: True
Hedef PIN: 7342
Kac denemede bulundu: 7343`,
        cyber: true,
        note: [
          "Gerçek güvenlik testlerinde tüm şifreleri bellekte bir listede toplamak `MemoryError` verdirebilir. `product` her seferinde sadece tek bir parolayı bellekte tutar.",
          "Generating candidate lists in memory triggers `MemoryError` at scale. `product` evaluates candidate tuples on-the-fly, keeping memory bounded."
        ]
      },
      {
        id: "proxy-pool-rotator",
        title: [
          "Döner Proxy ve User-Agent Rotasyon Motoru",
          "Rotating Proxy & User-Agent Dispatch Engine"
        ],
        sum: [
          "`itertools.cycle` kullanarak her istekte farklı bir çıkış kapısı seçen güvenlik mekanizması.",
          "Dispatching sequential HTTP probe requests across revolving proxy endpoints via cycle."
        ],
        code: R`from itertools import cycle

# Guvenlik taramasinda kullanilacak cikis sunuculari: ||| Egress proxy endpoints:
proxy_havuzu = ["10.0.0.1:8080", "10.0.0.2:8080", "10.0.0.3:8080"]
rotator = cycle(proxy_havuzu)

istekler = ["hedef_site.com/login", "hedef_site.com/admin", "hedef_site.com/api", "hedef_site.com/status"]
eslesmeler = []

for istek in istekler:
    aktif_proxy = next(rotator)
    eslesmeler.append((istek, aktif_proxy))

print("Toplam istek sayisi:", len(eslesmeler))
print("Ilk istek proxy'si:", eslesmeler[0][1])
print("Dorduncu istek basa dondu mu:", eslesmeler[3][1] == proxy_havuzu[0])`,
        out: R`Toplam istek sayisi: 4
Ilk istek proxy'si: 10.0.0.1:8080
Dorduncu istek basa dondu mu: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "itertools-lazy-evaluation",
        q: [
          "`itertools` fonksiyonlarının 'tembel' (lazy) çalışması ne anlama gelir ve siber güvenlikte neden kritiktir?",
          "What does it mean that `itertools` functions evaluate lazily, and why is it critical in cyber security?"
        ],
        a: [
          "Tüm olası değerler önceden hesaplanıp belleğe doldurulmaz; döngü döndükçe sadece sıradaki tek bir eleman üretilir. 1 milyar parolalık bir liste bilgisayarı kilitlerken, `itertools.product` neredeyse sıfır RAM ile çalışır.",
          "Items are computed on-demand one by one rather than pre-allocated in RAM. A billion-candidate wordlist exhausts memory as a list, but runs safely under `itertools.product` with negligible memory overhead."
        ]
      },
      {
        id: "product-vs-permutations",
        q: [
          "`product` ile `permutations` arasındaki fark nedir?",
          "What is the difference between `itertools.product` and `itertools.permutations`?"
        ],
        a: [
          "`product(chars, repeat=2)` elemanların kendisiyle tekrarına izin verir ('aa', 'ab', 'ba', 'bb'). `permutations(chars, 2)` ise tekrarsızdır; her elemanı sadece bir kez kullanarak dizilişleri üretir ('ab', 'ba').",
          "`product` permits repeating elements across slots ('aa', 'ab'). `permutations` produces arrangements without element reuse ('ab', 'ba')."
        ]
      },
      {
        id: "chain-vs-plus-operator",
        q: [
          "İki devasa kelime listesini birleştirirken neden `liste1 + liste2` yerine `itertools.chain(liste1, liste2)` kullanılmalıdır?",
          "Why should `itertools.chain` be used instead of `list1 + list2` when combining large wordlists?"
        ],
        a: [
          "`+` operatörü her iki listenin kopyasını alarak üçüncü büyük bir liste oluşturur (RAM ikiye katlanır). `chain` ise hiçbir şey kopyalamaz; birinci liste bitince otomatik olarak ikinciden okumaya devam eder.",
          "`+` duplicates items into a third brand-new list in memory. `chain` consumes the first collection and switches to the second lazily without allocating extra storage."
        ]
      },
      {
        id: "islice-on-generators",
        q: [
          "Neden bir üretecin (generator) ilk 10 elemanını almak için `gen[:10]` değil `itertools.islice(gen, 10)` kullanılır?",
          "Why must `itertools.islice(gen, 10)` be used instead of `gen[:10]` to extract the first 10 items from a generator?"
        ],
        a: [
          "Python üreteçleri indeksleme veya standart dilimleme (`[:]`) desteklemez (`TypeError` verir). `islice` ise üreteçleri belleğe almadan dilimlemenin tek standart yoludur.",
          "Generators do not support slice indexing syntax (`gen[:10]` raises `TypeError`). `islice` is the standard tool to slice stream generators lazily."
        ]
      },
      {
        id: "cycle-infinite-loop",
        q: [
          "`itertools.cycle` kullanırken sonsuz döngüye girmemek için ne yapılmalıdır?",
          "How do you prevent an infinite loop when consuming from `itertools.cycle`?"
        ],
        a: [
          "`cycle` kendiliğinden asla durmaz. İstek sayısını bir sayaçla sınırlandırmalı veya `itertools.islice(cycle(liste), N)` ile sabit sayıda eleman çekmelisiniz.",
          "`cycle` iterates forever without termination. Bound consumption with a loop break condition or slice it with `itertools.islice(cycle(seq), N)`."
        ]
      }
    ]
  });
})();


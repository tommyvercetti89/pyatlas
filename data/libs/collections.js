(function () {
  const R = String.raw;
  PY.addLib({
    id: "collections",
    name: "collections",
    sym: "cl",
    color: "#8b5cf6",
    focus: "both",
    level: 2,
    ext: false,
    cat: "basics",
    docs: "https://docs.python.org/3/library/collections.html",
    tagline: [
      "Özel ve yüksek performanslı veri yapıları — sayaçlar, çift uçlu kuyruklar ve varsayılan sözlükler.",
      "High-performance container datatypes — counters, double-ended queues, and default dictionaries."
    ],
    analogy: [
      "Python'un standart `list` ve `dict` yapıları düz mutfak bıçakları gibidir. `collections` ise profesyonel şef takım çantasıdır: `Counter` gelen siparişleri otomatik çetele tutar, `deque` dönen bir sushi bandı gibi eski tabakları atıp yenileri ekler, `defaultdict` ise olmayan kutuyu aradığında 'kutuyu bulamadım' diye bağırmak yerine o an senin için temiz bir kutu açar.",
      "Standard lists and dicts are all-purpose kitchen knives. `collections` is a specialized chef set: `Counter` tallies incoming orders automatically, `deque` acts like a revolving sushi belt discarding stale items, and `defaultdict` spawns empty buckets rather than throwing KeyErrors."
    ],
    intro: [
      [
        "`collections` modülü, standart `dict`, `list`, `set` ve `tuple` türlerine alternatif olarak geliştirilmiş yüksek performanslı ve özel amaçlı veri yapıları sunar.",
        "The `collections` module provides specialized, high-performance container alternatives to Python's general-purpose built-in dict, list, set, and tuple types."
      ],
      [
        "Siber güvenlikte ağ paketleri ve saldırgan IP'lerin sıklık dağılımını çıkarma (`Counter`), kayan pencereli hız sınırlama ve dairesel log tamponu oluşturma (`deque`), hedef port haritalama (`defaultdict`) ve ağ paketlerini okunabilir hafif yapılara dönüştürme (`namedtuple`) için standarttır.",
        "In cyber security, tallying anomalous IP frequency for DDoS triage (`Counter`), running sliding-window rate limiters (`deque`), grouping open ports per host (`defaultdict`), and modeling structured packet records (`namedtuple`) rely directly on `collections`."
      ]
    ],
    import: R`import collections
from collections import Counter, defaultdict, deque, namedtuple`,
    general: [
      ["Veri setlerindeki elemanların frekansını tek satırda sayıp en çok tekrarlananları (`most_common`) bulma.", "Tallying element frequencies and querying top occurrences in one line via `most_common`."],
      ["Sabit boyutlu dairesel bellek tamponları (ring buffer) ile hafıza taşmasını önleme.", "Maintaining fixed-size circular memory buffers with `deque(maxlen=N)`."],
      ["Hafif ve isimli veri kayıtları (`namedtuple`) ile kod okunabilirliğini artırma.", "Enhancing code readability with memory-efficient `namedtuple` schemas."]
    ],
    cyberUse: [
      ["DDoS ve Kaba Kuvvet (Brute-Force) Tespiti: Gelen HTTP veya SSH isteklerinde en sık görülen IP adreslerini `Counter` ile anında süzme.", "DDoS & brute-force triage: isolating high-volume offending IP addresses instantly via `Counter.most_common()`."],
      ["Kayan pencereli hız sınırlama (Sliding Window Rate Limiter): `deque` kullanarak son 60 saniye içindeki istek zaman damgalarını O(1) hızında yönetme.", "Sliding-window rate limiting: tracking request timestamps in an O(1) double-ended queue (`deque`) to enforce burst thresholds."],
      ["Port Tarama Haritalama: `defaultdict(set)` ile her taranan IP adresine ait açık portları `KeyError` kontrolü yapmadan temizce gruplama.", "Port scan topology mapping: cleanly aggregating discovered open ports per target IP without boilerplate `KeyError` checks via `defaultdict(set)`."]
    ],
    sections: [
      {
        id: "core-containers",
        title: ["Temel Konteyner Yapıları", "Core Container Classes"],
        intro: [
          "`Counter`, `defaultdict` ve `deque` veri yapıları.",
          "Specialized containers for counting, defaulting, and sliding queues."
        ],
        items: [
          {
            id: "counter",
            name: "collections.Counter([iterable-or-mapping])",
            kind: "class",
            sig: "collections.Counter(iterable_or_mapping=None) -> Counter",
            sum: [
              "Elemanların kaçar kez tekrarlandığını sayan özel sözlük alt sınıfı.",
              "A dict subclass for counting hashable objects and tracking frequencies."
            ],
            desc: [
              "Listedeki veya akıştaki elemanları anahtar, frekansları değer olarak tutar. Olmayan bir eleman sorgulandığında hata vermek yerine `0` döner. `.most_common(n)` metodu ile en çok tekrarlanan elemanları verir.",
              "Maintains element occurrences as key-value pairs. Querying missing keys returns 0 instead of raising KeyError. `.most_common(n)` extracts highest-frequency items."
            ],
            ex: {
              code: R`from collections import Counter

saldirgan_ipler = ["10.0.0.1", "10.0.0.2", "10.0.0.1", "10.0.0.1", "10.0.0.3"]
sayac = Counter(saldirgan_ipler)

print("En cok saldiran:", sayac.most_common(1))
print("Bilinmeyen IP sayisi:", sayac["192.168.1.1"])`,
              out: R`En cok saldiran: [('10.0.0.1', 3)]
Bilinmeyen IP sayisi: 0`
            },
            cyber: [
              "Log analizinde milyonlarca satırı `Counter` içine akıtarak şüpheli User-Agent ve IP dağılımını tek hamlede çıkarabilirsiniz.",
              "Stream millions of log records into `Counter` to instantly highlight anomalous User-Agents and offensive IP clusters."
            ]
          },
          {
            id: "defaultdict",
            name: "collections.defaultdict(default_factory=None, ...)",
            kind: "class",
            sig: "collections.defaultdict(default_factory=None, **kwargs) -> defaultdict",
            sum: [
              "Olmayan anahtarlar için otomatik varsayılan değer üreten sözlük.",
              "A dict subclass that calls a factory function to supply missing values."
            ],
            desc: [
              "Standart sözlükte `d[key].append(val)` yazıldığında anahtar yoksa `KeyError` fırlatılır. `defaultdict(list)` ise anahtar yoksa otomatik boş bir liste oluşturur. Port eşleme ve grup analizlerinde kod kalabalığını bitirir.",
              "Eliminates `KeyError` boilerplate. Invokes `default_factory` (e.g. `list`, `set`, `int`) automatically whenever an unset key is accessed."
            ],
            ex: {
              code: R`from collections import defaultdict

port_haritasi = defaultdict(set)
port_haritasi["192.168.1.10"].add(80)
port_haritasi["192.168.1.10"].add(443)

print(sorted(port_haritasi["192.168.1.10"]))
print("Yeni bos IP:", port_haritasi["10.0.0.99"])`,
              out: R`[80, 443]
Yeni bos IP: set()`
            }
          },
          {
            id: "deque",
            name: "collections.deque([iterable[, maxlen]])",
            kind: "class",
            sig: "collections.deque(iterable=(), maxlen=None) -> deque",
            sum: [
              "Her iki uçtan da O(1) hızında ekleme ve çıkarma yapabilen çift uçlu kuyruk.",
              "A double-ended queue with fast O(1) appends and pops from either side."
            ],
            desc: [
              "Standart Python listelerinde baştan eleman silmek (`list.pop(0)`) O(N) zaman alır. `deque.popleft()` ise O(1) zamanda biter. `maxlen` verildiğinde kapasite dolunca yeni eleman eklendikçe en eski eleman otomatik atılır (kayan pencere / ring buffer).",
              "Standard lists incur O(N) complexity for front pops; `deque.popleft()` completes in O(1). Setting `maxlen` creates bounded ring buffers dropping stale items automatically."
            ],
            ex: {
              code: R`from collections import deque

tampon = deque(maxlen=3)
tampon.append("paket_1")
tampon.append("paket_2")
tampon.append("paket_3")
tampon.append("paket_4") # paket_1 otomatik duser ||| paket_1 dropped automatically

print(list(tampon))
print(tampon.popleft())`,
              out: R`['paket_2', 'paket_3', 'paket_4']
paket_2`
            },
            cyber: [
              "Hafıza şişmesini önleyen son 1000 paketlik yakalama tamponu veya son 60 saniyelik DoS saldırı tespit pencereleri `deque(maxlen=...)` ile kurulur.",
              "Bounded packet capture buffers and rolling sliding-window rate limiters rely on `deque(maxlen=...)` to guarantee memory safety."
            ]
          },
          {
            id: "namedtuple",
            name: "collections.namedtuple(typename, field_names, ...)",
            kind: "function",
            sig: "collections.namedtuple(typename: str, field_names: str | list, ...) -> type",
            sum: [
              "Alanlarına hem isimle (`p.port`) hem indeksle erişilebilen hafif tuple fabrikası.",
              "Factory function for creating tuple subclasses with named fields."
            ],
            desc: [
              "Sınıf (class) yazma hantallığı olmadan, normal bir tuple kadar az bellek harcayarak yapısal veriler (örn. Ağ Paketi, Log Kaydı) oluşturmayı sağlar.",
              "Generates lightweight structured records accessible via dot notation (`record.port`) while retaining the compact memory footprint of standard tuples."
            ],
            ex: {
              code: R`from collections import namedtuple

HedefPort = namedtuple("HedefPort", ["ip", "port", "durum"])
h = HedefPort("10.0.0.1", 443, "ACIK")

print(h.ip, h.port, h.durum)
print(h[1]) # indeksle de erisilebilir ||| also accessible by index`,
              out: R`10.0.0.1 443 ACIK
443`
            }
          }
        ]
      },
      {
        id: "advanced-structures",
        title: ["Gelişmiş Yapılar ve Sıralı Eşlemeler", "Advanced Mappings & Chains"],
        intro: [
          "`OrderedDict` ve çoklu sözlük arama yapısı `ChainMap`.",
          "Order-preserving maps and multi-layered dictionary chaining."
        ],
        items: [
          {
            id: "ordereddict",
            name: "collections.OrderedDict([items])",
            kind: "class",
            sig: "collections.OrderedDict(*args, **kwds) -> OrderedDict",
            sum: [
              "Eklenme sırasını hatırlayan ve sıralama işlemlerini destekleyen sözlük.",
              "A dict subclass that remembers insertion order and offers reordering tools."
            ],
            desc: [
              "Python 3.7+ ile normal sözlükler de ekleme sırasını korur; ancak `OrderedDict` ek olarak `.move_to_end()` ve sıraya duyarlı eşitlik (`==`) gibi gelişmiş metotlar sunar. LRU (En Az Kullanılan) önbellek tasarımlarında temel taştır.",
              "Offers specialized reordering methods like `.move_to_end()` and order-sensitive equality checks essential for crafting LRU cache routines."
            ],
            ex: {
              code: R`from collections import OrderedDict

od = OrderedDict()
od["bir"] = 1
od["iki"] = 2
od["uc"] = 3
od.move_to_end("bir") # 'bir' en sona tasinir ||| move 'bir' to end

print(list(od.keys()))`,
              out: R`['iki', 'uc', 'bir']`
            }
          },
          {
            id: "chainmap",
            name: "collections.ChainMap(*maps)",
            kind: "class",
            sig: "collections.ChainMap(*maps: Mapping) -> ChainMap",
            sum: [
              "Birden fazla sözlüğü tek bir arama görünümünde birleştirir.",
              "A dict-like class for creating a single search view of multiple mappings."
            ],
            desc: [
              "Sözlükleri kopyalamadan birbirine bağlar. Bir anahtar arandığında ilk sözlükten sonuncuya doğru taranır. Siber güvenlik araçlarında öncelik sırası oluşturmak için idealdir: Komut Satırı Argümanları -> Ortam Değişkenleri -> Varsayılan Yapılandırma.",
              "Links multiple dictionaries into an ordered lookup chain without copying data. Perfect for cascading configuration: CLI args -> Environment variables -> Default settings."
            ],
            ex: {
              code: R`from collections import ChainMap

varsayilan = {"port": 80, "timeout": 30, "proxy": None}
kullanici = {"port": 8080}

ayarlar = ChainMap(kullanici, varsayilan)
print("Port (kullanicidan):", ayarlar["port"])
print("Timeout (varsayilandan):", ayarlar["timeout"])`,
              out: R`Port (kullanicidan): 8080
Timeout (varsayilandan): 30`
            }
          },
          {
            id: "counter-subtract",
            name: "Counter.subtract([iterable-or-mapping])",
            kind: "method",
            sig: "c.subtract(iterable_or_mapping=None) -> None",
            sum: [
              "Sayaçtan eleman frekanslarını yerinde (in-place) çıkarır.",
              "Subtracts counts in-place from an iterable or another mapping."
            ],
            desc: [
              "Sonuçlar negatif veya sıfır olabilir. İki farklı zaman dilimindeki trafik değişimini veya silinen girdileri tespit etmek için kullanılır.",
              "Deducts counts without dropping below zero constraints. Useful for diffing telemetry baselines."
            ],
            ex: {
              code: R`from collections import Counter

once = Counter(a=5, b=2)
sonra = Counter(a=3, b=2, c=1)
once.subtract(sonra)

print(once["a"], once["b"], once["c"])`,
              out: R`2 0 -1`
            }
          },
          {
            id: "deque-rotate",
            name: "deque.rotate(n=1)",
            kind: "method",
            sig: "d.rotate(n: int = 1) -> None",
            sum: [
              "Kuyruğu `n` adım sağa (veya negatifse sola) döndürür.",
              "Rotates the deque n steps to the right (or left if n is negative)."
            ],
            desc: [
              "Elemanların sırasını bozmadan döngüsel kaydırma yapar. Caesar şifreleme simülasyonlarında veya dairesel round-robin yük dengeleme algoritmalarında kullanılır.",
              "Performs in-place cyclic shifts. Useful for Caesar cipher rotations and round-robin load distribution."
            ],
            ex: {
              code: R`from collections import deque

d = deque([1, 2, 3, 4, 5])
d.rotate(2) # 2 adim saga ||| 2 steps to right
print(list(d))`,
              out: R`[4, 5, 1, 2, 3]`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "ddos-traffic-analyzer",
        title: [
          "DDoS Trafik Anomali ve En Çok Saldıran IP Dedektörü",
          "DDoS Traffic Anomaly & Top Attacker Detector"
        ],
        sum: [
          "Gelen binlerce ağ paketinden IP frekanslarını `Counter` ile çıkarıp eşiği aşanları tespit etme.",
          "Parsing stream packet headers to isolate IPs breaching request threshold limits."
        ],
        code: R`from collections import Counter

# Simule edilmis paket akisi: ||| Simulated packet flow:
paket_akisi = [
    "192.168.1.10", "10.0.0.5", "192.168.1.10", "172.16.0.2",
    "192.168.1.10", "192.168.1.10", "10.0.0.5", "192.168.1.10",
]

ip_sayaci = Counter(paket_akisi)
ESIK_DEGERI = 3

engellenecek_ipler = [ip for ip, sayi in ip_sayaci.items() if sayi >= ESIK_DEGERI]
en_aktif = ip_sayaci.most_common(1)[0]

print("En aktif IP ve paket sayisi:", en_aktif)
print("Esigi asip engellenecek IP'ler:", engellenecek_ipler)`,
        out: R`En aktif IP ve paket sayisi: ('192.168.1.10', 5)
Esigi asip engellenecek IP'ler: ['192.168.1.10']`,
        cyber: true,
        note: [
          "Büyük veri kümelerinde her IP için sözlük kontrolü yapmak yerine `Counter` kullanmak C seviyesinde optimize edildiği için işlem süresini kat kat kısaltır.",
          "Leveraging `Counter` executes frequency aggregation at C level, significantly accelerating high-volume packet triage."
        ]
      },
      {
        id: "sliding-window-rate-limiter",
        title: [
          "Kayan Pencereli API Hız Sınırlayıcı (Rate Limiter)",
          "Sliding Window Request Rate Limiter"
        ],
        sum: [
          "`deque` ile son 60 saniyedeki istekleri tutup brute-force denemelerini engelleme.",
          "Enforcing rolling sliding window limits to thwart authentication brute-force attacks."
        ],
        code: R`from collections import deque
import time

class RateLimiter:
    def __init__(self, max_requests: int, window_seconds: float):
        self.max_requests = max_requests
        self.window = window_seconds
        self.timestamps = deque()

    def allow_request(self, current_time: float) -> bool:
        # Pencere disinda kalan eski zaman damgalarini bastan at: ||| Pop timestamps older than window:
        while self.timestamps and current_time - self.timestamps[0] > self.window:
            self.timestamps.popleft()
        
        if len(self.timestamps) < self.max_requests:
            self.timestamps.append(current_time)
            return True
        return False

# 1 saniyede en fazla 2 istege izin veren sinirlayici: ||| Limiter allowing at most 2 reqs per 1s:
limiter = RateLimiter(max_requests=2, window_seconds=1.0)
t = 100.0

print("Istek 1 (t=100.0):", limiter.allow_request(t))
print("Istek 2 (t=100.2):", limiter.allow_request(t + 0.2))
print("Istek 3 (t=100.4, engellenmeli):", limiter.allow_request(t + 0.4))
print("Istek 4 (t=101.5, pencere gecti):", limiter.allow_request(t + 1.5))`,
        out: R`Istek 1 (t=100.0): True
Istek 2 (t=100.2): True
Istek 3 (t=100.4, engellenmeli): False
Istek 4 (t=101.5, pencere gecti): True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "counter-missing-key",
        q: [
          "`Counter` nesnesinde olmayan bir anahtar sorgulandığında ne döner?",
          "What happens when querying a non-existent key on a `Counter` object?"
        ],
        a: [
          "`KeyError` fırlatmaz, otomatik olarak `0` döner. Bu özellik frekans kontrollerini hata yakalamaya gerek kalmadan çok pratik hale getirir.",
          "It returns 0 instead of raising a `KeyError`, simplifying frequency inspections without defensive exception handling."
        ]
      },
      {
        id: "deque-vs-list-pop",
        q: [
          "Neden bir kuyruğun başından eleman çekerken `list.pop(0)` yerine `deque.popleft()` tercih edilmelidir?",
          "Why should `deque.popleft()` be preferred over `list.pop(0)` when consuming items from the front?"
        ],
        a: [
          "`list.pop(0)` listedeki tüm diğer elemanları bellekte bir sola kaydırmak zorunda olduğu için O(N) karmaşıklığındadır (yavaşlar). `deque.popleft()` ise çift bağlı liste mantığıyla O(1) sabit sürede çalışır.",
          "`list.pop(0)` must shift all remaining elements in memory, incurring O(N) cost. `deque.popleft()` operates in O(1) constant time."
        ]
      },
      {
        id: "deque-maxlen-behavior",
        q: [
          "`deque(maxlen=10)` tanımlı bir kuyruk doluyken yeni bir eleman eklenirse ne olur?",
          "What occurs when appending to a full `deque(maxlen=10)` instance?"
        ],
        a: [
          "Hata vermez; en eski eleman karşı uçtan (sol baştan) sessizce atılır ve yeni eleman sağa eklenir. Otomatik dairesel tampon (ring buffer) davranışı sergiler.",
          "It discards the oldest item from the opposite end silently and appends the new entry, acting as an automatic bounded ring buffer."
        ]
      },
      {
        id: "defaultdict-factory-purpose",
        q: [
          "`defaultdict(list)` ile standart `dict` arasındaki temel fark nedir?",
          "What is the key functional difference between `defaultdict(list)` and a standard `dict`?"
        ],
        a: [
          "Henüz var olmayan bir anahtara erişildiğinde `KeyError` vermek yerine otomatik olarak `list()` çağırarak boş bir liste oluşturur ve onu anahtara atar.",
          "Accessing an uninitialized key invokes the factory (e.g. `list()`) and populates it with an empty list instead of raising `KeyError`."
        ]
      },
      {
        id: "chainmap-usecase",
        q: [
          "`ChainMap` ne işe yarar ve siber güvenlik araçlarında nerede kullanılır?",
          "What is the purpose of `ChainMap`, and where is it used in security tooling?"
        ],
        a: [
          "Birden fazla sözlüğü tek bir arama zincirinde birleştirir. Komut satırı argümanları, ortam değişkenleri ve varsayılan konfigürasyon dosyalarını öncelik sırasına göre okumak için idealdir.",
          "It chains multiple dictionaries into a single cascading lookup mapping, ideal for layering CLI flags, environment variables, and default configuration files."
        ]
      }
    ]
  });
})();

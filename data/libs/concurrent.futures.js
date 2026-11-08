(function () {
  const R = String.raw;
  PY.addLib({
    id: "concurrent.futures",
    name: "concurrent.futures",
    sym: "cf",
    color: "#eab308",
    focus: "both",
    level: 2,
    ext: false,
    cat: "concurrency",
    docs: "https://docs.python.org/3/library/concurrent.futures.html",
    tagline: [
      "Yüksek seviyeli eşzamanlılık — iş parçacığı havuzu (ThreadPool) ve çoklu işlemci (ProcessPool) ile hızlı tarayıcılar.",
      "High-level concurrency — thread and process worker pools for ultra-fast scanners and multi-core auditing."
    ],
    analogy: [
      "`threading` ve `multiprocessing` sana tek tek fabrika işçileri verir; her işçinin mesaisini, dinlenmesini ve kaza anını tek tek yönetmen gerekir. `concurrent.futures` ise işçi taşeronu (havuz) gibidir: 'Elimde 1000 tane taranacak port var, bana 50 kişilik bir ekip kur ve işi biten sonucu masama koysun' dersin. Ekip yöneticisi işleri dağıtır, sonuçları `as_completed` ile bitiş sırasına göre sana teslim eder.",
      "`threading` and `multiprocessing` give you individual factory workers whom you must instruct and monitor by hand. `concurrent.futures` is a smart crew manager: you hand it 1000 tasks, ask for a pool of 50 workers, and it streams completed findings via `as_completed` as soon as they finish, handling thread lifecycle automatically."
    ],
    intro: [
      [
        "`concurrent.futures` modülü, iş parçacıkları (`ThreadPoolExecutor`) ve bağımsız işlemler (`ProcessPoolExecutor`) üzerinde görevleri asenkron olarak yürütmek için Python'un en modern ve temiz arayüzüdür.",
        "The `concurrent.futures` module provides a clean, unified high-level abstraction for asynchronous execution using worker pools of threads (`ThreadPoolExecutor`) or independent processes (`ProcessPoolExecutor`)."
      ],
      [
        "Siber güvenlikte binlerce port veya web yolunu saniyeler içinde tarayan çok iş parçacıklı tarayıcılar (port scanner / path fuzzer) yazmak ve CPU tüketen kaba kuvvet / hash kırma işlemlerini tüm işlemci çekirdeklerine paylaştırmak için birincil araçtır.",
        "In cyber security, building high-throughput multi-threaded port scanners, web path fuzzers, and distributing CPU-bound hash cracking workloads across all available processor cores rely fundamentally on `concurrent.futures`."
      ]
    ],
    import: R`import concurrent.futures
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed`,
    general: [
      ["Ağ I/O beklemesi içeren yüzlerce HTTP isteğini aynı anda paralel yürütme.", "Executing hundreds of I/O-bound HTTP queries in parallel worker threads."],
      ["Görüntü işleme ve büyük veri hesaplamalarını çoklu işlemci havuzuna (`ProcessPoolExecutor`) dağıtma.", "Distributing CPU-intensive data transformations across multi-core process pools."],
      ["Görevlerin tamamlanma sırasına göre anında sonuçları tüketme (`as_completed`).", "Consuming completed worker outputs dynamically as they finish via `as_completed`."]
    ],
    cyberUse: [
      ["Yüksek Hızlı Port Tarama: 1000 portu tek tek sırayla taramak 5 dakika sürerken, `ThreadPoolExecutor(max_workers=50)` ile tüm taramayı birkaç saniyede tamamlama.", "High-throughput port scanning: accelerating 1000-port probes from minutes to seconds via bounded `ThreadPoolExecutor` worker pools."],
      ["Web Dizini Fuzzing (Path Discovery): Hedef sunucudaki `/admin`, `/login`, `/api` gibi yüzlerce gizli yolu paralel thread'lerle yoklayarak yanıt kodlarını yakalama.", "Parallel path fuzzing: discovering hidden web endpoints concurrently without serial round-trip latency overhead."],
      ["Çok Çekirdekli Hash Kırma: Python'un Global Interpreter Lock (GIL) sınırını aşmak için `ProcessPoolExecutor` kullanarak tüm CPU çekirdeklerinde paralel hash brute-force denemeleri yürütme.", "Multi-core hash cracking: bypassing Python's GIL via `ProcessPoolExecutor` to saturate all CPU cores during cryptographic search."]
    ],
    sections: [
      {
        id: "executor-pools",
        title: ["Havuz Yöneticileri ve Yürütme", "Executor Pools & Dispatch"],
        intro: [
          "`ThreadPoolExecutor` (I/O) ve `ProcessPoolExecutor` (CPU) sınıfları.",
          "Thread-based I/O concurrency versus process-based CPU parallelism."
        ],
        items: [
          {
            id: "threadpoolexecutor",
            name: "concurrent.futures.ThreadPoolExecutor(max_workers=None)",
            kind: "class",
            sig: "ThreadPoolExecutor(max_workers: int = None, thread_name_prefix: str = '')",
            sum: [
              "Ağ ve dosya I/O işlemleri için iş parçacığı havuzu yöneten sınıf.",
              "An Executor subclass that uses a pool of threads to execute calls asynchronously."
            ],
            desc: [
              "Ağ istekleri, soket bağlantıları ve veritabanı sorguları gibi I/O beklemeli işlerde idealdir. `with ThreadPoolExecutor(max_workers=20) as executor:` bloğu bittiğinde tüm thread'ler otomatik temizlenir.",
              "Optimized for I/O-bound tasks (network scanning, HTTP requests). The context manager guarantees graceful thread teardown."
            ],
            ex: {
              code: R`from concurrent.futures import ThreadPoolExecutor

def kare_al(n):
    return n * n

with ThreadPoolExecutor(max_workers=2) as executor:
    sonuclar = list(executor.map(kare_al, [1, 2, 3]))

print("Sonuclar:", sonuclar)`,
              out: R`Sonuclar: [1, 4, 9]`
            }
          },
          {
            id: "processpoolexecutor",
            name: "concurrent.futures.ProcessPoolExecutor(max_workers=None)",
            kind: "class",
            sig: "ProcessPoolExecutor(max_workers: int = None, mp_context=None)",
            sum: [
              "CPU yoğun işlemler için her çekirdekte ayrı bir Python süreci çalıştıran sınıf.",
              "An Executor subclass that uses a pool of processes to execute calls asynchronously."
            ],
            desc: [
              "Python GIL (Global Interpreter Lock) kilidini aşar. Hash kırma, şifreleme ve ağır veri ayrıştırma işlerinde gerçek donanımsal paralellik sağlar.",
              "Bypasses the GIL by spawning isolated processes, enabling true parallel multicore CPU computation."
            ],
            ex: {
              code: R`from concurrent.futures import ProcessPoolExecutor

# ProcessPoolExecutor sinif yapisinin kontrolu: ||| Verify ProcessPoolExecutor class structure:
print(isinstance(ProcessPoolExecutor, type))`,
              out: R`True`
            },
            cyber: [
              "Şifre kırma veya büyük log analizlerinde `ThreadPool` GIL yüzünden tek çekirdeğe sıkışır; tam CPU performansı için `ProcessPoolExecutor` şarttır.",
              "Hash brute-force and log disassembly saturate only 1 core under threads due to GIL; `ProcessPoolExecutor` unleashes all physical cores."
            ]
          },
          {
            id: "submit",
            name: "executor.submit(fn, *args, **kwargs)",
            kind: "method",
            sig: "executor.submit(fn: Callable, *args, **kwargs) -> Future",
            sum: [
              "Fonksiyonu havuza gönderir ve anında bir `Future` nesnesi döner.",
              "Schedules the callable to be executed and returns a Future representing execution."
            ],
            desc: [
              "Çağrıyı bloke etmeden hemen geri döner. Dönen `Future` nesnesi, arka plandaki görevin durumunu ve gelecekteki sonucunu temsil eder.",
              "Non-blocking dispatch returning an unresolved Future object monitoring execution."
            ],
            ex: {
              code: R`from concurrent.futures import ThreadPoolExecutor

def kontrol(hedef):
    return f"{hedef}:OK"

with ThreadPoolExecutor(max_workers=1) as ex:
    future = ex.submit(kontrol, "127.0.0.1")
    print("Sonuc:", future.result())`,
              out: R`Sonuc: 127.0.0.1:OK`
            }
          },
          {
            id: "map",
            name: "executor.map(func, *iterables, timeout=None)",
            kind: "method",
            sig: "executor.map(func: Callable, *iterables, timeout: float = None) -> Iterator",
            sum: [
              "Standart `map()` gibidir ancak fonksiyon çağrılarını havuzdaki işçilere paralel dağıtır.",
              "Equivalent to map(func, *iterables) but executes calls asynchronously across the pool."
            ],
            desc: [
              "Sonuçlar girdi sırasıyla döner. Hangi işin önce bittiği önemli değilse ve girdi sırası korunmak isteniyorsa en temiz yoldur.",
              "Maintains output ordering matching the input iterable sequence across asynchronous workers."
            ],
            ex: {
              code: R`from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=3) as ex:
    sonuc = list(ex.map(str.upper, ["tcp", "udp", "icmp"]))

print(sonuc)`,
              out: R`['TCP', 'UDP', 'ICMP']`
            }
          }
        ]
      },
      {
        id: "future-and-results",
        title: ["Future Nesneleri ve Sonuç Yönetimi", "Future Objects & Result Harvesting"],
        intro: [
          "`as_completed`, `wait` ve `Future` durumu denetimi.",
          "Harvesting completed tasks dynamically and monitoring promise states."
        ],
        items: [
          {
            id: "as-completed",
            name: "concurrent.futures.as_completed(fs, timeout=None)",
            kind: "function",
            sig: "as_completed(fs: Iterable[Future], timeout: float = None) -> Iterator[Future]",
            sum: [
              "Future nesnelerini tamamlanma sırasına göre akıtan bir iterator döner.",
              "An iterator over the given futures that yields each as it completes."
            ],
            desc: [
              "Ağ taramalarında en kritik fonksiyondur: Yavaş veya kapalı portları beklemek yerine, ilk yanıt veren açık portları bittikleri anda anında ekrana basmayı sağlar.",
              "Yields finished futures as soon as they complete without waiting for slower or unresponsive probes."
            ],
            ex: {
              code: R`from concurrent.futures import ThreadPoolExecutor, as_completed

def tara(port):
    return port, port in [80, 443]

with ThreadPoolExecutor(max_workers=2) as ex:
    gorevler = [ex.submit(tara, p) for p in [22, 80]]
    tamamlananlar = [f.result() for f in as_completed(gorevler)]

print("Tamamlanan gorev sayisi:", len(tamamlananlar))`,
              out: R`Tamamlanan gorev sayisi: 2`
            },
            cyber: [
              "10.000 hedef taranırken sonuçları tek tek liste sonunda beklemek yerine `as_completed` ile canlı log akışı oluşturulur.",
              "Stream live discovered telemetry dynamically via `as_completed` without waiting for long-tail timeouts."
            ]
          },
          {
            id: "future-result",
            name: "future.result(timeout=None)",
            kind: "method",
            sig: "future.result(timeout: float = None) -> Any",
            sum: [
              "Görevin dönüş değerini döner; henüz bitmemişse bitene kadar bekler.",
              "Return the value returned by the call. If the call hasn't completed, waits up to timeout."
            ],
            desc: [
              "Görev bir istisna (exception) fırlatarak çöktüyse, `result()` çağrıldığında aynı istisnayı yeniden fırlatır.",
              "Rethrows any exception raised during worker execution when retrieving results."
            ],
            ex: {
              code: R`from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=1) as ex:
    f = ex.submit(lambda: "BASARILI")
    print(f.result())`,
              out: R`BASARILI`
            }
          },
          {
            id: "future-done-cancel",
            name: "future.done() / future.cancel()",
            kind: "method",
            sig: "future.done() -> bool, future.cancel() -> bool",
            sum: [
              "Görevin bitip bitmediğini denetler veya henüz başlamamışsa iptal eder.",
              "Checks whether the call was cancelled or finished, or cancels pending calls."
            ],
            desc: [
              "Çalışmaya başlamış bir görev iptal edilemez (`cancel()` False döner); sadece kuyrukta bekleyen görevler iptal edilebilir.",
              "A running task cannot be cancelled; only calls still queued in the executor can be cancelled."
            ],
            ex: {
              code: R`from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=1) as ex:
    f = ex.submit(int, "42")
    print("Gorev bitti mi:", f.done() or f.result() == 42)`,
              out: R`Gorev bitti mi: True`
            }
          },
          {
            id: "wait-func",
            name: "concurrent.futures.wait(fs, timeout=None, return_when=ALL_COMPLETED)",
            kind: "function",
            sig: "wait(fs: Iterable[Future], timeout: float = None, return_when: str = ALL_COMPLETED)",
            sum: [
              "Belirtilen Future nesneleri tamamlanana kadar bekler; `(done, not_done)` ikilisi döner.",
              "Wait for the Future instances to resolve, partitioning them into done and not_done sets."
            ],
            desc: [
              "`return_when=FIRST_COMPLETED` seçeneği, ilk başarılı yanıt geldiğinde beklemeden devam etmek (örneğin ilk açılan proxy'yi seçmek) için kullanılır.",
              "Accepts `FIRST_COMPLETED` or `FIRST_EXCEPTION` to abort waiting as soon as the first target responds."
            ],
            ex: {
              code: R`from concurrent.futures import ThreadPoolExecutor, wait

with ThreadPoolExecutor(max_workers=2) as ex:
    gorevler = [ex.submit(lambda x: x * 2, i) for i in range(3)]
    done, not_done = wait(gorevler)

print("Biten sayisi:", len(done), "Kalan sayisi:", len(not_done))`,
              out: R`Biten sayisi: 3 Kalan sayisi: 0`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "multithreaded-port-scanner",
        title: [
          "Yüksek Hızlı Çok İş Parçacıklı Port Tarayıcı",
          "High-Speed Multithreaded TCP Port Scanner"
        ],
        sum: [
          "`ThreadPoolExecutor` ve `as_completed` ile yüzlerce portu paralel tarayıp açık portları anında yakalama.",
          "Scanning target port spaces concurrently using bounded worker thread pools."
        ],
        code: R`from concurrent.futures import ThreadPoolExecutor, as_completed
import socket

# Guvenli loopback hedefi uzerinde test: ||| Safe loopback target test:
HEDEF_IP = "127.0.0.1"
taranacak_portlar = [21, 22, 80, 443, 8080]

def tcp_port_tara(ip: str, port: int) -> tuple[int, bool]:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.05) # Kisa zaman asimi ||| Short timeout
    try:
        # connect_ex basarida 0 doner: ||| connect_ex returns 0 on success:
        sonuc = s.connect_ex((ip, port))
        return port, sonuc == 0
    except Exception:
        return port, False
    finally:
        s.close()

tarama_sonuclari = {}

# 10 is parcacikli havuzla paralel tara: ||| Scan concurrently with 10 worker threads:
with ThreadPoolExecutor(max_workers=10) as executor:
    gorevler = {executor.submit(tcp_port_tara, HEDEF_IP, port): port for port in taranacak_portlar}
    for future in as_completed(gorevler):
        port, acik_mi = future.result()
        tarama_sonuclari[port] = acik_mi

print("Tum portlar tarandi mi:", len(tarama_sonuclari) == len(taranacak_portlar))
print("Port 80 tarananlar arasinda mi:", 80 in tarama_sonuclari)`,
        out: R`Tum portlar tarandi mi: True
Port 80 tarananlar arasinda mi: True`,
        cyber: true,
        note: [
          "Seri tarama port başına zaman aşımı beklediği için saatler sürebilir. Thread havuzu oluşturmak ve `connect_ex` ile soketleri yönetmek tarama süresini saniyeler düzeyine indirir.",
          "Serial socket scanning blocks on connection timeouts. Thread pooling accelerates discovery exponentially while keeping thread contention bounded."
        ]
      },
      {
        id: "parallel-hash-cracker-sim",
        title: [
          "Çok Çekirdekli Paralel Hash Kırma Simülatörü",
          "Multiprocess Hash Search & Keyspace Partitioning"
        ],
        sum: [
          "`ThreadPoolExecutor` ile kelime listesi bloklarını paralel işçilere bölüştürerek hedef hash'i çözme.",
          "Distributing candidate wordlist slices across worker threads to locate target pre-images."
        ],
        code: R`from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib

HEDEF_HASH = hashlib.md5(b"gizli123").hexdigest()
kelime_listesi = ["admin", "root", "123456", "gizli123", "password", "deneme"]

def hash_kontrol(kelime: str) -> tuple[str, bool]:
    h = hashlib.md5(kelime.encode()).hexdigest()
    return kelime, h == HEDEF_HASH

bulunan_parola = None

with ThreadPoolExecutor(max_workers=4) as ex:
    gorevler = [ex.submit(hash_kontrol, k) for k in kelime_listesi]
    for future in as_completed(gorevler):
        kelime, eslesti_mi = future.result()
        if eslesti_mi:
            bulunan_parola = kelime
            break

print("Hedef hash basariyla cozuldu mu:", bulunan_parola == "gizli123")
print("Cozulen parola:", bulunan_parola)`,
        out: R`Hedef hash basariyla cozuldu mu: True
Cozulen parola: gizli123`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "threadpool-vs-processpool",
        q: [
          "`ThreadPoolExecutor` ile `ProcessPoolExecutor` ne zaman ve hangi amaçla seçilmelidir?",
          "When should `ThreadPoolExecutor` be chosen over `ProcessPoolExecutor`?"
        ],
        a: [
          "`ThreadPoolExecutor` ağ soketleri, HTTP istekleri ve dosya okuma gibi I/O beklemeli işlerde kullanılır (hafiftir). `ProcessPoolExecutor` ise hash kırma ve şifreleme gibi CPU yoran işlerde GIL kilidini aşıp tüm çekirdekleri çalıştırmak için seçilir.",
          "`ThreadPoolExecutor` suits I/O-bound tasks (port scanning, web queries) with low memory overhead. `ProcessPoolExecutor` bypasses Python's GIL to saturate all CPU cores for compute-heavy workloads like hash brute-forcing."
        ]
      },
      {
        id: "as-completed-advantage",
        q: [
          "`as_completed(futures)` fonksiyonunun ağ tarayıcılarındaki en büyük avantajı nedir?",
          "What is the key advantage of `as_completed(futures)` in network scanners?"
        ],
        a: [
          "Görevlerin başlatılma sırasını beklemez; hangi port veya sunucu önce yanıt verdiyse o sonucu anında üretir. Yavaş veya kapalı hedeflerin diğer açık hedefleri geciktirmesini engeller.",
          "It yields resolved futures out of order as soon as they finish. Unresponsive or filtered targets do not delay reporting findings from faster endpoints."
        ]
      },
      {
        id: "max-workers-tuning",
        q: [
          "`ThreadPoolExecutor(max_workers=...)` parametresi aşırı büyük (örn. 50.000) seçilirse ne olur?",
          "What happens if `max_workers` is set to an excessively large value (e.g. 50,000)?"
        ],
        a: [
          "İşletim sisteminin dosya tanıtıcısı (file descriptor) ve soket sınırları aşılır (`OSError: Too many open files`), aşırı RAM tüketimi olur ve thread bağlam değiştirme (context switching) performansı çökertir.",
          "The OS exhausts file descriptors (`Too many open files`) and memory. Excessive thread context-switching degrades CPU throughput."
        ]
      },
      {
        id: "future-exception-propagation",
        q: [
          "Bir thread içinde hata fırlatılırsa `concurrent.futures` bu hatayı nasıl ele alır?",
          "How does `concurrent.futures` handle exceptions raised inside a worker thread?"
        ],
        a: [
          "Hatayı o an yutmaz; arka planda saklar. Ana program `future.result()` çağırdığı anda o istisnayı ana thread'e yeniden fırlatır (re-raise eder).",
          "It captures the exception and preserves it. When the parent thread subsequently calls `future.result()`, the exception is re-raised for handling."
        ]
      },
      {
        id: "executor-context-manager",
        q: [
          "`with ThreadPoolExecutor() as executor:` bağlam yöneticisi (context manager) kullanmanın faydası nedir?",
          "What is the benefit of using `with ThreadPoolExecutor() as executor:` as a context manager?"
        ],
        a: [
          "Blok bittiğinde otomatik olarak `executor.shutdown(wait=True)` çağırır; arka planda yetim kalan (zombi) thread'lerin sızıntı yapmasını önler.",
          "It automatically calls `executor.shutdown(wait=True)` upon exiting the block, ensuring all worker threads terminate cleanly without leaking resources."
        ]
      }
    ]
  });
})();


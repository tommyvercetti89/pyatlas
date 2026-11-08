(function () {
  const R = String.raw;
  PY.addLib({
    id: "threading",
    name: "threading",
    sym: "th",
    color: "#8b5cf6",
    focus: "both",
    level: 2,
    ext: false,
    cat: "concurrency",
    docs: "https://docs.python.org/3/library/threading.html",
    tagline: [
      "İş parçacığı (thread) tabanlı eşzamanlılık: Hızlı port tarama ve I/O görevlerini paralel yürütme.",
      "Thread-based concurrency: High-speed port scanning and parallel network I/O execution."
    ],
    analogy: [
      "Tek bir aşçının bir yandan çorbanın kaynamasını bekleyip (I/O beklemesi) diğer yemeklere dokunamaması yerine, mutfağa 50 yardımcı aşçı almak gibidir. Biri ağdan gelen yanıtı beklerken diğeri diğer porta bağlanır. Aşçılar aynı tezgâhı (ortak belleği) paylaştığı için birbirlerinin malzemelerine çarpmaması için kilitler (`Lock`) kullanırlar.",
      "Instead of a single chef staring idly at a pot waiting for water to boil (I/O wait), you deploy 50 kitchen assistants. While one waits for a network socket response, others actively probe other ports. Because they share the same counter (shared memory), they use access locks (`Lock`) to prevent collision."
    ],
    intro: [
      [
        "`threading` modülü, Python süreçleri içinde birden fazla eşzamanlı iş parçacığı (thread) çalıştırmayı sağlar. İş parçacıkları aynı bellek alanını paylaşır ve özellikle ağ (I/O) beklemesi olan operasyonları muazzam şekilde hızlandırır.",
        "The `threading` module enables concurrent execution of multiple threads sharing the same process memory space, providing massive acceleration for network I/O-bound tasks."
      ],
      [
        "Siber güvenlik araçlarında hız her şeydir: tek iş parçacıklı bir port tarayıcı 1000 portu tararken dakikalarca beklerken, 50-100 iş parçacıklı bir tarayıcı aynı taramayı saniyeler içinde tamamlar. Ancak ortak bellek paylaşımı yarış durumu (race condition) doğurabileceğinden `Lock` mekanizması kritik öneme sahiptir.",
        "In cybersecurity, concurrency is crucial for speed: single-threaded port scans take minutes, whereas a threaded worker pool scans hundreds of targets in seconds. Proper synchronization via `Lock` is required to avoid race conditions."
      ]
    ],
    import: R`import threading`,
    general: [
      [
        "Ağ isteklerini (HTTP, soket, DNS) paralel göndererek toplam bekleme süresini minimize etmek.",
        "Issuing parallel network requests (HTTP, sockets) to minimize total idle latency."
      ],
      [
        "Kullanıcı arayüzünü (GUI / CLI) dondurmadan arka planda uzun süren görevler çalıştırmak.",
        "Offloading background work without freezing responsive user interfaces."
      ],
      [
        "`queue.Queue` ile işçi havuzu (Worker Pool) tasarım desenleri kurmak.",
        "Implementing resilient producer-consumer worker pools with `queue.Queue`."
      ]
    ],
    cyberUse: [
      [
        "Çok İş Parçacıklı Port Tarayıcı: Belirlenen port aralığını 50 eşzamanlı thread ile saniyeler içinde denetlemek.",
        "High-performance port scanning by assigning ports to concurrent worker threads."
      ],
      [
        "Paralel Dizin Fuzzing (Web Discovery): Yetkili lab ortamlarında gizli URL yollarını eşzamanlı taramak.",
        "Multi-threaded directory fuzzing and endpoint discovery against lab web apps."
      ],
      [
        "Paylaşılan log sayaçlarında ve tarama raporlarında yarış durumlarını (Race Condition) `threading.Lock` ile önlemek.",
        "Eliminating race conditions in shared telemetry counters using `threading.Lock`."
      ]
    ],
    sections: [
      {
        id: "threads-lifecycle",
        title: ["Thread Nesnesi ve Yaşam Döngüsü", "Thread Object & Lifecycle"],
        intro: [
          "İş parçacığı oluşturma, başlatma (`start`) ve tamamlanmasını bekleme (`join`).",
          "Creating, starting, and synchronizing threads."
        ],
        items: [
          {
            id: "thread-class",
            name: "threading.Thread(target, args, ...)",
            kind: "class",
            sig: "threading.Thread(target=None, name=None, args=(), kwargs={}, daemon=None)",
            sum: [
              "Yeni bir iş parçacığı (Thread) nesnesi oluşturur.",
              "Instantiates a new Thread object encapsulating a callable target."
            ],
            desc: [
              "`target`, arka planda çalıştırılacak fonksiyondur; `args` ise fonksiyona geçirilecek parametreler demetidir. `daemon=True` yapılırsa ana program kapandığında thread'in bitmesi beklenmeden anında sonlandırılır.",
              "Encapsulates an activity to run in a separate thread of control. If `daemon=True`, the thread will terminate abruptly when the main program exits."
            ],
            params: [
              { n: "target", d: ["Çalıştırılacak fonksiyon veya çağrılabilir nesne.", "Callable object to be invoked by the run() method."] },
              { n: "args", d: ["Fonksiyona aktarılacak argümanlar demeti (`tuple`).", "Tuple of positional arguments for the target invocation."] },
              { n: "daemon", d: ["Arka plan servis iş parçacığı bayrağı (`bool`).", "Boolean flag designating a daemon thread."] }
            ],
            ret: ["`threading.Thread` nesnesi.", "`threading.Thread` instance."],
            ex: {
              code: R`import threading

sonuc = []
def worker(val):
    sonuc.append(val * 2)

t = threading.Thread(target=worker, args=(21,))
t.start()
t.join()
print(sonuc[0])`,
              out: R`42`
            }
          },
          {
            id: "start",
            name: "thread.start()",
            kind: "method",
            sig: "thread.start()",
            sum: [
              "İş parçacığının faaliyetini başlatır (run metodunu çağırır).",
              "Starts the thread's activity by scheduling its target function."
            ],
            desc: [
              "İşletim sistemine yeni bir iş parçacığı oluşturması talimatını verir ve hemen geri döner (asenkron). Her thread nesnesinde yalnızca bir kez çağrılabilir.",
              "Schedules the thread for execution and returns immediately. Must be called at most once per thread object."
            ],
            ex: {
              code: R`import threading

t = threading.Thread(target=lambda: None)
print(t.is_alive())
t.start()
print(isinstance(t.ident, int))
t.join()`,
              out: R`False
True`
            }
          },
          {
            id: "join",
            name: "thread.join(timeout=None)",
            kind: "method",
            sig: "thread.join(timeout=None)",
            sum: [
              "İş parçacığı tamamlanana kadar çağıran ana programı bekletir (bloklar).",
              "Blocks the calling thread until the thread whose join() was called terminates."
            ],
            desc: [
              "Thread işini bitirene kadar ana kod akışını bekletir. Çok iş parçacıklı tarayıcılarda tüm thread'lerin işi bittiğinde nihai raporu basmak için tüm thread'lere `join()` çağrılır.",
              "Synchronizes thread completion. Used in scanners to pause execution until all worker threads finish checking their assigned targets."
            ],
            params: [
              { n: "timeout", d: ["Maksimum bekleme süresi saniye cinsinden (`float`).", "Maximum blocking duration in seconds."] }
            ],
            ex: {
              code: R`import threading

done = False
def task():
    global done
    done = True

t = threading.Thread(target=task)
t.start()
t.join()
print("Bitti mi:", done)`,
              out: R`Bitti mi: True`
            }
          }
        ]
      },
      {
        id: "synchronization",
        title: ["Senkronizasyon: Lock ve Event", "Synchronization: Lock & Event"],
        intro: [
          "Ortak kaynakları koruma (Lock) ve iş parçacıkları arası sinyalleşme (Event).",
          "Preventing race conditions via Lock and thread coordination with Event."
        ],
        items: [
          {
            id: "lock-class",
            name: "threading.Lock()",
            kind: "class",
            sig: "threading.Lock() -> Lock",
            sum: [
              "Yarış durumlarını (Race Condition) önleyen ilkel karşılıklı dışlama (Mutual Exclusion) kilidi.",
              "Primitive mutual exclusion lock to synchronize access to shared resources."
            ],
            desc: [
              "İki temel duruma sahiptir: kilitli (`locked`) veya açık (`unlocked`). `with lock:` bloğu kullanıldığında aynı anda yalnızca TEK bir iş parçacığı o kod bloğunu çalıştırabilir; diğerleri kilit açılana kadar sırada bekler.",
              "Enforces that only one thread can access critical code sections simultaneously. Using `with lock:` safely acquires and releases the lock."
            ],
            ret: ["`threading.Lock` nesnesi.", "`threading.Lock` instance."],
            ex: {
              code: R`import threading

lock = threading.Lock()
sayac = 0

def guvenli_arttir():
    global sayac
    with lock:
        sayac += 1

threads = [threading.Thread(target=guvenli_arttir) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()
print("Son sayac:", sayac)`,
              out: R`Son sayac: 10`
            },
            cyber: [
              "Tarayıcılarda bulunan açık portları ekrana veya rapora yazarken kilit kullanılmazsa, iki thread aynı anda ekrana yazarak log metinlerini birbirine karıştırabilir.",
              "Logging discoveries from multiple concurrent workers requires a `Lock` to prevent interleaved terminal corruption."
            ]
          },
          {
            id: "event-class",
            name: "threading.Event()",
            kind: "class",
            sig: "threading.Event() -> Event",
            sum: [
              "İş parçacıkları arasında güvenli durdurma veya başlama sinyalleri iletir.",
              "Thread communication mechanism acting as a simple boolean signal flag."
            ],
            desc: [
              "Bir thread'in diğer thread'lere 'çalışmayı durdur' veya 'başla' sinyali vermesi için en temiz mekanizmadır. `event.set()` bayrağı açar, `event.is_set()` sorgular, `event.wait()` ise bayrak açılana kadar bekler.",
              "A thread-safe boolean flag. Used to implement graceful cancellation tokens (e.g. aborting scans on Ctrl+C)."
            ],
            ex: {
              code: R`import threading

stop_signal = threading.Event()
print("Baslangicta set mi:", stop_signal.is_set())
stop_signal.set()
print("set() sonrasi:", stop_signal.is_set())`,
              out: R`Baslangicta set mi: False
set() sonrasi: True`
            }
          },
          {
            id: "gil-concept",
            name: "Kavram: Global Interpreter Lock (GIL) ve Ağ (I/O)",
            kind: "concept",
            sig: "GIL: CPU-bound vs I/O-bound",
            sum: [
              "Python GIL mekanizması ve threading'in neden ağ taramalarında mükemmel çalıştığı.",
              "Why threading excels in network I/O despite CPython's Global Interpreter Lock."
            ],
            desc: [
              "CPython'daki GIL, aynı anda yalnızca bir thread'in Python baytkodunu yürütmesine izin verir. Bu nedenle ağır matematiksel (CPU-bound) işlerde thread hızlandırmaz. ANCAK soket veya dosya işlemlerinde (I/O-bound) Python soket beklemesine girdiği anda GIL'i serbest bırakır. Bu sayede ağ tarayıcılarında threading devasa bir hız artışı sağlar.",
              "The GIL permits only one thread to execute Python bytecode at once, limiting CPU-bound tasks. However, during network socket operations, CPython releases the GIL, allowing hundreds of concurrent I/O operations."
            ],
            ex: {
              code: R`import threading

# I/O beklemelerinde thread'ler paralel calisabilir ||| Threads excel at I/O operations
print(threading.active_count() >= 1)`,
              out: R`True`
            }
          },
          {
            id: "daemon-threads",
            name: "Daemon (Arka Plan) Thread Kavramı",
            kind: "concept",
            sig: "thread.daemon = True",
            sum: [
              "Ana program bittiğinde otomatik kapanan arka plan iş parçacıkları.",
              "Background threads that automatically die when the main process exits."
            ],
            desc: [
              "Normal (non-daemon) thread'ler çalıştığı sürece ana Python programı kapanmaz; bekler. `daemon=True` yapılan bir thread ise ana program kapanırken arkada açık kalsa dahi programın anında kapanmasını engellemez. Arka plan izleme görevlerinde kullanılır.",
              "Non-daemon threads keep Python running until they finish. Daemon threads are aborted instantly when all non-daemon threads exit, preventing hung processes."
            ],
            ex: {
              code: R`import threading

t = threading.Thread(target=lambda: None, daemon=True)
print("Daemon mi:", t.daemon)`,
              out: R`Daemon mi: True`
            }
          },
          {
            id: "queue-worker-pattern",
            name: "queue.Queue ile İşçi Havuzu (Worker Pattern)",
            kind: "concept",
            sig: "from queue import Queue; q.put(), q.get(), q.task_done()",
            sum: [
              "İş parçacıklarına güvenle görev dağıtan iş parçacığı güvenli (thread-safe) kuyruk.",
              "Thread-safe FIFO queue designed specifically for producer-consumer worker architectures."
            ],
            desc: [
              "10.000 portu taramak için 10.000 thread açmak sistemi çökertir. Doğru yöntem: 50 sabit 'işçi' (worker) thread açmak ve portları bir `queue.Queue` içine koymaktır. İşçiler kuyruktan sırayla port alıp tararlar.",
              "Spawning thousands of threads crashes the OS. The professional pattern creates a pool of 50 worker threads fed by a thread-safe `queue.Queue`."
            ],
            ex: {
              code: R`from queue import Queue

q = Queue()
q.put(80)
q.put(443)
print(q.get())
print(q.get())
print(q.empty())`,
              out: R`80
443
True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "threaded-port-scanner",
        title: [
          "Çok İş Parçacıklı Hızlı Port Tarayıcı (Worker Pool)",
          "Multi-Threaded High-Speed Port Checker (Worker Pool)"
        ],
        sum: [
          "Kuyruk (Queue) ve iş parçacıkları kullanarak portları paralel tarama.",
          "Auditing a series of ports concurrently using worker threads and a queue."
        ],
        code: R`import socket
import threading
from queue import Queue

# 1. Test icin yerel dinleyici ac ||| Mock open port listener
server = socket.socket()
server.bind(("127.0.0.1", 0))
open_port = server.getsockname()[1]
server.listen(1)

# 2. Tarayici havuzu ||| Worker scanner pool
q = Queue()
open_ports = []
lock = threading.Lock()

def worker():
    while not q.empty():
        port = q.get()
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.2)
            if s.connect_ex(("127.0.0.1", port)) == 0:
                with lock:
                    open_ports.append(port)
        q.task_done()

# Hedef portlari kuyruga at ||| Feed target ports into queue
test_ports = [open_port, open_port + 1]
for p in test_ports:
    q.put(p)

# 4 adet isci thread baslat ||| Spawn 4 worker threads
threads = [threading.Thread(target=worker, daemon=True) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()

print(f"Acik Portlar: {sorted(open_ports) == [open_port]}")
server.close()`,
        out: R`Acik Portlar: True`,
        cyber: true,
        note: [
          "İşçi havuzu (worker pool) deseni, sistem kaynaklarını tüketmeden binlerce portu saniyeler içinde taramanın en optimize yoludur.",
          "Worker pool architecture guarantees predictable concurrency without thread exhaustion."
        ]
      },
      {
        id: "graceful-stop-scanner",
        title: [
          "İptal Edilebilir Tarama Görevi (Event ile Graceful Stop)",
          "Cancellable Background Task via Event Signaling"
        ],
        sum: [
          "`threading.Event` ile arka plan tarama görevini güvenle yarıda kesme.",
          "Terminating long-running background scanning threads gracefully using an Event."
        ],
        code: R`import threading
import time

stop_event = threading.Event()
processed = 0

def background_monitor():
    global processed
    for _ in range(1000000):
        if stop_event.is_set():
            break
        processed += 1

t = threading.Thread(target=background_monitor)
t.start()
# Gorevi hemen iptal et ||| Signal abort
stop_event.set()
t.join()

print("Durduruldu, islenen oge sayisi < 1M:", processed < 1000000)`,
        out: R`Durduruldu, islenen oge sayisi < 1M: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "gil-io-speedup",
        q: [
          "Python'da GIL olmasına rağmen `threading` neden ağ (I/O) işlemlerini çok ciddi oranda hızlandırır?",
          "Why does `threading` provide massive speedups for network I/O despite Python's GIL?"
        ],
        a: [
          "Çünkü Python bir soket beklemesine (I/O wait) girdiği anda C düzeyinde GIL'i otomatik olarak serbest bırakır. Bir thread uzak sunucudan yanıt beklerken diğer thread'ler ağa yeni paketler gönderebilir.",
          "Because CPython automatically releases the GIL during socket I/O waits, allowing concurrent threads to utilize network bandwidth while others await replies."
        ]
      },
      {
        id: "race-condition-definition",
        q: [
          "Siber güvenlik ve eşzamanlılıkta 'Yarış Durumu' (Race Condition) nedir ve nasıl önlenir?",
          "What is a Race Condition in concurrent code and how is it eliminated?"
        ],
        a: [
          "İki veya daha fazla thread'in aynı paylaşılan veriyi (örneğin bir sayaç veya bakiye) aynı anda okuyup değiştirmeye çalışması sonucu verinin bozulmasıdır. `threading.Lock` kullanılarak kritik kod blokları korunur.",
          "Occurs when concurrent threads unsafely read and mutate shared state simultaneously, corrupting data. Resolved by serializing access using `threading.Lock`."
        ]
      },
      {
        id: "daemon-thread-difference",
        q: [
          "Bir iş parçacığını `daemon=True` olarak ayarlamanın pratik sonucu nedir?",
          "What is the practical effect of setting `daemon=True` on a Thread?"
        ],
        a: [
          "Ana program bittiğinde, daemon thread'in işinin bitmesi beklenmez; anında işletim sistemi tarafından sonlandırılır. Programın arka planda takılı kalmasını önler.",
          "Daemon threads are abruptly killed when all regular non-daemon threads exit, preventing the Python process from hanging in the background."
        ]
      },
      {
        id: "worker-pool-queue-pattern",
        q: [
          "Neden 65.535 portu taramak için 65.535 adet thread açmak yerine `queue.Queue` ile bir işçi havuzu (worker pool) kurulmalıdır?",
          "Why should a worker pool with `queue.Queue` be used rather than spawning 65,535 individual threads?"
        ],
        a: [
          "Her thread işletim sisteminde bellek ve tanıtıcı (file descriptor) harcar. Binlerce thread açmak bellek tükenmesine (OOM) ve çökmeye yol açar. 50-100 işçili sabit bir havuz sistemi yormadan kuyruktaki işleri sırayla bitirir.",
          "Every thread incurs OS stack and file descriptor overhead. Spawning thousands causes Out-Of-Memory crashes. A fixed pool of 50-100 workers drains queue tasks safely."
        ]
      },
      {
        id: "thread-join-purpose",
        q: [
          "Çok iş parçacıklı bir tarayıcıda `thread.join()` döngüsü ne zaman ve neden çağrılır?",
          "When and why is a `thread.join()` loop executed in a multi-threaded scanner?"
        ],
        a: [
          "Tüm iş parçacıkları başlatıldıktan sonra, ana programın tarama bitmeden erken kapanmasını önlemek ve tüm tarama sonuçları hazır olana kadar beklemek için çağrılır.",
          "Invoked after starting workers to block the main thread until every background task concludes, ensuring complete results before generating reports."
        ]
      }
    ]
  });
})();

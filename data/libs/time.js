(function () {
  const R = String.raw;
  PY.addLib({
    id: "time",
    name: "time",
    sym: "tm",
    color: "#f59e0b",
    focus: "both",
    level: 1,
    ext: false,
    cat: "time",
    docs: "https://docs.python.org/3/library/time.html",
    tagline: [
      "Düşük seviyeli zaman erişimi, yüksek çözünürlüklü sayaçlar, gecikme ve hız sınırlama.",
      "Low-level time access, high-resolution monotonic benchmarking, sleeping, and rate limiting."
    ],
    analogy: [
      "`datetime` bir takvim ve ajandadır (hangi ay, hangi gün, saat dilimi ne). `time` ise saf bir kronometre ve kum saatidir: 'burada 2 saniye bekle', 'bu fonksiyon kaç milisaniyede bitti', '1970'ten beri kaç saniye geçti'. Basit, doğrudan ve makine seviyesindedir.",
      "`datetime` is a calendar and agenda (months, days, timezones). `time` is a raw stopwatch and hourglass: 'wait here 2 seconds', 'how many nanoseconds did this function take', 'how many seconds have elapsed since 1970'. Direct, lightweight, and machine-level."
    ],
    intro: [
      [
        "`time` modülü, C kütüphanesinin zaman fonksiyonlarına doğrudan arayüz sağlar. Takvim hesaplamalarıyla uğraşmadan geçen süreyi ölçmek (`perf_counter`), programı bekletmek (`sleep`) ve POSIX epoch zaman damgasını (`time`) almak için kullanılır.",
        "The `time` module provides low-level C runtime time functions. It excels at measuring execution elapsed time (`perf_counter`), yielding execution threads (`sleep`), and querying the POSIX epoch timestamp (`time`)."
      ],
      [
        "Siber güvenlikte ağ taramalarında IDS/IPS tespitinden kaçınmak için istek aralarına gecikme koyma (`sleep`), parola karşılaştırma algoritmalarında zamanlama sızıntılarını (timing attack) tespit eden hassas mikrosaniye ölçümleri ve sistem saati sıfırlansa bile asla geriye akmayan monotonik sayaçlar (`monotonic`) için temel araçtır.",
        "In cyber security, pacing network scans to evade IDS detection (`sleep`), analyzing microsecond latency variances in timing attack research (`perf_counter`), and tracking timeouts with rollback-immune timers (`monotonic`) depend fundamentally on `time`."
      ]
    ],
    import: R`import time`,
    general: [
      ["Kod bloklarının ve veritabanı sorgularının çalışma performansını milisaniye cinsinden ölçme.", "Benchmarking function runtimes and database query performance in milliseconds."],
      ["Döngüler arasına duraklama (`sleep`) koyarak CPU tüketimini ve API limitlerini (rate limit) yönetme.", "Adding pauses between polling loops to manage CPU cycles and API rate quotas."],
      ["Dosya veya olay kayıtlarına 1970 tabanlı sayısal epoch zaman damgası ekleme.", "Attaching numeric epoch timestamps to lightweight event logs."]
    ],
    cyberUse: [
      ["Zamanlama saldırısı (Timing Attack) tespiti: `perf_counter` ile bir algoritmanın farklı girdilerdeki tepki sürelerini nanosaniye hassasiyetinde ölçerek kriptografik sızıntıları yakalama.", "Timing attack research: measuring microsecond response differentials with `perf_counter` to identify cryptographic timing side-channels."],
      ["Ağ taraması pürüzsüzleştirme (Evasion): Port tarama veya kaba kuvvet (brute-force) scriptlerinde sabit hız yerine `sleep(random.uniform(0.5, 2.0))` uygulayarak IDS kural eşiklerini atlatma.", "IDS evasion & pacing: jittering port scan or brute-force intervals with randomized `sleep` to stay under threshold alerting rules."],
      ["Geriye sarılamaz zaman (`monotonic`): NTP senkronizasyonunda veya saldırganın sistem saatini manipüle ettiği durumlarda bile asla geriye gitmeyen güvenlik zamanlayıcıları kurma.", "Rollback-immune timers: leveraging `monotonic` for timeouts that remain uncompromised even if system clock jumps or NTP recalibrates."]
    ],
    sections: [
      {
        id: "timers-and-counters",
        title: ["Sayaçlar ve Yüksek Çözünürlüklü Ölçüm", "Counters & High-Res Benchmarking"],
        intro: [
          "`time()`, `perf_counter()` ve saat sıçramalarından etkilenmeyen `monotonic()`.",
          "Epoch clocks, monotonic counters, and high-precision timers."
        ],
        items: [
          {
            id: "time-func",
            name: "time.time()",
            kind: "function",
            sig: "time.time() -> float",
            sum: [
              "1 Ocak 1970 00:00:00 UTC (Unix Epoch) tarihinden bu yana geçen saniyeyi döner.",
              "Returns the current time in seconds since the Epoch as a floating-point number."
            ],
            desc: [
              "Sistem duvar saatini (wall-clock) okur. Kullanıcı sistem saatini değiştirirse veya NTP düzeltmesi yapılırsa bu değer ileri ya da geri sıçrayabilir; bu yüzden süre ölçümünde değil sadece 'anlık tarih damgası' olarak kullanılmalıdır.",
              "Reads system wall clock. Susceptible to NTP adjustments and manual clock changes; recommended for absolute timestamps rather than elapsed duration benchmarking."
            ],
            ex: {
              code: R`import time

epoch_simdi = time.time()
print(isinstance(epoch_simdi, float), epoch_simdi > 1700000000)`,
              out: R`True True`
            }
          },
          {
            id: "perf-counter",
            name: "time.perf_counter()",
            kind: "function",
            sig: "time.perf_counter() -> float",
            sum: [
              "Kısa süreleri ölçmek için en yüksek çözünürlüklü performans sayacını döner.",
              "Returns the float value of the highest available resolution performance counter."
            ],
            desc: [
              "İşlemcinin donanımsal yüksek hassasiyetli saatini kullanır. Uyku sürelerini de hesaba katar. Kriptografik fonksiyonların veya ağ sorgularının kaç mikrosaniyede bittiğini test etmek için altın standarttır.",
              "Hardware-backed high-resolution timer including sleep duration. Gold standard for microsecond profiling and cryptographic latency auditing."
            ],
            ex: {
              code: R`import time

t0 = time.perf_counter()
toplam = sum(i * i for i in range(10000))
t1 = time.perf_counter()

gecen_sure = t1 - t0
print(gecen_sure >= 0, isinstance(gecen_sure, float))`,
              out: R`True True`
            },
            cyber: [
              "Kriptografik timing saldırısı deneylerinde `time.time()` yerine mutlaka `time.perf_counter()` veya `time.perf_counter_ns()` kullanılmalıdır.",
              "For timing attack simulations and side-channel leak analysis, always rely on `perf_counter` or `perf_counter_ns`."
            ]
          },
          {
            id: "monotonic",
            name: "time.monotonic()",
            kind: "function",
            sig: "time.monotonic() -> float",
            sum: [
              "Asla geriye gitmeyen (monotonik) bir saatin değerini saniye cinsinden döner.",
              "Returns the value of a monotonic clock that cannot go backwards."
            ],
            desc: [
              "Başlangıç noktası tanımsızdır (genelde sistemin açılış anıdır). Sistem saati NTP ile geri alınsa bile monotonik sayaç sadece ileri doğru sayar. Güvenlik oturumlarının süre sınırını (timeout) korumak için en güvenilir saattir.",
              "Immune to system clock changes or daylight saving shifts. The reference point is undefined, making it strictly intended for delta comparisons and security timeouts."
            ],
            ex: {
              code: R`import time

m1 = time.monotonic()
time.sleep(0.01) # kisa bir bekleme ||| brief pause
m2 = time.monotonic()

print(m2 > m1)`,
              out: R`True`
            }
          },
          {
            id: "perf-counter-ns",
            name: "time.perf_counter_ns()",
            kind: "function",
            sig: "time.perf_counter_ns() -> int",
            sum: [
              "Performans sayacını tamsayı (int) nanosaniye olarak döner.",
              "Returns the performance counter as an integer number of nanoseconds."
            ],
            desc: [
              "Kayan noktalı (float) sayıların yaratabileceği yuvarlama ve hassasiyet kayıplarını sıfıra indirir. Aşırı hızlı mikro işlemlerde kesin fark hesabı için kullanılır.",
              "Eliminates float precision rounding errors by expressing duration in integer nanoseconds."
            ],
            ex: {
              code: R`import time

ns0 = time.perf_counter_ns()
x = 100 ** 100
ns1 = time.perf_counter_ns()

print(isinstance(ns1 - ns0, int), ns1 >= ns0)`,
              out: R`True True`
            }
          }
        ]
      },
      {
        id: "delay-and-structures",
        title: ["Bekletme ve Zaman Yapıları", "Pausing & Time Structures"],
        intro: [
          "`sleep()` ile akışı durdurma ve `struct_time` dönüşümleri.",
          "Thread execution pauses and C-level time tuple conversions."
        ],
        items: [
          {
            id: "sleep",
            name: "time.sleep(secs)",
            kind: "function",
            sig: "time.sleep(secs: float | int) -> None",
            sum: [
              "Geçerli thread'in çalışmasını belirtilen saniye kadar duraklatır.",
              "Suspends execution of the calling thread for the given number of seconds."
            ],
            desc: [
              "Ondalıklı sayılar kabul eder (`time.sleep(0.25)` = çeyrek saniye). Ağ taramalarında hız kesmek (rate limiting) ve IDS/IPS sistemlerinin dikkatini çekmemek için aralıklara konur.",
              "Accepts floating-point arguments. Essential for spacing network probes to avoid triggering threshold-based IDS/IPS alarms."
            ],
            ex: {
              code: R`import time

baslangic = time.perf_counter()
time.sleep(0.02)
gecen = time.perf_counter() - baslangic

print(gecen >= 0.015)`,
              out: R`True`
            },
            cyber: [
              "Otomasyon araçlarında sabit `sleep(1)` kullanmak imza bırakır. Bunun yerine `time.sleep(random.uniform(0.8, 2.5))` kullanarak istek zamanlarını insan benzeri dalgalı hale getirin.",
              "Avoid rigid constant sleep delays; introduce jitter via `time.sleep(random.uniform(0.8, 2.5))` to mimic human variance."
            ]
          },
          {
            id: "gmtime",
            name: "time.gmtime([secs])",
            kind: "function",
            sig: "time.gmtime(secs: float = None) -> struct_time",
            sum: [
              "Epoch saniyesini UTC saat diliminde `struct_time` nesnesine çevirir.",
              "Converts a time expressed in seconds since the epoch to a struct_time in UTC."
            ],
            desc: [
              "Parametre verilmezse o anki saati alır. Dönen nesne `tm_year`, `tm_mon`, `tm_mday`, `tm_hour` gibi alanlar sunar.",
              "Returns a 9-item sequence/tuple representing UTC calendar components."
            ],
            ex: {
              code: R`import time

st = time.gmtime(1700000000)
print(st.tm_year, st.tm_mon, st.tm_mday)`,
              out: R`2023 11 14`
            }
          },
          {
            id: "localtime",
            name: "time.localtime([secs])",
            kind: "function",
            sig: "time.localtime(secs: float = None) -> struct_time",
            sum: [
              "Epoch saniyesini yerel sistem saat diliminde `struct_time` nesnesine çevirir.",
              "Converts a time expressed in seconds since the epoch to a struct_time in local time."
            ],
            desc: [
              "İşletim sisteminin o anki coğrafi saat dilimini ve yaz saati uygulamasını (DST) hesaba katar.",
              "Interprets epoch seconds according to the host machine's configured local timezone."
            ],
            ex: {
              code: R`import time

st_yerel = time.localtime()
print(isinstance(st_yerel.tm_hour, int))`,
              out: R`True`
            }
          },
          {
            id: "ctime",
            name: "time.ctime([secs])",
            kind: "function",
            sig: "time.ctime(secs: float = None) -> str",
            sum: [
              "Epoch saniyesini doğrudan okunabilir ASCII tarih metnine çevirir.",
              "Converts a time in seconds since the epoch to a string representing local time."
            ],
            desc: [
              "`'Sun Nov  8 14:35:10 2026'` biçiminde sabit 24 karakterlik metin üretir. Hızlı konsol loglamasında kullanılır.",
              "Produces a standardized 24-character human-readable timestamp string."
            ],
            ex: {
              code: R`import time

metin = time.ctime(1700000000)
print(isinstance(metin, str), len(metin) == 24)`,
              out: R`True True`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "rate-limited-scanner",
        title: [
          "Dalgalı (Jitter) Hız Sınırlayıcı ve IDS Atlatma Simülatörü",
          "Jittered Rate Limiter for IDS Alert Avoidance"
        ],
        sum: [
          "İstekler arasına rastgele mikro gecikmeler (`sleep`) ekleyerek sabit imza oluşumunu engelleme.",
          "Injecting randomized jitter delays into probe loops to bypass threshold-based detection rules."
        ],
        code: R`import time
import random

# Taranacak ornek port/hedef listesi: ||| Sample targets to inspect:
hedefler = [80, 443, 8080]
olculen_araliklar = []

son_zaman = time.perf_counter()

for hedef in hedefler:
    # 10 ile 25 milisaniye arasi rastgele dalgalanma (jitter): ||| Random jitter between 10 and 25 ms:
    jitter = random.uniform(0.010, 0.025)
    time.sleep(jitter)
    
    simdi = time.perf_counter()
    olculen_araliklar.append(simdi - son_zaman)
    son_zaman = simdi

print("Tum hedefler tarandi mi:", len(olculen_araliklar) == 3)
print("Araliklar sifirdan buyuk mu:", all(aralik >= 0.009 for aralik in olculen_araliklar))`,
        out: R`Tum hedefler tarandi mi: True
Araliklar sifirdan buyuk mu: True`,
        cyber: true,
        note: [
          "Güvenlik cihazları (WAF, IDS) saniyede sabit aralıkla (örn. tam 100ms) gelen istekleri bot olarak işaretler. Rastgele gecikme eklemek trafiğin insani görünmesini sağlar.",
          "Network defenses flag isochronous (strictly periodic) requests as automated bots; adding randomized jitter masks scanning traffic."
        ]
      },
      {
        id: "timing-attack-benchmarker",
        title: [
          "Zamanlama Saldırısı Yan-Kanal Ölçüm Laboratuvarı",
          "Side-Channel Timing Differential Benchmarker"
        ],
        sum: [
          "`perf_counter_ns` ile erken dönen `==` operatörü ile sabit zamanlı kontrol arasındaki farkı yakalama.",
          "Measuring nanosecond latency discrepancies between short-circuiting equality and constant-time checks."
        ],
        code: R`import time
import hmac

gizli_token = "K" * 100
yanlis_token_erken = "X" + ("K" * 99) # Ilk karakter hatali ||| First char differs
yanlis_token_gec = ("K" * 99) + "X"   # Son karakter hatali ||| Last char differs

# Standart == kiyaslamasinin suresini olcelim: ||| Measure standard == operator:
t0 = time.perf_counter_ns()
_ = (gizli_token == yanlis_token_erken)
sure_erken = time.perf_counter_ns() - t0

t0 = time.perf_counter_ns()
_ = (gizli_token == yanlis_token_gec)
sure_gec = time.perf_counter_ns() - t0

# Sabit zamanli hmac.compare_digest kiyaslamasi: ||| Constant-time comparison:
t0 = time.perf_counter_ns()
_ = hmac.compare_digest(gizli_token, yanlis_token_erken)
sure_sabit = time.perf_counter_ns() - t0

print("Olcumler tamamlandi mi:", sure_erken >= 0 and sure_gec >= 0 and sure_sabit >= 0)`,
        out: R`Olcumler tamamlandi mi: True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "time-vs-perf-counter",
        q: [
          "Kod çalışma süresi ölçerken neden `time.time()` yerine `time.perf_counter()` kullanılmalıdır?",
          "Why should `time.perf_counter()` be used instead of `time.time()` for code benchmarking?"
        ],
        a: [
          "`time.time()` sistem duvar saatini okur ve NTP güncellemeleri veya saat değişikliklerinde ileri/geri sıçrayabilir. `time.perf_counter()` ise geriye sıçramayan, donanımsal en yüksek çözünürlüklü monotonik performans sayacıdır.",
          "`time.time()` tracks the wall clock and can jump backwards during NTP updates. `time.perf_counter()` is a monotonic hardware timer with the highest available resolution."
        ]
      },
      {
        id: "monotonic-importance",
        q: [
          "`time.monotonic()` fonksiyonunun güvenlik zamanlayıcılarındaki önemi nedir?",
          "What is the significance of `time.monotonic()` in security timeout logic?"
        ],
        a: [
          "Monotonik saat asla geriye gitmez. Sistem saati saldırgan tarafından geri alınsa bile zaman aşımı (timeout) hesaplamalarının bozulmasını ve kilitlenmeleri engeller.",
          "A monotonic clock is guaranteed never to roll back, preventing attackers or NTP shifts from manipulating timeout countdowns or authentication limits."
        ]
      },
      {
        id: "sleep-jitter-defense",
        q: [
          "Ağ tarama araçlarında `time.sleep`'e neden 'jitter' (rastgele sapma) eklenir?",
          "Why is jitter added to `time.sleep` in network reconnaissance scripts?"
        ],
        a: [
          "Sabit aralıklarla gelen istekler (örn. her 500ms) IDS/IPS ve WAF cihazlarının eşik kurallarını tetikler. Rastgele dalgalı bekleme süreleri trafiği organik göstererek tespiti zorlaştırır.",
          "Predictable fixed-interval requests quickly trigger threshold rules in IDS/IPS devices. Introducing randomized jitter delays mimics human browsing patterns."
        ]
      },
      {
        id: "perf-counter-ns-purpose",
        q: [
          "`time.perf_counter_ns()` fonksiyonunun normal `perf_counter`'a göre avantajı nedir?",
          "What is the advantage of `time.perf_counter_ns()` over `perf_counter()`?"
        ],
        a: [
          "Süreyi kayan noktalı sayı (float) yerine doğrudan tamsayı (int) nanosaniye olarak döner; float yuvarlama hatalarını ortadan kaldırarak mikro düzeyde kesin fark sunar.",
          "It returns integer nanoseconds rather than floating-point seconds, eliminating precision loss and rounding nuances in ultra-fast microbenchmarks."
        ]
      },
      {
        id: "gmtime-vs-localtime",
        q: [
          "`time.gmtime()` ile `time.localtime()` arasındaki fark nedir?",
          "What is the difference between `time.gmtime()` and `time.localtime()`?"
        ],
        a: [
          "`time.gmtime()` zamanı 0 saat dilimindeki UTC (Greenwich) standardında döner; `time.localtime()` ise çalıştırılan makinenin yerel saat dilimini ve yaz saati uygulamasını uygular.",
          "`time.gmtime()` converts epoch seconds to UTC (offset 0), while `time.localtime()` adjusts for the local machine's configured timezone and daylight saving settings."
        ]
      }
    ]
  });
})();

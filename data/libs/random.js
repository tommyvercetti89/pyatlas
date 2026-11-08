(function () {
  const R = String.raw;
  PY.addLib({
    id: "random",
    name: "random",
    sym: "rn",
    color: "#f59e0b",
    focus: "both",
    level: 1,
    ext: false,
    cat: "basics",
    docs: "https://docs.python.org/3/library/random.html",
    tagline: [
      "Rastgele sayılar, seçimler ve karıştırma: oyunlar, simülasyonlar ve test verisi için (güvenlik için DEĞİL).",
      "Random numbers, picks and shuffles for games, simulations and test data: but NOT for security.",
    ],
    analogy: [
      "`random` bir zar torbası gibi: içinden zar atar, kart çeker, desteyi karıştırırsın. Ama zarlar aslında çok karmaşık bir tarifle (formülle) üretilir; tarifin başlangıç noktasını (seed) bilen biri bütün zar sonuçlarını önceden söyleyebilir. Kumar masasında eğlenceli, kasa şifresi için tehlikeli.",
      "`random` is like a bag of dice: you roll, draw cards, shuffle the deck. But the dice follow a very elaborate recipe (a formula); anyone who knows the starting point (the seed) can predict every future roll. Great at a game table, dangerous for a safe combination.",
    ],
    intro: [
      [
        "`random` modülü **sözde rastgele (pseudo-random)** sayı üreticisi sunar. Python'da kullanılan algoritma **Mersenne Twister (MT19937)**'dir: iç durumu (state) 624 adet 32-bit sayıdır ve her sayı bir öncekinden **matematiksel olarak** türetilir. Gerçek rastgelelik yoktur; ama istatistiksel olarak çok iyi dağılır, hızlıdır ve **tekrarlanabilirdir**.",
        "The `random` module gives you a **pseudo-random** number generator. Python uses the **Mersenne Twister (MT19937)**: its internal state is 624 32-bit numbers and every output is derived **mathematically** from the previous state. There is no true randomness, yet the numbers are statistically well spread, fast to produce and **reproducible**.",
      ],
      [
        "Tekrarlanabilirlik bir **özelliktir**: `random.seed(42)` dersen aynı programı her çalıştırdığında aynı sayıları alırsın. Bu, hata ayıklama, bilimsel deney ve test yazarken çok işe yarar. Aynı özellik güvenlikte **felakettir**: çıktıların bir kısmını gören saldırgan geri kalanını hesaplayabilir.\n\nBu yüzden şu kural altın değerindedir:\n- Oyun, simülasyon, test verisi, örnekleme → `random`\n- Parola, token, anahtar, OTP, CSRF/session kimliği → **`secrets`** (veya `random.SystemRandom`)",
        "Reproducibility is a **feature**: call `random.seed(42)` and your program prints the same numbers on every run. That is wonderful for debugging, science and tests. In security the very same property is a **disaster**: an attacker who sees part of the output can compute the rest.\n\nSo keep this rule in your head:\n- Games, simulations, test data, sampling → `random`\n- Passwords, tokens, keys, OTPs, CSRF/session IDs → **`secrets`** (or `random.SystemRandom`)",
      ],
      [
        "Modülün fonksiyonları (`random.random()`, `random.choice()` …) aslında gizli bir `random.Random` nesnesinin **bound method**'larıdır. Yani `random.seed()` hepsini birlikte etkiler. Kendi bağımsız üretecini istersen `random.Random(seed)` ile ayrı bir nesne yaratırsın.",
        "The module-level functions (`random.random()`, `random.choice()` …) are really bound methods of one hidden `random.Random` object. That is why `random.seed()` affects all of them together. If you want your own independent generator, create one with `random.Random(seed)`.",
      ],
    ],
    import: R`import random`,
    general: [
      ["Oyunlarda zar atma, kart çekme, rastgele düşman/ödül seçme.", "Dice rolls, card draws and picking random enemies or rewards in games."],
      ["Simülasyon ve Monte Carlo yöntemleri; veri biliminde örnekleme ve train/test ayırma (`sample`, `shuffle`).", "Simulations and Monte Carlo methods; sampling and train/test splits in data work (`sample`, `shuffle`)."],
      ["Test verisi üretme: rastgele ama **tekrarlanabilir** girdiler için `seed()` kullanmak.", "Generating test data: use `seed()` for random-looking but **reproducible** inputs."],
      ["Sıralama/arama algoritmalarını denemek için rastgele listeler oluşturma.", "Building random lists to try out sorting and searching algorithms."],
      ["Ağırlıklı seçim (`choices`) ile basit yük dengeleme veya A/B testi grupları.", "Weighted picks (`choices`) for simple load balancing or A/B test groups."],
    ],
    cyberUse: [
      ["**`random` kriptografik olarak güvenli DEĞİLDİR.** Parola, token, anahtar, salt, nonce veya OTP üretmek için asla kullanma; `secrets` kullan.", "**`random` is NOT cryptographically secure.** Never use it for passwords, tokens, keys, salts, nonces or OTPs; use `secrets` instead."],
      ["Saldırgan bakış açısı: Mersenne Twister'ın 624 ardışık 32-bit çıktısı görülürse iç durum tamamen geri kurulabilir ve sonraki tüm çıktılar tahmin edilir. Zayıf “şifre sıfırlama kodu” hatalarının kökü budur.", "Attacker's view: after seeing 624 consecutive 32-bit outputs of Mersenne Twister, the whole internal state can be rebuilt and every later output predicted. This is the root of many weak “password reset code” bugs."],
      ["Zaman damgası ile seed etmek (`random.seed(time.time())`) tahmin edilebilir: saldırgan seed'i birkaç bin denemeyle bulabilir. Kod incelemesinde (code review) bu desen kırmızı bayraktır.", "Seeding with a timestamp (`random.seed(time.time())`) is guessable: an attacker can brute-force the seed in a few thousand tries. In a code review this pattern is a red flag."],
      ["CTF ve ethical-lab ortamlarında “zayıf PRNG” görevleri bu yüzden çözülür; savunma tarafında çözüm her zaman işletim sistemi CSPRNG'sine (`os.urandom`, `secrets`) geçmektir.", "CTF and ethical-lab “weak PRNG” challenges are solved this way; the defensive fix is always to switch to the OS CSPRNG (`os.urandom`, `secrets`)."],
      ["Savunma: kod tarayıcıları (Bandit B311) güvenlik bağlamında `random` kullanımını işaretler; bu uyarıyı ciddiye al.", "Defence: code scanners (Bandit B311) flag `random` used in security contexts; take that warning seriously."],
    ],
    sections: [
      {
        id: "seeding",
        title: ["Seed, durum ve üreteç nesneleri", "Seeding, state and generator objects"],
        intro: [
          "Burada rastgeleliğin “başlangıç noktasını” ve üretecin kendisini yönetirsin.",
          "Here you control the “starting point” of the randomness and the generator objects themselves.",
        ],
        items: [
          {
            id: "seed",
            name: "random.seed(a=None, version=2)",
            kind: "function",
            sig: "random.seed(a=None, version=2)",
            sum: ["Üreteci belirli bir başlangıç değerine kurar; aynı seed aynı diziyi verir.", "Resets the generator to a known starting value; the same seed gives the same sequence."],
            desc: [
              "`seed(42)` dedikten sonra gelen tüm `random()`, `choice()`, `shuffle()` … çağrıları **her çalıştırmada aynı** sonuçları verir. `a` verilmezse (veya `None`ise) üreteç işletim sisteminin rastgelelik kaynağından (yoksa saatten) tohumlanır; Python bunu ilk `import`'ta zaten otomatik yapar.",
              "After `seed(42)`, every later `random()`, `choice()`, `shuffle()` … call returns the **same results on every run**. With `a=None` the generator is seeded from the OS randomness source (or the clock as a fallback); Python already does that automatically at import time.",
            ],
            params: [
              { n: "a", d: ["Başlangıç değeri: `int`, `str`, `bytes`, `bytearray` veya `None`. Tipik: `42`.", "Starting value: `int`, `str`, `bytes`, `bytearray` or `None`. Typical: `42`."] },
              { n: "version", d: ["`2` (varsayılan): str/bytes seed'ler SHA-512 ile int'e çevrilir. `1` eski Python 2 davranışı.", "`2` (default): str/bytes seeds are converted to an int via SHA-512. `1` is the old Python 2 behaviour."] },
            ],
            ret: ["`None`", "`None`"],
            ex: {
              code: R`import random

random.seed(42)
print(random.random())  # ilk sayı ||| first number
print(random.random())  # ikinci sayı ||| second number
random.seed(42)         # başa sar ||| rewind
print(random.random())  # yine ilk sayı ||| first number again`,
              out: R`0.6394267984578837
0.025010755222666936
0.6394267984578837`,
            },
            cyber: [
              "Seed'i tahmin edilebilir bir şeyden (saat, PID, kullanıcı adı) türetmek, tüm çıktıları saldırganın hesaplayabileceği hale getirir. Güvenlik gerektiren yerde seed ayarlamaya hiç gerek yok: `secrets` zaten OS'ten besleniyor.",
              "Deriving the seed from something guessable (clock, PID, username) lets an attacker compute every output. In security code you should not seed at all: `secrets` is fed by the OS already.",
            ],
            gotcha: [
              "Aynı seed, **aynı Python sürümünde** aynı sonucu verir. `random()` dizisi sürümler arasında çok kararlıdır, ama `randrange`/`choice`/`sample` gibi türetilmiş fonksiyonların algoritmaları zamanla değişmiştir; sürümler arası birebir aynılığa güvenme. Python 3.11+ `seed()` yalnızca `None, int, float, str, bytes, bytearray` kabul eder (örn. `tuple` hata verir).",
              "The same seed gives the same result on the **same Python version**. The raw `random()` stream is very stable, but derived functions like `randrange`/`choice`/`sample` have changed algorithms over time, so do not rely on cross-version identity. Python 3.11+ accepts only `None, int, float, str, bytes, bytearray` as seed (a `tuple` raises an error).",
            ],
            see: ["getstate", "random-class", "not-secure"],
          },
          {
            id: "getstate",
            name: "random.getstate() / random.setstate(state)",
            kind: "function",
            sig: "random.getstate()  /  random.setstate(state)",
            sum: ["Üretecin iç durumunu kaydeder ve geri yükler.", "Saves and restores the generator's internal state."],
            desc: [
              "`getstate()` iç durumu bir tuple olarak döndürür (içinde MT'nin 624 sayısı ve bir indeks vardır). Daha sonra `setstate()` ile verirsen üreteç tam o noktadan devam eder. Bir deneyin ortasında “şu ana dön” demek için idealdir; `seed()`'den farkı, rastgele **ortadaki** bir noktaya dönebilmendir.",
              "`getstate()` returns the internal state as a tuple (it holds the 624 MT numbers and an index). Passing it to `setstate()` later makes the generator continue from exactly that point. It is ideal for “go back to this moment” in an experiment; unlike `seed()` it can return to a point in the **middle** of a stream.",
            ],
            params: [
              { n: "state", d: ["`getstate()`'ten daha önce alınmış değer.", "A value previously obtained from `getstate()`."] },
            ],
            ret: ["`getstate()` → tuple `(3, (…625 int…), None)`; `setstate()` → `None`.", "`getstate()` → tuple `(3, (…625 ints…), None)`; `setstate()` → `None`."],
            ex: {
              code: R`import random

random.seed(2)
state = random.getstate()
a = [random.randint(1, 100) for _ in range(3)]
random.setstate(state)          # geri sar ||| rewind
b = [random.randint(1, 100) for _ in range(3)]
print(a == b)
print(len(state), len(state[1]))  # (sürüm, 625 sayı, gauss) ||| (version, 625 numbers, gauss)`,
              out: R`True
3 625`,
            },
            cyber: [
              "İç durumun sızması = geleceğin sızması. Bir uygulama hata ayıklama çıktısında veya serileştirilmiş (pickle) nesnede `getstate()` değerini açığa çıkarırsa, saldırgan sonraki tüm “rastgele” değerleri bilir.",
              "A leaked internal state is a leaked future. If an app exposes `getstate()` in debug output or in a pickled object, an attacker knows every later “random” value.",
            ],
            see: ["seed", "not-secure"],
          },
          {
            id: "random-class",
            name: "random.Random(seed=None)",
            kind: "class",
            sig: "class random.Random([seed])",
            sum: ["Bağımsız, kendi durumu olan bir üreteç nesnesi oluşturur.", "Creates an independent generator object with its own state."],
            desc: [
              "Modül düzeyindeki `random.xxx()` fonksiyonları ortak (global) tek bir üreteci kullanır. Bir kütüphane yazarken veya iki farklı tekrarlanabilir akış istediğinde `Random(seed)` ile **ayrı** nesneler yaratırsın; birinin kullanımı diğerini etkilemez. Nesnenin tüm metotları (`random`, `randint`, `choice`, `shuffle` …) modül fonksiyonlarıyla aynı adı taşır.",
              "The module-level `random.xxx()` functions share one global generator. When you write a library, or want two separate reproducible streams, create **separate** objects with `Random(seed)`; using one does not affect the other. All its methods (`random`, `randint`, `choice`, `shuffle` …) have the same names as the module functions.",
            ],
            params: [
              { n: "seed", d: ["`seed()` ile aynı türler; verilmezse OS'ten tohumlanır.", "Same types as `seed()`; if omitted it is seeded from the OS."] },
            ],
            ret: ["Bir `Random` nesnesi.", "A `Random` object."],
            ex: {
              code: R`import random

r1 = random.Random(99)
r2 = random.Random(99)
print(r1.random(), r1.randint(1, 100))
print(r2.random(), r2.randint(1, 100))   # aynı akış ||| same stream
random.seed(0)                           # global üreteç ayrı ||| global generator is separate
print(r1.random() != random.random())`,
              out: R`0.40397807494366633 26
0.40397807494366633 26
True`,
            },
            gotcha: [
              "Thread güvenliği: modül fonksiyonları thread-safe'tir, ama aynı `Random` nesnesini birden çok thread'de paylaşıp tekrarlanabilirlik beklersen sıralama belirsiz olur. Her thread için ayrı nesne ver.",
              "Thread safety: module functions are thread-safe, but if several threads share one `Random` object and you expect reproducibility, the interleaving makes it non-deterministic. Give each thread its own object.",
            ],
            see: ["seed", "systemrandom"],
          },
          {
            id: "systemrandom",
            name: "random.SystemRandom()",
            kind: "class",
            sig: "class random.SystemRandom([seed])",
            sum: ["Aynı arayüz, ama rastgeleliği doğrudan işletim sisteminden (`os.urandom`) alan üreteç.", "Same interface, but it draws randomness straight from the operating system (`os.urandom`)."],
            desc: [
              "`SystemRandom`, `Random`'ın alt sınıfıdır: `choice`, `randint`, `shuffle`, `sample` … hepsi vardır, ama bunlar MT yerine OS'in kriptografik üretecini kullanır. Bu yüzden **tahmin edilemez** ve **tekrarlanamaz**dır; `seed()` ve `getstate()` etkisizdir/desteklenmez.",
              "`SystemRandom` is a subclass of `Random`: it has `choice`, `randint`, `shuffle`, `sample` … but they use the OS cryptographic generator instead of MT. So the output is **unpredictable** and **not reproducible**; `seed()` is a no-op and `getstate()` is unsupported.",
            ],
            ret: ["Bir `SystemRandom` nesnesi.", "A `SystemRandom` object."],
            ex: {
              code: R`import random

sr = random.SystemRandom()
print(sr.seed(123))                     # etkisiz ||| no effect
print(0 <= sr.random() < 1)
print(sr.randint(1, 6) in range(1, 7))
print(len(sr.sample("abcdefgh", 4)))
try:
    sr.getstate()
except NotImplementedError:
    print("getstate: NotImplementedError")`,
              out: R`None
True
True
4
getstate: NotImplementedError`,
            },
            cyber: [
              "Güvenlik amaçlı seçimde (`secrets.choice` dahili olarak bunu kullanır) doğru araçtır. Parola harfi seçerken `random.choice` yerine `SystemRandom().choice` veya doğrudan `secrets.choice` kullan.",
              "It is the right tool for security-related picks (`secrets.choice` uses it internally). When picking password characters use `SystemRandom().choice` or simply `secrets.choice` instead of `random.choice`.",
            ],
            gotcha: [
              "Daha yavaştır (her çağrıda sistem çağrısı) ve test için tekrarlanabilir değildir. Test edilebilirlik gerekiyorsa üretecini parametre olarak dışarıdan al (dependency injection).",
              "It is slower (a system call per request) and not reproducible for tests. If you need testability, take the generator as a parameter (dependency injection).",
            ],
            see: ["random-class", "secrets:token_hex"],
          },
        ],
      },
      {
        id: "numbers",
        title: ["Sayı üretme", "Generating numbers"],
        items: [
          {
            id: "random",
            name: "random.random()",
            kind: "function",
            sig: "random.random()",
            sum: ["0.0 ≤ x < 1.0 aralığında rastgele bir `float` verir.", "Returns a random `float` in the range 0.0 ≤ x < 1.0."],
            desc: [
              "Tüm diğer fonksiyonların temelidir. 1.0 **asla** dahil değildir. Olasılık denemek için çok kullanışlıdır: `random.random() < 0.3` yaklaşık %30 ihtimalle `True` olur.",
              "It is the foundation of all the other functions. 1.0 is **never** included. It is handy for probabilities: `random.random() < 0.3` is `True` about 30% of the time.",
            ],
            ret: ["`float`, [0.0, 1.0) aralığında.", "`float` in [0.0, 1.0)."],
            ex: {
              code: R`import random

random.seed(10)
hits = sum(random.random() < 0.3 for _ in range(1000))
print(250 <= hits <= 350)  # ~300 beklenir ||| roughly 300 expected
print(0 <= random.random() < 1)`,
              out: R`True
True`,
            },
            see: ["uniform", "seed"],
          },
          {
            id: "uniform",
            name: "random.uniform(a, b)",
            kind: "function",
            sig: "random.uniform(a, b)",
            sum: ["`a` ile `b` arasında rastgele bir `float` verir.", "Returns a random `float` between `a` and `b`."],
            desc: [
              "`a + (b - a) * random()` formülüyle çalışır. `a > b` olsa bile çalışır. Uç değer `b`, yuvarlama yüzünden bazen dahil olabilir.",
              "It works as `a + (b - a) * random()`. It also works when `a > b`. The end point `b` may occasionally be included because of floating-point rounding.",
            ],
            params: [
              { n: "a", d: ["Bir uç (sayı).", "One end point (number)."] },
              { n: "b", d: ["Diğer uç (sayı).", "The other end point (number)."] },
            ],
            ret: ["`float`", "`float`"],
            ex: {
              code: R`import random

random.seed(8)
print(random.uniform(1, 10))
temp = random.uniform(-5.0, 5.0)
print(-5 <= temp <= 5)`,
              out: R`3.0403527344294394
True`,
            },
          },
          {
            id: "randint",
            name: "random.randint(a, b)",
            kind: "function",
            sig: "random.randint(a, b)",
            sum: ["`a` ve `b` **dahil** olmak üzere rastgele tam sayı verir.", "Returns a random integer between `a` and `b`, **both included**."],
            desc: [
              "Zar atmak için birebir: `randint(1, 6)`. `range()`'ten farklı olarak üst sınır **dahildir**. Aslında `randrange(a, b + 1)` ile aynıdır.",
              "Perfect for dice: `randint(1, 6)`. Unlike `range()`, the upper limit **is included**. It is really `randrange(a, b + 1)`.",
            ],
            params: [
              { n: "a", d: ["Alt sınır (dahil), `int`.", "Lower bound (included), `int`."] },
              { n: "b", d: ["Üst sınır (dahil), `int`; `a <= b` olmalı.", "Upper bound (included), `int`; must satisfy `a <= b`."] },
            ],
            ret: ["`int`", "`int`"],
            ex: {
              code: R`import random

random.seed(1)
print(all(1 <= random.randint(1, 6) <= 6 for _ in range(5)))
try:
    random.randint(6, 1)
except ValueError:
    print("ValueError yakalandi")`,
              out: R`True
ValueError yakalandi`,
            },
            gotcha: [
              "`a > b` ise `ValueError` olur. Hata mesajının biçimi Python sürümüne göre değişir (3.12+ mesajı farklıdır), bu yüzden mesajı değil türü yakala.",
              "If `a > b` you get `ValueError`. The wording of the message differs between Python versions (3.12+ phrases it differently), so catch the type, not the text.",
            ],
            see: ["randrange"],
          },
          {
            id: "randrange",
            name: "random.randrange(start, stop[, step])",
            kind: "function",
            sig: "random.randrange(stop)  /  random.randrange(start, stop[, step])",
            sum: ["`range(...)` içinden rastgele bir eleman seçer; `stop` dahil değildir.", "Picks a random element from `range(...)`; `stop` is excluded."],
            desc: [
              "`range()` ile aynı parametrelere sahiptir ama bütün sayıları listelemeden seçer (bellek harcamaz). Adım (`step`) ile “10'un katları” gibi şeyler seçebilirsin; negatif adım da çalışır.",
              "It takes the same arguments as `range()` but picks without building the whole list (no memory cost). With `step` you can pick things like “multiples of 10”; negative steps work too.",
            ],
            params: [
              { n: "start", d: ["Başlangıç (dahil), varsayılan 0.", "Start (included), default 0."] },
              { n: "stop", d: ["Bitiş (dahil değil).", "End (excluded)."] },
              { n: "step", d: ["Adım, varsayılan 1; 0 olamaz.", "Step, default 1; cannot be 0."] },
            ],
            ret: ["`int`", "`int`"],
            ex: {
              code: R`import random

random.seed(7)
print(random.randrange(10))        # 0..9
print(random.randrange(0, 100, 10))  # 0,10,...,90
print(random.randrange(5, 0, -1))  # 5,4,3,2,1`,
              out: R`5
20
2`,
            },
            gotcha: [
              "`randrange(10)` 10'u **vermez**, `randint(1, 10)` ise 10'u verir. Bu fark sık “bir eksik/bir fazla” (off-by-one) hatasına yol açar.",
              "`randrange(10)` **never** returns 10, whereas `randint(1, 10)` can. This difference is a classic source of off-by-one bugs.",
            ],
            see: ["randint"],
          },
          {
            id: "getrandbits",
            name: "random.getrandbits(k)",
            kind: "function",
            sig: "random.getrandbits(k)",
            sum: ["`k` bitlik rastgele bir tam sayı üretir.", "Produces a random integer made of `k` random bits."],
            desc: [
              "Sonuç `0 ≤ x < 2**k` aralığındadır. Maske, bayrak, ID veya basit deneme verisi için uygundur. MT'nin ham çıktısına en yakın fonksiyon budur: `getrandbits(32)` MT'nin bir çıktısını doğrudan verir.",
              "The result satisfies `0 ≤ x < 2**k`. It suits masks, flags, IDs or simple test data. It is the function closest to MT's raw output: `getrandbits(32)` hands you one MT output directly.",
            ],
            params: [
              { n: "k", d: ["Bit sayısı, `int ≥ 0` (3.9+ için `k=0` → 0). Tipik: 8, 16, 32, 128.", "Number of bits, `int ≥ 0` (`k=0` → 0 in 3.9+). Typical: 8, 16, 32, 128."] },
            ],
            ret: ["`int`", "`int`"],
            ex: {
              code: R`import random

random.seed(8)
print(random.getrandbits(8))
print(random.getrandbits(16))
print(random.getrandbits(1))
x = random.getrandbits(128)
print(x < 2 ** 128, x.bit_length() <= 128)`,
              out: R`58
24275
1
True True`,
            },
            cyber: [
              "128 bit'lik değer “güvenli görünür” ama `random` ile üretildiyse yine tahmin edilebilir. Güvenli sürüm: `secrets.randbits(128)`.",
              "A 128-bit value looks safe, but if it came from `random` it is still predictable. The safe version: `secrets.randbits(128)`.",
            ],
            see: ["not-secure", "randbytes", "secrets:randbits"],
          },
          {
            id: "randbytes",
            name: "random.randbytes(n)",
            kind: "function",
            sig: "random.randbytes(n)",
            sum: ["`n` baytlık rastgele `bytes` üretir (Python 3.9+).", "Produces `n` random `bytes` (Python 3.9+)."],
            desc: [
              "Test dosyası, sahte payload veya doldurma (padding) verisi gerekiyorsa kullanışlıdır. Tekrarlanabilir olduğu için testlerde işe yarar; ama anahtar/token için **kullanma**.",
              "Useful for test files, dummy payloads or padding data. Because it is reproducible it works well in tests; but do **not** use it for keys or tokens.",
            ],
            params: [
              { n: "n", d: ["Bayt sayısı, `int ≥ 0`.", "Number of bytes, `int ≥ 0`."] },
            ],
            ret: ["`bytes`, uzunluğu `n`.", "`bytes` of length `n`."],
            ex: {
              code: R`import random

random.seed(1)
data = random.randbytes(3)
print(data)
print(len(data), data.hex())
print(len(random.randbytes(16)))`,
              out: R`b'\xb1e"'
3 b16522
16`,
            },
            cyber: [
              "Anahtar/IV/nonce için `os.urandom(n)` veya `secrets.token_bytes(n)` kullan. `randbytes` yalnızca test verisi içindir.",
              "For keys/IVs/nonces use `os.urandom(n)` or `secrets.token_bytes(n)`. `randbytes` is for test data only.",
            ],
            gotcha: [
              "Python 3.9'da eklendi; 3.8 ve öncesinde `AttributeError` verir.",
              "Added in Python 3.9; on 3.8 and earlier it raises `AttributeError`.",
            ],
            see: ["secrets:token_bytes"],
          },
        ],
      },
      {
        id: "sequences",
        title: ["Dizilerle çalışma: seçme, örnekleme, karıştırma", "Working with sequences: pick, sample, shuffle"],
        items: [
          {
            id: "choice",
            name: "random.choice(seq)",
            kind: "function",
            sig: "random.choice(seq)",
            sum: ["Bir dizinin içinden tek bir eleman seçer.", "Picks one element from a sequence."],
            desc: [
              "`seq` indekslenebilir olmalı (liste, tuple, `str`, `range`). Set veya dict ile çalışmaz; önce `list(...)` yap. Boş dizi `IndexError` verir.",
              "`seq` must be indexable (list, tuple, `str`, `range`). It does not work with sets or dicts; wrap them in `list(...)` first. An empty sequence raises `IndexError`.",
            ],
            params: [
              { n: "seq", d: ["Boş olmayan dizi.", "A non-empty sequence."] },
            ],
            ret: ["Dizinin bir elemanı.", "One element of the sequence."],
            ex: {
              code: R`import random

random.seed(3)
ch1 = random.choice(["a", "b", "c", "d"])
print(ch1 in ["a", "b", "c", "d"])
ch2 = random.choice("PYTHON")
print(ch2 in "PYTHON")
try:
    random.choice([])
except IndexError:
    print("IndexError: empty sequence")`,
              out: R`True
True
IndexError: empty sequence`,
            },
            cyber: [
              "`random.choice(string.ascii_letters)` ile parola üretmek klasik bir hatadır. Doğrusu `secrets.choice`.",
              "Building a password with `random.choice(string.ascii_letters)` is a classic mistake. The correct tool is `secrets.choice`.",
            ],
            gotcha: [
              "Python 3.11'den beri set ile çalışmaz (`TypeError`); `random.choice(sorted(s))` veya `list(s)` kullan.",
              "Since Python 3.11 it no longer works with sets (`TypeError`); use `random.choice(sorted(s))` or `list(s)`.",
            ],
            see: ["choices", "secrets:choice"],
          },
          {
            id: "choices",
            name: "random.choices(population, weights=None, *, cum_weights=None, k=1)",
            kind: "function",
            sig: "random.choices(population, weights=None, *, cum_weights=None, k=1)",
            sum: ["**Yerine koyarak** `k` eleman seçer; isteğe bağlı ağırlıkla.", "Picks `k` elements **with replacement**, optionally weighted."],
            desc: [
              "Aynı eleman birden fazla kez gelebilir (çekilen kâğıt geri konur). `weights` ile bazı elemanları daha olası yapabilirsin. **Her zaman bir liste döndürür**, `k=1` olsa bile; tek eleman istiyorsan `choice` daha uygundur.",
              "The same element can appear several times (the drawn card goes back). With `weights` you make some elements more likely. It **always returns a list**, even for `k=1`; for a single element `choice` is the better fit.",
            ],
            params: [
              { n: "population", d: ["Elemanların bulunduğu dizi.", "Sequence of candidates."] },
              { n: "weights", d: ["Göreli ağırlıklar, örn. `[10, 1, 1]`. Toplamın 1 olması gerekmez.", "Relative weights, e.g. `[10, 1, 1]`. They need not add up to 1."] },
              { n: "cum_weights", d: ["Birikimli ağırlıklar (`weights` ile birlikte verilemez).", "Cumulative weights (cannot be combined with `weights`)."] },
              { n: "k", d: ["Kaç eleman seçilecek (varsayılan 1).", "How many elements to pick (default 1)."] },
            ],
            ret: ["`k` uzunluğunda `list`.", "A `list` of length `k`."],
            ex: {
              code: R`import random

random.seed(3)
print(random.choices(["red", "green", "blue"], weights=[10, 1, 1], k=5))
random.seed(3)
print(random.choices("ABC", k=4))
random.seed(10)
print(random.choices(range(5), cum_weights=[1, 2, 3, 4, 10], k=5))`,
              out: R`['red', 'red', 'red', 'red', 'red']
['A', 'B', 'B', 'B']
[4, 4, 4, 2, 4]`,
            },
            gotcha: [
              "Python 3.9+ içinde tüm ağırlıklar 0 ise `ValueError` verir; negatif ağırlık da kabul edilmez (3.9+). `weights` ve `cum_weights` aynı anda verilirse `TypeError` olur.",
              "In Python 3.9+ all-zero weights raise `ValueError`; negative weights are also rejected. Passing both `weights` and `cum_weights` raises `TypeError`.",
            ],
            see: ["choice", "sample"],
          },
          {
            id: "sample",
            name: "random.sample(population, k, *, counts=None)",
            kind: "function",
            sig: "random.sample(population, k, *, counts=None)",
            sum: ["**Yerine koymadan** `k` farklı eleman seçer (tekrar yok).", "Picks `k` distinct elements **without replacement** (no repeats)."],
            desc: [
              "Loto çekilişi gibi: çekilen top geri konmaz, aynı pozisyon iki kez gelmez. Orijinal dizi değişmez. `range(...)` doğrudan verilebilir ve bellek harcamaz. `counts` ile “3 kırmızı, 2 mavi top” gibi tekrarlı havuz tanımlanabilir.",
              "Like a lottery draw: drawn balls are not put back, the same position is never chosen twice. The original sequence is left untouched. You can pass a `range(...)` directly (no memory cost). With `counts` you can describe a pool like “3 red, 2 blue balls”.",
            ],
            params: [
              { n: "population", d: ["Dizi veya `range` (set verilemez, 3.11+).", "Sequence or `range` (sets not allowed, 3.11+)."] },
              { n: "k", d: ["Kaç eleman; `k <= len(population)` olmalı.", "How many; must satisfy `k <= len(population)`."] },
              { n: "counts", d: ["Her elemanın havuzdaki tekrar sayısı (3.9+).", "How many times each element is in the pool (3.9+)."] },
            ],
            ret: ["Yeni bir `list`.", "A new `list`."],
            ex: {
              code: R`import random

random.seed(5)
print(random.sample(range(100), 5))
random.seed(5)
print(random.sample(["a", "b", "c", "d"], k=2))
random.seed(2)
print(random.sample(["r", "b"], counts=[3, 2], k=4))
try:
    random.sample([1, 2], 5)
except ValueError:
    print("ValueError: sample larger than population")`,
              out: R`[79, 32, 94, 45, 88]
['c', 'd']
['r', 'b', 'b', 'r']
ValueError: sample larger than population`,
            },
            gotcha: [
              "`random.sample(x, k=len(x))` = karıştırılmış **kopya** verir; yerinde karıştırmak için `shuffle` kullan. 3.11'den itibaren `population` set olamaz.",
              "`random.sample(x, k=len(x))` gives a shuffled **copy**; use `shuffle` to shuffle in place. From 3.11 on `population` cannot be a set.",
            ],
            see: ["choices", "shuffle"],
          },
          {
            id: "shuffle",
            name: "random.shuffle(x)",
            kind: "function",
            sig: "random.shuffle(x)",
            sum: ["Bir listeyi **yerinde** (in-place) karıştırır; `None` döndürür.", "Shuffles a list **in place** and returns `None`."],
            desc: [
              "Kart destesi gibi: liste doğrudan değişir. En sık yapılan hata `x = random.shuffle(x)` yazmaktır; bu `x`'i `None` yapar. Değişmez diziler (tuple, `str`) karıştırılamaz; önce `list()` yap, ya da `sample(x, len(x))` kullan.",
              "Like a deck of cards: the list itself changes. The most common mistake is `x = random.shuffle(x)`, which turns `x` into `None`. Immutable sequences (tuple, `str`) cannot be shuffled; make a `list()` first or use `sample(x, len(x))`.",
            ],
            params: [
              { n: "x", d: ["Değiştirilebilir dizi, genelde `list`.", "A mutable sequence, usually a `list`."] },
            ],
            ret: ["`None`", "`None`"],
            ex: {
              code: R`import random

random.seed(5)
cards = list(range(10))
result = random.shuffle(cards)
print(len(cards) == 10 and sorted(cards) == list(range(10)))
print(result)             # None
word = list("python")
random.shuffle(word)
print(sorted(word) == sorted("python"))`,
              out: R`True
None
True`,
            },
            gotcha: [
              "Python 3.11'de eski `random=` parametresi kaldırıldı. Çok uzun listelerde (2080+ eleman) olası permütasyon sayısı MT'nin periyodunu aşar; her permütasyon üretilemez, bu istatistik/güvenlik açısından bir not düşer.",
              "The old `random=` parameter was removed in Python 3.11. For very long lists (2080+ items) the number of permutations exceeds MT's period, so not every permutation can be produced - worth knowing for statistics and security.",
            ],
            cyber: [
              "Güvenlik için karıştırma (örn. rastgele sıralanmış tarama hedefleri değil, anahtar sırası/kart dağıtımı) gerekiyorsa `random.SystemRandom().shuffle(x)` kullan.",
              "If security matters (key ordering, a card deal for a real-money game), use `random.SystemRandom().shuffle(x)`.",
            ],
            see: ["sample"],
          },
        ],
      },
      {
        id: "distributions",
        title: ["Dağılımlar (simülasyon için)", "Distributions (for simulation)"],
        intro: [
          "Her sayının eşit olasılıklı olmadığı durumlar için: boy dağılımı, bekleme süresi, ağ gecikmesi gibi şeyleri taklit edebilirsin.",
          "For cases where outcomes are not equally likely: you can imitate heights, waiting times, network latency and so on.",
        ],
        items: [
          {
            id: "gauss",
            name: "random.gauss(mu=0.0, sigma=1.0)",
            kind: "function",
            sig: "random.gauss(mu=0.0, sigma=1.0)",
            sum: ["Normal (çan eğrisi) dağılımdan rastgele sayı verir.", "Returns a random number from the normal (bell-curve) distribution."],
            desc: [
              "`mu` ortalama, `sigma` standart sapmadır. Değerlerin çoğu `mu ± sigma` civarında toplanır. Python 3.11'den beri `mu`/`sigma` için varsayılan değerler vardır. `gauss()` hızlıdır ama thread güvenli değildir; çok thread'li kodda `normalvariate()` daha güvenlidir.",
              "`mu` is the mean and `sigma` the standard deviation; most values cluster near `mu ± sigma`. Since Python 3.11 `mu`/`sigma` have defaults. `gauss()` is fast but not thread-safe; in multi-threaded code `normalvariate()` is safer.",
            ],
            params: [
              { n: "mu", d: ["Ortalama (örn. `100`).", "Mean (e.g. `100`)."] },
              { n: "sigma", d: ["Standart sapma (örn. `15`).", "Standard deviation (e.g. `15`)."] },
            ],
            ret: ["`float`", "`float`"],
            ex: {
              code: R`import random
import statistics

random.seed(8)
print(random.gauss(0, 1))
iq = [random.gauss(100, 15) for _ in range(10000)]
print(round(statistics.mean(iq)), round(statistics.stdev(iq)))`,
              out: R`0.3734151696239873
100 15`,
            },
            see: ["normalvariate", "uniform"],
          },
          {
            id: "normalvariate",
            name: "random.normalvariate(mu=0.0, sigma=1.0)",
            kind: "function",
            sig: "random.normalvariate(mu=0.0, sigma=1.0)",
            sum: ["`gauss`'un thread-güvenli, biraz yavaş kardeşi.", "The thread-safe, slightly slower sibling of `gauss`."],
            desc: [
              "Aynı normal dağılımı üretir, ama aralarında dahili durum paylaşılmaz. Tek thread'li basit işlerde `gauss` yeterlidir.",
              "It draws from the same normal distribution, but it keeps no shared internal state. For simple single-threaded work `gauss` is enough.",
            ],
            params: [
              { n: "mu", d: ["Ortalama.", "Mean."] },
              { n: "sigma", d: ["Standart sapma.", "Standard deviation."] },
            ],
            ret: ["`float`", "`float`"],
            ex: {
              code: R`import random

random.seed(4)
vals = [random.normalvariate(50, 5) for _ in range(5)]
print(all(30 < v < 70 for v in vals))
print(len(vals))`,
              out: R`True
5`,
            },
          },
          {
            id: "triangular",
            name: "random.triangular(low=0.0, high=1.0, mode=None)",
            kind: "function",
            sig: "random.triangular(low=0.0, high=1.0, mode=None)",
            sum: ["Üçgen dağılım: iki uç ve bir “en olası” nokta (mode).", "Triangular distribution: two end points and a “most likely” value (mode)."],
            desc: [
              "Elinde sadece “en az, en çok ve en olası” tahmini varsa (örn. bir işin süresi) iş görür. `mode` verilmezse aralığın ortasıdır.",
              "Useful when you only have a “minimum, maximum and most likely” estimate (e.g. a task's duration). Without `mode` it is the middle of the range.",
            ],
            params: [
              { n: "low", d: ["Alt uç.", "Lower end."] },
              { n: "high", d: ["Üst uç.", "Upper end."] },
              { n: "mode", d: ["En olası değer.", "The most likely value."] },
            ],
            ret: ["`float`, `low`..`high` arasında.", "`float` between `low` and `high`."],
            ex: {
              code: R`import random

random.seed(4)
t = random.triangular(0, 10, 2)
print(round(t, 4))
print(0 <= t <= 10)`,
              out: R`2.1823
True`,
            },
          },
          {
            id: "expovariate",
            name: "random.expovariate(lambd=1.0)",
            kind: "function",
            sig: "random.expovariate(lambd=1.0)",
            sum: ["Üstel dağılım: olaylar arasındaki bekleme süreleri.", "Exponential distribution: waiting times between events."],
            desc: [
              "`lambd`, olay hızıdır (1 / ortalama bekleme). Rastgele gelen istekler (Poisson süreci) arasındaki süreleri taklit eder; kuyruk ve yük simülasyonlarında kullanılır. Ortalaması `1/lambd`'dir. Python 3.12+ `lambd` için varsayılan 1.0 verir.",
              "`lambd` is the event rate (1 / mean wait). It imitates the gaps between randomly arriving requests (a Poisson process) and is used in queue and load simulations. Its mean is `1/lambd`. Python 3.12+ gives `lambd` a default of 1.0.",
            ],
            params: [
              { n: "lambd", d: ["Hız: 1/ortalama (sıfırdan farklı).", "Rate: 1/mean (non-zero)."] },
            ],
            ret: ["`float`", "`float`"],
            ex: {
              code: R`import random
import statistics

random.seed(1)
gaps = [random.expovariate(2.0) for _ in range(20000)]
print(round(statistics.mean(gaps), 1))   # 1/2.0`,
              out: R`0.5`,
            },
            gotcha: [
              "Parametrenin adı `lambda` değil `lambd`'dir, çünkü `lambda` Python anahtar sözcüğüdür.",
              "The parameter is called `lambd`, not `lambda`, because `lambda` is a Python keyword.",
            ],
          },
          {
            id: "betavariate",
            name: "random.betavariate(alpha, beta)",
            kind: "function",
            sig: "random.betavariate(alpha, beta)",
            sum: ["Beta dağılımı: 0 ile 1 arasında “oran/olasılık” üretir.", "Beta distribution: produces a “ratio/probability” between 0 and 1."],
            desc: [
              "`alpha` ve `beta` pozitif şekil parametreleridir. Bayesci istatistikte bir olasılığın belirsizliğini modellemek için kullanılır. Diğer dağılımlar da vardır: `lognormvariate`, `gammavariate`, `vonmisesvariate`, `paretovariate`, `weibullvariate`; Python 3.12'de `binomialvariate(n, p)` eklendi.",
              "`alpha` and `beta` are positive shape parameters. It is used in Bayesian statistics to model the uncertainty of a probability. Other distributions exist too: `lognormvariate`, `gammavariate`, `vonmisesvariate`, `paretovariate`, `weibullvariate`; Python 3.12 added `binomialvariate(n, p)`.",
            ],
            params: [
              { n: "alpha", d: ["Şekil parametresi > 0.", "Shape parameter > 0."] },
              { n: "beta", d: ["Şekil parametresi > 0.", "Shape parameter > 0."] },
            ],
            ret: ["`float`, 0..1 arasında.", "`float` between 0 and 1."],
            ex: {
              code: R`import random

random.seed(4)
p = random.betavariate(2, 5)
print(0 <= p <= 1)
print(isinstance(p, float))`,
              out: R`True
True`,
            },
            gotcha: [
              "Bu uzman fonksiyonların çıktısı sürümler arasında değişebilir; sadece özelliklerine (aralık, ortalama) güven, tam değerine değil.",
              "The output of these specialist functions may differ between versions; trust their properties (range, mean), not exact values.",
            ],
          },
        ],
      },
      {
        id: "security",
        title: ["Güvenlik: `random` neden güvenli değil?", "Security: why `random` is not secure"],
        items: [
          {
            id: "not-secure",
            name: "random ≠ cryptographically secure",
            kind: "concept",
            sig: "# Mersenne Twister (MT19937) is a PRNG, not a CSPRNG",
            sum: ["`random` tahmin edilebilir; güvenlik için `secrets` kullan.", "`random` is predictable; use `secrets` for anything security-related."],
            desc: [
              "**PRNG** (pseudo-random number generator) = formülle sayı üreten düzenek. **CSPRNG** (cryptographically secure PRNG) = çıktıyı görsen bile bir sonrakini hesaplayamadığın düzenek. Mersenne Twister CSPRNG **değildir**: iç durumu 624 × 32 bit'tir ve her çıktı, durumdan **tersine çevrilebilir** bir karıştırma (tempering) ile elde edilir. 624 çıktıyı gören biri durumu geri kurar ve gelecekteki **bütün** çıktıları bilir.",
              "A **PRNG** (pseudo-random number generator) produces numbers by formula. A **CSPRNG** (cryptographically secure PRNG) is one where seeing outputs does not let you compute the next one. Mersenne Twister is **not** a CSPRNG: its state is 624 × 32 bits and every output comes from the state through an **invertible** scrambling (tempering). Anyone who sees 624 outputs rebuilds the state and knows **all** future outputs.",
            ],
            ex: {
              title: ["Aynı seed = aynı “rastgele” parola", "Same seed = same “random” password"],
              code: R`import random
import string

def weak_password(seed, n=8):
    rng = random.Random(seed)
    return "".join(rng.choice(string.ascii_lowercase) for _ in range(n))

p1 = weak_password(1234)
p2 = weak_password(1234)
p3 = weak_password(1235)
print(p1 == p2)
print(p1 != p3)
print(len(p1))`,
              out: R`True
True
8`,
            },
            cyber: [
              "Gerçek hata örnekleri: zaman damgasıyla seed edilen şifre sıfırlama kodları, `random` ile üretilmiş session ID'ler, tahmin edilebilir CSRF token'lar. Seed uzayı küçükse (örn. son 1 günün saniyeleri ≈ 86 400 olasılık) saldırgan hepsini saniyeler içinde dener.",
              "Real-world bugs: password-reset codes seeded with the timestamp, session IDs made with `random`, predictable CSRF tokens. If the seed space is small (e.g. the seconds of the last day ≈ 86,400 options) an attacker simply tries them all in seconds.",
              "Savunma: `secrets` modülünü kullan, OS CSPRNG'sinden beslenen değerleri token olarak ver, token'ları kısa ömürlü yap ve deneme sayısını sınırla.",
              "Defence: use the `secrets` module, issue tokens fed by the OS CSPRNG, keep them short-lived and rate-limit attempts.",
            ].slice(0, 2),
            gotcha: [
              "“Python'un `random`'ı yeterince karışık” düşüncesi yanlış güvendir: karışıklık ≠ tahmin edilemezlik. Tahmin edilemezlik, **gizli ve yüksek entropili** bir kaynaktan gelir.",
              "“Python's `random` is mixed up enough” is false comfort: scrambled ≠ unpredictable. Unpredictability comes from a **secret, high-entropy** source.",
            ],
            see: ["seed", "systemrandom", "secrets:token_urlsafe"],
          },
        ],
      },
    ],
    recipes: [
      {
        id: "dice-sim",
        title: ["Zar simülasyonu", "Dice simulation"],
        sum: ["İki zarın toplamlarının dağılımını sayar.", "Counts the distribution of the sum of two dice."],
        code: R`import random
from collections import Counter

random.seed(2024)  # tekrarlanabilir deney ||| reproducible experiment
rolls = Counter(random.randint(1, 6) + random.randint(1, 6) for _ in range(6000))
print("En olasi toplam 7 mi:", rolls.most_common(1)[0][0] == 7)
print("Toplam sayisi 11 mi:", len(rolls) == 11)
print("Tum sonuclar 2-12 araliginda mi:", min(rolls) == 2 and max(rolls) == 12)`,
        out: R`En olasi toplam 7 mi: True
Toplam sayisi 11 mi: True
Tum sonuclar 2-12 araliginda mi: True`,
        note: ["7 en sık gelir: 36 kombinasyondan 6'sı 7 yapar.", "7 is the most common: 6 of the 36 combinations make 7."],
      },
      {
        id: "split-data",
        title: ["Tekrarlanabilir train/test ayırma", "Reproducible train/test split"],
        sum: ["Listeyi karıştırıp %80/%20 böler; seed ile her seferinde aynı bölünme.", "Shuffles a list and splits 80/20; the seed gives the same split every time."],
        code: R`import random

data = list(range(1, 11))
rng = random.Random(7)       # kendi üretecimiz ||| our own generator
rng.shuffle(data)
cut = int(len(data) * 0.8)
train, test = data[:cut], data[cut:]
print(len(train), len(test))
print(sorted(train + test) == list(range(1, 11)))`,
        out: R`8 2
True`,
      },
      {
        id: "weak-vs-strong",
        title: ["Zayıf ve güçlü parola üreteci", "Weak vs strong password generator"],
        sum: ["Aynı alfabe; biri tahmin edilebilir (`random`), biri değil (`SystemRandom`).", "Same alphabet; one predictable (`random`), one not (`SystemRandom`)."],
        code: R`import random
import string

alphabet = string.ascii_letters + string.digits

def weak(n=12, seed=0):
    rng = random.Random(seed)      # TEHLİKELİ: seed biliniyor ||| DANGEROUS: seed is known
    return "".join(rng.choice(alphabet) for _ in range(n))

def strong(n=12):
    sr = random.SystemRandom()     # OS CSPRNG ||| OS CSPRNG
    return "".join(sr.choice(alphabet) for _ in range(n))

print(weak() == weak())            # tekrarlanabilir = kötü ||| reproducible = bad
print(strong() == strong())        # tekrarlanamaz = iyi ||| not reproducible = good
print(len(strong()), set(strong()) <= set(alphabet))`,
        out: R`True
False
12 True`,
        cyber: true,
        note: ["Gerçek projede doğrudan `secrets.choice` kullan (aynı iş, daha açık niyet).", "In a real project use `secrets.choice` directly (same job, clearer intent)."],
      },
      {
        id: "mt-clone",
        title: ["Lab: Mersenne Twister durumunu geri kurma", "Lab: recovering the Mersenne Twister state"],
        sum: ["Kendi üretecinin 624 çıktısından durumu kurar ve sonrakileri tahmin eder; `random`'ın neden güvensiz olduğunu gösterir.", "Rebuilds the state from 624 outputs of your own generator and predicts the next ones; shows why `random` is insecure."],
        code: R`import random

def untemper(y):
    # MT'nin tempering adımlarını tersine çevir ||| invert the MT tempering steps
    y ^= y >> 18
    y ^= (y << 15) & 0xEFC60000
    t = y
    for _ in range(5):
        t = y ^ ((t << 7) & 0x9D2C5680)
    y = t
    t = y
    for _ in range(3):
        t = y ^ (t >> 11)
    return t & 0xFFFFFFFF

victim = random.Random()                       # bilinmeyen seed ||| unknown seed
seen = [victim.getrandbits(32) for _ in range(624)]   # gözlemlenen çıktılar ||| observed outputs

clone = random.Random()
clone.setstate((3, tuple(untemper(o) for o in seen) + (624,), None))
ok = all(victim.getrandbits(32) == clone.getrandbits(32) for _ in range(1000))
print("predicted next 1000 outputs:", ok)`,
        out: R`predicted next 1000 outputs: True`,
        cyber: true,
        note: ["Yalnızca kendi ürettiğin nesne üzerinde dene. Amaç: saldırının ne kadar basit olduğunu görüp `secrets`'e geçmek.", "Only try this on a generator you created yourself. The goal: see how simple the attack is and switch to `secrets`."],
      },
    ],
    cards: [
      {
        id: "pseudo",
        q: ["`random` modülündeki sayılar neden “sözde” rastgeledir?", "Why are the numbers from `random` called “pseudo” random?"],
        a: ["Mersenne Twister formülüyle, bir iç durumdan deterministik olarak üretilirler; aynı seed aynı diziyi verir.", "They are produced deterministically by the Mersenne Twister formula from an internal state; the same seed gives the same sequence."],
      },
      {
        id: "randint-vs-randrange",
        q: ["`randint(1, 6)` ile `randrange(1, 6)` arasındaki fark nedir?", "What is the difference between `randint(1, 6)` and `randrange(1, 6)`?"],
        a: ["`randint` üst sınırı dahil eder (1-6); `randrange` dahil etmez (1-5).", "`randint` includes the upper bound (1-6); `randrange` excludes it (1-5)."],
      },
      {
        id: "shuffle-none",
        q: ["`x = random.shuffle(x)` sonrası `x` ne olur?", "What is `x` after `x = random.shuffle(x)`?"],
        a: ["`None`; `shuffle` listeyi yerinde karıştırır ve `None` döndürür.", "`None`; `shuffle` shuffles in place and returns `None`."],
        code: R`x = [1, 2, 3]
x = random.shuffle(x)`,
      },
      {
        id: "choice-vs-sample",
        q: ["`choices` ile `sample` farkı?", "`choices` vs `sample`?"],
        a: ["`choices` yerine koyarak seçer (tekrar olabilir, ağırlık verilir); `sample` yerine koymadan seçer (tekrar yok).", "`choices` picks with replacement (repeats possible, weights allowed); `sample` picks without replacement (no repeats)."],
      },
      {
        id: "secure-token",
        q: ["Oturum token'ı üretmek için `random` yeterli mi? Ne kullanmalı?", "Is `random` good enough to make a session token? What should you use?"],
        a: ["Hayır. `secrets` (ör. `secrets.token_urlsafe()`) veya `random.SystemRandom` kullan; çünkü `random` tahmin edilebilir.", "No. Use `secrets` (e.g. `secrets.token_urlsafe()`) or `random.SystemRandom`, because `random` is predictable."],
      },
      {
        id: "global-seed",
        q: ["`random.seed(1)` neden başka bir `random.Random(2)` nesnesini etkilemez?", "Why does `random.seed(1)` not affect a separate `random.Random(2)` object?"],
        a: ["Modül fonksiyonları gizli global bir üreteci kullanır; `Random()` nesnelerinin kendi bağımsız durumu vardır.", "Module functions use one hidden global generator; `Random()` objects have their own independent state."],
      },
      {
        id: "624",
        q: ["Saldırgan MT'nin durumunu geri kurmak için kaç çıktı gözlemlemeli?", "How many outputs must an attacker observe to rebuild MT's state?"],
        a: ["624 ardışık 32-bit çıktı.", "624 consecutive 32-bit outputs."],
      },
    ],
  });
})();

# PyAtlas: Python ve Siber Güvenlik Kütüphane Atlası

PyAtlas, Python programlama dilinin standart ve temel üçüncü parti kütüphanelerini, metotlarını ve fonksiyonlarını adım adım somutlaştırarak öğreten; hem genel yazılım geliştirme hem de savunmacı siber güvenlik (defensive cyber security) pratiklerini tek çatı altında sunan modern, interaktif ve çevrimdışı çalışabilen bir Progressive Web App (PWA) platformudur.

- Canlı Uygulama: https://tommyvercetti89.github.io/pyatlas/
- GitHub Deposu: https://github.com/tommyvercetti89/pyatlas

---

## Temel Özellikler

- **Mobil ve Masaüstü PWA:** W3C Manifest ve Service Worker (`pyatlas-v1.5.0`) ile tarayıcı üzerinden doğrudan telefona veya bilgisayara yerel bir uygulama gibi kurulabilir. İnternet bağlantısı olmaksızın (offline-first) 58 varlığın tamamıyla bağımsız çalışır.
- **Çift Odaklı Öğretim Modeli:** Her kütüphane ve metot için hem günlük yazılım geliştirme ("Genel Kodlama") hem de siber güvenlik / lab kullanım senaryoları ("Siber Güvenlik") ayrı ayrı ele alınır.
- **Aralıklı Tekrar Sistemi (SM-2 Spaced Repetition):** SuperMemo ve Anki algoritmalarını temel alan kart sistemi ile öğrenilen fonksiyonların kalıcı hafızaya aktarılmasını sağlar. Kolaylık dereceleri, inceleme kuyruğu ve günlük tekrar takip mekanizması mevcuttur.
- **3 Dinamik Tema:** 
  - Dark (Varsayılan): OLED uyumlu derin obsidyen ve siber renk paleti.
  - Purple (Cyber Neon): Fütüristik mor ve neon camgöbeği estetiği.
  - Light (Açık): Yüksek kontrastlı, temiz editoryal okuma modu.
- **Anında İki Dilli Altyapı (TR / EN):** Arayüz butonlarından kütüphane dokümantasyonuna, metot parametrelerinden kod bloklarındaki yorum satırlarına kadar tüm içerik sayfa yenilenmeden milisaniyeler içinde Türkçe ve İngilizce arasında dönüşür.
- **Sıfır Derleme Adımı (Zero Build Step):** Karmaşık derleyicilere, paketleyicilere veya Node çalışma zamanı bağımlılıklarına ihtiyaç duyulmaz. Saf Vanilla HTML5, CSS3 ve ES6 ile hazırlanmıştır.
- **Canlı Kod Arama ve Klavye Kısayolları:** `/` veya `Ctrl+K` ile 34 kütüphane ve 300'ü aşkın metot arasında gerçek zamanlı arama yapılabilir.

---

## Kapsanan Kütüphaneler (34 Amiral Modül)

### 1. Temel Dil ve Sistem
- `builtins`: Dahili fonksiyonlar, temel veri tipleri ve hata hiyerarşisi
- `sys`: Yorumlayıcı parametreleri, sistem yolları ve akış kontrolü
- `os`: İşletim sistemi arabirimi, dosya yönetimi ve süreç ortamı
- `pathlib`: Nesne yönelimli dosya yolu yönetimi
- `shutil`: Yüksek seviyeli dosya, dizin ve arşiv işlemleri

### 2. Metin, Veri ve Otomasyon
- `re`: Düzenli ifadeler (RegEx), log ve girdi ayrıştırma
- `json`: JSON serileştirme ve API veri alışverişi
- `csv`: Tablosal veri analizi ve raporlama
- `sqlite3`: Sıfır konfigürasyonlu yerel SQL veritabanı motoru
- `datetime`: Zaman damgası aritmetiği, süre analizi ve oturum kontrolleri
- `time`: Düşük seviyeli sistem saati ve gecikme yönetimi
- `collections`: Gelişmiş veri yapıları (Counter, deque, defaultdict)
- `itertools`: Yüksek performanslı döngü üreteçleri ve kombinatorik araçlar
- `random`: İstatiksel sahte-rastgele sayı üreteci (PRNG)
- `secrets`: Kriptografik güvenli rastgele sayı ve token üretimi (CSPRNG)
- `argparse`: Profesyonel CLI argüman ayrıştırma arabirimi
- `logging`: Kurumsal loglama, denetim izi ve hata takibi

### 3. Ağ ve İletişim
- `socket`: Düşük seviyeli Berkeley ağ soketi arabirimi
- `ipaddress`: IPv4/IPv6 CIDR hesaplama, subnet doğrulama ve IP analizi
- `struct`: İkili (binary) paket ve ağ protokol başlığı paketleme/çözme
- `ssl`: TLS şifreleme, sertifika doğrulama ve güvenli kanal kurma
- `urllib`: Standart HTTP istemcisi ve URL ayrıştırma
- `http.server`: Dahili HTTP dinleyicisi ve honeypot prototipi
- `requests`: Modern, ergonomik HTTP istemcisi (üçüncü parti)
- `scapy`: Paket manipülasyonu, koklama (sniffing) ve analiz (üçüncü parti)
- `paramiko`: SSHv2 istemci ve sunucu otomasyonu (üçüncü parti)

### 4. Kriptografi ve Kodlama
- `hashlib`: SHA-256, SHA-3, MD5 ve PBKDF2 kriptografik özetleme
- `hmac`: Mesaj doğrulama kodu ve zamanlama saldırılarına karşı güvenli kontrol
- `base64`: RFC 4648 ikili veri kodlama ve taşıma formatı
- `binascii`: Hex, Base64 ve düşük seviyeli ikili dönüşümler
- `cryptography`: Endüstri standardı simetrik ve asimetrik şifreleme (üçüncü parti)

### 5. Süreçler ve Eşzamanlılık
- `subprocess`: Alt süreç başlatma, komut çalıştırma ve boru hattı (pipeline)
- `threading`: İş parçacığı yönetimi ve bellek içi eşzamanlılık
- `concurrent.futures`: ThreadPoolExecutor ve ProcessPoolExecutor ile yüksek seviyeli asenkron tarayıcılar

---

## Yapılandırılmış Öğrenme Rotaları (Learning Tracks)

1. **Python'a Geri Dön (Refresh):** Temel tipler, dosya işlemleri, veri yapıları ve metin işleme ile hızlı ısınma turu.
2. **Siber Güvenlik Temeli (Cyber Core):** Sistem keşfi, alt süreçler, ikili veri dönüşümleri ve güvenli token mantığı.
3. **Ağ Savunması (Network Defense):** Düşük seviyeli soket programlama, paket yakalama, port tarama ve SSH otomasyonu.
4. **Veri ve Log Analizi (Data & Log Analysis):** Olay müdahale (incident response) odaklı log regex filtreleme, zaman analizi ve SQLite korelasyonu.
5. **Kripto Lab (Crypto Lab):** Simetrik/asimetrik şifreleme, dijital imza, HMAC ve parola türetme fonksiyonları (KDF).

---

## Mimari ve Teknik Standartlar

- **Vanilla Stack:** Harici JavaScript çatısı (React, Vue, Angular) kullanılmaz. Tarayıcıların yerel Web API'leri doğrudan çalışır.
- **İzole Veri Modeli:** Her kütüphane `data/libs/<id>.js` altında kendi IIFE kapsamı içinde tanımlanır.
- **Güvenli Olay Delegasyonu:** DOM tıklamaları küresel `data-act` mimarisiyle yönetilir; dinamik arayüz elemanlarında bellek sızıntısı ve dinleyici kopukluğu oluşmaz.
- **CSS Değişken Mimarisi:** Renkler, yazı boyutları ve radius değerleri CSS Custom Properties (`--var`) ile yönetilir.
- **Güvenli Alan (Safe Area Insets):** Modern mobil cihazlardaki kamera çentikleri ve alt çubuklar için `env(safe-area-inset-top)` ve `env(safe-area-inset-bottom)` kuralları tam desteklenir.

---

## Yerel Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için herhangi bir paket kurucusu gerekmez. Proje dizininde yerel bir HTTP sunucusu başlatmak yeterlidir:

```bash
# Python ile:
python -m http.server 8000

# veya Node.js ile:
npx serve .
```

Tarayıcınızda `http://localhost:8000` adresine giderek uygulamayı doğrudan kullanabilirsiniz.

---

## Test ve Doğrulama

Kod kalitesi, doğruluğu ve bütünlüğü otomatik test betikleriyle doğrulanmaktadır:

1. **Uygulama ve Buton Bütünlüğü:**
   ```bash
   node tools/test_app.mjs
   ```
   Tüm DOM elemanlarını, 20 adet `data-act` buton işleyicisini, Service Worker önbelleğini ve TR/EN çeviri anahtarlarını doğrular.

2. **Kütüphane Şema ve Çapraz Referans Doğrulaması:**
   ```bash
   node tools/validate.mjs
   ```
   34 kütüphanenin şemasını, metot imzalarını, kartlarını ve çift yönlü bağlantılarını denetler.

3. **Gerçek Python Örneklerinin Yürütülmesi:**
   ```bash
   python tools/run_examples.py
   ```
   Kütüphane dokümantasyonunda yer alan 371 adet Python kod örneğinin tamamını alt süreçlerde izole çalıştırarak beklenen çıktıları (`out`) doğrular.

---

## Lisans

Bu proje MIT lisansı kapsamında sunulmaktadır.

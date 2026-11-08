# 🐍 PyAtlas — Python & Siber Güvenlik Kütüphane Atlası (PWA)

> **GitHub Pages Uyumlu, Çevrimdışı Çalışabilen (PWA), Aralıklı Tekrar (SM-2) ve İki Dilli (TR / EN) İnteraktif Kütüphane Rehberi.**

---

## 🌟 Neden PyAtlas?

Python öğrenirken veya siber güvenlik lablarına girerken en büyük engel şudur: **Kütüphaneler ve metotların metotları** ("methods of methods") gözde büyür, karmaşıklaşır ve pratik yapmadıkça unutulur.

**PyAtlas**, Python standart kütüphanelerini ve temel siber güvenlik araçlarını;
1. **Somut Zihinsel Modeller ve Metaforlar** (Analojiler),
2. **Çalıştırılmış ve Doğrulanmış Örnek Kodlar** (%100 Deterministic Testler),
3. **Siber Güvenlik / Savunma / Ethical-Lab İpuçları**,
4. **Hafızada Kalıcı Kılan Aralıklı Tekrar Kartları (SuperMemo SM-2 Algoritması)**
ile tane tane öğreterek akılda kalıcı hale getirir.

---

## ✨ Özellikler

- 📱 **Mobil & Masaüstü PWA:** Telefona tek tıkla uygulama gibi yüklenir (`manifest.webmanifest`, `ServiceWorker`), uçak modunda ve çevrimdışı tamamen çalışır.
- 🎨 **3 Dinamik Tema:** 
  - 🌙 **Dark (Karanlık):** OLED dostu, göz yormayan derin gri/siyah.
  - 💜 **Purple (Cyber Neon):** Siber güvenlik ve fütüristik mor/neon estetiği.
  - ☀️ **Light (Açık):** Gündüz ortamları için yüksek kontrastlı net okuma modu.
- 🌐 **Anında İki Dilli Destek (TR 🇹🇷 / EN 🇬🇧):** Arayüz, açıklamalar ve kod yorumları (`# tr ||| en`) tek tuşla anında dilden dile dönüşür.
- 🧠 **Aralıklı Tekrar (SM-2 Spaced Repetition):** Anki ve SuperMemo algoritmalarıyla çalışan bilgi kartları (flashcards). Hatırlama zorluğuna göre (1: Tekrar, 2: Zor, 3: İyi, 4: Kolay) kartları ideal günlerde tekrar karşına çıkarır.
- 🛡️ **Defensive & Ethical Lab Odaklı:** Port tarama, banner yakalama, log inceleme, zamanlama saldırısı savunması, token yönetimi, paket ayrıştırma ve formül enjeksiyonu koruması.
- ⚡ **Sıfır Derleme (Zero Build Step):** Vanilla HTML5, CSS3 ve ES6. GitHub Pages veya herhangi bir statik sunucuda anında çalışır.
- 🔍 **Canlı Arama & Kısayol (`/`):** İstediğin metodu veya kütüphaneyi klavyeden `/` tuşuna basarak anında bul.

---

## 📚 Kapsanan Kütüphaneler (34 Flagship Modül)

### 1. Temel Sistem & Dosya Yönetimi (Basics & Files)
- **`builtins`**: Python dahili fonksiyonları (`len`, `zip`, `enumerate`, `isinstance`, `map`, `filter`, `open`, vb.)
- **`sys`**: Python yorumlayıcı ve işletim sistemi köprüsü (`argv`, `exit`, `stdin/stdout`, `platform`, `byteorder`)
- **`os`**: Düşük seviyeli sistem çağrıları (`environ`, `system`, `urandom`, `walk`, dosya izinleri)
- **`pathlib`**: Modern nesne yönelimli dosya ve dizin yönetimi (`Path`, `glob`, `resolve`, traversal savunması)
- **`shutil`**: Yüksek seviyeli kopyalama (`copy2` adli bilişim zaman koruması, `copytree`, `rmtree`, `which`)

### 2. Metin, Veri & Veritabanı (Text, Data & Database)
- **`re`**: Düzenli ifadeler (Regex) ile log ayrıştırma, IP/E-posta doğrulama ve arama
- **`json`**: Web API ve SIEM log serileştirme (`dumps`, `loads`, `indent`)
- **`csv`**: Zafiyet raporlama, pentest bulguları ve CSV Formül Enjeksiyonu savunması
- **`sqlite3`**: SQL sorguları, veritabanı saldırılarına karşı parametreli sorgu savunması (`?`)
- **`datetime`**: UTC zaman damgaları, log zaman çizelgesi (timeline) ve oturum süre sınırları (`timedelta`)
- **`time`**: Düşük seviyeli sayaçlar, `sleep` ile dalgalı IDS atlatma ve `perf_counter` zamanlama analizi
- **`collections`**: DDoS IP frekans sayacı (`Counter`), hız sınırlayıcı kuyruk (`deque`), `defaultdict`
- **`itertools`**: Parola brute-force simülatörü (`product`), kelime listesi akıtma (`chain`), proxy döngüsü (`cycle`)
- **`random`**: Simülasyon ve test verisi (ve neden güvenlikte kullanılmaması gerektiği)
- **`secrets`**: Kriptografik güvenli rastgelelik (parola, token, OTP, CSPRNG)

### 3. Araç Geliştirme & Günlük Kaydı (Tooling & Logging)
- **`argparse`**: Profesyonel CLI argüman ayrıştırma, `--target`, `--port`, alt komutlar (`subparsers`)
- **`logging`**: Olay müdahale ve güvenlik denetim kayıtları (INFO, WARNING, CRITICAL, dosya ve konsol akışları)

### 4. Ağ & Web Programlama (Network & Web)
- **`socket`**: TCP/UDP istemci/sunucu mimarisi, port tarayıcı, af_inet soketleri
- **`ipaddress`**: CIDR blokları, özel/genel IP filtreleme, alt ağ denetimi
- **`struct`**: Ağ paket başlıkları, ikili veri paketleme/açma (`pack`, `unpack`)
- **`ssl`**: TLS el sıkışması, sertifika analizi (`getpeercert`), Ortadaki Adam (MITM) savunması
- **`urllib`**: Standart kütüphane HTTP istemcisi, URL parse ve Open Redirect güvenlik doğrulaması
- **`http.server`**: Yerel test sunucusu, OAST / SSRF callback dinleyicisi, hafif bal küpü (honeypot)
- **`requests`**: Modern HTTP istemcisi, API istekleri, özel başlıklar, zaman aşımları
- **`scapy`**: İkili paket koklama (sniffing), paket üretme, SYN taraması, PCAP analizi
- **`paramiko`**: SSHv2 istemcisi, güvenli komut çalıştırma, SFTP dosya transferi, Ed25519 anahtarları

### 5. Kriptografi & Kodlama (Crypto & Encoding)
- **`hashlib`**: MD5, SHA-256, SHA-512, salting, gökkuşağı tablosu savunması
- **`hmac`**: Gizli anahtarlı mesaj doğrulama, webhook imzaları ve `compare_digest` zamanlama kalkanı
- **`base64`**: Binary veriyi ASCII'ye çevirme, URL-safe Base64, padding
- **`binascii`**: C hızında hex ve binary çevirisi, CRC32 sağlama, shellcode hexdump analizi
- **`cryptography`**: Fernet kimlik doğrulamalı simetrik şifreleme, AES-GCM, RSA anahtar üretimi, PBKDF2

### 6. Eşzamanlılık & Paralel Çalışma (Concurrency)
- **`subprocess`**: Sistem komutları çalıştırma (`run`), boru hatları (`PIPE`), Shell Injection savunması
- **`threading`**: Çok iş parçacıklı port tarama, kilitler (`Lock`), olaylar (`Event`)
- **`concurrent.futures`**: `ThreadPoolExecutor` ile yüksek hızlı tarayıcılar, `as_completed` canlı akış

---

## 🚀 Yerel Olarak Çalıştırma

Projeyi bilgisayarınızda yerel olarak açmak için herhangi bir HTTP sunucusu yeterlidir:

```bash
# Proje klasörüne girin:
cd pyküt

# Python dahili sunucusunu başlatın:
python -m http.server 8080
```

Tarayıcınızda açın:
👉 **`http://localhost:8080`**

---

## 🌐 GitHub Pages'e Yükleme (Adım Adım)

1. GitHub'da yeni bir repository (depo) oluşturun (örneğin: `pyatlas`).
2. Proje dizininde terminalden şu komutları çalıştırın:

```bash
git add .
git commit -m "feat: complete PyAtlas 34 flagship libraries with SM-2 spaced repetition and PWA"
git branch -M main
git remote add origin https://github.com/<kullanici-adiniz>/pyatlas.git
git push -u origin main
```

3. GitHub Repository sayfanızda:
   - **Settings** (Ayarlar) -> **Pages** sekmesine gidin.
   - **Branch** olarak `main` ve klasör olarak `/ (root)` seçin.
   - **Save** butonuna tıklayın.
4. Birkaç saniye içinde siteniz yayına alınacaktır:
   👉 **`https://<kullanici-adiniz>.github.io/pyatlas/`**

---

## 🧪 Test ve Doğrulama Araçları

Projeye dahil edilen test araçları tüm kod örneklerinin çalışabilirliğini doğrular:

```bash
# Tüm kütüphanelerin sözdizimini, çift dilli açıklamalarını ve kartlarını doğrula:
node tools/validate.mjs

# Tüm kütüphanelerdeki 368+ kod örneğini gerçek Python üzerinde çalıştırıp doğrula:
python tools/run_examples.py
```

---

## 📄 Lisans
Bu proje eğitim ve etik siber güvenlik araştırmaları için MIT lisansı altında hazırlanmıştır.

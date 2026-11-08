(function () {
  const R = String.raw;
  PY.addLib({
    id: "scapy",
    name: "scapy",
    sym: "sc",
    color: "#06b6d4",
    focus: "cyber",
    level: 3,
    ext: true,
    install: "pip install scapy",
    cat: "network",
    docs: "https://scapy.readthedocs.io/",
    tagline: [
      "Ağ paketlerini inşa etme, dinleme, çözümleme ve PCAP analizi yapma kütüphanesi.",
      "Packet manipulation: crafting, sniffing, dissecting, and analyzing PCAP captures."
    ],
    analogy: [
      "Standart soketlerle çalışmak bir mektubu zarfa koyup postaneye vermek gibidir; zarfın içindeki pulun ve mührün detayına dokunamazsın. Scapy ise eline bir matbaa verir: Ethernet çerçevesini (`Ether`), IP başlığını (`IP`), TCP bayraklarını (`TCP(flags='S')`) ve veri yükünü (`Raw`) legolar gibi üst üste dizer (`/` operatörü) ve kendi özel paketini üretirsin.",
      "Standard sockets are like dropping an envelope in a postbox without controlling internal routing headers. Scapy provides a full packet printing press: stack Ethernet (`Ether`), IPv4 (`IP`), TCP control flags (`TCP`), and arbitrary payloads (`Raw`) using the `/` stacking operator like building blocks."
    ],
    intro: [
      [
        "`scapy`, Python ile yazılmış en güçlü paket manipülasyon aracıdır. Yüzlerce ağ protokolünü (Ethernet, IP, TCP, UDP, ICMP, DNS, ARP, TLS) destekler. Ağ paketlerini inşa edebilir, ağdan dinleyebilir (sniff) ve pcap dosyalarını analiz edebilir.",
        "`scapy` is a premier network packet manipulation library supporting hundreds of protocols. It enables crafting arbitrary packets, capturing live network traffic, and analyzing PCAP files."
      ],
      [
        "Siber güvenlik eğitiminde ve ağ adli analizinde vazgeçilmezdir: Wireshark tarafından kaydedilen yakalama dosyalarını (`.pcap`) otomatik ayrıştırmak, SYN flood veya port tarama aktivitelerini tespit etmek ve protokollerin nasıl çalıştığını derinlemesine anlamak Scapy ile öğretilir.",
        "Crucial for network security and digital forensics: automating PCAP triage, dissecting network anomalies, and mastering TCP/IP protocol internals."
      ]
    ],
    import: R`from scapy.all import IP, TCP, UDP, ICMP, Ether, Raw, rdpcap, wrpcap`,
    general: [
      [
        "Ağ protokollerinin iç yapısını ve el sıkışma mantığını uygulamalı öğrenmek.",
        "Exploring protocol internals, header fields, and handshakes experimentally."
      ],
      [
        "PCAP dosyalarını açarak ağ trafiği istatistikleri ve bant genişliği raporları üretmek.",
        "Reading and summarizing PCAP capture files for telemetry and bandwidth reporting."
      ],
      [
        "Özel protokol başlıkları tasarlamak ve test etmek.",
        "Prototyping and testing custom binary framing protocols."
      ]
    ],
    cyberUse: [
      [
        "Ağ Güvenliği Adli Analizi: PCAP dosyalarını tarayarak şüpheli SYN taramalarını veya anormal paket boyutlarını tespit etmek.",
        "Forensic packet triage: inspecting PCAPs to identify port scans, malformed frames, and suspicious payloads."
      ],
      [
        "Yetkili lab ortamında TCP bayraklarını (SYN, ACK, FIN, RST) elle belirleyerek firewall tepkilerini test etmek.",
        "Auditing lab firewall behavior by synthesizing custom packets with targeted TCP flags (SYN, FIN, RST)."
      ],
      [
        "DNS ve ARP protokolü mesajlarını inceleyerek sahtecilik (spoofing/poisoning) girişimlerini tespit edecek savunma scriptleri yazmak.",
        "Developing defensive heuristics to detect ARP poisoning and DNS spoofing in capture dumps."
      ]
    ],
    sections: [
      {
        id: "packet-crafting",
        title: ["Paket İnşa Etme ve / Operatörü", "Packet Crafting & The / Operator"],
        intro: [
          "Katmanları birbirine bağlama, alanları özelleştirme ve özetleme metodları.",
          "Stacking protocol layers, custom field overrides, and summaries."
        ],
        items: [
          {
            id: "slash-operator",
            name: "Katman İstifleme: Layer1 / Layer2",
            kind: "operator",
            sig: "Ether() / IP() / TCP() / Raw()",
            sum: [
              "Scapy'nin meşhur bölme (`/`) operatörü ile ağ katmanlarını iç içe dizer.",
              "Stacks network layers sequentially from data link to application layer."
            ],
            desc: [
              "Bölme operatörü (`/`), bir katmanı diğerinin veri yükü (payload) olarak sarar. Örneğin `IP() / TCP()` ifadesi bir IP başlığının içine TCP başlığı yerleştirir. Otomatik olarak uzunluk ve sağlama toplamlarını (checksum) hesaplar.",
              "The division operator binds layers together, encapsulating each subsequent layer as the payload of the former. Checksums and length fields are computed automatically."
            ],
            ex: {
              code: R`from scapy.all import IP, TCP

pkt = IP(dst="192.168.1.1") / TCP(dport=80, flags="S")
print(pkt.dst)
print(pkt[TCP].dport)
print(pkt[TCP].flags)`,
              out: R`192.168.1.1
80
S`
            },
            cyber: [
              "`flags='S'` bir TCP SYN paketidir (3 yollu el sıkışmanın ilk adımı). Scapy ile istediğiniz TCP bayrağını (F, S, R, P, A, U) tek harfle atayabilirsiniz.",
              "`flags='S'` denotes a SYN segment. Scapy accepts single-letter flag mnemonics to forge exact TCP control combinations."
            ]
          },
          {
            id: "ip-layer",
            name: "IP() Katmanı",
            kind: "class",
            sig: "scapy.all.IP(src=None, dst=None, ttl=64, proto=None, ...)",
            sum: [
              "IPv4 paket başlığı katmanı.",
              "IPv4 packet header encapsulation layer."
            ],
            desc: [
              "Kaynak IP (`src`), hedef IP (`dst`), yaşam süresi (`ttl`) ve protokol (`proto`) alanlarını barındırır. `src` belirtilmezse Scapy işletim sisteminin varsayılan IP'sini otomatik doldurur.",
              "Encapsulates IPv4 headers. If `src` is omitted, Scapy automatically assigns the outbound interface IP."
            ],
            ex: {
              code: R`from scapy.all import IP

ip = IP(dst="10.0.0.1", ttl=128)
print(ip.ttl)
print(ip.dst)`,
              out: R`128
10.0.0.1`
            }
          },
          {
            id: "tcp-layer",
            name: "TCP() Katmanı",
            kind: "class",
            sig: "scapy.all.TCP(sport=None, dport=80, seq=0, ack=0, flags='S', ...)",
            sum: [
              "İletim Kontrol Protokolü (TCP) başlığı katmanı.",
              "Transmission Control Protocol (TCP) header layer."
            ],
            desc: [
              "Kaynak port (`sport`), hedef port (`dport`), sıra numarası (`seq`), onay numarası (`ack`) ve bayrakları (`flags`) yönetir.",
              "Controls ports, sequence/acknowledgment tracking, and handshake flags."
            ],
            ex: {
              code: R`from scapy.all import TCP

tcp = TCP(dport=443, flags="SA")  # SYN-ACK paketi ||| SYN-ACK packet
print(tcp.dport, tcp.flags)`,
              out: R`443 SA`
            }
          },
          {
            id: "raw-layer",
            name: "Raw() Katmanı",
            kind: "class",
            sig: "scapy.all.Raw(load=b'') -> Layer",
            sum: [
              "Ham uygulama verisi (payload) ekleme katmanı.",
              "Appends arbitrary binary application payload bytes."
            ],
            desc: [
              "HTTP istekleri, özel ikili komutlar veya test verilerini paketin en alt katmanına yerleştirmek için kullanılır.",
              "Attaches raw payload bytes (e.g. HTTP text, custom binary data) as the outermost encapsulated layer."
            ],
            ex: {
              code: R`from scapy.all import IP, UDP, Raw

pkt = IP(dst="127.0.0.1") / UDP(dport=53) / Raw(b"DNS_SORGU_VERISI")
print(pkt[Raw].load.decode())`,
              out: R`DNS_SORGU_VERISI`
            }
          }
        ]
      },
      {
        id: "pcap-io",
        title: ["PCAP Dosyalarını Okuma ve Yazma", "PCAP Capture File IO"],
        intro: [
          "Wireshark uyumlu yakalama dosyalarını diskte kaydetme ve analiz için belleğe alma.",
          "Loading and persisting capture files compatible with Wireshark and tcpdump."
        ],
        items: [
          {
            id: "wrpcap",
            name: "wrpcap(filename, pkts)",
            kind: "function",
            sig: "scapy.all.wrpcap(filename, pkts, append=False)",
            sum: [
              "Paket listesini standart `.pcap` dosyası olarak kaydeder.",
              "Writes a list of packets out to standard libpcap format."
            ],
            desc: [
              "Oluşturduğunuz veya yakaladığınız paketleri diske `.pcap` olarak yazar. Bu dosya daha sonra Wireshark veya NetworkMiner ile incelenebilir.",
              "Persists packet streams to `.pcap` on disk, fully viewable in Wireshark or tcpdump."
            ],
            params: [
              { n: "filename", d: ["Kaydedilecek `.pcap` dosya yolu.", "Output `.pcap` file path."] },
              { n: "pkts", d: ["Paketler listesi veya tek bir paket.", "Sequence of packets."] }
            ],
            ex: {
              code: R`from scapy.all import IP, TCP, wrpcap
import tempfile
import os

with tempfile.TemporaryDirectory() as td:
    p = os.path.join(td, "ornek.pcap")
    pkts = [IP(dst="10.0.0.1") / TCP(dport=p) for p in [80, 443]]
    wrpcap(p, pkts)
    print("Dosya boyutu:", os.path.getsize(p) > 0)`,
              out: R`Dosya boyutu: True`
            }
          },
          {
            id: "rdpcap",
            name: "rdpcap(filename)",
            kind: "function",
            sig: "scapy.all.rdpcap(filename, count=-1) -> PacketList",
            sum: [
              "Diskteki bir `.pcap` dosyasını okuyup Scapy PacketList nesnesine dönüştürür.",
              "Reads packets from a `.pcap` file into a Scapy PacketList."
            ],
            desc: [
              "Wireshark yakalamalarını Python ile analiz etmenin anahtarıdır. Belleğe yüklenen paketler üzerinde döngüyle katman denetimleri (`haslayer`) yapılır.",
              "Loads capture files into memory, returning a rich list of dissected packets ready for forensic analysis."
            ],
            ret: ["Paket listesi (`scapy.plist.PacketList`).", "Dissected `PacketList`."],
            ex: {
              code: R`from scapy.all import IP, TCP, wrpcap, rdpcap
import tempfile
import os

with tempfile.TemporaryDirectory() as td:
    p = os.path.join(td, "test.pcap")
    wrpcap(p, [IP(dst="192.168.1.5") / TCP(dport=22)])
    
    loaded = rdpcap(p)
    print("Paket sayisi:", len(loaded))
    print("Hedef IP:", loaded[0][IP].dst)`,
              out: R`Paket sayisi: 1
Hedef IP: 192.168.1.5`
            },
            cyber: [
              "Büyük PCAP dosyalarındaki port tarama izlerini veya veri sızıntılarını (data exfiltration) Python scriptleriyle otomatik taramak için `rdpcap` kullanılır.",
              "Automated threat hunting pipelines read gigabytes of PCAP dumps via Scapy to detect stealthy exfiltration patterns."
            ]
          },
          {
            id: "summary-show",
            name: "pkt.summary() / pkt.haslayer()",
            kind: "method",
            sig: "pkt.summary() -> str, pkt.haslayer(layer) -> bool",
            sum: [
              "Paketin tek satırlık özetini verir ve belirli katmanın varlığını sorgular.",
              "Returns one-line summary and verifies presence of a specific protocol layer."
            ],
            desc: [
              "`pkt.haslayer(TCP)` ifadesi pakette TCP başlığı olup olmadığını doğrular. `summary()` ise Wireshark liste satırı gibi hızlı bir protokol dizesi döner.",
              "`haslayer(cls)` checks if the packet contains a specific protocol layer. `summary()` produces a concise textual summary."
            ],
            ex: {
              code: R`from scapy.all import IP, TCP

pkt = IP(dst="127.0.0.1") / TCP(dport=80)
print(pkt.haslayer(TCP))
print(pkt.haslayer(IP))`,
              out: R`True
True`
            }
          },
          {
            id: "bytes-pkt",
            name: "bytes(pkt) (Serileştirme)",
            kind: "function",
            sig: "bytes(pkt) -> bytes",
            sum: [
              "Scapy paket nesnesini ağ kablosundan geçecek ham ikili baytlara dönüştürür.",
              "Serializes packet object into raw wire-format binary bytes."
            ],
            desc: [
              "Tüm başlıkları, uzunlukları ve sağlama toplamlarını (checksum) hesaplayarak ham bayt dizisi üretir.",
              "Forces computation of length and checksum fields, generating raw wire-format bytes."
            ],
            ex: {
              code: R`from scapy.all import IP, TCP

pkt = IP(dst="127.0.0.1") / TCP(dport=80)
raw = bytes(pkt)
print(len(raw), type(raw).__name__)`,
              out: R`40 bytes`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "pcap-syn-flood-detector",
        title: [
          "PCAP Dosyasında SYN Flood Tarama Analizi",
          "Forensic PCAP SYN Flood / Port Scan Detector"
        ],
        sum: [
          "Bir PCAP dosyasındaki tüm paketleri tarayıp aynı kaynaktan çok sayıda SYN paketi gelip gelmediğini analiz etme.",
          "Analyzing capture dumps to detect suspicious bursts of TCP SYN packets (scanning or flooding)."
        ],
        code: R`from scapy.all import IP, TCP, wrpcap, rdpcap
from collections import Counter
import tempfile
import os

with tempfile.TemporaryDirectory() as td:
    pcap_file = os.path.join(td, "saldiri_analizi.pcap")
    
    # Test amaciyla ornek paketler yaz ||| Generate sample packets
    sample_packets = []
    # Saldirgan IP: 10.0.0.99 hedef portlari tarasin ||| Scanner IP probing ports
    for port in [21, 22, 23, 80, 443]:
        sample_packets.append(IP(src="10.0.0.99", dst="192.168.1.1") / TCP(dport=port, flags="S"))
    wrpcap(pcap_file, sample_packets)
    
    # PCAP'i oku ve analiz et ||| Ingest and analyze capture
    packets = rdpcap(pcap_file)
    syn_counter = Counter()
    
    for p in packets:
        if p.haslayer(TCP) and p[TCP].flags == "S":
            syn_counter[p[IP].src] += 1
            
    for ip, count in syn_counter.items():
        print(f"Tespit Edilen Saldirgan: {ip} -> {count} adet SYN paketi gonderdi.")`,
        out: R`Tespit Edilen Saldirgan: 10.0.0.99 -> 5 adet SYN paketi gonderdi.`,
        cyber: true,
        note: [
          "Ağ adli analizinde (Network Forensics) port taramaları veya DoS girişimleri PCAP dosyalarından tam olarak bu mantıkla ayıklanır.",
          "Core network forensics technique: sweeping capture files for anomalous TCP control flag frequencies."
        ]
      },
      {
        id: "craft-dns-query",
        title: [
          "Özel DNS Sorgu Paketi İnşa Etme (Offline Yapılandırma)",
          "Crafting Custom DNS Query Frames (Offline Dissection)"
        ],
        sum: [
          "Scapy ile DNS protokol başlığı ve sorgu kaydı oluşturma.",
          "Constructing complete application-layer DNS queries over UDP."
        ],
        code: R`from scapy.all import IP, UDP, DNS, DNSQR

# DNS A kaydi sorgusu hazirla ||| Build DNS A record query
query = IP(dst="8.8.8.8") / UDP(dport=53) / DNS(rd=1, qd=DNSQR(qname="google.com"))

print("Protokol:", query[DNS].summary())
print("Sorgulanan Alan Adi:", query[DNSQR].qname.decode())`,
        out: R`Protokol: DNS Qry b'google.com.'
Sorgulanan Alan Adi: google.com.`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "scapy-slash-operator",
        q: [
          "Scapy'deki `/` operatörü ne işe yarar ve nasıl çalışır?",
          "What is the purpose of the `/` operator in Scapy and how does it work?"
        ],
        a: [
          "Katman istifleme (Layer Stacking) operatörüdür. Sağındaki katmanı solundaki katmanın veri yükü (payload) olarak paketler (örn: `IP() / TCP()`).",
          "Layer stacking operator. Binds layers sequentially, encapsulating the right-hand layer into the payload of the left-hand layer."
        ]
      },
      {
        id: "haslayer-utility",
        q: [
          "`packet.haslayer(TCP)` metodu adli bilişim analizinde neden çok sık kullanılır?",
          "Why is `packet.haslayer(TCP)` ubiquitous in forensic traffic inspection?"
        ],
        a: [
          "Paketin içinde TCP katmanı olup olmadığını hata almadan (Exception fırlatmadan) doğrular; böylece sadece ilgilenilen protokoller filtrelenebilir.",
          "Safely checks if a specific protocol layer exists in a packet without raising IndexError, enabling clean protocol filtering."
        ]
      },
      {
        id: "rdpcap-vs-sniff",
        q: [
          "`rdpcap()` ile `sniff()` arasındaki temel fark nedir?",
          "What is the core distinction between `rdpcap()` and `sniff()`?"
        ],
        a: [
          "`rdpcap()`, önceden kaydedilmiş `.pcap` dosyalarını diskten okur (çevrimdışı/offline). `sniff()` ise fiziksel ağ kartından o an geçen canlı paketleri dinler (çevrimiçi/online).",
          "`rdpcap()` reads pre-recorded capture files from disk offline. `sniff()` captures live packets directly from active network interfaces."
        ]
      },
      {
        id: "tcp-flags-meanings",
        q: [
          "Scapy'de `TCP(flags='S')` ve `TCP(flags='SA')` ne tür paketleri temsil eder?",
          "What kinds of packets do `TCP(flags='S')` and `TCP(flags='SA')` represent?"
        ],
        a: [
          "`'S'` yalnızca SYN bayrağı aktif olan bağlantı başlatma paketidir. `'SA'` ise SYN + ACK bayrakları aktif olan sunucu el sıkışma yanıt paketidir.",
          "`'S'` denotes a SYN initiation packet. `'SA'` denotes a SYN-ACK server acknowledgment response."
        ]
      },
      {
        id: "scapy-privilege-note",
        q: [
          "Canlı ağda Scapy ile paket göndermek (`send`) veya dinlemek (`sniff`) neden yönetici (root/admin) yetkisi gerektirir?",
          "Why does sending or sniffing live packets in Scapy require root/administrator privileges?"
        ],
        a: [
          "Çünkü işletim sisteminin standart TCP/IP yığınını atlayarak ham ağ kartı sürücülerine (Raw Sockets / Npcap / libpcap) doğrudan erişim sağlar; bu da güvenlik nedeniyle yalnızca yöneticilere açıktır.",
          "Because it bypasses the operating system's standard TCP/IP stack to access raw socket drivers directly, restricted to privileged users."
        ]
      }
    ]
  });
})();

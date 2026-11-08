(function () {
  const R = String.raw;
  PY.addLib({
    id: "ipaddress",
    name: "ipaddress",
    sym: "ip",
    color: "#06b6d4",
    focus: "cyber",
    level: 2,
    ext: false,
    cat: "network",
    docs: "https://docs.python.org/3/library/ipaddress.html",
    tagline: [
      "IPv4 ve IPv6 adres ve alt ağ (subnet) manipülasyonu, CIDR hesaplama ve kapsam doğrulama.",
      "IPv4/IPv6 address and network manipulation, CIDR arithmetic, and scan scope enforcement."
    ],
    analogy: [
      "IP adresini sadece bir metin dizesi (`'192.168.1.1'`) olarak düşünmek, bir posta adresini sadece bir kağıt parçası sanmak gibidir. `ipaddress` modülü o adrese bir coğrafyacı ve haritacı gözüyle bakar: binanın numarasını (`ip_address`), sokağın sınırlarını (`ip_network`), adreste kaç daire olduğunu (`num_addresses`) ve bu adresin özel bir site mi yoksa halka açık bir cadde mi olduğunu (`is_private`, `is_global`) anında söyler.",
      "Treating an IP as a plain string is like seeing a mailing address as dumb text. The `ipaddress` module parses it like an urban planner: identifying the exact house (`ip_address`), the subnet borders (`ip_network`), total host count (`num_addresses`), and whether it is a private gated complex or public street (`is_private`, `is_global`)."
    ],
    intro: [
      [
        "`ipaddress` modülü (PEP 3144), IPv4 ve IPv6 adreslerini, alt ağlarını (subnet / CIDR) ve ağ arayüzlerini modelleyen nesne yönelimli standart Python kütüphanesidir.",
        "The `ipaddress` module (PEP 3144) provides capabilities to create, manipulate, and operate on IPv4 and IPv6 addresses and networks."
      ],
      [
        "Siber güvenlikte kapsam yönetimi (Scope Management) ve tarama güvenliğinin temelidir: sızma testlerinde yalnızca izinli IP bloklarının (`192.168.1.0/24`) tarandığından emin olmak, loglardan IP ayıklamak ve SSRF (Sunucu Taraflı İstek Sahteciliği) saldırılarını engellemek için özel/yerel IP'leri (`is_private`, `is_loopback`) filtrelemek bu modülle yapılır.",
        "In cyber security, this module is the cornerstone of penetration testing scope enforcement, log IP classification, and preventing SSRF vulnerabilities by detecting private/bogon IP blocks."
      ]
    ],
    import: R`import ipaddress`,
    general: [
      [
        "Bir alt ağdaki (CIDR) tüm geçerli istemci IP adreslerini döngüyle listelemek (`net.hosts()`).",
        "Iterating over all usable host IP addresses within a CIDR subnet."
      ],
      [
        "IP adreslerinin geçerliliğini ve biçimini doğrulamak (`AddressValueError`).",
        "Validating IP address syntax and detecting malformed strings."
      ],
      [
        "IPv4 ve IPv6 adreslerini ikili (packed bytes) veya tamsayı formatına dönüştürmek.",
        "Converting IP addresses to packed binary bytes or raw 32/128-bit integers."
      ]
    ],
    cyberUse: [
      [
        "Tarama Kapsamı Doğrulaması (Scope Checking): Bir hedefin izinli müşteri IP bloğu içinde olup olmadığını `target_ip in allowed_network` ile denetlemek.",
        "Auditing scan scope by verifying if target IPs reside within authorized customer CIDR blocks (`target in net`)."
      ],
      [
        "SSRF Koruması: Kullanıcı tarafından sağlanan URL'deki IP'nin `is_private` veya `is_loopback` olup olmadığını kontrol ederek iç ağa erişimi engellemek.",
        "Thwarting SSRF attacks by blocking outbound HTTP requests to `is_private` and `is_loopback` IP ranges."
      ],
      [
        "Güvenlik duvarı (Firewall) kurallarını CIDR bloklarına göre otomatik yapılandırmak.",
        "Automating firewall ACL configurations and supernet aggregations."
      ]
    ],
    sections: [
      {
        id: "factory-functions",
        title: ["Fabrika Fonksiyonları (Factory Functions)", "Factory Functions"],
        intro: [
          "Dizelerden veya sayılardan otomatik IPv4/IPv6 nesnesi üreten giriş fonksiyonları.",
          "Convenient factory constructors that automatically infer IPv4 vs IPv6."
        ],
        items: [
          {
            id: "ip-address",
            name: "ipaddress.ip_address(address)",
            kind: "function",
            sig: "ipaddress.ip_address(address) -> IPv4Address | IPv6Address",
            sum: [
              "Verilen dize veya sayıdan IPv4Address veya IPv6Address nesnesi döner.",
              "Constructs an IPv4Address or IPv6Address object from string, int, or bytes."
            ],
            desc: [
              "Otomatik olarak adresin IPv4 mü yoksa IPv6 mı olduğunu anlar. Geçersiz bir IP verilirse `ValueError` (özellikle `AddressValueError`) fırlatır.",
              "Automatically distinguishes IPv4 from IPv6. Raises `AddressValueError` if given an invalid format."
            ],
            params: [
              { n: "address", d: ["IP adresi dizesi (örn: `'192.168.1.1'` veya `'::1'`).", "IP address string (e.g. `'192.168.1.1'` or `'::1'`)."] }
            ],
            ret: ["`IPv4Address` veya `IPv6Address` nesnesi.", "`IPv4Address` or `IPv6Address` instance."],
            ex: {
              code: R`import ipaddress

ip4 = ipaddress.ip_address("192.168.1.50")
ip6 = ipaddress.ip_address("2001:db8::1")
print(ip4.version, ip6.version)`,
              out: R`4 6`
            }
          },
          {
            id: "ip-network",
            name: "ipaddress.ip_network(address, strict=True)",
            kind: "function",
            sig: "ipaddress.ip_network(address, strict=True) -> IPv4Network | IPv6Network",
            sum: [
              "CIDR formatındaki ağ bloğunu temsil eden nesne oluşturur.",
              "Instantiates an IPv4Network or IPv6Network object from CIDR notation."
            ],
            desc: [
              "`strict=True` olduğunda host bitlerinin sıfır olmasını zorunlu kılar (örn: `192.168.1.0/24` geçerlidir ama `192.168.1.5/24` hata verir). `strict=False` verilirse host bitleri otomatik maskelenerek ağ adresi bulunur.",
              "When `strict=True`, host bits must be zeroed. Setting `strict=False` automatically masks host bits to compute the network base address."
            ],
            params: [
              { n: "address", d: ["CIDR dizesi (örn: `'10.0.0.0/8'`).", "CIDR network string (e.g. `'10.0.0.0/8'`)."] },
              { n: "strict", d: ["Host bitlerinin sıfır olmasını denetler (`bool`).", "Enforces that host bits are unset."] }
            ],
            ex: {
              code: R`import ipaddress

net = ipaddress.ip_network("192.168.1.0/24")
print(net.num_addresses)
print(net.netmask)`,
              out: R`256
255.255.255.0`
            }
          }
        ]
      },
      {
        id: "address-properties",
        title: ["IP Adres Özellikleri (Güvenlik Denetimleri)", "Address Attributes (Security Checks)"],
        intro: [
          "Bir IP adresinin türünü (özel, genel, yerel döngü) denetleyen öznitelikler.",
          "Essential boolean attributes for classifying IP address exposure."
        ],
        items: [
          {
            id: "is-private",
            name: "ip.is_private",
            kind: "attr",
            sig: "ip.is_private: bool",
            sum: [
              "IP'nin RFC 1918 özel (private/LAN) ağ aralığında olup olmadığını belirtir.",
              "Boolean indicating if the IP belongs to a private (RFC 1918) network allocation."
            ],
            desc: [
              "`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` ve `127.0.0.0/8` gibi internete yönlendirilmeyen iç ağ adreslerinde `True` döner.",
              "Returns `True` for non-routable private address allocations (e.g. `10.0.0.0/8`, `192.168.0.0/16`)."
            ],
            ex: {
              code: R`import ipaddress

lan = ipaddress.ip_address("192.168.1.1")
pub = ipaddress.ip_address("8.8.8.8")
print(lan.is_private, pub.is_private)`,
              out: R`True False`
            },
            cyber: [
              "SSRF (Server-Side Request Forgery) korumasında kullanıcıdan gelen hedef IP'nin `is_private` olması durumunda isteğin reddedilmesi hayati bir savunma tedbiridir.",
              "Mandatory check for defeating SSRF attacks: reject user-supplied target URLs resolving to `is_private` IP addresses."
            ]
          },
          {
            id: "is-loopback",
            name: "ip.is_loopback",
            kind: "attr",
            sig: "ip.is_loopback: bool",
            sum: [
              "IP'nin yerel geri döngü (127.0.0.0/8 veya ::1) adresi olduğunu doğrular.",
              "Boolean indicating if the address is allocated for local loopback."
            ],
            desc: [
              "`127.0.0.1` veya `::1` adreslerinde `True` döner. Yalnızca yerel makinenin kendisini işaret eder.",
              "Returns `True` for loopback addresses (`127.0.0.0/8` or `::1`)."
            ],
            ex: {
              code: R`import ipaddress

print(ipaddress.ip_address("127.0.0.1").is_loopback)
print(ipaddress.ip_address("::1").is_loopback)`,
              out: R`True
True`
            }
          },
          {
            id: "is-global",
            name: "ip.is_global",
            kind: "attr",
            sig: "ip.is_global: bool",
            sum: [
              "IP'nin genel internette yönlendirilebilir (public) olduğunu doğrular.",
              "Boolean indicating if the address is globally routable on the public Internet."
            ],
            desc: [
              "Özel, rezerve veya yerel olmayan, doğrudan genel internette erişilebilen kamuya açık IP'lerde `True` döner.",
              "True for public routable addresses, excluding private, multicast, and loopback blocks."
            ],
            ex: {
              code: R`import ipaddress

print(ipaddress.ip_address("1.1.1.1").is_global)
print(ipaddress.ip_address("10.0.0.1").is_global)`,
              out: R`True
False`
            }
          }
        ]
      },
      {
        id: "network-operations",
        title: ["Alt Ağ İşlemleri ve Kapsam Kontrolü", "Subnet Operations & Scope Checking"],
        intro: [
          "Host numaralandırma, alt ağa bölme ve IP kapsam sorgulama metodları.",
          "Iterating usable hosts, calculating subnets, and testing membership."
        ],
        items: [
          {
            id: "hosts-generator",
            name: "network.hosts()",
            kind: "method",
            sig: "network.hosts() -> Iterator[IPv4Address]",
            sum: [
              "Ağ adresi ve broadcast hariç, ağdaki kullanılabilir host IP'lerini döner.",
              "Returns an iterator yielding usable host addresses in the network."
            ],
            desc: [
              "Standart /24 ağında 256 adres vardır ancak ilk adres (Ağ Adresi) ve son adres (Yayın / Broadcast Adresi) cihazlara atanamaz. `hosts()` metodu tam olarak atanabilir 254 hostu tek tek üretir (jeneratör).",
              "Yields valid assignable host addresses, automatically omitting the network and broadcast addresses."
            ],
            ex: {
              code: R`import ipaddress

net = ipaddress.ip_network("192.168.1.0/29")
hosts = list(net.hosts())
print(len(hosts))
print(hosts[0], "...", hosts[-1])`,
              out: R`6
192.168.1.1 ... 192.168.1.6`
            },
            cyber: [
              "Yerel ağ tarayıcılarında CIDR bloğundaki tüm hedef IP'leri döngüyle taramaya göndermek için `net.hosts()` kullanılır.",
              "Network scanning utilities feed `net.hosts()` directly into concurrency pools to audit entire subnets."
            ]
          },
          {
            id: "in-operator",
            name: "ip in network (Kapsam Kontrolü)",
            kind: "operator",
            sig: "address in network -> bool",
            sum: [
              "Bir IP adresinin belirtilen CIDR alt ağ bloğu içinde olup olmadığını test eder.",
              "Tests whether an IP address resides inside a target network block."
            ],
            desc: [
              "Siber güvenlikte 'Kapsam Kontrolü' (Scope Checking) için en hızlı ve güvenli yoldur. İzin verilen test kapsamı dışındaki kurumlara yanlışlıkla tarama paketi gitmesini önler.",
              "The quintessential method for enforcing authorized penetration testing scope and preventing out-of-scope scanning."
            ],
            ex: {
              code: R`import ipaddress

scope = ipaddress.ip_network("192.168.10.0/24")
print(ipaddress.ip_address("192.168.10.45") in scope)
print(ipaddress.ip_address("192.168.11.1") in scope)`,
              out: R`True
False`
            }
          },
          {
            id: "subnets",
            name: "network.subnets(prefixlen_diff=1)",
            kind: "method",
            sig: "network.subnets(prefixlen_diff=1, new_prefix=None) -> Iterator[Network]",
            sum: [
              "Bir ağı daha küçük alt ağlara (subnet) böler.",
              "Divides the current network into smaller constituent subnets."
            ],
            desc: [
              "Örneğin bir `/24` ağını iki adet `/25` alt ağına böler. Büyük tarama görevlerini worker iş parçacıklarına dağıtırken kullanılır.",
              "Splits a network into smaller chunks (e.g. dividing a `/24` into two `/25` subnets) for distributed parallel scanning."
            ],
            ex: {
              code: R`import ipaddress

net = ipaddress.ip_network("10.0.0.0/24")
subs = list(net.subnets(prefixlen_diff=1))
for s in subs:
    print(s)`,
              out: R`10.0.0.0/25
10.0.0.128/25`
            }
          }
        ]
      }
    ],
    recipes: [
      {
        id: "scope-validator",
        title: [
          "Siber Güvenlik Tarama Kapsamı Doğrulayıcı (Scope Guard)",
          "Scan Scope Boundary Validator"
        ],
        sum: [
          "Müşterinin izin verdiği CIDR blokları dışındaki hedefleri engelleyen güvenlik kontrolü.",
          "Enforcing strict authorization scope to guarantee scans never hit out-of-bounds targets."
        ],
        code: R`import ipaddress

# Musterinin izin verdigi CIDR kapsami ||| Authorized client scope
authorized_ranges = [
    ipaddress.ip_network("192.168.1.0/24"),
    ipaddress.ip_network("10.50.0.0/16")
]

def is_in_scope(target_ip_str):
    try:
        target = ipaddress.ip_address(target_ip_str)
        return any(target in network for network in authorized_ranges)
    except ValueError:
        return False

# Test kontrolleri ||| Validation tests
print("192.168.1.42 kapsamda mi?", is_in_scope("192.168.1.42"))
print("8.8.8.8 kapsamda mi?", is_in_scope("8.8.8.8"))`,
        out: R`192.168.1.42 kapsamda mi? True
8.8.8.8 kapsamda mi? False`,
        cyber: true,
        note: [
          "Sızma testlerinde izinsiz bir hedefe tek bir paket dahi göndermek yasal sorumluluk doğurur. Bu kontrol her tarama scriptinin başında bulunmalıdır.",
          "Sending probe packets outside agreed customer scope violates rules of engagement; always enforce a scope guard."
        ]
      },
      {
        id: "ssrf-ip-guard",
        title: [
          "SSRF Güvenlik Duvarı: İç Ağ IP Filtreleyici",
          "SSRF Defense: Internal IP Filter"
        ],
        sum: [
          "Kullanıcı URL'sindeki IP'nin iç ağa (LAN / Loopback) erişmesini engelleme.",
          "Blocking SSRF vectors targeting internal private services or cloud metadata endpoints."
        ],
        code: R`import ipaddress

def is_safe_public_ip(ip_str):
    try:
        ip = ipaddress.ip_address(ip_str)
        # Ozel veya yerel IP'ler engellenmelidir ||| Reject private, loopback, or reserved
        if ip.is_private or ip.is_loopback or ip.is_reserved or ip.is_multicast:
            return False
        return True
    except ValueError:
        return False

print("127.0.0.1 (Yerel):", is_safe_public_ip("127.0.0.1"))
print("169.254.169.254 (Cloud Metadata):", is_safe_public_ip("169.254.169.254"))
print("93.184.216.34 (Public Web):", is_safe_public_ip("93.184.216.34"))`,
        out: R`127.0.0.1 (Yerel): False
169.254.169.254 (Cloud Metadata): False
93.184.216.34 (Public Web): True`,
        cyber: true
      }
    ],
    cards: [
      {
        id: "strict-true-vs-false",
        q: [
          "`ipaddress.ip_network('192.168.1.5/24', strict=True)` neden `ValueError` hatası verir?",
          "Why does `ipaddress.ip_network('192.168.1.5/24', strict=True)` raise `ValueError`?"
        ],
        a: [
          "Çünkü `/24` ağında son oktet host bitleridir. `strict=True` olduğunda host bitlerinin sıfır (`192.168.1.0/24`) olması şarttır. `strict=False` verilirse Python host bitlerini otomatik sıfırlar.",
          "Because the final octet contains non-zero host bits (`.5`). `strict=True` requires exact network base boundaries (`.0`). Setting `strict=False` masks host bits automatically."
        ]
      },
      {
        id: "hosts-exclusion",
        q: [
          "`network.hosts()` jeneratörü hangi iki özel IP adresini hariç tutar ve neden?",
          "Which two special IP addresses does `network.hosts()` exclude and why?"
        ],
        a: [
          "Ağ Adresini (Network Address: tüm host bitleri 0) ve Yayın Adresini (Broadcast Address: tüm host bitleri 1) hariç tutar. Çünkü bu adresler tek bir cihaza atanamaz.",
          "It omits the Network Address (all host bits 0) and the Broadcast Address (all host bits 1) because neither can be assigned to an individual host adapter."
        ]
      },
      {
        id: "ssrf-prevention-role",
        q: [
          "`ip.is_private` ve `ip.is_loopback` öznitelikleri hangi web açığına (vulnerability) karşı temel savunmadır?",
          "Which web vulnerability is primarily defended using `ip.is_private` and `ip.is_loopback`?"
        ],
        a: [
          "SSRF (Server-Side Request Forgery). Saldırganın web sunucusunu kullanarak şirket içi iç ağdaki (192.168.x.x, 10.x.x.x) veya yerel (`127.0.0.1`) hassas servislere erişmesini engeller.",
          "Server-Side Request Forgery (SSRF). Prevents attackers from coercing the server into probing internal services or cloud metadata endpoints."
        ]
      },
      {
        id: "in-operator-usage",
        q: [
          "Bir IP'nin belirli bir alt ağda olduğunu kontrol etmek için Python'da en zarif sözdizimi nedir?",
          "What is the most pythonic syntax to check if an IP resides within a subnet?"
        ],
        a: [
          "`ip in network` sözdizimidir (örn: `ipaddress.ip_address('192.168.1.5') in ipaddress.ip_network('192.168.1.0/24')`). Doğrudan boolean `True/False` döner.",
          "`ip in network` (e.g. `ipaddress.ip_address('192.168.1.5') in ipaddress.ip_network('192.168.1.0/24')`), returning a clean boolean."
        ]
      },
      {
        id: "ipv4-vs-ipv6-handling",
        q: [
          "`ipaddress.ip_address()` fonksiyonuna IPv4 veya IPv6 verilmesi durumunda ne olur?",
          "How does `ipaddress.ip_address()` handle both IPv4 and IPv6 input strings?"
        ],
        a: [
          "Fonksiyon akıllıdır (polimorfik); girdi formatını otomatik inceler ve duruma göre ya bir `IPv4Address` ya da `IPv6Address` nesnesi döndürür.",
          "It is polymorphic: dynamically parses the address string and instantiates either an `IPv4Address` or an `IPv6Address` appropriately."
        ]
      }
    ]
  });
})();

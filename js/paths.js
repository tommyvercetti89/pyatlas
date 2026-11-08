/* Learning paths: ordered lists of library ids */
(function () {
  'use strict';
  const PY = window.PY = window.PY || {};
  PY.paths = [
    {
      id: 'refresh',
      icon: 'refresh',
      color: '#8b5cf6',
      title: ['Python’a Geri Dön', 'Back to Python'],
      desc: [
        'Uzun bir aradan sonra ısınma turu: temel tipler, dosyalar, metin ve veri işleme.',
        'A warm-up lap after a long break: core types, files, text and data handling.',
      ],
      libs: ['builtins', 'sys', 'os', 'pathlib', 'json', 'datetime', 'collections', 'itertools', 're'],
    },
    {
      id: 'cyber-core',
      icon: 'shield',
      color: '#06b6d4',
      title: ['Siber Güvenlik Temeli', 'Cyber Security Core'],
      desc: [
        'Ağ, ikili veri, özet (hash) ve güvenli rastgelelik: kursun Python omurgası.',
        'Networking, binary data, hashes and secure randomness: the Python backbone of your course.',
      ],
      libs: ['socket', 'ipaddress', 'struct', 'hashlib', 'hmac', 'secrets', 'base64', 'binascii', 'subprocess', 'logging'],
    },
    {
      id: 'net-web',
      icon: 'globe',
      color: '#10b981',
      title: ['Ağ ve Web', 'Network & Web'],
      desc: [
        'Soketten HTTP’ye, TLS’den paket analizine ve SSH’a kadar ağ programlama.',
        'Network programming from sockets to HTTP, TLS, packet analysis and SSH.',
      ],
      libs: ['socket', 'urllib', 'http.server', 'requests', 'ssl', 'scapy', 'paramiko'],
    },
    {
      id: 'tooling',
      icon: 'bolt',
      color: '#f59e0b',
      title: ['Araç Yazma ve Otomasyon', 'Tooling & Automation'],
      desc: [
        'Komut satırı araçları, paralel çalışma, veri depolama ve raporlama.',
        'Command-line tools, parallel work, data storage and reporting.',
      ],
      libs: ['argparse', 'logging', 'subprocess', 'threading', 'concurrent.futures', 'shutil', 'csv', 'sqlite3', 'time'],
    },
    {
      id: 'crypto',
      icon: 'key',
      color: '#ec4899',
      title: ['Kripto ve Kodlama', 'Crypto & Encoding'],
      desc: [
        'Encoding, hash, HMAC ve gerçek şifreleme arasındaki farkı bir kez ve kalıcı öğren.',
        'Learn the difference between encoding, hashing, HMAC and real encryption once and for all.',
      ],
      libs: ['base64', 'binascii', 'hashlib', 'hmac', 'random', 'secrets', 'cryptography', 'ssl'],
    },
  ];
})();


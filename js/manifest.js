/* Library registry. Add an id here and create data/libs/<id>.js to add a library. Order = display order. */
(function () {
  'use strict';
  const PY = window.PY = window.PY || {};
  PY.manifest = [
    // basics
    'builtins', 'sys', 'os', 'pathlib', 'shutil',
    // text & data
    're', 'json', 'csv', 'sqlite3', 'datetime', 'time',
    'collections', 'itertools', 'random', 'secrets', 'argparse', 'logging',
    // network
    'socket', 'ipaddress', 'struct', 'ssl', 'urllib', 'http.server', 'requests', 'scapy', 'paramiko',
    // crypto & encoding
    'hashlib', 'hmac', 'base64', 'binascii', 'cryptography',
    // processes & concurrency
    'subprocess', 'threading', 'concurrent.futures',
  ];
})();


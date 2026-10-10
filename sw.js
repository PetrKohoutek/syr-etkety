const CACHE = 'syr-etkety-pwa-v4';
const FILES = [
  './', './index.html', './styles.css', './app.js', './manifest.webmanifest', './icon.svg',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './assets/01_obr_hlavicka.png', './assets/10_obr_bok_1.png', './assets/11_obr_bok_2.png',
  './assets/12_obr_bok_3.png', './assets/13_obr_bok_4.png',
  './obsah/02_text_hlavicka_cz.txt', './obsah/03_text_hlavicka_aj.txt',
  './obsah/04_menu_1_cz.txt', './obsah/05_menu_1_aj.txt', './obsah/06_menu_2_cz.txt',
  './obsah/07_menu_2_aj.txt', './obsah/08_menu_3_cz.txt', './obsah/09_menu_3_aj.txt',
  './obsah/14_text_menu_1_cz.md', './obsah/15_text_menu_1_aj.md', './obsah/16_text_menu_2_cz.md',
  './obsah/17_text_menu_2_aj.md', './obsah/18_text_menu_3_cz.md', './obsah/19_text_menu_3_aj.md'
];
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES))));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const requestUrl = new URL(event.request.url);
  const editableContent = requestUrl.pathname.includes('/obsah/') || requestUrl.pathname.includes('/assets/');
  if (editableContent) {
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok && requestUrl.origin === self.location.origin) {
        caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
      }
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (requestUrl.origin === self.location.origin) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});

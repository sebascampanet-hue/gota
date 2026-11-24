// Gota: funciona sense connexió amb el que ja s'ha carregat. Les dades del núvol (Supabase) no es guarden aquí.
const CACHE = 'xop-v7';
const BASE = ['./', 'index.html', 'contingut.json', 'experts.json', 'nutricio.json', 'fonts.json', 'manifest.webmanifest', 'mascota-contenta.png', 'mascota-celebrant.png',
  'mascota-trista.png', 'mascota-pensativa.png', 'gota-celebra.webp', 'icona-192.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  // Xarxa primer (sempre la versió nova), i si no hi ha connexió, la còpia guardada.
  e.respondWith(fetch(r).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(r, cp)); }
    return res;
  }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || caches.match('./'))));
});

/* Service worker da Minha Fazendinha.
   __VERSION__ é substituído no build (hash do app.js), o que renova o cache a cada versão.
   Estratégia:
   - instalação: guarda a casca do app (html, js, css, manifesto, ícones);
   - navegação (abrir o app): rede primeiro, cache se estiver offline;
   - demais arquivos do próprio site: cache primeiro e atualiza em segundo plano (a próxima abertura já vem nova);
   - fontes do Google: cache se já vistas, senão rede (o jogo tem fallback de fonte). */
const VERSION = '__VERSION__';
const CACHE = `fazendinha-${VERSION}`;
const SHELL = ['./', './index.html', './app.js', './app.css', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('fazendinha-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; })
        .catch(() => caches.match('./index.html')),
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req).then((res) => {
          if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        }).catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  if (url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com')) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        if (res && res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
        return res;
      }).catch(() => cached)),
    );
  }
});

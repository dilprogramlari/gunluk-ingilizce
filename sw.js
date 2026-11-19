// Günlük İngilizce Konuşma — internetsiz çalışma
// Kabuk (sayfa, veri, simgeler, yazı tipi) her sürümde yenilenir; ses paketleri ayrı ve kalıcı önbellekte durur,
// adlarında içerik özeti olduğu için yalnızca değişen paketler yeniden iner. Sesleri sayfa tek tek indirir.
const KABUK = 'ingilizce-kabuk-e821654534';
const SES = 'ingilizce-ses';
const KABUK_DOSYALAR = ["./", "ikon-180.png", "ikon-192.png", "ikon-512.png", "ikon-maskable-512.png", "manifest.webmanifest", "veri.js", "yazitipi/7a3188b65975.woff2", "yazitipi/9fecae86b15d.woff2", "yazitipi/c0dd90c78986.woff2", "yazitipi/yazitipi.css"];
const SES_DOSYALAR = new Set(["ses/acil-e.a5189c61.js", "ses/acil.1232875d.js", "ses/alisveris-e.7394b783.js", "ses/alisveris.3350c62c.js", "ses/banka-e.96ba7a6d.js", "ses/banka.021938b4.js", "ses/berber-e.b5e8e72b.js", "ses/berber.fdfe94e5.js", "ses/bulusma-e.d0e01a0c.js", "ses/bulusma.3b7f7517.js", "ses/duygular-e.71a6b2ac.js", "ses/duygular.fcf24552.js", "ses/ev-e.50aadef2.js", "ses/ev.f852a9d4.js", "ses/is-e.08705a91.js", "ses/is.6c540557.js", "ses/kafe-e.13afde9f.js", "ses/kafe.2ecc962b.js", "ses/kendim-e.a49e5d22.js", "ses/kendim.fb072ae7.js", "ses/komsu-e.053c2a02.js", "ses/komsu.4a051f6e.js", "ses/kutuphane-e.cc35bef7.js", "ses/kutuphane.11208817.js", "ses/lokanta-e.a4b7aee8.js", "ses/lokanta.3d8a4e22.js", "ses/manav-e.a2d3145e.js", "ses/manav.f8c0bf11.js", "ses/market-e.8a2e5efd.js", "ses/market.680d3203.js", "ses/nezaket-e.68e8f8a0.js", "ses/nezaket.c7da4d54.js", "ses/okul-e.4b4877e2.js", "ses/okul.fdecbe56.js", "ses/otel-e.dc6c9d8f.js", "ses/otel.2cfdb10f.js", "ses/saglik-e.c7c4e953.js", "ses/saglik.5cda089b.js", "ses/sayilar-e.ec08afa3.js", "ses/sayilar.7078de45.js", "ses/sohbet-e.48afc5c7.js", "ses/sohbet.3248a5c1.js", "ses/stratejiler-e.4d5fa395.js", "ses/stratejiler.7f99c013.js", "ses/tanisma-e.0e52e534.js", "ses/tanisma.e8c6e7b7.js", "ses/telefon-e.4ef8b8b3.js", "ses/telefon.0bda8a16.js", "ses/ulasim-e.ee731ef4.js", "ses/ulasim.d2fb04ce.js", "ses/yol-e.97c1ca66.js", "ses/yol.9be50cea.js", "ses/zaman-e.9b429b71.js", "ses/zaman.ffe0ffb3.js"]);
self.addEventListener('install', e => {
  // tarayıcının kendi önbelleğindeki eski kopyalar değil, sunucudaki yeni dosyalar alınsın
  e.waitUntil(caches.open(KABUK).then(c => c.addAll(KABUK_DOSYALAR.map(d => new Request(d, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('ingilizce-') && k !== KABUK && k !== SES) await caches.delete(k);  // yalnızca bu programın eski önbellekleri
    const c = await caches.open(SES);   // artık kullanılmayan eski ses paketlerini temizle
    for (const r of await c.keys()) { const p = new URL(r.url).pathname.split('/').slice(-2).join('/'); if (!SES_DOSYALAR.has(p)) await c.delete(r); }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.includes('/ses/')) {
    e.respondWith(caches.open(SES).then(c => c.match(e.request, { ignoreSearch: true }).then(r => r ||
      fetch(e.request).then(y => { if (y.ok) c.put(e.request, y.clone()); return y; }))));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r ||
    (e.request.mode === 'navigate' ? caches.match('./') : null)).then(r => r || fetch(e.request)));
});

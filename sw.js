// Guarda la app en el teléfono para que funcione sin internet.
const CACHE='mi-gym-v10';
const FILES=['./','index.html','figuras.js','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png',
  'fonts/archivo.woff2','fonts/barlow-600.woff2','fonts/barlow-700.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Responde desde el teléfono al instante y, si hay internet, se actualiza por detrás.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}).catch(()=>hit);
    return hit||net;
  }));
});

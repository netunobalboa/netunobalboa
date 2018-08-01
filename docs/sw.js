// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'precache-v10';
const RUNTIME = 'runtime';

console.log("versão do sw" + PRECACHE);

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  './', // Alias for index.html
  'styles.css',
 // 'app.js'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  
  console.log("entrou no install");
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  
  console.log("entrou no activate");
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
     console.log("entrou na limpeza de cache");
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        console.log("entrou na limpeza de cache 2");
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.

//self.addEventListener('fetch', event => {
  
 // console.log("entrou no fetch");
 // // Skip cross-origin requests, like those for Google Analytics.
 // if (event.request.url.startsWith(self.location.origin)) {
 //  console.log("entrou no fetch 1");
 //  event.respondWith(
 //     caches.match(event.request).then(cachedResponse => {
 //       console.log("entrou no fetch 2");
 //       if (cachedResponse) {
 //        console.log("entrou no fetch 3");
 //         return cachedResponse;
 //       }

//        return caches.open(RUNTIME).then(cache => {
//          console.log("entrou no fetch 4");
//          return fetch(event.request).then(response => {
//            console.log("entrou no fetch 5");
//            // Put a copy of the response in the runtime cache.
//            return cache.put(event.request, response.clone()).then(() => {
//              console.log("entrou no fetch 6");
//              return response;
//            });
//          });
//        });
//      })
//    );
//  }
//});


// Serve from Cache
self.addEventListener("fetch", event => {
  console.log("entrou no fetch");
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        console.log("fetch online");
        return response || fetch(event.request);
      })
      .catch(() => {
        console.log("fletch offline");
        return caches.match('offline.html');
      })
  )
});

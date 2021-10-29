//This is the "Offline page" service worker

//console.log('Hello from service-worker.js');

const CACHE_VERSION = 5;

if('function' === typeof importScripts) {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
  if (workbox) {
      console.log(`Yay! Workbox is loaded 🎉`);
  } else {
      console.log(`Boo! Workbox didn't load 😬`);
  }
  
  workbox.routing.registerRoute(
      /.*\.(?:png|jpg|jpeg|svg|gif|js|css|html|woff2|json|ico)/g,
      new workbox.strategies.CacheFirst({
          cacheName: "pwa-offline",
          cacheableResponse: {
              statuses: [0, 200]
          }
      })
  );
  
  //Install stage sets up the offline page in the cache and opens a new cache
  self.addEventListener('install', function(event) {
    var indexPage = new Request('https://prelias.github.io/magicmirror/');
    event.waitUntil(
      fetch(indexPage).then(function(response) {
        return caches.open('pwa-offline').then(function(cache) {
          console.log('[PWA Builder] Cached files during install '+ response.url);
          return cache.add(indexPage, response);
        });
    }));
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open('pwa-offline').then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            cache.add(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });
}

// self.addEventListener('message', function(e) {
//   self.postMessage(e.data);
// }, false);


// self.addEventListener('load', function (event) {
//     event.waitUntil(
//         caches.open('pwa-offline').then(function (cache) {
//             return cache.addAll([
//                 'https://www.youtube.com/s/player/f676c671/player_ias.vflset/pt_BR/base.js',
//                 'https://paulorobertoelias.com.br/img/avatar-icon.png',
//                 'https://connect.facebook.net/en_US/sdk.js?hash=a6867fd537e6b78f3cffa02884775beb&ua=modern_es6',
//                 'https://c.disquscdn.com/next/embed/lounge.bundle.e956ea67a0fdae8d09ae64734b639915.js'
//             ]);
//         })
//     );
// });


//This is a event that can be fired from your page to tell the SW to update the offline page
// self.addEventListener('refreshOffline', function(response) {
//   return caches.open('pwabuilder-offline').then(function(cache) {
//     console.log('[PWA Builder] Offline page updated from refreshOffline event: '+ response.url);
//     return cache.put(offlinePage, response);
//   });
// });

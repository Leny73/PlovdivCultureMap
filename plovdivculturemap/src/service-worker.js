var staticCache = 'PlovdivCultureMap-v3'
self.addEventListener('install', function(event){
    console.log('The service worker is being installed');
    event.waitUntil(
        caches.open(staticCache).then(function(cache){
            console.log('Cache loaded');
            return cache.addAll([
                '/',
                '/index.css',
                '/App.css',
                '/App.js',
                '/componenets/footer.js',
                '/componenets/header.js',
                '/componenets/sidebar.js',

              ]);
        }).catch('Failed to cache')
    );
});
self.addEventListener('fetch', function(event) {
    console.log("The asset is serving");
    event.respondWith(
      caches.open(staticCache).then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });
self.addEventListener('activate',function(event){
    console.log('Service worker has been activated');
    event.waitUntil(
        caches.keys().then(function(cacheNames){
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName.startsWith('PlovdivCultureMap-') && cacheName != staticCache
                }).map(function(cacheName){
                    return cache.delete(cacheName);
                })
            );
        })
    );
});
const version = '1.1.3';
const cacheName = `v${version}::static`;

const fileList = ['/'];

self.addEventListener('install', e => {
    // once the SW is installed, go ahead and fetch the resources
    // to make this work offline
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                return cache.addAll(fileList).then(() => {
                    self.skipWaiting();
                });
            })
            .then(() => {
                console.log(`offline ${version} ready`);
            })
    );
});

// when the browser fetches a url, either response with
// the cached object or go ahead and fetch the actual url
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(res => res || fetch(event.request))
    );
});

const clearOldCaches = () => {
    return caches.keys().then(keys => {
        return Promise.all(
            keys.filter(key => key !== cacheName).map(key => caches.delete(key))
        );
    });
};

self.addEventListener('activate', event => {
    event.waitUntil(clearOldCaches().then(() => self.clients.claim()));
});

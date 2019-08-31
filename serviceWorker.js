const CacheName = 'static-v1';
const itemsToCache = [
    './',
    './css/main.css',
    './js/main.js',
];

self.addEventListener('install', (event) => {

    const preCache = async () => {

        const cache = await caches.open(CacheName);
        console.log('Opened cache');

        return cache.addAll(itemsToCache);
    };

    event.waitUntil(preCache());
});

self.addEventListener('fetch', (event) => {

    const responseHadler = async () => {
        
        let response = await caches.match(event.request);

        if (response) 
            return response;

        response = await fetch(event.request)
        
        if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
        }

        const responseToCache = response.clone();

        const cache = await caches.open(CacheName);
        cache.put(event.request, responseToCache);

        return response;
    }

    event.respondWith(responseHadler());
});
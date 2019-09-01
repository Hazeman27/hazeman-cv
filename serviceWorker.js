const CacheName = 'static-v7';
const itemsToCache = [
    './',
    './404.html',
    './css/main.css',
    './js/main.js',
];

self.addEventListener('install', (event) => {

    const preCache = async () => {

        const cache = await caches.open(CacheName);
        return cache.addAll(itemsToCache);
    };

    event.waitUntil(preCache());
});

self.addEventListener('fetch', (event) => {

    const responseHadler = async () => {
        
        let response = await caches.match(event.request);

        if (response) 
            return response;

        try {

            response = await fetch(event.request);

        } catch (error) {
            return await caches.match('./404.html');
        }
        
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
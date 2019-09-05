const Cache = 'static-v-10';
const Assets = [
    './',
    './404.html',
    './css/main.css',
    './js/main.js',
];

const preCache = async () => {

    const cache = await caches.open(Cache);
    return cache.addAll(Assets);
};

const responseHadler = async (request) => {
        
    let response = await caches.match(request);

    if (response) 
        return response;

    try {

        response = await fetch(request);

    } catch (error) {
        return await caches.match('./404.html');
    }
    
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
    }

    const cache = await caches.open(Cache);
    cache.put(request, response.clone());

    return response;
}

const updateAssets = async (request) => {

    const cache = await caches.open(Cache);
    const response = await fetch(request);

    await cache.put(request, response.clone());
    const clients = await self.clients.matchAll();

    for (const client of clients) {

        const message = {
            type: 'refresh',
            url: response.url,
            eTag: response.headers.get('ETag')
        };

        client.postMessage(JSON.stringify(message));
    }

    return response;
}

self.addEventListener('install', (event) => {
    event.waitUntil(preCache());
});

self.addEventListener('fetch', (event) => {

    event.respondWith(responseHadler(event.request));
    event.waitUntil(updateAssets(event.request));
});
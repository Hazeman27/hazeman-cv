const Cache = 'static-v-12';
const Assets = [
    './',
    './css/main.css',
    './css/media/min-width-800.css',
    './css/media/min-width-1080.css',
    './css/media/min-width-1366.css',
    './js/index.js',
];

const preCache = async () => {

    const cache = await caches.open(Cache);
    return cache.addAll(Assets);
};

const responseHandler = async (request) => {
        
    let response = await caches.match(request);

    if (response) 
        return response;

    try {

        response = await fetch(request);

    } catch (error) {
        return await caches.match('./index.html');
    }
    
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
    }

    const cache = await caches.open(Cache);
    await cache.put(request, response.clone());

    return response;
};

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
};

self.addEventListener('install', (event) => {
    event.waitUntil(preCache());
});

self.addEventListener('fetch', (event) => {

    event.respondWith(responseHandler(event.request));
    event.waitUntil(updateAssets(event.request));
});
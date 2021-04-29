var cacheName = 'WEBPOW_01-02-00';
var urlsToCache = [
	'/',
	'/index.html',
	'/inicio.webp',
	'/conexao.js',
	'/pow.js',
	'favicon.ico',
	'load.gif',
	'logo.webp',
	'logo180.png',
	'logo256.png',
	'logo512.png',
	'manifest.json',
	'menu.webp',
	'w3.css',
]

self.addEventListener('install',event=>{
	event.waitUntil(
		caches.open(cacheName).then(cache=>{
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('activate',event=>{
	event.waitUntil(caches.keys().then(cacheNames=>{
		return Promise.all(cacheNames.map(cache=>{
			if([cacheName].indexOf(cache)===-1)return caches.delete(cache);
		}));
	}));
});

self.addEventListener('fetch',event=>{
	event.respondWith(caches.match(event.request).then(response=>{
		if(response)return response;
		return fetch(event.request.clone()).then(response=>{
			if(!response||response.status!==200||response.type!=='basic')return response;
			var responseToCache=response.clone();
			caches.open(cacheName).then(cache=>{
				cache.put(event.request,responseToCache);
			});
			return response;
		});
	}));
});
// PWA part 2: the service worker. SvelteKit registers this file automatically.
// Idea: on install, download the whole app into a cache. Afterwards answer requests from the cache -> works offline.
// SvelteKit 3: the old '$service-worker' module is gone, the values come from these two modules:
import { version } from '$app/env';
import { assets, immutable, prerendered } from '$app/manifest';

const CACHE = `tafel-${version}`; // new build = new version = new cache
// immutable = JS/CSS bundles, assets = everything in /static, prerendered = the HTML pages
const ASSETS = [...immutable, ...assets, ...prerendered];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

// Delete caches of older versions
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
	);
});

// Cache first, network only if we don't have the file
self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;
	event.respondWith(caches.match(event.request).then((hit) => hit ?? fetch(event.request)));
});
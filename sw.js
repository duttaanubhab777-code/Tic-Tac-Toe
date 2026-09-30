/* Service worker — Created by Anubhab Dutta. Bump V after changing any file so users get the update. */
const V = "ttt-v3",
    ASSETS = [
        "./",
        "index.html",
        "style.css",
        "app.js",
        "manifest.json",
        "icons/icon-192.png",
        "icons/icon-512.png",
        "icons/maskable-512.png",
        "icons/apple-touch-icon.png"
    ];
self.addEventListener("install", e => {
    e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)));
    self.skipWaiting();
});
self.addEventListener("activate", e => {
    e.waitUntil(
        caches
            .keys()
            .then(k =>
                Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))
            )
    );
    self.clients.claim();
});
self.addEventListener("fetch", e => {
    if (e.request.method !== "GET") return;
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then(hit => {
            const net = fetch(e.request)
                .then(r => {
                    if (r.ok || r.type === "opaque") {
                        const cp = r.clone();
                        caches.open(V).then(c => c.put(e.request, cp));
                    }
                    return r;
                })
                .catch(() => hit);
            return hit || net; // cache first, refresh in background
        })
    );
});

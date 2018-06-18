const CACHE_NAME = "shop-list-pwa-v0.0.3"

urlsToCache = [
    '/',
    './',
    './index.html',
    './main.js',
    './public/css/main.css',
    './sw.js',
    './public/img/favicon.ico',
    './public/img/icons/icon-72x72.png',
    './public/img/icons/icon-96x96.png',
    './public/img/icons/icon-128x128.png',
    './public/img/icons/icon-144x144.png',
    './public/img/icons/icon-152x152.png',
    './public/img/icons/icon-192x192.png',
    './public/img/icons/icon-384x384.png',
    './public/img/icons/icon-512x512.png',

    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://code.getmdl.io/1.3.0/material.indigo-pink.min.css',
    'https://code.getmdl.io/1.3.0/material.min.js',

    'https://fonts.googleapis.com/css?family=Cantata+One',
    'https://fonts.googleapis.com/css?family=Lora'
]

self.addEventListener('install', e => {
    console.log("Evento: SW Instalado")
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log(`Archivos en cache`)
                return cache.addAll(urlsToCache)
            })
            .catch(err => console.log(`Fallo registro de cache`, err))
    )
})

self.addEventListener('activate', e => {
    console.log("Evento: SW Activado")
    const cacheList = [CACHE_NAME]

    e.waitUntil(
        caches.keys()
            .then(cachesNames => {
                return Promise.all(
                    cachesNames.map(cacheName => {
                        if (cacheList.indexOf(cacheName) === -1) {
                            return caches.delete(cacheName)
                        }
                    })
                )
            })
            .then(() => {
                console.log(`El cache esta limpio y actualizado`)
                return self.clients.claim()
            })
            .catch()
    )
})

self.addEventListener('fetch', e => {
    console.log('Evento: SW Recuperando')

    e.respondWith(
        //Miramos si la petición coincide con algún elemento del cache
        caches.match(e.request)
            .then(res => {
                console.log('Recuperando cache')
                if (res) {
                    //Si coincide lo retornamos del cache
                    return res
                }
                //Sino, lo solicitamos a la red
                return fetch(e.request)
            })
    )
})

self.addEventListener('push', e => {
    console.log('Evento: Push')

    let title = 'Push Notificación Demo',
        options = {
            body: 'Click para regresar a la aplicación',
            icon: './public/img/icons/icon-192x192.png',
            vibrate: [100, 50, 100],
            data: { id: 1 },
            actions: [
                { 'action': 'Si', 'title': 'Amo esta aplicación :)', icon: './img/icon_192x192.png' },
                { 'action': 'No', 'title': 'No me gusta esta aplicación :(', icon: './img/icon_192x192.png' }
            ]
        }

    e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', e => {
    console.log(e)

    if (e.action === 'Si') {
        console.log('AMO esta aplicación')
        clients.openWindow('https://www.google.com')
    } else if (e.action === 'No') {
        console.log('No me gusta esta aplicación')
    }

    e.notification.close()
})

// self.addEventListener('sync', e => {
//     console.log('Evento: Sincronización de Fondo', e)

//     //Revisamos que la etiqueta de sincronización sea la que definimos o la que emulan las devtools
//     if (e.tag === 'github' || e.tag === 'test-tag-from-devtools') {
//         e.waitUntil(
//             //Comprobamos todas las pestañas abiertas y les enviamos postMessage
//             self.clients.matchAll()
//                 .then(all => {
//                     return all.map(client => {
//                         return client.postMessage('online')
//                     })
//                 })
//                 .catch(err => console.log(err))
//         )
//     }
// })

  /* self.addEventListener('message' e => {
    console.log('Desde la Sincronización de Fondo: ', e.data)
    fetchGitHubUser( localStorage.getItem('github'), true )
  }) */

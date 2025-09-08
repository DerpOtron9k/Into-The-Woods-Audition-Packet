// Service Worker for Into the Woods Audition Packet
// Provides caching and offline support

// Auto-generate version based on timestamp for every deployment
const VERSION = Date.now();
const CACHE_NAME = `intothewoods-v${VERSION}`;
const STATIC_CACHE = `static-v${VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${VERSION}`;

// Resources to cache immediately (only local resources)
const STATIC_ASSETS = [
  '/',
  '/index.html'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches and force cache reset
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        // Delete ALL caches to force complete refresh
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        // Force all clients to reload to get fresh content
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({ type: 'CACHE_UPDATED' });
          });
        });
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external API calls (Google Apps Script)
  if (url.hostname === 'script.google.com') {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(response => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(request)
          .then(fetchResponse => {
            // Don't cache if not a valid response or if it's a chrome-extension URL
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic' || 
                request.url.startsWith('chrome-extension://')) {
              return fetchResponse;
            }

            // Clone the response
            const responseToCache = fetchResponse.clone();

            // Cache dynamic content (including external resources)
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                try {
                  cache.put(request, responseToCache);
                } catch (error) {
                  console.log('Cache put error:', error);
                }
              });

            return fetchResponse;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for form submissions (if supported)
self.addEventListener('sync', event => {
  if (event.tag === 'form-submission') {
    event.waitUntil(
      // Handle offline form submissions
      handleOfflineSubmissions()
    );
  }
});

// Handle offline form submissions
async function handleOfflineSubmissions() {
  try {
    // Get pending submissions from IndexedDB
    const pendingSubmissions = await getPendingSubmissions();
    
    for (const submission of pendingSubmissions) {
      try {
        // Attempt to submit
        const response = await fetch(submission.url, {
          method: 'POST',
          body: submission.data
        });
        
        if (response.ok) {
          // Remove from pending queue
          await removePendingSubmission(submission.id);
          console.log('Offline submission successful:', submission.id);
        }
      } catch (error) {
        console.log('Offline submission failed:', error);
      }
    }
  } catch (error) {
    console.log('Error handling offline submissions:', error);
  }
}

// IndexedDB helpers for offline storage
async function getPendingSubmissions() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function removePendingSubmission(id) {
  // Implementation would depend on your IndexedDB setup
  return true;
}

// Push notifications (if needed in the future)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

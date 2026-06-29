// Wakanect Service Worker — notifications push
// Servi depuis public/sw.js -> dist/sw.js (racine, scope "/")

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = {};
  }

  const data = payload.data || {};
  const type = data.type;

  const baseOptions = {
    icon: '/icon-192.png',   // ajoute en C3 ; icone grise par defaut en attendant
    badge: '/icon-192.png',
    renotify: true,
    data,
  };

  // Produits en attente : regroupes sous un tag partage, compteur cumule
  if (type === 'candidate') {
    const existing = await self.registration.getNotifications({ tag: 'candidate' });
    let count = 1;
    if (existing.length > 0 && existing[0].data && existing[0].data.count) {
      count = existing[0].data.count + 1;
    }
    const title = count > 1 ? 'Produits a valider' : (payload.title || 'Produit a valider');
    const body = count > 1
      ? `${count} produits attendent ta validation`
      : (payload.body || 'Nouveau produit detecte');
    return self.registration.showNotification(title, {
      ...baseOptions,
      body,
      tag: 'candidate',
      data: { ...data, count },
    });
  }

  // Nouvelle commande : une notification distincte par commande
  if (type === 'order') {
    return self.registration.showNotification(payload.title || 'Nouvelle commande', {
      ...baseOptions,
      body: payload.body || '',
      tag: data.orderId ? `order-${data.orderId}` : undefined,
    });
  }

  // Type inconnu : repli generique
  return self.registration.showNotification(payload.title || 'Wakanect', {
    ...baseOptions,
    body: payload.body || '',
  });
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const path = (event.notification.data && event.notification.data.url) || '/app';
  event.waitUntil(focusOrOpen(path));
});

async function focusOrOpen(path) {
  const clientsList = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });
  for (const client of clientsList) {
    if ('focus' in client) {
      await client.focus();
      if ('navigate' in client) {
        try { await client.navigate(path); } catch (e) { /* noop */ }
      }
      return;
    }
  }
  if (self.clients.openWindow) {
    return self.clients.openWindow(path);
  }
}

/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js"
);

// Route mapping for notification categories
const CATEGORY_TO_ROUTE = {
  ORDER_CREATED: "/recent-orders",
  ORDER_PAYMENT_CONFIRMED: "/recent-orders",
  ORDER_REVIEW_CREATED: "/order-reviews",
  ORDER_ITEM_REVIEW_CREATED: "/order-reviews",
  GENERAL_RATING_CREATED: "/website/general-ratings",
  ORDER_TICKET_CREATED: "/order-tickets",
  CONTACT_QUERY_CREATED: "/customers/contact-queries",
  RESERVATION_CREATED: "/customers/reservation-queries",
};

let isFirebaseInitialized = false;

// Initialize Firebase and setup messaging
function initializeFirebase(config) {
  if (isFirebaseInitialized) return;

  try {
    firebase.initializeApp(config);
    isFirebaseInitialized = true;

    const messaging = firebase.messaging();

    // Background notification handler
    messaging.onBackgroundMessage((payload) => {
      console.log(
        "[firebase-messaging-sw.js] Background message received:",
        payload
      );

      const { notification, data } = payload;

      const notificationOptions = {
        body: notification?.body || "",
        icon: "/favicon.svg",
        badge: "/favicon.svg",
        vibrate: [100, 50, 100],
        data: data,
        actions: [{ action: "open_app", title: "Open App" }],
        tag: data?.category || "default",
        renotify: true,
      };

      self.registration.showNotification(
        notification?.title || "New Notification",
        notificationOptions
      );
    });

    console.log("[firebase-messaging-sw.js] Firebase initialized successfully");
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Firebase initialization error:", error);
  }
}

// Receive config from main app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    initializeFirebase(event.data.config);
  }
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const category = event.notification.data?.category;
  const targetUrl = CATEGORY_TO_ROUTE[category] || "/dashboard";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.postMessage({
              type: "NOTIFICATION_CLICK",
              category,
              targetUrl,
            });
            return client.focus();
          }
        }
        // Open new window if not open
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

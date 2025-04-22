import { firebaseConfigData } from "../src/utils/staticCredential";

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// // Initialize the Firebase app in the service worker by passing the generated config
firebase?.initializeApp({
  apiKey: "AIzaSyCxJnLEXSwG-fHAzwoEWZdrbxPgOMLkaBE",
  authDomain: "marwa-2023.firebaseapp.com",
  projectId: "marwa-2023",
  storageBucket: "ammart-8885e.appspot.com",
  messagingSenderId: "393744073684",
  appId: "1:393744073684:web:7c8dcb6fc0cd90fc6a4c41",
  measurementId: "G-G7GR2SL8MG",
});

// Retrieve firebase messaging
const messaging = firebase?.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

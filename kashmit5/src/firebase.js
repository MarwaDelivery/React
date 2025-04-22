import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCxJnLEXSwG-fHAzwoEWZdrbxPgOMLkaBE",
  authDomain: "marwa-2023.firebaseapp.com",
  projectId: "marwa-2023",
  storageBucket: "ammart-8885e.appspot.com",
  messagingSenderId: "393744073684",
  appId: "1:393744073684:web:7c8dcb6fc0cd90fc6a4c41",
  measurementId: "G-G7GR2SL8MG",
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }

    return null;
  } catch (err) {
    return null;
  }
})();

export const fetchToken = async (setTokenFound, setFcmToken) => {
  return getToken(await messaging, {
    vapidKey:
      "BOafs51MmDIomDbBlXrEdpFXJQ_-fzWggglK9OEro9gj1cbMfZOIRpHKIiNErt54B3w6zXeru3Ls45fILn2y5Ko",
  })
    .then((currentToken) => {
      if (currentToken) {
        setTokenFound(true);
        setFcmToken(currentToken);

        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        setTokenFound(false);
        setFcmToken();
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      // catch error while creating client token
    });
};

export const onMessageListener = async () =>
  new Promise((resolve) =>
    (async () => {
      const messagingResolve = await messaging;
      onMessage(messagingResolve, (payload) => {
        resolve(payload);
      });
    })()
  );

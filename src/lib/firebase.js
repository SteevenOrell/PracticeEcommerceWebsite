import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase web config values are public identifiers (they ship in the bundle by design).
// Protect the project with Firebase Auth "Authorized domains", API-key HTTP referrer
// restrictions in Google Cloud, and server-side rules — never rely on hiding these values.
const firebaseConfig = {
    apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain);

let authInstance = null;
if (isFirebaseConfigured) {
    try {
        authInstance = getAuth(initializeApp(firebaseConfig));
    } catch {
        authInstance = null;
    }
}

/** Firebase Auth instance, or null when auth is not configured (the storefront still works). */
export const auth = authInstance;

import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Firebase web config values are public identifiers (they ship in the bundle by design).
// Protect the project with Firebase Auth "Authorized domains", API-key HTTP referrer
// restrictions in Google Cloud, and Firestore security rules (firestore.rules) — never
// rely on hiding these values.
const firebaseConfig = {
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Local development against the Firebase Emulator Suite (`npm run emulators`).
const useEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true";

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let authInstance = null;
let dbInstance = null;
if (isFirebaseConfigured) {
    try {
        const app = initializeApp(firebaseConfig);
        authInstance = getAuth(app);
        dbInstance = getFirestore(app);
        if (useEmulator) {
            connectAuthEmulator(authInstance, "http://127.0.0.1:9099", { disableWarnings: true });
            connectFirestoreEmulator(dbInstance, "127.0.0.1", 8080);
        }
    } catch {
        authInstance = null;
        dbInstance = null;
    }
}

/** Firebase Auth instance, or null when auth is not configured (the storefront still works). */
export const auth = authInstance;
/** Firestore instance, or null when Firebase is not configured (products fall back to the bundled catalog). */
export const db = dbInstance;

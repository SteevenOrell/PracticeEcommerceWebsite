// Shared Firebase Admin SDK bootstrap for the one-off scripts in this folder.
//
// Credentials: set GOOGLE_APPLICATION_CREDENTIALS to the path of a service-account JSON key
// (Firebase console > Project settings > Service accounts > Generate new private key).
// Keep that file OUTSIDE the repo. It grants full admin access to the project.
//
// Emulator: when FIRESTORE_EMULATOR_HOST / FIREBASE_AUTH_EMULATOR_HOST are set (e.g. by
// `firebase emulators:exec`), the Admin SDK talks to the emulators and needs no key.
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_AUTH_EMULATOR_HOST);

if (!usingEmulator && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error("Set GOOGLE_APPLICATION_CREDENTIALS to your service-account key path (kept outside the repo).");
}

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || undefined;
const app = initializeApp(usingEmulator
    ? { projectId: projectId || "demo-ecommerce" }
    : { credential: applicationDefault(), ...(projectId ? { projectId } : {}) });

export const db = getFirestore(app);
export const auth = getAuth(app);
export const target = usingEmulator ? "emulator" : `project ${app.options.projectId ?? "(from credentials)"}`;

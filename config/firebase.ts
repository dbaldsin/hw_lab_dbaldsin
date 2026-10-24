import publicConfig from './firebase.public.json';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

// Firebase web configuration identifies the project; it is not an admin credential.
// Defaults point to this lab's project; optional Expo env values can override them.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || publicConfig.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || publicConfig.authDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || publicConfig.projectId,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || publicConfig.storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || publicConfig.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || publicConfig.appId,
};
export const firebaseConfigured = Boolean(firebaseConfig.projectId);
export const usingEmulator = process.env.EXPO_PUBLIC_USE_FIRESTORE_EMULATOR === 'true';
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
if (usingEmulator) {
  connectFirestoreEmulator(db, process.env.EXPO_PUBLIC_FIRESTORE_EMULATOR_HOST || '127.0.0.1', 8088);
}

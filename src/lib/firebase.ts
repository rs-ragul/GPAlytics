import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function hasValidFirebaseConfig() {
  return Object.values(firebaseConfig).every((value) => Boolean(value));
}

export function getFirebaseApp() {
  if (!hasValidFirebaseConfig()) {
    throw new Error("Firebase config is missing. Add NEXT_PUBLIC_FIREBASE_* values to your environment.");
  }

  if (appInstance) {
    return appInstance;
  }

  appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return appInstance;
}

export function getFirebaseAuth() {
  if (authInstance) {
    return authInstance;
  }

  authInstance = getAuth(getFirebaseApp());
  return authInstance;
}

export function getFirestoreDb() {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = getFirestore(getFirebaseApp());
  return dbInstance;
}

import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB_xHOMN2FpbqB4BG7P4mYp092c7Puaxw4",
  authDomain: "finals-project-26b39.firebaseapp.com",
  projectId: "finals-project-26b39",
  storageBucket: "finals-project-26b39.firebasestorage.app",
  messagingSenderId: "1074830693454",
  appId: "1:1074830693454:web:bc98ec94ab1069fb029f1f"
};

// Prevent duplicate app initialization (handles hot reload and multiple imports)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with React Native persistence for session persistence
// Use getAuth to get existing auth instance if already initialized
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (error) {
  // Auth already initialized, get the existing instance
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

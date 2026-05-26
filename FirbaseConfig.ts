import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB_xHOMN2FpbqB4BG7P4mYp092c7Puaxw4",
  authDomain: "finals-project-26b39.firebaseapp.com",
  projectId: "finals-project-26b39",
  storageBucket: "finals-project-26b39.firebasestorage.app",
  messagingSenderId: "1074830693454",
  appId: "1:1074830693454:web:bc98ec94ab1069fb029f1f"
};

const app = initializeApp(firebaseConfig);

// In Firebase v11, getAuth() handles persistence automatically in React Native
const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
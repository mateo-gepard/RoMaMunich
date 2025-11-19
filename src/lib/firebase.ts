import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIz08txcPTddBgwFAo28pAc89zIfc7OIA",
  authDomain: "romamunich-7472d.firebaseapp.com",
  projectId: "romamunich-7472d",
  storageBucket: "romamunich-7472d.firebasestorage.app",
  messagingSenderId: "104574788278",
  appId: "1:104574788278:web:cf702ac6b12e19e80d3c17",
  measurementId: "G-MKHC1BDTR1"
};

// Initialize Firebase (nur einmal)
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth und Firestore exports
export const auth = getAuth(app);
export const db = getFirestore(app);

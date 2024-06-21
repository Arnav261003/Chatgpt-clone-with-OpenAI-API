import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzIFnv9pEYCR71R1uDma49HJ2yrYKYgVw",
  authDomain: "chatgpt-messenger-app-2c8f2.firebaseapp.com",
  projectId: "chatgpt-messenger-app-2c8f2",
  storageBucket: "chatgpt-messenger-app-2c8f2.appspot.com",
  messagingSenderId: "641612720529",
  appId: "1:641612720529:web:9dc0a1db66c863f0845230",
  measurementId: "G-L5W7SVDM0E"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig); //Singleton pattern encoding, when we want only a single instance
const db = getFirestore(app);

export { db };
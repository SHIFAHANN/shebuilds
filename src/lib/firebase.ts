import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB0766J5W5r7SncXe9Kh_kFdi-yATAkHRc",
    authDomain: "anonymous-confession-c6fd7.firebaseapp.com",
    projectId: "anonymous-confession-c6fd7",
    storageBucket: "anonymous-confession-c6fd7.firebasestorage.app",
    messagingSenderId: "83893502722",
    appId: "1:83893502722:web:34ee15fecd28a74d03b81b",
    measurementId: "G-30SZ0RKMXZ"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };

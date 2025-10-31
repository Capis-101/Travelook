// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDr49ngp4iDZyBvamrrVOC6GXAQJdwAHPo",
  authDomain: "travel-companion-guide.firebaseapp.com",
  projectId: "travel-companion-guide",
  storageBucket: "travel-companion-guide.firebasestorage.app",
  messagingSenderId: "154974395025",
  appId: "1:154974395025:web:91e89bf681d36e61cf3d30",
  measurementId: "G-MRK4PT3KWM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // ✅ Firestore initialized
const analytics = getAnalytics(app);
export const auth = getAuth(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdtc6OxWjVjiS6UC6PAlJ5ya1QW4HCr6U",
  authDomain: "streetfeast-25.firebaseapp.com",
  projectId: "streetfeast-25",
  storageBucket: "streetfeast-25.appspot.com",
  messagingSenderId: "448664364754",
  appId: "1:448664364754:web:94e9346cd0a88b28a4af0b",
  measurementId: "G-K02KX10QSE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in client-side and production
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { analytics };

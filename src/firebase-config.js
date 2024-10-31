// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCocbJ022I54UbdghLkqDtGB6yQdyjh6Ts",
  authDomain: "cphi-45f72.firebaseapp.com",
  projectId: "cphi-45f72",
  storageBucket: "cphi-45f72.appspot.com",
  messagingSenderId: "538700625938",
  appId: "1:538700625938:web:67ba742162128a8c4a00cb",
  measurementId: "G-RW8NGYMLQ1"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Auth persistence set successfully');
  })
  .catch((error) => {
    console.error('Error setting auth persistence:', error);
  }
);

export { db, auth, storage }
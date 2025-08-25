// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: "AIzaSyAZ4pKgh_cewr2f4A5IiL5Y-W6BRsM1fB0",
  authDomain: "paint-changer.firebaseapp.com",
  projectId: "paint-changer",
  storageBucket: "paint-changer.firebasestorage.app",
  messagingSenderId: "283803864978",
  appId: "1:283803864978:web:ab52319ef2d07623c8fb4b",
  measurementId: "G-B0R9H8PSQL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
const firestore = getFirestore(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEk8e-PlEvHd-B_I1gp_zA9qXZ15l_ppw",
  authDomain: "ggbois-16c37.firebaseapp.com",
  projectId: "ggbois-16c37",
  storageBucket: "ggbois-16c37.appspot.com",
  messagingSenderId: "284285752700",
  appId: "1:284285752700:web:5f9d83dd61b7c44fc040f9",
  measurementId: "G-FLKJT17KZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getFirestore(app);
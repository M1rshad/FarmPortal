// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqoc3zszq8DTl2xObUfrnzS1P7k4gr8Gg",
  authDomain: "farmportal-de7d9.firebaseapp.com",
  projectId: "farmportal-de7d9",
  storageBucket: "farmportal-de7d9.firebasestorage.app",
  messagingSenderId: "133503777116",
  appId: "1:133503777116:web:28d28b1b4f7d6d1d63a999",
  measurementId: "G-BKRR6CHWZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

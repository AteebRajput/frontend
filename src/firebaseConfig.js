// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClhtV0z82eYK2ZkX2olSSAjn-7PM9agG8",
  authDomain: "agritech-fcac6.firebaseapp.com",
  projectId: "agritech-fcac6",
  storageBucket: "agritech-fcac6.firebasestorage.app",
  messagingSenderId: "494337430587",
  appId: "1:494337430587:web:70bd38d27f7f793dd3781e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
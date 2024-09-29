import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCs_pix5_BOQRWXAFVE8IZ5syG8ZcpYcAg",
  authDomain: "practice-fire-38369.firebaseapp.com",
  projectId: "practice-fire-38369",
  storageBucket: "practice-fire-38369.appspot.com",
  messagingSenderId: "932154808874",
  appId: "1:932154808874:web:9e1d4b81986bc47d380153"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore()
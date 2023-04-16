import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMCgBJBFWytEi_2-O3nnugynZmTeyeCeg",
  authDomain: "messageapp-2337e.firebaseapp.com",
  projectId: "messageapp-2337e",
  storageBucket: "messageapp-2337e.appspot.com",
  messagingSenderId: "179248709272",
  appId: "1:179248709272:web:58f6bfebff4445ad991aed",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

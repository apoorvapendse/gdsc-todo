import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCoH_nHs8CtsFQjZBGzF7k0tVwf9xVsvwE",
  authDomain: "gdsc-todo-18159.firebaseapp.com",
  projectId: "gdsc-todo-18159",
  storageBucket: "gdsc-todo-18159.appspot.com",
  messagingSenderId: "724207916294",
  appId: "1:724207916294:web:5cac08d8811ba4e6f5ba87",
  measurementId: "G-5S3W8LN9DD",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

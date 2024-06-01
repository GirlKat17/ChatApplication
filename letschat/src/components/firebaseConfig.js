// Import the functions you need from the SDKs you need
import { initializeApp, getApps,getApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_auth_Domain, 
  projectId: process.env. NEXT_PUBLIC_FIREBASE_project_Id,
  storageBucket: process.env. NEXT_PUBLIC_FIREBASE_storage_Bucket,
  messagingSenderId: process.env. NEXT_PUBLIC_FIREBASE_messaging_Sender_Id, 
  appId: process.env. NEXT_PUBLIC_FIREBASE_app_Id,
  measurementId: process.env. NEXT_PUBLIC_FIREBASE_measurement_Id,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig): getApp();
const auth= getAuth(app)
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export {app,auth,db}

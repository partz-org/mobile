import { getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCcnWxqH493JHk2V04vUY55QUfEQh5j2uw",
  authDomain: "partz-21052.firebaseapp.com",
  projectId: "partz-21052",
  storageBucket: "partz-21052.appspot.com",
  messagingSenderId: "698644857046",
  appId: "1:698644857046:web:f6db8ca7799a8c28828977",
  measurementId: "G-1R31D3QNDH",
};

const firebaseApp = initializeApp(firebaseConfig);

if (!firebaseApp?.options) {
  throw new Error(
    "This example only works on Android or iOS, and requires a valid Firebase config."
  );
}

export const app = getApp();
export const auth = getAuth();

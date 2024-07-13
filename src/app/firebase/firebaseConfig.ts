import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCLxJ7uGBO3RsjuAxEaxWXDT44m9mrgCB8",
//   authDomain: "iott-b4895.firebaseapp.com",
//   databaseURL: "https://iott-b4895-default-rtdb.firebaseio.com",
//   projectId: "iott-b4895",
//   storageBucket: "iott-b4895.appspot.com",
//   messagingSenderId: "498904939578",
//   appId: "1:498904939578:web:74642e6263c30c862a8903",
//   measurementId: "G-ZG73C4V7PK",
// };
// const firebaseConfig = {
//   apiKey: "AIzaSyAbx74joTkwMgG2Fc9e5dnmVwAM4F3IfaU",
//   authDomain: "aightnow-fcc33.firebaseapp.com",
//   projectId: "aightnow-fcc33",
//   storageBucket: "aightnow-fcc33.appspot.com",
//   messagingSenderId: "1065469610982",
//   appId: "1:1065469610982:web:8a03a8c440a25ad7dfa427",
//   measurementId: "G-082J3DB40G",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCh93LSaD0oVyGiiWq9d6N6dVz1c7ikXjc",
  authDomain: "test-29402.firebaseapp.com",
  projectId: "test-29402",
  storageBucket: "test-29402.appspot.com",
  messagingSenderId: "934520066683",
  appId: "1:934520066683:web:2122f35e931df397c908de",
  measurementId: "G-GMBX9WMFYP",
};

const googleProvider = new GoogleAuthProvider();

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export {
  firestore,
  auth,
  app,
  storage,
  provider,
  signInWithRedirect,
  getRedirectResult,
};

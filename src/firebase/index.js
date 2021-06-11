import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxOB-I8Kk4r6veRBP2-B3YjCFKmVGR76w",
  authDomain: "dnd-combat-map-9305e.firebaseapp.com",
  projectId: "dnd-combat-map-9305e",
  storageBucket: "dnd-combat-map-9305e.appspot.com",
  messagingSenderId: "192551276731",
  appId: "1:192551276731:web:bc6876be34c244e1aad99e",
  measurementId: "G-3DHDS62CN6",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const db = firebase.firestore();

export { storage, db, firebase as default };

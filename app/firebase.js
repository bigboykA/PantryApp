// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3zcVF-VCwZEgf-JeHbNonJuNKnZKbF70",
  authDomain: "pantryapp-262f7.firebaseapp.com",
  projectId: "pantryapp-262f7",
  storageBucket: "pantryapp-262f7.appspot.com",
  messagingSenderId: "11571686681",
  appId: "1:11571686681:web:4af3a3f10315f54866a988"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };

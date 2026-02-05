import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA61wpov9IQ9rLGPYIQKadudH_QUWiKX1I",
  authDomain: "sestran-rg.firebaseapp.com",
  projectId: "sestran-rg",
  storageBucket: "sestran-rg.firebasestorage.app",
  messagingSenderId: "163139467683",
  appId: "1:163139467683:web:ca6100189bc23e3d4e4216",
  measurementId: "G-C7FSJ298WE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

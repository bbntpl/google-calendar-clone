import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDj6W-113mlv3bycEjK9fH4lvUI-Nn4VJM',
  authDomain: 'calendar-clone-a2d2f.firebaseapp.com',
  projectId: 'calendar-clone-a2d2f',
  storageBucket: 'calendar-clone-a2d2f.appspot.com',
  messagingSenderId: '305164708116',
  appId: '1:305164708116:web:29310c057daeca8530fa01',
  measurementId: 'G-RRC3X53S0M',
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };

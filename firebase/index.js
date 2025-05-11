// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { collection, getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCFFIypBzAiVwfCGhe3IwVayWBs4oEuMMo',
  authDomain: 'flowers-b6299.firebaseapp.com',
  projectId: 'flowers-b6299',
  storageBucket: 'flowers-b6299.firebasestorage.app',
  messagingSenderId: '992459023185',
  appId: '1:992459023185:web:9eefa419acd686628f2970',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)

const productsRef = collection(db, 'products')

export { app, db, auth, productsRef }

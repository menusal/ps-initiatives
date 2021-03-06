// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCdPeHDdESXJ8uij90sneX6tY0gjs3qaYA',
  authDomain: 'ps-initiatives.firebaseapp.com',
  projectId: 'ps-initiatives',
  storageBucket: 'ps-initiatives.appspot.com',
  messagingSenderId: '654031423544',
  appId: '1:654031423544:web:7c4b32653c28e505033ecd',
}

export const SUCCESS = 'success'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)


const googleProvider = new GoogleAuthProvider()

/**
 * It signs in with Google, then adds the user to the database if they don't
 * already exist
 * @returns A promise that resolves to a string.
 */
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider)
    const user = res.user
    const q = query(collection(db, 'users'), where('uid', '==', user.uid))
    const docs = await getDocs(q)

    if (docs.docs.length === 0) {

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      }).then(() => {
        return SUCCESS
      })
    }
    return SUCCESS
  } catch (err) {
    console.error(err)
    return err.code
  }
}

const logout = () => {
  signOut(auth)
}

export {
  auth,
  db,
  signInWithGoogle,
  signInWithEmailAndPassword,
  logout,
}

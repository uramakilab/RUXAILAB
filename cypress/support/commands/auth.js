import { initializeApp } from 'firebase/app'
import {
  getAuth,
  connectAuthEmulator,
  deleteUser as deleteUserAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'

const authUser = require('../../fixtures/authUser.json')

const firebaseConfig = {
  apiKey: Cypress.env('VUE_APP_FIREBASE_API_KEY'),
  authDomain: Cypress.env('VUE_APP_FIREBASE_AUTH_DOMAIN'),
  storageBucket: Cypress.env('VUE_APP_FIREBASE_STORAGE_BUCKET'),
  projectId: Cypress.env('VUE_APP_FIREBASE_PROJECT_ID'),
  appId: Cypress.env('VUE_APP_FIREBASE_APP_ID'),
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
if (window.Cypress) {
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFirestoreEmulator(db, 'localhost', 8081)
}

/**
 * Delete the currently logged-in user
 * @returns {Promise<void>}
 */
export const deleteUser = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    const { collection } = authUser
    await deleteDocById(collection, user.uid)
    await deleteUserAuth(user)
    console.info(`Deleted user with ID "${user.uid}"`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Log in with email and password
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password).then(() => {
      console.info(`Logged in as "${email}"`)
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * Log out the currently logged-in user
 * @returns {Promise<void>}
 */
export const logOut = async () => {
  try {
    await signOut(auth).then(() => {
      console.info('Logged out')
    })
  } catch (err) {
    console.error(err)
  }
}

/**
 * Sign up with email and password
 * @param email
 * @param password
 * @returns {Promise<void>}
 */
export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    console.info(`Signed up as "${email}" with user ID "${user.uid}"`)
    const { data, collection } = authUser
    await createDoc(collection, user.uid, data)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Create a document in a collection
 * @param col
 * @param docId
 * @param data
 * @returns {Promise<void>}
 */
export const createDoc = async (col, docId, data) => {
  try {
    const ref = doc(db, `${col}/${docId}`)
    await setDoc(ref, data)
  } catch (err) {
    console.error(err)
  }
}

/**
 * Delete a document by ID
 * @param col
 * @param docId
 * @returns {Promise<void>}
 */
export const deleteDocById = async (col, docId) => {
  try {
    const ref = doc(db, `${col}/${docId}`)
    await deleteDoc(ref)
  } catch (err) {
    console.error(err)
  }
}



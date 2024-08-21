import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const analytics = getAnalytics(firebaseApp)
const fbFunctions = getFunctions(firebaseApp)
const storage = getStorage(firebaseApp, `gs://${firebaseConfig.storageBucket}`)

// Emulators if running locally

// if (process.env.NODE_ENV === 'development') {
//   connectFirestoreEmulator(db, 'localhost', 8081)
//   connectAuthEmulator(auth, 'http://localhost:9099')
//   connectFunctionsEmulator(fbFunctions, 'localhost', 5001)
//   connectStorageEmulator(storage, '127.0.0.1', 9199)
// }

export { auth, db, analytics, fbFunctions, storage }

import '@testing-library/jest-dom'

jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
  }
})

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    connectAuthEmulator: jest.fn(),
  }
})

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(),
    connectFirestoreEmulator: jest.fn(),
  }
})

jest.mock('firebase/storage', () => {
  return {
    getStorage: jest.fn(),
    connectStorageEmulator: jest.fn(),
  }
})

jest.mock('firebase/functions', () => {
  return {
    getFunctions: jest.fn(),
    connectFunctionsEmulator: jest.fn(),
  }
})

jest.mock('firebase/analytics', () => {
  return {
    getAnalytics: jest.fn(),
  }
})

import { initializeApp } from '@firebase/app'
import { getAuth, onAuthStateChanged, User } from '@firebase/auth'
import { getStorage } from '@firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)
export const firebaseStorage = getStorage(app)
export async function getFirebaseUserWithToken(): Promise<{ user: User; token: string }> {
  return new Promise((resolve, reject) => {
    if (firebaseAuth.currentUser) {
      firebaseAuth.currentUser
        .getIdToken(true)
        .then((token) => {
          resolve({ user: firebaseAuth.currentUser!, token })
        })
        .catch(reject)
      return
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      unsubscribe()
      if (!user) {
        reject(new Error())
        return
      }
      const token = await user.getIdToken(true)
      resolve({ user, token })
    })
  })
}

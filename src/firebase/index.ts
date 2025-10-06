
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// For debugging Firebase configuration issues, consider the following:
// 1. Verify Environment Variables: Ensure that your .env.local file is correctly set up and that the variable names match what's used here.
//    - In Next.js, client-side variables must be prefixed with NEXT_PUBLIC_.
// 2. Check Firebase Console: Double-check the values in your Firebase project settings (Project settings > General > Your apps > Firebase SDK snippet) against your .env.local file.
// 3. 'auth/invalid-api-key': This is the most common error. It means the `apiKey` is wrong.
// 4. Correct Project ID: Make sure `authDomain` and `storageBucket` use the correct `projectId`. The format is typically `your-project-id.firebaseapp.com` and `your-project-id.appspot.com`.

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function initializeFirebase() {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);

  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        getAnalytics(app);
      }
    });
  }
  
  return { app, db, auth };
}

export { initializeFirebase };

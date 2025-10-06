
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

function initializeFirebase(firebaseConfig: FirebaseOptions) {
  // Guard against client-side execution with missing config
  if (typeof window === 'undefined' || !firebaseConfig?.apiKey) {
    return null;
  }
  
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Initialize Analytics only on the client-side
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
  
  return { app, db, auth };
}

export { initializeFirebase };

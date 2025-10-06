
import * as admin from 'firebase-admin';

// This is the only place where we use the service account key.
// It is safe to use here because this code runs on the server.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

let app: admin.app.App;

export async function initializeAdminApp() {
  if (!app) {
    if (!serviceAccount) {
      throw new Error(
        'Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable.'
      );
    }
    try {
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (e: any) {
      if (e.code !== 'app/duplicate-app') {
        throw e;
      }
      app = admin.app(); // Get the default app if it already exists
    }
  }

  const auth = admin.auth(app);
  const db = admin.firestore(app);

  return { app, auth, db };
}

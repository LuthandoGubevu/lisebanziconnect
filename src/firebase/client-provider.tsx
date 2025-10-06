
'use client';

import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { AuthLayout } from '@/components/layout/AuthLayout';

// Initialize Firebase on the client
const { app, auth, db } = initializeFirebase();

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      <AuthLayout>{children}</AuthLayout>
    </FirebaseProvider>
  );
}

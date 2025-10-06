
'use client';

import React from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { AuthLayout } from '@/components/layout/AuthLayout';

// Initialize Firebase within the provider component to ensure it only runs on the client.
const firebaseInstances = initializeFirebase();

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { app, auth, db } = firebaseInstances;
  
  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      <AuthLayout>{children}</AuthLayout>
    </FirebaseProvider>
  );
}

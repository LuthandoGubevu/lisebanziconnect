
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { AuthLayout } from '@/components/layout/AuthLayout';

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useMemo to ensure Firebase is initialized only once per render cycle on the client.
  const firebaseInstances = useMemo(() => initializeFirebase(), []);

  if (!firebaseInstances) {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }
  
  const { app, auth, db } = firebaseInstances;
  
  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      <AuthLayout>{children}</AuthLayout>
    </FirebaseProvider>
  );
}

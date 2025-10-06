
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Skeleton } from '@/components/ui/skeleton';
import type { FirebaseOptions } from 'firebase/app';


export function FirebaseClientProvider({
  children,
  config
}: {
  children: React.ReactNode;
  config: FirebaseOptions;
}) {
  // useMemo ensures this only runs once on the client.
  const firebaseInstances = useMemo(() => initializeFirebase(config), [config]);

  if (!firebaseInstances) {
    return (
       <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>
    );
  }
  
  const { app, auth, db } = firebaseInstances;
  
  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      <AuthLayout>{children}</AuthLayout>
    </FirebaseProvider>
  );
}

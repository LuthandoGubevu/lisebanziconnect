
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import type { FirebaseOptions } from 'firebase/app';
import { Skeleton } from '@/components/ui/skeleton';

export function FirebaseClientProvider({
  children,
  config
}: {
  children: React.ReactNode;
  config: FirebaseOptions;
}) {
  // useMemo ensures this only runs once on the client.
  const firebaseInstances = useMemo(() => initializeFirebase(config), [config]);

  // During server-side rendering or if initialization fails,
  // we cannot provide the context. We return a loading skeleton or null
  // to prevent children that depend on the context from crashing the app.
  if (!firebaseInstances) {
    return (
        <div className="flex items-center justify-center h-screen">
          <Skeleton className="h-20 w-20 rounded-full bg-muted" />
        </div>
    );
  }
  
  const { app, auth, db } = firebaseInstances;
  
  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      {children}
    </FirebaseProvider>
  );
}

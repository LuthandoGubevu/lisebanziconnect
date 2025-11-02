
'use client';

import React, { useMemo } from 'react';
import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
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
    // Return children directly if Firebase isn't initialized (e.g., on server).
    return <>{children}</>;
  }
  
  const { app, auth, db } = firebaseInstances;
  
  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      {children}
    </FirebaseProvider>
  );
}

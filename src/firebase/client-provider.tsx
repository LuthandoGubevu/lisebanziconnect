
'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const firebaseInstances = useMemo(() => {
    if (typeof window !== 'undefined') {
      return initializeFirebase(config);
    }
    return null;
  }, [config]);

  if (!isMounted || !firebaseInstances) {
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


'use client';

import { initializeFirebase } from './index';
import { FirebaseProvider } from './provider';
import { useAuth } from '@/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';

// Initialize Firebase on the client
const { app, auth, db } = initializeFirebase();

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === '/';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
      );
    }

    if (user && !isAuthPage) {
      return <AppLayout>{children}</AppLayout>;
    }
    
    return children;
  };

  return (
    <FirebaseProvider app={app} auth={auth} db={db}>
      {renderContent()}
    </FirebaseProvider>
  );
}

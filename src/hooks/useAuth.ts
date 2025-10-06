
"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useFirebase } from '@/firebase/provider';
import { useRouter, usePathname } from 'next/navigation';

export function useAuth() {
  const { auth } = useFirebase();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      const isAuthPage = pathname === '/';
      
      if (user && isAuthPage) {
        router.push('/dashboard');
      }
      
      if (!user && !isAuthPage && pathname !== '/') {
        // Redirect to login if not authenticated and not on a public page
        const publicPages = ['/your-story', '/upcoming-events']; // Add any other public pages
        if(!publicPages.some(page => pathname.startsWith(page)) && !pathname.startsWith('/auth')) {
             router.push('/');
        }
      }
    });

    return () => unsubscribe();
  }, [auth, router, pathname]);

  // Adjust redirect for dashboard access
  useEffect(() => {
    if (!loading && !user && pathname.startsWith('/dashboard')) {
        router.push('/');
    }
  }, [user, loading, pathname, router]);

  return { user, loading };
}

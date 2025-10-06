
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
      
      if (!user && !isAuthPage) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, router, pathname]);

  return { user, loading };
}

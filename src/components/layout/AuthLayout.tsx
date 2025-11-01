
"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";


export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPage = pathname === '/' || pathname === '/auth';

  useEffect(() => {
    if (loading || isPublicPage) {
      return; // Do nothing while loading or on public pages
    }
    
    if (!user) {
      // If user is not logged in and not on a public page, redirect to auth
      router.push("/auth");
    }

  }, [user, loading, router, isPublicPage, pathname]);

  // For protected pages, show a loading skeleton while auth is in progress
  if (!isPublicPage && (loading || !user)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-20 w-20 rounded-full bg-muted" />
      </div>
    );
  }
  
  // Render the children (the page)
  return <>{children}</>;
}

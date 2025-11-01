
"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/auth";
  const isLandingPage = pathname === "/";


  useEffect(() => {
    // Don't run auth logic on the landing page
    if (isLandingPage) return;

    if (!loading) {
      if (user && isAuthPage) {
        // If user is logged in and tries to access auth page, redirect to dashboard
        router.push("/dashboard");
      }
      if (!user && !isAuthPage) {
        // If user is not logged in and not on auth page, redirect to auth page
        router.push("/auth");
      }
    }
  }, [user, loading, isAuthPage, isLandingPage, pathname, router]);


  // For public pages, or while auth is loading, just render the content.
  // The useEffect will handle redirects once auth status is known.
  if (isLandingPage || isAuthPage || loading) {
    return <>{children}</>;
  }

  // If user is authenticated and not on a public page, render the authenticated layout.
  if (user && !isAuthPage) {
     return <>{children}</>;
  }
  
  // If no user and not on auth page (and not loading), we are likely redirecting,
  // so rendering nothing avoids a flash of unstyled content.
  return null;
}

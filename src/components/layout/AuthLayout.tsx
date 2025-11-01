
"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/auth";
  const isLandingPage = pathname === "/";

  useEffect(() => {
    if (loading || isLandingPage) {
      return; // Do nothing while loading or on the landing page
    }

    if (user && isAuthPage) {
      // If user is logged in and tries to access auth page, redirect to dashboard
      router.push("/dashboard");
    }
    
    if (!user && !isAuthPage) {
      // If user is not logged in and not on auth or landing page, redirect to auth
      router.push("/auth");
    }
  }, [user, loading, isAuthPage, isLandingPage, pathname, router]);

  // Show a loading skeleton for protected pages while authentication is in progress
  if (loading && !isLandingPage && !isAuthPage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-20 w-20 rounded-full bg-muted" />
      </div>
    );
  }

  // If the user is authenticated, or if it's a public page, show the content
  if (user || isLandingPage || isAuthPage) {
    return <>{children}</>;
  }

  // If not authenticated and on a protected page, render nothing while redirecting
  return null;
}

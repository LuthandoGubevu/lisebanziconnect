
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
    if (loading) {
      return; // Do nothing while loading
    }
    
    // If on a public page, do nothing.
    if (isLandingPage || isAuthPage) {
        if(user && isAuthPage) {
            router.push("/dashboard");
        }
        return;
    }

    if (!user) {
      // If user is not logged in and not on a public page, redirect to auth
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
  if ((user && !isAuthPage) || isLandingPage || isAuthPage) {
    return <>{children}</>;
  }

  // If not authenticated and on a protected page, render nothing while redirecting
  return null;
}

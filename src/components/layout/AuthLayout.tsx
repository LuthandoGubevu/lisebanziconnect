
"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
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
        router.push("/dashboard");
      }
      if (!user && !isAuthPage) {
        router.push("/auth");
      }
    }
  }, [user, loading, isAuthPage, isLandingPage, pathname, router]);


  // If we are on the landing page, just render the children
  if (isLandingPage) {
    return <>{children}</>;
  }

  // Show a loading skeleton while checking auth status,
  // or if we are about to redirect.
  if (loading || (!user && !isAuthPage) || (user && isAuthPage)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>
    );
  }
  
  return <>{children}</>;
}


"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/auth";

  // Conditionally call hooks only for protected pages
  if (isPublicPage) {
    return <>{children}</>;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
}


function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }
    
    if (!user) {
      // If user is not logged in and not on a public page, redirect to auth
      router.push("/auth");
    }

  }, [user, loading, router]);

  // Show a loading skeleton for protected pages while authentication is in progress
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-20 w-20 rounded-full bg-muted" />
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  // If not authenticated and on a protected page, render nothing while redirecting
  return null;
}

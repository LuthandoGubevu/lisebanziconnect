
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";


export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }
    
    if (!user) {
      // If user is not logged in, redirect to auth
      router.push("/auth");
    }

  }, [user, loading, router]);

  // Show a loading skeleton for protected pages while authentication is in progress
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-20 w-20 rounded-full bg-muted" />
      </div>
    );
  }
  
  // If authenticated, render the children (the protected page)
  return <>{children}</>;
}


"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/";

  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.push("/");
    }
  }, [user, loading, isAuthPage, router]);


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
  
  if (user && isAuthPage) {
    return null; // or a redirect component
  }

  if (!user && !isAuthPage) {
    return null; // or a redirect component
  }

  return <>{children}</>;
}


"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect } from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/";

  useEffect(() => {
    if (!loading) {
      if (user && isAuthPage) {
        router.push("/dashboard");
      }
      if (!user && !isAuthPage) {
        router.push("/");
      }
    }
  }, [user, loading, isAuthPage, pathname, router]);

  if (loading || (!user && !isAuthPage) || (user && isAuthPage)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>
    );
  }
  
  return <>{children}</>;
}


"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isAuthPage = pathname === "/";

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

  return <>{children}</>;
}

"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { ChatRoom } from "./_components/ChatRoom";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SupportCirclesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.28))]">
      <PageHeader
        title="Support Circle"
        description="A public chatroom for peer-to-peer support. Share and connect with the community."
      />
      <div className="flex-1 mt-6 min-h-0">
         <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <ChatRoom />
          </Suspense>
      </div>
    </div>
  );
}

"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { EventList } from "./_components/EventList";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function UpcomingEventsPage() {
  
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Upcoming Events"
        description="Join our community events to learn, connect, and grow together."
      />

      <Alert className="shadow-sm bg-white/80 backdrop-blur-sm border-gray-200 text-gray-800">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="font-bold text-blue-600">Admin Notice</AlertTitle>
        <AlertDescription>
         Currently, there is no UI to add new events. You can programmatically add events to the 'events' collection in Firestore.
        </AlertDescription>
      </Alert>
      
      <Suspense fallback={<Skeleton className="h-[400px] w-full bg-gray-200/80" />}>
        <EventList />
      </Suspense>
    </div>
  );
}

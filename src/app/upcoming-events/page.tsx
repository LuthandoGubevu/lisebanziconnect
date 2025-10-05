import { PageHeader } from "@/components/ui/PageHeader";
import { EventList } from "./_components/EventList";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { addEvent } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function UpcomingEventsPage() {
  
  // This is a placeholder for an admin feature.
  // In a real app, this would be behind authentication.
  const SeedEventsButton = () => (
    <form action={addEvent}>
      <button type="submit" className="hidden">Seed Events</button>
    </form>
  )

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Upcoming Events"
        description="Join our community events to learn, connect, and grow together."
      />

      <Alert className="shadow-neumorphic-sm bg-white/20 backdrop-blur-sm border-white/20 text-foreground">
        <Info className="h-4 w-4 text-accent" />
        <AlertTitle className="font-bold text-primary">Admin Notice</AlertTitle>
        <AlertDescription>
         Currently, there is no UI to add new events. You can programmatically add events to the 'events' collection in Firestore.
        </AlertDescription>
      </Alert>
      
      <SeedEventsButton />

      <Suspense fallback={<Skeleton className="h-[400px] w-full bg-white/30" />}>
        <EventList />
      </Suspense>
    </div>
  );
}

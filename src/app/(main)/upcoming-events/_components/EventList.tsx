
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import type { Event } from "@/lib/types";
import { useFirebase } from "@/firebase/provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addEvent } from "../actions";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function formatTimestamp(timestamp: Timestamp | null) {
  if (!timestamp) return "Date TBD";
  let date: Date;
  if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (timestamp && 'seconds' in timestamp) {
    date = (timestamp as Timestamp).toDate();
  } else if (timestamp && '_seconds' in timestamp) {
    date = new Date((timestamp as any)._seconds * 1000);
  } else {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const { toast } = useToast();
  const { db } = useFirebase();

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const eventsData: Event[] = [];
        querySnapshot.forEach(doc => {
          eventsData.push({ id: doc.id, ...doc.data() } as Event)
        });

        if (eventsData.length === 0) {
            // If no events, seed one.
            addEvent().then(() => {
                // The listener will pick up the new event.
            });
        } else {
            setEvents(eventsData);
        }
        setLoading(false);
        setPermissionError(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: "events",
          operation: "list",
        });
        errorEmitter.emit("permission-error", permissionError);
        setLoading(false);
        setPermissionError(true);
      }
    );
    return () => unsubscribe();
  }, [db, toast]);


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg bg-gray-200/80" />
        ))}
      </div>
    );
  }

  if (permissionError) {
    return (
       <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Content Unavailable</AlertTitle>
        <AlertDescription>
          We're currently experiencing technical difficulties and cannot load events. Our team has been notified.
        </AlertDescription>
      </Alert>
    )
  }

  if (events.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
        <h3 className="text-xl font-semibold text-gray-500">
          No Upcoming Events
        </h3>
        <p className="text-gray-500">
          Check back soon for new events and workshops!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="shadow-lg flex flex-col bg-white/80 backdrop-blur-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-blue-600">{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Calendar className="size-4 text-gray-500" />
              <span>{formatTimestamp(event.date)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-gray-700">{event.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

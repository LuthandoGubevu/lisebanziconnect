
"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";
import type { Event } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

function formatTimestamp(timestamp: Timestamp | null) {
  if (!timestamp) return "Date TBD";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = useFirebase();
  const { toast } = useToast();


  useEffect(() => {
    // Seed with one event if collection is empty
    addInitialEvent();

    const q = query(collection(db, "events"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const eventsData: Event[] = [];
        querySnapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() } as Event);
        });
        setEvents(eventsData);
        setLoading(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: "events",
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You don't have permission to view events."
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, toast]);

  const addInitialEvent = async () => {
    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        const { addEvent } = require('../actions');
        addEvent();
      }
      unsubscribe();
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg bg-gray-200/80" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
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

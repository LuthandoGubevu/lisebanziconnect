"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
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
        console.error("Error fetching events:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addInitialEvent = async () => {
    const q = query(collection(db, "events"));
    onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        const { addEvent } = require('../actions');
        addEvent();
      }
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg bg-white/30" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-white/50">
        <h3 className="text-xl font-semibold text-muted-foreground">
          No Upcoming Events
        </h3>
        <p className="text-muted-foreground">
          Check back soon for new events and workshops!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card key={event.id} className="shadow-neumorphic flex flex-col bg-white/30 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span>{formatTimestamp(event.date)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-foreground/80">{event.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

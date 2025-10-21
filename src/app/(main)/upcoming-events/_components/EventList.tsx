
"use client";

import { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
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
import { getEvents, addEvent } from "../actions";

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
  const { toast } = useToast();

  useEffect(() => {
    async function fetchEvents() {
        const result = await getEvents();
        if(result.success && result.data) {
            if (result.data.length === 0) {
                // If no events, seed one.
                await addEvent();
                const newResult = await getEvents();
                if (newResult.success && newResult.data) {
                    setEvents(newResult.data);
                }
            } else {
                setEvents(result.data);
            }
        } else {
             toast({
                variant: "destructive",
                title: "Failed to load events",
                description: result.error || "Could not load events."
            });
        }
        setLoading(false);
    }
    fetchEvents();
  }, [toast]);


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

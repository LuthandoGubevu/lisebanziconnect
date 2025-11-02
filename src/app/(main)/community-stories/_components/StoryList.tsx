"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import type { Story } from "@/lib/types";
import { useFirebase } from "@/firebase/provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


function formatTimestamp(timestamp: Timestamp | null | Date) {
  if (!timestamp) return "Just now";
  let date: Date;
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (timestamp && 'seconds' in timestamp) {
    date = (timestamp as Timestamp).toDate();
  } else if (timestamp && '_seconds' in timestamp) {
    date = new Date((timestamp as any)._seconds * 1000);
  } else {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const { toast } = useToast();
  const { db } = useFirebase();
  const [expandedStories, setExpandedStories] = useState<string[]>([]);

  const toggleStory = (storyId: string) => {
    setExpandedStories(prev => 
      prev.includes(storyId) ? prev.filter(id => id !== storyId) : [...prev, storyId]
    );
  };


  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const storiesData: Story[] = [];
        querySnapshot.forEach((doc) => {
          storiesData.push({ id: doc.id, ...doc.data() } as Story);
        });
        setStories(storiesData);
        setLoading(false);
        setPermissionError(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: "stories",
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
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
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
          We're currently experiencing technical difficulties and cannot load stories. Our team has been notified. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  if (stories.length === 0) {
      return (
          <div className="text-center text-gray-500 italic py-10">
              No stories yet. Be the first to share your journey.
          </div>
      );
  }


  return (
    <div className="space-y-6">
      {stories.map((story) => {
        const isExpanded = expandedStories.includes(story.id);
        return (
          <Card key={story.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl bg-white/80 backdrop-blur-lg border-gray-200">
            <CardHeader className="p-6">
              <CardTitle className="text-blue-600 text-xl">{story.title}</CardTitle>
              <CardDescription className="text-xs text-gray-500 pt-1">
                By {story.author} on {formatTimestamp(story.createdAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className={cn("text-base text-gray-700 break-words", !isExpanded && "line-clamp-3")}>
                {story.story}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="p-0 h-auto" onClick={() => toggleStory(story.id)}>
                {isExpanded ? 'View Less' : 'View All'}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  );
}

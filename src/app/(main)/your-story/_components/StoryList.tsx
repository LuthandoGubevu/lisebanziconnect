
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

const mockStory: Story = {
  id: "mock-story",
  title: "The Journey to Healing",
  author: "Jane Doe",
  story: "This is a mock story to demonstrate how community stories will be displayed. It is a tale of resilience, hope, and the power of community. Finding this space has been a turning point in my journey. The support I've received is immeasurable, and for the first time in a long time, I don't feel alone. Sharing my story is a big step, but I hope it can help someone else feel understood.",
  createdAt: new Date() as any, // Using 'as any' to satisfy Timestamp type for this mock
};

export function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const { toast } = useToast();
  const { db } = useFirebase();

  useEffect(() => {
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

  const storiesToDisplay = stories.length === 0 ? [mockStory] : stories;

  return (
    <div className="space-y-6">
      {storiesToDisplay.map((story) => (
        <Card key={story.id} className="shadow-lg bg-white/80 backdrop-blur-lg border-gray-200">
          <CardHeader>
            <CardTitle className="text-blue-600">{story.title}</CardTitle>
            <CardDescription>
              By {story.author} on {formatTimestamp(story.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-4 whitespace-pre-wrap text-gray-700">
              {story.story}
            </p>
          </CardContent>
          <CardFooter>
            {/* Can add a "Read More" button later if stories are long */}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

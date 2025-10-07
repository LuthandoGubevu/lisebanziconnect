
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
import type { Story } from "@/lib/types";
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

function formatTimestamp(timestamp: Timestamp | null) {
  if (!timestamp) return "Just now";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function StoryList() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { db } = useFirebase();
  const { toast } = useToast();


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
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: "stories",
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You don't have permission to view stories."
        });
        setLoading(false);
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

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
        <h3 className="text-xl font-semibold text-gray-500">
          No Stories Yet
        </h3>
        <p className="text-gray-500">
          Be the first one to share an inspirational story!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stories.map((story) => (
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

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
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg bg-card/80" />
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-white/50">
        <h3 className="text-xl font-semibold text-muted-foreground">
          No Stories Yet
        </h3>
        <p className="text-muted-foreground">
          Be the first one to share an inspirational story!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stories.map((story) => (
        <Card key={story.id} className="shadow-neumorphic bg-card backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">{story.title}</CardTitle>
            <CardDescription>
              By {story.author} on {formatTimestamp(story.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-4 whitespace-pre-wrap text-foreground/80">
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

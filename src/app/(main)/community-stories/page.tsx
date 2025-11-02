export const dynamic = "force-dynamic";

"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { StoryList } from "../your-story/_components/StoryList";

// This page will display all publicly shared stories from the community.
// It reuses the StoryList component from the old 'your-story' page.

export default function CommunityStoriesPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Community Stories"
        description="Read inspirational stories of resilience and hope from others in the community."
      />
       <div className="w-full max-w-3xl mx-auto px-4">
        <StoryList />
      </div>
    </div>
  );
}


import { PageHeader } from "@/components/ui/PageHeader";
import { StoryForm } from "./_components/StoryForm";
import { StoryList } from "./_components/StoryList";

export default function YourStoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Your Story"
        description="Share your journey, inspire others, and find strength in our collective stories."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <StoryForm />
        </div>
        <div className="lg:col-span-2">
          <StoryList />
        </div>
      </div>
    </div>
  );
}

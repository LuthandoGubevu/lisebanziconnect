
import { PageHeader } from "@/components/ui/PageHeader";

// This will be the page where a user can write/edit their personal story
// and control its visibility. It differs from the public "Community Stories" page.

export default function MyStoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="My Story"
        description="Your private space to document your journey. You control who sees it."
      />
       <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
        <h3 className="text-xl font-semibold text-gray-500">
          Story Editor Coming Soon
        </h3>
        <p className="text-gray-500">
          This is where you'll be able to write your story and choose whether to keep it private, share it anonymously, or share it openly.
        </p>
      </div>
    </div>
  );
}

import { PageHeader } from "@/components/ui/PageHeader";
import { QuestionForm } from "./_components/QuestionForm";
import { QuestionList } from "./_components/QuestionList";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AskAMentorPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Ask a Mentor"
        description="Have a question? Ask our experienced mentors. All questions can be submitted anonymously."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <QuestionForm />
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <QuestionList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

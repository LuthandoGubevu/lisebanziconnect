
import { PageHeader } from "@/components/ui/PageHeader";

export default function PolicyFeedbackPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Policy Feedback"
        description="Use your voice to drive change. Anonymously provide feedback on systemic issues."
      />
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
        <h3 className="text-xl font-semibold text-gray-500">
          Suggestion Box & Voting Coming Soon
        </h3>
        <p className="text-gray-500">
          Submit your ideas for reform and vote on suggestions from the community.
        </p>
      </div>
    </div>
  );
}

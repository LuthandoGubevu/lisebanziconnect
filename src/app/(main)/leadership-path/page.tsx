export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/ui/PageHeader";

export default function LeadershipPathPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Leadership Path"
        description="Grow into a community leader. Complete training to become a peer mentor and moderator."
      />
       <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
        <h3 className="text-xl font-semibold text-gray-500">
          Training & Gamification Coming Soon
        </h3>
        <p className="text-gray-500">
          Earn badges and level up by completing mentorship training modules.
        </p>
      </div>
    </div>
  );
}

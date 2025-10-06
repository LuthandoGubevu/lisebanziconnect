
import { PageHeader } from "@/components/ui/PageHeader";

export default function InsightsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Insights Dashboard"
        description="Anonymous, aggregated data to help identify trends and inform advocacy efforts."
      />
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
        <h3 className="text-xl font-semibold text-gray-500">
          Charts & Graphs Coming Soon
        </h3>
        <p className="text-gray-500">
          This dashboard will visualize anonymized data to highlight key insights and support policy change.
        </p>
      </div>
    </div>
  );
}

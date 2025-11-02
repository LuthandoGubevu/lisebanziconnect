"use client";

import { PageHeader } from "@/components/ui/PageHeader";

export default function EducationHubPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Education Hub"
        description="Empower yourself with knowledge. Learn about your rights, digital safety, and paths to healing."
      />
      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
        <h3 className="text-xl font-semibold text-gray-500">
          Interactive Modules Coming Soon
        </h3>
        <p className="text-gray-500">
          This section will feature articles, videos, and quizzes on topics like consent, legal rights, and healthy relationships.
        </p>
      </div>
    </div>
  );
}

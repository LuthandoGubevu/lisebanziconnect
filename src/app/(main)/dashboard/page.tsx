
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your personalized space."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>My Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Content for quick stats will go here.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                <p>A feed of recent activity will go here.</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Suggestions for what to do next will go here.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}


"use client";

import { useAuth } from "@/hooks/useAuth";
import { useFirebase } from "@/firebase/provider";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DashboardPage() {
  const { user } = useAuth();
  const { auth } = useFirebase();

  const handleSignOut = async () => {
    await auth.signOut();
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Welcome, ${user?.displayName || 'User'}!`}
        description="This is your dashboard. More features coming soon."
      />
      <div className="flex flex-col items-start gap-4">
        <p>You are logged in with the email: {user?.email}</p>
        <Button onClick={handleSignOut} variant="destructive">
          Sign Out
        </Button>
      </div>
    </div>
  );
}

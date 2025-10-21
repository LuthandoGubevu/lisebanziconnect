
"use client";

import { AlertCircle, Bot } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

export function QuestionList() {
  const { user } = useAuth();

  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
            <h3 className="text-xl font-semibold text-gray-500">Please sign in</h3>
            <p className="text-gray-500">Sign in to see your submitted questions.</p>
        </div>
    )
  }

  return (
    <div className="space-y-4">
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Feature Currently Unavailable</AlertTitle>
            <AlertDescription>
                We're experiencing technical difficulties and cannot load questions at this time. 
                Our team has been notified and is working on a fix. You can still submit new questions using the form. 
                Thank you for your patience.
            </AlertDescription>
        </Alert>

        <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg p-4 animate-pulse">
            <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
             <div className="border-t pt-4 mt-4 border-gray-200">
                <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full h-fit"><Bot className="text-blue-600"/></div>
                    <div>
                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6 mt-1"></div>
                    </div>
                </div>
              </div>
        </div>
    </div>
  );
}


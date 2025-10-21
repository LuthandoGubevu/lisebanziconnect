
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy, where, Timestamp } from "firebase/firestore";
import type { Question } from "@/lib/types";
import { useFirebase } from "@/firebase/provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";

function formatTimestamp(timestamp: Timestamp | string | null) {
  if (!timestamp) return "Just now";
  let date: Date;
  if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else if (timestamp && 'seconds' in timestamp) {
    // It's a Firestore Timestamp
    date = (timestamp as Timestamp).toDate();
  } else if (timestamp && '_seconds' in timestamp) {
    // It's a Firebase Admin Timestamp
    date = new Date((timestamp as any)._seconds * 1000);
  } else {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}


export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const { toast } = useToast();
  const { db } = useFirebase();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };

    const q = query(
        collection(db, "questions"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const questionsData: Question[] = [];
        querySnapshot.forEach((doc) => {
          questionsData.push({ id: doc.id, ...doc.data() } as Question);
        });
        setQuestions(questionsData);
        setLoading(false);
        setPermissionError(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: "questions",
          operation: "list",
        });
        errorEmitter.emit("permission-error", permissionError);
        setLoading(false);
        setPermissionError(true);
      }
    );

    return () => unsubscribe();
  }, [db, toast, user]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg bg-gray-200/80" />
        ))}
      </div>
    );
  }
  
  if (!user) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
            <h3 className="text-xl font-semibold text-gray-500">Please sign in</h3>
            <p className="text-gray-500">Sign in to see your submitted questions.</p>
        </div>
    )
  }

  if (permissionError) {
    return (
       <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Content Unavailable</AlertTitle>
        <AlertDescription>
          We're currently experiencing technical difficulties and cannot load your questions. Our team has been notified. Please try again later.
        </AlertDescription>
      </Alert>
    )
  }

  if (questions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-gray-300">
            <h3 className="text-xl font-semibold text-gray-500">No questions yet</h3>
            <p className="text-gray-500">Ask a question and it will appear here.</p>
        </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {questions.map((q) => (
        <AccordionItem key={q.id} value={q.id} className="border-none">
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-lg shadow-lg">
            <AccordionTrigger className="p-4 text-left hover:no-underline">
              <div className="flex-1">
                <p className="font-semibold text-base text-gray-800">{q.question}</p>
                <p className="text-sm text-gray-500 mt-1">Asked by {q.name} on {formatTimestamp(q.createdAt)}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="border-t pt-4 border-gray-200">
                {q.answer ? (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full h-fit"><Bot className="text-blue-600"/></div>
                    <div>
                      <p className="font-semibold">Mentor's Response</p>
                      <p className="text-gray-700 whitespace-pre-wrap">{q.answer}</p>
                    </div>
                  </div>
                ) : (
                  <p className="italic text-gray-500">A mentor will answer this question soon.</p>
                )}
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

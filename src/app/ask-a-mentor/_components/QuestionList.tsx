"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Question } from "@/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, User } from "lucide-react";

function formatTimestamp(timestamp: Timestamp | null) {
  if (!timestamp) return "Just now";
  return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

export function QuestionList() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "questions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const questionsData: Question[] = [];
      querySnapshot.forEach((doc) => {
        questionsData.push({ id: doc.id, ...doc.data() } as Question);
      });
      setQuestions(questionsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching questions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg bg-white/30" />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-64 border-white/50">
            <h3 className="text-xl font-semibold text-muted-foreground">No questions yet</h3>
            <p className="text-muted-foreground">Be the first one to ask a question!</p>
        </div>
    )
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-4">
      {questions.map((q) => (
        <AccordionItem key={q.id} value={q.id} className="border-none">
          <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-lg shadow-neumorphic">
            <AccordionTrigger className="p-4 text-left hover:no-underline">
              <div className="flex-1">
                <p className="font-semibold text-base text-primary-dark">{q.question}</p>
                <p className="text-sm text-muted-foreground mt-1">Asked by {q.name} on {formatTimestamp(q.createdAt)}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="border-t pt-4 border-white/20">
                {q.answer ? (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full h-fit"><Bot className="text-primary"/></div>
                    <div>
                      <p className="font-semibold">Mentor's Response</p>
                      <p className="text-foreground/80 whitespace-pre-wrap">{q.answer}</p>
                    </div>
                  </div>
                ) : (
                  <p className="italic text-muted-foreground">A mentor will answer this question soon.</p>
                )}
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

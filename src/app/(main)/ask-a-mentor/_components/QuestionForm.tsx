
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { askQuestion } from "../actions";

const questionSchema = z.object({
  name: z.string().optional(),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters long.")
    .max(1000, "Question must be less than 1000 characters."),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

export function QuestionForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      name: "",
      question: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user?.displayName) {
      form.setValue("name", user.displayName);
    }
  }, [user, form]);


  async function onSubmit(values: QuestionFormValues) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to ask a question.",
      });
      return;
    }
    setIsSubmitting(true);

    const result = await askQuestion(values, user.uid, user.displayName);

    if (result.success) {
      toast({
        title: "Success!",
        description: "Your question has been submitted.",
      });
      form.reset({ question: "", name: user.displayName || "" });
    } else {
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.error || "There was a problem submitting your question.",
      });
    }

    setIsSubmitting(false);
  }

  return (
    <Card className="shadow-lg sticky top-20 bg-white/80 backdrop-blur-lg border-gray-200">
      <CardHeader>
        <CardTitle>Submit your question</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Anonymous"
                      {...field}
                      className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner"
                      disabled={!!user?.displayName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What would you like to ask?"
                      rows={5}
                      {...field}
                      className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || !user} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Question"}
            </Button>
             {!user && (
              <p className="text-xs text-center text-gray-500">
                Please sign in to ask a question.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

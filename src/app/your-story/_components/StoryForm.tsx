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
import { shareStory } from "../actions";
import { PenSquare } from "lucide-react";
import React from "react";
import { useAuth } from "@/hooks/useAuth";

const storySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  author: z.string().optional(),
  story: z
    .string()
    .min(50, "Story must be at least 50 characters long.")
    .max(5000, "Story must be less than 5000 characters."),
});

type StoryFormValues = z.infer<typeof storySchema>;

export function StoryForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      author: "",
      story: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user?.displayName) {
      form.setValue("author", user.displayName);
    }
  }, [user, form]);


  async function onSubmit(values: StoryFormValues) {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to share a story.",
      });
      return;
    }
    setIsSubmitting(true);
    const result = await shareStory(values);

    if (result.success) {
      toast({
        title: "Thank you for sharing!",
        description: "Your story has been published.",
      });
      form.reset({ title: "", story: "", author: user.displayName || "" });
    } else {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong.",
        description: result.error || "Could not publish your story.",
      });
    }
    setIsSubmitting(false);
  }

  return (
    <Card className="shadow-lg sticky top-20 bg-white/80 backdrop-blur-lg border-gray-200">
      <CardHeader>
        <CardTitle>Share Your Story</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="A title for your story" {...field} className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Anonymous" {...field} className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner" disabled={!!user?.displayName} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Story</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your inspirational story here..."
                      rows={8}
                      {...field}
                      className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting || !user} className="w-full">
              <PenSquare className="mr-2 h-4 w-4" />
              {isSubmitting ? "Publishing..." : "Publish Story"}
            </Button>
             {!user && (
              <p className="text-xs text-center text-gray-500">
                Please sign in to share your story.
              </p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

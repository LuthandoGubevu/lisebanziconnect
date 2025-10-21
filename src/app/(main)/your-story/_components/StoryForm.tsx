
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
import { Checkbox } from "@/components/ui/checkbox";

const storySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  story: z
    .string()
    .min(50, "Story must be at least 50 characters long.")
    .max(5000, "Story must be less than 5000 characters."),
  isAnonymous: z.boolean().default(false),
});

type StoryFormValues = z.infer<typeof storySchema>;

export function StoryForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      story: "",
      isAnonymous: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

    const authorName = values.isAnonymous ? "Anonymous" : user.displayName || "Anonymous";

    const storyData = {
        title: values.title,
        story: values.story,
        author: authorName,
    };

    const result = await shareStory(storyData, user.uid);

    if (result.success) {
      toast({
        title: "Thank you for sharing!",
        description: "Your story has been published.",
      });
      form.reset({ title: "", story: "", isAnonymous: false });
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
             <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm bg-white/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Post anonymously
                    </FormLabel>
                  </div>
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

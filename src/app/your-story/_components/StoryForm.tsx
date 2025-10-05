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
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      author: "",
      story: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  async function onSubmit(values: StoryFormValues) {
    setIsSubmitting(true);
    const result = await shareStory(values);

    if (result.success) {
      toast({
        title: "Thank you for sharing!",
        description: "Your story has been published.",
      });
      form.reset();
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
    <Card className="shadow-neumorphic sticky top-20 bg-card backdrop-blur-lg border-white/20">
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
                    <Input placeholder="A title for your story" {...field} className="bg-input backdrop-blur-sm border-white/20 shadow-neumorphic-inset" />
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
                  <FormLabel>Your Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Anonymous" {...field} className="bg-input backdrop-blur-sm border-white/20 shadow-neumorphic-inset" />
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
                      className="bg-input backdrop-blur-sm border-white/20 shadow-neumorphic-inset"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              <PenSquare className="mr-2 h-4 w-4" />
              {isSubmitting ? "Publishing..." : "Publish Story"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

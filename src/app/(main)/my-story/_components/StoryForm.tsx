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
import { PenSquare } from "lucide-react";
import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useFirebase } from "@/firebase/provider";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";

const storySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  story: z
    .string()
    .min(50, "Story must be at least 50 characters long.")
    .max(5000, "Story must be less than 5000 characters."),
  author: z.string().min(2, "Author name must be at least 2 characters."),
  isAnonymous: z.boolean().default(false),
});

type StoryFormValues = z.infer<typeof storySchema>;

export function StoryForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { db } = useFirebase();
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      title: "",
      story: "",
      author: "",
      isAnonymous: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (user?.displayName && !form.getValues("author")) {
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

    const authorName = values.isAnonymous ? "Anonymous" : values.author;

    const storyData = {
        userId: user.uid,
        title: values.title,
        story: values.story,
        author: authorName,
        createdAt: serverTimestamp(),
    };
    
    const storiesCollectionRef = collection(db, "stories");

    try {
        await addDoc(storiesCollectionRef, storyData);
        toast({
            title: "Thank you for sharing!",
            description: "Your story has been published.",
        });
        form.reset({ 
            title: "", 
            story: "", 
            isAnonymous: false,
            author: user.displayName || ""
        });
    } catch (error) {
        const permissionError = new FirestorePermissionError({
            path: storiesCollectionRef.path,
            operation: 'create',
            requestResourceData: storyData
         });
         errorEmitter.emit('permission-error', permissionError);
         toast({
            variant: "destructive",
            title: "Failed to publish story",
            description: "You do not have permission to publish a story.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  const isAnonymous = form.watch("isAnonymous");

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
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="Your display name" 
                        {...field} 
                        className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner"
                        disabled={isAnonymous}
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

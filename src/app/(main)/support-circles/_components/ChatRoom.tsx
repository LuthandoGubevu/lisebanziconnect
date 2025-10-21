
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFirebase } from "@/firebase/provider";
import type { Message } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { sendMessage, getMessages } from "../actions";
import { Send } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

const messageSchema = z.object({
  text: z.string().min(1).max(500),
  sender: z.string().optional(),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export function ChatRoom() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "", sender: "" },
  });
  const {formState: { isSubmitting }} = form;

  useEffect(() => {
    if (user?.displayName) {
      form.setValue("sender", user.displayName);
    }
  }, [user, form]);

  useEffect(() => {
    async function fetchMessages() {
        const result = await getMessages();
        if(result.success && result.data) {
            setMessages(result.data);
        } else {
            toast({
                variant: "destructive",
                title: "Error fetching messages",
                description: result.error || "Could not load chat history."
            })
        }
        setLoading(false);
    }
    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);

  }, [toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function onSubmit(values: MessageFormValues) {
     if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to send a message.",
      });
      return;
    }
    const result = await sendMessage(values, user.uid, user.displayName);
    if (result.success) {
      form.reset({text: "", sender: values.sender}); 
      // Manually add message to state for instant feedback
      if(result.newMessage) {
        setMessages(prev => [...prev, result.newMessage as Message]);
      }
    } else {
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: result.error,
      });
    }
  }

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg">
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="space-y-4">
              <Skeleton className="h-16 w-3/4 bg-gray-200/80" />
              <Skeleton className="h-16 w-3/4 ml-auto bg-gray-200/80" />
              <Skeleton className="h-16 w-3/4 bg-gray-200/80" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm rounded-b-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
            <div className="flex-1 grid gap-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Type your message..."
                        className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="sender"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/2">
                      <FormControl>
                        <Input
                          autoComplete="off"
                          placeholder="Your Name"
                           className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner text-sm"
                          {...field}
                           disabled={!!user?.displayName}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </div>
            <Button type="submit" size="icon" disabled={isSubmitting || !user} className="aspect-square h-auto self-stretch">
              <Send className="size-5" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
           {!user && (
              <p className="text-xs text-center text-gray-500 pt-2">
                Please sign in to join the chat.
              </p>
            )}
        </Form>
      </div>
    </div>
  );
}

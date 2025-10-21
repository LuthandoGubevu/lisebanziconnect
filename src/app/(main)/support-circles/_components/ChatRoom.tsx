
"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useFirebase } from "@/firebase/provider";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import type { Message } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Send, AlertCircle } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const messageSchema = z.object({
  text: z.string().min(1).max(500),
  sender: z.string().optional(),
});

type MessageFormValues = z.infer<typeof messageSchema>;

export function ChatRoom() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { db } = useFirebase();
  
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
    const q = query(collection(db, "support_circle_messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const messagesData: Message[] = [];
        querySnapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() } as Message);
        });
        setMessages(messagesData);
        setLoading(false);
        setPermissionError(false);
      },
      (error) => {
        const permissionError = new FirestorePermissionError({
          path: "support_circle_messages",
          operation: "list",
        });
        errorEmitter.emit("permission-error", permissionError);
        setLoading(false);
        setPermissionError(true);
      }
    );
    return () => unsubscribe();
  }, [db]);

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
    
    const messageData = {
        userId: user.uid,
        text: values.text,
        sender: values.sender || user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
    };

    const messagesCollectionRef = collection(db, "support_circle_messages");

    try {
        await addDoc(messagesCollectionRef, messageData);
        form.reset({text: "", sender: user.displayName || ""}); 
    } catch (error) {
         const permissionError = new FirestorePermissionError({
            path: messagesCollectionRef.path,
            operation: 'create',
            requestResourceData: messageData
         });
         errorEmitter.emit('permission-error', permissionError);
         toast({
            variant: "destructive",
            title: "Failed to send message",
            description: "You do not have permission to send a message.",
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
        ) : permissionError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Content Unavailable</AlertTitle>
            <AlertDescription>
              We're currently experiencing technical difficulties and cannot load the chat. Our team has been notified.
            </AlertDescription>
          </Alert>
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder={user ? "Type your message..." : "Please sign in to chat"}
                      className="bg-white/80 backdrop-blur-sm border-gray-300 shadow-inner"
                      {...field}
                      disabled={!user || permissionError || isSubmitting}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isSubmitting || !user || permissionError}>
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

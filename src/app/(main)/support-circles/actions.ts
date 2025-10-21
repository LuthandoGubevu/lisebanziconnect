
"use server";

import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/firebase/admin";
import type { Message } from "@/lib/types";
import { revalidatePath } from "next/cache";

const MessageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty.").max(500, "Message is too long."),
  sender: z.string().optional(),
});

export async function sendMessage(values: z.infer<typeof MessageSchema>, userId: string, userDisplayName: string | null) {
  const { app } = await initializeAdminApp();
  const db = getFirestore(app);

  if (!userId) {
    return { success: false, error: "You must be logged in to send a message." };
  }

  const validatedFields = MessageSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid message.",
    };
  }

  try {
    const messageData = {
      userId: userId,
      text: validatedFields.data.text,
      sender: validatedFields.data.sender || userDisplayName || "Anonymous",
      createdAt: new Date(),
    };
    const docRef = await db.collection("support_circle_messages").add(messageData);
    
    revalidatePath("/support-circles");

    return { success: true, newMessage: { id: docRef.id, ...messageData } };
  } catch (error) {
    console.error("Error sending message: ", error);
    return { success: false, error: "Failed to send message. Please try again." };
  }
}

export async function getMessages(): Promise<{ success: boolean; data?: Message[]; error?: string; }> {
    try {
        const { db } = await initializeAdminApp();
        const messagesSnapshot = await db.collection("support_circle_messages").orderBy("createdAt", "asc").limit(50).get();
        const messages: Message[] = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
        return { success: true, data: messages };
    } catch (error) {
        console.error("Error fetching messages: ", error);
        return { success: false, error: "Failed to retrieve messages." };
    }
}

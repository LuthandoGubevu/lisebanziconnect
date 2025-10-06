
"use server";

import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/firebase/admin";

const MessageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty.").max(500, "Message is too long."),
  sender: z.string().optional(),
});

export async function sendMessage(values: z.infer<typeof MessageSchema>, userId: string, userDisplayName: string | null) {
  const { app } = await initializeAdminApp();
  const db = getFirestore(app);

  if (!userId) {
    return { error: "You must be logged in to send a message." };
  }

  const validatedFields = MessageSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid message.",
    };
  }

  try {
    await db.collection("support_circle_messages").add({
      userId: userId,
      text: validatedFields.data.text,
      sender: validatedFields.data.sender || userDisplayName || "Anonymous",
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending message: ", error);
    return { error: "Failed to send message. Please try again." };
  }
}

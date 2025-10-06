
"use server";

import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

const MessageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty.").max(500, "Message is too long."),
  sender: z.string().optional(),
});

export async function sendMessage(values: z.infer<typeof MessageSchema>) {
  const { db } = initializeFirebase();
  const validatedFields = MessageSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid message.",
    };
  }

  try {
    await addDoc(collection(db, "support_circle_messages"), {
      text: validatedFields.data.text,
      sender: validatedFields.data.sender || "Anonymous",
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending message: ", error);
    return { error: "Failed to send message. Please try again." };
  }
}

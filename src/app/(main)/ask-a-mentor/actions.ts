
"use server";

import { z } from "zod";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/firebase/admin";
import { revalidatePath } from "next/cache";

const QuestionSchema = z.object({
  name: z.string().optional(),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters long.")
    .max(1000, "Question must be less than 1000 characters."),
});

export async function askQuestion(values: z.infer<typeof QuestionSchema>, userId: string, userDisplayName: string | null) {
  const { app } = await initializeAdminApp();
  const db = getFirestore(app);

  if (!userId) {
    return { error: "You must be logged in to ask a question." };
  }

  const validatedFields = QuestionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid data provided.",
    };
  }

  try {
    await db.collection("questions").add({
      userId: userId,
      name: validatedFields.data.name || userDisplayName || "Anonymous",
      question: validatedFields.data.question,
      answer: "",
      createdAt: new Date(),
    });

    revalidatePath("/ask-a-mentor");
    return { success: true };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { error: "Failed to submit question. Please try again." };
  }
}

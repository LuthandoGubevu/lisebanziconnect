
"use server";

import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/firebase/admin";
import { revalidatePath } from "next/cache";
import type { Question } from "@/lib/types";

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
    return { success: false, error: "You must be logged in to ask a question." };
  }

  const validatedFields = QuestionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
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
    return { success: false, error: "Failed to submit question. Please try again." };
  }
}

export async function getQuestions(): Promise<{ success: boolean; data?: Question[]; error?: string; }> {
    try {
        const { db } = await initializeAdminApp();
        const questionsSnapshot = await db.collection("questions").orderBy("createdAt", "desc").get();
        const questions: Question[] = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));
        return { success: true, data: questions };
    } catch (error) {
        console.error("Error fetching questions: ", error);
        return { success: false, error: "Failed to retrieve questions." };
    }
}

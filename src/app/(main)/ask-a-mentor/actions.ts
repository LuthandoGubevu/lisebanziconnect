
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

export async function getQuestions() {
  const { db } = await initializeAdminApp();
  try {
    const snapshot = await db.collection("questions").orderBy("createdAt", "desc").get();
    if (snapshot.empty) {
      return [];
    }
    const questions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to a serializable format
        createdAt: data.createdAt.toDate().toISOString(),
      };
    });
    return questions;
  } catch (error) {
    console.error("Error getting documents: ", error);
    // In a real app, you might want to return a more specific error object
    return { error: "Failed to fetch questions." };
  }
}

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

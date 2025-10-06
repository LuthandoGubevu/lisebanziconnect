
"use server";

import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { revalidatePath } from "next/cache";

const QuestionSchema = z.object({
  name: z.string().optional(),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters long.")
    .max(1000, "Question must be less than 1000 characters."),
});

export async function askQuestion(values: z.infer<typeof QuestionSchema>) {
  const { db } = initializeFirebase();
  const validatedFields = QuestionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid data provided.",
    };
  }

  try {
    await addDoc(collection(db, "questions"), {
      name: validatedFields.data.name || "Anonymous",
      question: validatedFields.data.question,
      answer: "", // Admin will fill this later
      createdAt: serverTimestamp(),
    });

    revalidatePath("/ask-a-mentor");
    return { success: true };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { error: "Failed to submit question. Please try again." };
  }
}

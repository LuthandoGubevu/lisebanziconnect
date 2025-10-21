
"use server";

import { z } from "zod";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/firebase/admin";
import { revalidatePath } from "next/cache";

const QuestionSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters long.")
    .max(1000, "Question must be less than 1000 characters."),
  name: z.string().optional(),
});


export async function askQuestion(
  values: z.infer<typeof QuestionSchema>,
  userId: string,
  userName: string | null
) {
  const { app } = await initializeAdminApp();
  const db = getFirestore(app);

  if (!userId) {
    return { success: false, error: "Authentication required." };
  }

  const validatedFields = QuestionSchema.safeParse(values);

  if (!validatedFields.success) {
    return { success: false, error: "Invalid question." };
  }

  try {
    await db.collection("questions").add({
      userId: userId,
      name: validatedFields.data.name || userName || "Anonymous",
      question: validatedFields.data.question,
      answer: "",
      createdAt: Timestamp.now(),
    });

    revalidatePath("/ask-a-mentor");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to submit question.",
    };
  }
}

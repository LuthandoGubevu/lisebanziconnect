"use server";

import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { revalidatePath } from "next/cache";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function getFirebaseInstances() {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const db = getFirestore(app);
    return { app, db };
}

const QuestionSchema = z.object({
  name: z.string().optional(),
  question: z
    .string()
    .min(10, "Question must be at least 10 characters long.")
    .max(1000, "Question must be less than 1000 characters."),
});

export async function askQuestion(values: z.infer<typeof QuestionSchema>) {
  const { db } = getFirebaseInstances();
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

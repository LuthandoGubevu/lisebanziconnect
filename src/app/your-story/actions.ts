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

const StorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  author: z.string().optional(),
  story: z
    .string()
    .min(50, "Story must be at least 50 characters long.")
    .max(5000, "Story must be less than 5000 characters."),
});

export async function shareStory(values: z.infer<typeof StorySchema>) {
  const { db } = getFirebaseInstances();
  const validatedFields = StorySchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid data provided.",
    };
  }

  try {
    await addDoc(collection(db, "stories"), {
      title: validatedFields.data.title,
      author: validatedFields.data.author || "Anonymous",
      story: validatedFields.data.story,
      createdAt: serverTimestamp(),
    });

    revalidatePath("/your-story");
    return { success: true };
  } catch (error) {
    console.error("Error adding story: ", error);
    return { error: "Failed to publish story. Please try again." };
  }
}


"use server";

import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";
import { revalidatePath } from "next/cache";

const StorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  author: z.string().optional(),
  story: z
    .string()
    .min(50, "Story must be at least 50 characters long.")
    .max(5000, "Story must be less than 5000 characters."),
});

export async function shareStory(values: z.infer<typeof StorySchema>) {
  const { db } = initializeFirebase();
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

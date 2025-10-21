
"use server";

import { z } from "zod";
import { getFirestore } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/firebase/admin";
import { revalidatePath } from "next/cache";
import type { Story } from "@/lib/types";

const StorySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(100),
  author: z.string().optional(),
  story: z
    .string()
    .min(50, "Story must be at least 50 characters long.")
    .max(5000, "Story must be less than 5000 characters."),
});

export async function shareStory(values: z.infer<typeof StorySchema>, userId: string, userDisplayName: string | null) {
  const { app } = await initializeAdminApp();
  const db = getFirestore(app);

  if (!userId) {
    return { success: false, error: "You must be logged in to share a story." };
  }

  const validatedFields = StorySchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid data provided.",
    };
  }

  try {
    await db.collection("stories").add({
      userId: userId,
      title: validatedFields.data.title,
      author: validatedFields.data.author || userDisplayName || "Anonymous",
      story: validatedFields.data.story,
      createdAt: new Date(),
    });

    revalidatePath("/your-story");
    revalidatePath("/community-stories");
    return { success: true };
  } catch (error) {
    console.error("Error adding story: ", error);
    return { success: false, error: "Failed to publish story. Please try again." };
  }
}

export async function getStories(): Promise<{ success: boolean; data?: Story[]; error?: string; }> {
    try {
        const { db } = await initializeAdminApp();
        const storiesSnapshot = await db.collection("stories").orderBy("createdAt", "desc").get();
        const stories: Story[] = storiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Story));
        return { success: true, data: stories };
    } catch (error) {
        console.error("Error fetching stories: ", error);
        return { success: false, error: "Failed to retrieve stories." };
    }
}

"use server";

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

// This action is for seeding data. In a real app, you'd have a proper form and validation.
export async function addEvent() {
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14); // 2 weeks from now

    await addDoc(collection(db, "events"), {
      title: "Community Meet & Greet",
      description: "An online event to welcome new members, share stories, and get to know the community. All are welcome!",
      date: Timestamp.fromDate(futureDate),
    });
    
    revalidatePath("/upcoming-events");
    return { success: true };
  } catch (error) {
    console.error("Error adding event:", error);
    return { error: "Failed to add event." };
  }
}

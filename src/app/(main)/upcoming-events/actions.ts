
"use server";

import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/firebase/admin";
import { revalidatePath } from "next/cache";
import type { Event } from "@/lib/types";

// This action is for seeding data. In a real app, you'd have a proper form and validation.
export async function addEvent() {
    const { db } = await initializeAdminApp();
  try {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14); // 2 weeks from now

    await db.collection("events").add({
      title: "Community Meet & Greet",
      description: "An online event to welcome new members, share stories, and get to know the community. All are welcome!",
      date: Timestamp.fromDate(futureDate),
    });
    
    revalidatePath("/upcoming-events");
    return { success: true };
  } catch (error) {
    console.error("Error adding event:", error);
    return { success: false, error: "Failed to add event." };
  }
}

export async function getEvents(): Promise<{ success: boolean; data?: Event[]; error?: string; }> {
    try {
        const { db } = await initializeAdminApp();
        const eventsSnapshot = await db.collection("events").orderBy("date", "asc").get();
        const events: Event[] = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        return { success: true, data: events };
    } catch (error) {
        console.error("Error fetching events: ", error);
        return { success: false, error: "Failed to retrieve events." };
    }
}

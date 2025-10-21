
"use server";

import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { initializeAdminApp } from "@/firebase/admin";
import { revalidatePath } from "next/cache";

// This action is for seeding data. In a real app, you'd have a proper form and validation.
// This is currently disabled because it requires FIREBASE_SERVICE_ACCOUNT_KEY.
// The EventList component will show a mock event instead.
export async function addEvent() {
    // const { db } = await initializeAdminApp();
    // try {
    //   const futureDate = new Date();
    //   futureDate.setDate(futureDate.getDate() + 14); // 2 weeks from now

    //   await db.collection("events").add({
    //     title: "Community Meet & Greet",
    //     description: "An online event to welcome new members, share stories, and get to know the community. All are welcome!",
    //     date: Timestamp.fromDate(futureDate),
    //   });
    
    //   revalidatePath("/upcoming-events");
    //   return { success: true };
    // } catch (error) {
    //   console.error("Error adding event:", error);
    //   return { success: false, error: "Failed to add event." };
    // }
    return { success: false, error: "Seeding is currently disabled." };
}

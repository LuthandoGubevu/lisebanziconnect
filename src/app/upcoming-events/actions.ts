"use server";

import { addDoc, collection, Timestamp } from "firebase/firestore";
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

// This action is for seeding data. In a real app, you'd have a proper form and validation.
export async function addEvent() {
    const { db } = getFirebaseInstances();
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

"use server";

import { z } from "zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

const MessageSchema = z.object({
  text: z.string().min(1, "Message cannot be empty.").max(500, "Message is too long."),
  sender: z.string().optional(),
});

export async function sendMessage(values: z.infer<typeof MessageSchema>) {
  const { db } = getFirebaseInstances();
  const validatedFields = MessageSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid message.",
    };
  }

  try {
    await addDoc(collection(db, "support_circle_messages"), {
      text: validatedFields.data.text,
      sender: validatedFields.data.sender || "Anonymous",
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending message: ", error);
    return { error: "Failed to send message. Please try again." };
  }
}

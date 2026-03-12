"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore/lite";
import { getFirebaseAuth, getFirestoreDb } from "@/lib/firebase";

export type AcademicRecordType = "gpa" | "cgpa" | "predict";

export interface AcademicRecord {
  id: string;
  type: AcademicRecordType;
  title: string;
  score: number;
  credits: number;
  metadata: Record<string, unknown>;
  createdAtMs: number;
}

interface SaveRecordInput {
  type: AcademicRecordType;
  title: string;
  score: number;
  credits: number;
  metadata?: Record<string, unknown>;
}

interface SaveRecordResult {
  ok: boolean;
  message: string;
}

export async function ensureUserProfile() {
  const auth = getFirebaseAuth();
  const db = getFirestoreDb();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return;
  }

  const profileRef = doc(db, "users", currentUser.uid);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    await setDoc(profileRef, {
      email: currentUser.email,
      displayName: currentUser.displayName ?? "Student",
      createdAtMs: Date.now(),
    });
  }
}

export async function saveAcademicRecord(input: SaveRecordInput): Promise<SaveRecordResult> {
  try {
    const auth = getFirebaseAuth();
    const db = getFirestoreDb();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return { ok: false, message: "Please login to save your record." };
    }

    await ensureUserProfile();

    await addDoc(collection(db, "users", currentUser.uid, "records"), {
      ...input,
      metadata: input.metadata ?? {},
      createdAtMs: Date.now(),
    });

    return { ok: true, message: "Record saved to your dashboard." };
  } catch (err) {
    console.error("Error saving record:", err);
    
    let message = "Failed to save record.";
    if (err instanceof Error) {
      if (err.message.includes("Missing or insufficient permissions")) {
        message = "Permission denied. Your Firestore security rules may need to be updated. Contact support.";
      } else {
        message = err.message;
      }
    }
    
    return {
      ok: false,
      message,
    };
  }
}

export async function getUserRecords(uid: string): Promise<AcademicRecord[]> {
  try {
    const db = getFirestoreDb();
    const recordsQuery = query(
      collection(db, "users", uid, "records"),
      orderBy("createdAtMs", "desc")
    );

    const recordsSnap = await getDocs(recordsQuery);

    return recordsSnap.docs.map((recordDoc) => {
      const data = recordDoc.data();

      return {
        id: recordDoc.id,
        type: (data.type as AcademicRecordType) ?? "gpa",
        title: (data.title as string) ?? "Untitled Record",
        score: Number(data.score ?? 0),
        credits: Number(data.credits ?? 0),
        metadata: (data.metadata as Record<string, unknown>) ?? {},
        createdAtMs: Number(data.createdAtMs ?? Date.now()),
      };
    });
  } catch (err) {
    console.error("Error fetching records:", err);
    if (err instanceof Error && err.message.includes("Missing or insufficient permissions")) {
      throw new Error("Permission denied. Your Firestore security rules may need to be updated.");
    }
    throw err;
  }
}

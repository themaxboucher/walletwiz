"use client";

import { Client, Account } from "appwrite";
import { getSession } from "@/lib/actions/user.actions";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const account = new Account(client);

export async function sendVerificationEmail(redirectUrl: string) {
  try {
    // Get session from server
    const session = await getSession();
    console.log("Setting session:", session);
    client.setSession(session);

    await account.createVerification(redirectUrl);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

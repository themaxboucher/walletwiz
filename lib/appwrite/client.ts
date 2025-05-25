"use client";

import { Client, Account } from "appwrite";
import { getSession } from "@/lib/actions/user.actions";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const account = new Account(client);

export async function sendVerificationEmail() {
  try {
    // Get session from server
    const session = await getSession();
    console.log("Setting session:", session);
    client.setSession(session);

    await account.createVerification(
      `${process.env.NEXT_PUBLIC_SITE_URL!}/verify`
    );
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

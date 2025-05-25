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

export async function sendPasswordRecoveryEmail(email: string) {
  try {
    await account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_SITE_URL!}/reset-password`
    );
    console.log("Password recovery email sent successfully");
  } catch (error) {
    console.error("Error sending password recovery email:", error);
    throw error;
  }
}

export async function resetPassword(
  userId: string,
  secret: string,
  password: string
) {
  try {
    await account.updateRecovery(userId, secret, password);
    console.log("Password reset successfully");
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

export async function updateVerification(userId: string, secret: string) {
  try {
    await account.updateVerification(userId, secret);
    console.log("Email verified successfully");
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
}

"use client";

import { Client, Account, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

const account = new Account(client);
const storage = new Storage(client);

export async function sendVerificationEmail() {
  try {
    await account.createVerification(
      `${process.env.NEXT_PUBLIC_SITE_URL!}/verify`
    );
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
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

export async function updateVerification(userId: string, secret: string) {
  try {
    await account.updateVerification(userId, secret);
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
}

export async function uploadAvatar(file: File): Promise<string> {
  try {
    const uploaded = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID!,
      ID.unique(),
      file
    );
    return storage
      .getFilePreview(
        process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID!,
        uploaded.$id
      )
      .toString();
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Failed to upload avatar. Please try again.");
  }
}

export async function deleteAvatar(fileId: string): Promise<void> {
  const storage = new Storage(client);
  try {
    await storage.deleteFile(
      process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID!,
      fileId
    );
  } catch (error) {
    console.error("Error deleting avatar from Appwrite Storage:", error);
    throw new Error("Failed to delete avatar. Please try again.");
  }
}

export async function updatePassword(newPassword: string, oldPassword: string) {
  try {
    await account.updatePassword(newPassword, oldPassword);
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export async function createClientSession(email: string, password: string) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
  const account = new Account(client);
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    console.error("Error creating client session:", error);
    throw error;
  }
}

export async function deleteClientSession() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);
  const account = new Account(client);
  try {
    return await account.deleteSession("current");
  } catch (error) {
    console.error("Error deleting client session:", error);
    throw error;
  }
}

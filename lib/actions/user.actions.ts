"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/server";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { defaultCategories, defaultAccounts } from "@/constants";
import { createCategory } from "./category.actions";
import { createAccount } from "./account.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_CATEGORY_COLLECTION_ID: CATEGORY_COLLECTION_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
  APPWRITE_ACCOUNT_COLLECTION_ID: ACCOUNT_COLLECTION_ID,
  APPWRITE_PAYEE_COLLECTION_ID: PAYEE_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: { userId: string }) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
  }
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });
    return parseStringify(user);
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const signup = async ({
  password,
  ...userData
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const { email, firstName, lastName } = userData;

  try {
    const { account, database } = await createAdminClient();

    // Create the user account
    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error("Error creating user");

    // Create user document in database
    const newUser = await database.createDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      ID.unique(),
      {
        ...userData,
        userId: newUserAccount.$id,
      }
    );

    // Create session after successful signup
    const session = await account.createEmailPasswordSession(email, password);

    // Set the session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const userAccount = await account.get();

    const userDocument = await getUserInfo({ userId: userAccount.$id });

    const loggedInUser = {
      ...userDocument,
      $emailVerification: userAccount.emailVerification,
    };

    return parseStringify(loggedInUser);
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const logout = async () => {
  try {
    const { account } = await createSessionClient();

    (await cookies()).delete("appwrite-session");

    await account.deleteSession("current");
  } catch (error) {
    return null;
  }
};

export const getSession = async () => {
  try {
    const session = (await cookies()).get("appwrite-session");
    return session?.value || "";
  } catch (error) {
    console.error("Error getting session:", error);
    return "";
  }
};

export const updateUser = async ({
  userId,
  firstName,
  lastName,
  email,
  avatar,
}: {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}) => {
  try {
    const { database, user: users } = await createAdminClient();
    // Find the user document
    const userDoc = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );
    const docId = userDoc.documents[0]?.$id;
    if (!docId) throw new Error("User document not found");

    // Get current values from the user document
    const currentEmail = userDoc.documents[0]?.email;
    const currentName = `${userDoc.documents[0]?.firstName} ${userDoc.documents[0]?.lastName}`;
    // Update the Appwrite Auth user (name and email) only if changed
    try {
      if (currentName !== `${firstName} ${lastName}`) {
        await users.updateName(userId, `${firstName} ${lastName}`);
      }
      if (currentEmail !== email) {
        await users.updateEmail(userId, email);
      }
    } catch (authError: any) {
      console.error("Error updating Appwrite Auth user:", authError);
      const message =
        authError?.response?.message ||
        authError?.message ||
        "Failed to update Appwrite Auth user. User document not updated.";
      throw new Error(message);
    }

    // Update the user document
    const updated = await database.updateDocument(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      docId,
      { firstName, lastName, email, avatar }
    );
    return parseStringify(updated);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteAccount = async (authUserId: string, docUserId: string) => {
  try {
    const { user: users, database } = await createAdminClient();
    // Delete all transactions for the user
    const transactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal("user", [docUserId]), Query.limit(5000)]
    );
    for (const tx of transactions.documents) {
      await database.deleteDocument(
        DATABASE_ID!,
        TRANSACTION_COLLECTION_ID!,
        tx.$id
      );
    }
    // Delete all payees for the user
    const payees = await database.listDocuments(
      DATABASE_ID!,
      PAYEE_COLLECTION_ID!,
      [Query.equal("user", docUserId), Query.limit(5000)]
    );
    for (const payee of payees.documents) {
      await database.deleteDocument(
        DATABASE_ID!,
        PAYEE_COLLECTION_ID!,
        payee.$id
      );
    }
    // Delete all categories for the user
    const categories = await database.listDocuments(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      [Query.equal("user", docUserId), Query.limit(5000)]
    );
    for (const cat of categories.documents) {
      await database.deleteDocument(
        DATABASE_ID!,
        CATEGORY_COLLECTION_ID!,
        cat.$id
      );
    }
    // Delete all accounts for the user
    const accounts = await database.listDocuments(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      [Query.equal("user", docUserId), Query.limit(5000)]
    );
    for (const acc of accounts.documents) {
      await database.deleteDocument(
        DATABASE_ID!,
        ACCOUNT_COLLECTION_ID!,
        acc.$id
      );
    }
    // Delete the user document from the database
    await database.deleteDocument(DATABASE_ID!, USER_COLLECTION_ID!, docUserId);
    // Delete the user from Appwrite Auth
    await users.delete(authUserId);
    return true;
  } catch (error) {
    console.error("Error deleting user account:", error);
    throw error;
  }
};

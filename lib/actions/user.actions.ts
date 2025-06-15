"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite/server";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";
import { categories } from "@/constants";
import { createCategory } from "./category.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
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

    // Create default categories for the new user
    for (const category of categories) {
      await createCategory(category, newUser.$id);
    }

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

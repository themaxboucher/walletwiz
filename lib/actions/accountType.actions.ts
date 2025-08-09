"use server";

import { Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_ACCOUNTTYPE_COLLECTION_ID: ACCOUNT_COLLECTION_ID,
} = process.env;

export async function getAccountTypes(limit: number = 5000) {
  try {
    const { database } = await createAdminClient();
    const result = await database.listDocuments(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      [Query.limit(limit)]
    );
    return parseStringify(result.documents);
  } catch (error) {
    console.error("Error fetching account types:", error);
    throw error;
  }
}

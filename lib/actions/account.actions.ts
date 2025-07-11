"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_ACCOUNT_COLLECTION_ID: ACCOUNT_COLLECTION_ID,
} = process.env;

export const createAccount = async (account: AccountDB, userId: string) => {
  try {
    const { database } = await createAdminClient();
    const newAccount = await database.createDocument(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      ID.unique(),
      {
        ...account,
        user: userId,
      }
    );
    return parseStringify(newAccount);
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const getAccounts = async (userId: string) => {
  try {
    const { database } = await createAdminClient();

    const accounts = await database.listDocuments(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      [Query.equal("user", userId)]
    );

    return parseStringify(accounts.documents);
  } catch (error) {
    console.error("Error getting accounts:", error);
    throw error;
  }
};

export const updateAccount = async (
  accountId: string,
  updatedAccount: Partial<AccountDB>
) => {
  try {
    const { database } = await createAdminClient();
    const account = await database.updateDocument(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      accountId,
      updatedAccount
    );
    return parseStringify(account);
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

export const deleteFinancialAccount = async (accountId: string) => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      accountId
    );
    return { success: true };
  } catch (error) {
    console.error("Error deleting financial account:", error);
    throw error;
  }
};

"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_PAYEE_COLLECTION_ID: PAYEE_COLLECTION_ID,
} = process.env;

export const createPayee = async (payee: PayeeDB, userId: string) => {
  try {
    const { database } = await createAdminClient();
    const newPayee = await database.createDocument(
      DATABASE_ID!,
      PAYEE_COLLECTION_ID!,
      ID.unique(),
      {
        ...payee,
        user: userId,
      }
    );
    return parseStringify(newPayee);
  } catch (error) {
    console.error("Error creating payee:", error);
    throw error;
  }
};

export const getPayees = async (userId: string) => {
  try {
    const { database } = await createAdminClient();
    const payees = await database.listDocuments(
      DATABASE_ID!,
      PAYEE_COLLECTION_ID!,
      [Query.equal("user", userId)]
    );
    return parseStringify(payees.documents);
  } catch (error) {
    console.error("Error getting payees:", error);
    throw error;
  }
};

export const updatePayee = async (
  payeeId: string,
  updatedPayee: Partial<PayeeDB>
) => {
  try {
    const { database } = await createAdminClient();
    const payee = await database.updateDocument(
      DATABASE_ID!,
      PAYEE_COLLECTION_ID!,
      payeeId,
      updatedPayee
    );
    return parseStringify(payee);
  } catch (error) {
    console.error("Error updating payee:", error);
    throw error;
  }
};

export const deletePayee = async (payeeId: string) => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(DATABASE_ID!, PAYEE_COLLECTION_ID!, payeeId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting payee:", error);
    throw error;
  }
};

/**
 * Find a payee by its linked account ID
 */
export const getPayeeByAccount = async (accountId: string) => {
  try {
    const { database } = await createAdminClient();
    const payees = await database.listDocuments(
      DATABASE_ID!,
      PAYEE_COLLECTION_ID!,
      [Query.equal("account", accountId)]
    );

    return payees.documents.length > 0
      ? parseStringify(payees.documents[0])
      : null;
  } catch (error) {
    console.error("Error getting payee by account:", error);
    throw error;
  }
};

"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const createTransaction = async (transaction: TransactionDB) => {
  try {
    const { database } = await createAdminClient();

    const newTransaction = await database.createDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      ID.unique(),
      transaction
    );

    return parseStringify(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

export const getTransactions = async (userId: string, limit: number = 5000) => {
  try {
    const { database } = await createAdminClient();

    const transactions = await database.listDocuments(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      [Query.equal("user", [userId]), Query.limit(limit)]
    );

    return parseStringify(transactions.documents);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId: string) => {
  try {
    const { database } = await createAdminClient();

    await database.deleteDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      transactionId
    );
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

export const updateTransaction = async (
  transactionId: string,
  transaction: Partial<TransactionDB>
) => {
  try {
    const { database } = await createAdminClient();

    const updatedTransaction = await database.updateDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      transactionId,
      transaction
    );

    return parseStringify(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

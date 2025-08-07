"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";
import { adjustAccountBalance } from "./account.actions";

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

    // Add the transaction amount to the account balance
    if (transaction.account) {
      await adjustAccountBalance(transaction.account, transaction.amount);
    }

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

    // Get the transaction before deleting to know which account to update
    const transactionToDelete = await database.getDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      transactionId
    );

    // Subtract the transaction amount from the account balance
    if (transactionToDelete.account) {
      await adjustAccountBalance(
        transactionToDelete.account.$id,
        -transactionToDelete.amount
      );
    }

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

    // Get the original transaction to know which account(s) need balance updates
    const originalTransaction = await database.getDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      transactionId
    );

    const updatedTransaction = await database.updateDocument(
      DATABASE_ID!,
      TRANSACTION_COLLECTION_ID!,
      transactionId,
      transaction
    );

    // Update account balances based on the changes
    const originalAccountId = originalTransaction.account.$id;
    const newAccountId = transaction.account || originalTransaction.account.$id;
    const originalAmount = originalTransaction.amount;
    const newAmount =
      transaction.amount !== undefined
        ? transaction.amount
        : originalTransaction.amount;

    // Handle account balance adjustments
    if (originalAccountId && newAccountId) {
      if (originalAccountId !== newAccountId) {
        // Account changed: remove from old account, add to new account
        await Promise.all([
          adjustAccountBalance(originalAccountId, -originalAmount),
          adjustAccountBalance(newAccountId, newAmount),
        ]);
      } else if (originalAmount !== newAmount) {
        // Same account but amount changed: adjust by the difference
        const difference = newAmount - originalAmount;
        await adjustAccountBalance(originalAccountId, difference);
      }
    }

    return parseStringify(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

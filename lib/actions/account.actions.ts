"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";
import { createPayee, deletePayee, getPayeeByAccount } from "./payee.actions";

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

    // Create corresponding payee for this account
    try {
      const payeeData: PayeeDB = {
        name: newAccount.name,
        brandId: null,
        domain: null,
        user: userId,
        account: newAccount.$id,
      };
      await createPayee(payeeData, userId);
    } catch (payeeError) {
      console.error("Error creating corresponding payee:", payeeError);
      throw payeeError;
    }

    return parseStringify(newAccount);
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const getAccounts = async (userId: string, limit: number = 5000) => {
  try {
    const { database } = await createAdminClient();

    const accounts = await database.listDocuments(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      [Query.equal("user", userId), Query.limit(limit)]
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
    // Delete corresponding payee first
    try {
      const linkedPayee = await getPayeeByAccount(accountId);
      if (linkedPayee) {
        await deletePayee(linkedPayee.$id);
      }
    } catch (payeeError) {
      console.error("Error deleting corresponding payee:", payeeError);
      throw payeeError;
    }

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

/**
 * Adjust account balance by a specific amount (add or subtract)
 */
export const adjustAccountBalance = async (
  accountId: string,
  amount: number
) => {
  try {
    const { database } = await createAdminClient();

    // Get current account to retrieve current balance
    const currentAccount = await database.getDocument(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      accountId
    );

    const currentBalance = currentAccount.currentBalance || 0;
    const newBalance = currentBalance + amount;

    const updatedAccount = await database.updateDocument(
      DATABASE_ID!,
      ACCOUNT_COLLECTION_ID!,
      accountId,
      { currentBalance: newBalance }
    );

    return parseStringify(updatedAccount);
  } catch (error) {
    console.error("Error adjusting account balance:", error);
    throw error;
  }
};

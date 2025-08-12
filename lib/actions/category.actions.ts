"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";
import { getTransactions, updateTransaction } from "./transaction.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_CATEGORY_COLLECTION_ID: CATEGORY_COLLECTION_ID,
} = process.env;

export const createCategory = async (category: Category, userId: string) => {
  try {
    const { database } = await createAdminClient();
    const newCategory = await database.createDocument(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      ID.unique(),
      {
        ...category,
        user: userId,
      }
    );
    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const getCategories = async (userId: string, limit: number = 5000) => {
  try {
    const { database } = await createAdminClient();

    const categories = await database.listDocuments(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      [Query.equal("user", userId), Query.limit(limit)]
    );

    return parseStringify(categories.documents);
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

export const updateCategory = async (
  categoryId: string,
  updatedCategory: Partial<Category>
) => {
  try {
    const { database } = await createAdminClient();
    const category = await database.updateDocument(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      categoryId,
      updatedCategory
    );
    return category;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const { database } = await createAdminClient();
    await database.deleteDocument(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      categoryId
    );
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const updateCategories = async (
  userId: string,
  selected: Category[],
  initialUserCategories: Category[]
) => {
  // Find categories to add (selected but not in initialUserCategories)
  const toAdd = selected.filter(
    (cat: Category) =>
      !initialUserCategories.some((c: Category) => c.name === cat.name)
  );
  // Find categories to delete (in initialUserCategories but not selected)
  const toDelete = initialUserCategories.filter(
    (cat: Category) => !selected.some((c: Category) => c.name === cat.name)
  );

  // If there are no changes, avoid unnecessary work
  if (toAdd.length === 0 && toDelete.length === 0) {
    return getCategories(userId);
  }

  // Get user's current categories (including $id for 'Other Income' and 'Other Expense')
  const userCategories = await getCategories(userId);
  const otherIncome = userCategories.find(
    (cat: Category) => cat.name === "Other Income" && cat.type === "income"
  );
  const otherExpense = userCategories.find(
    (cat: Category) => cat.name === "Other Expense" && cat.type === "expense"
  );

  if (!otherIncome || !otherExpense) {
    throw new Error(
      "'Other Income' or 'Other Expense' category not found for user"
    );
  }

  // Get all transactions for the user
  const transactions = await getTransactions(userId);

  // For each category to delete, update transactions to use the appropriate 'Other' category
  for (const cat of toDelete) {
    const replacementId =
      cat.type === "income" ? otherIncome.$id : otherExpense.$id;
    const affectedTransactions = transactions.filter(
      (tx: any) => tx.category.$id === cat.$id
    );
    await Promise.all(
      affectedTransactions.map((tx: any) =>
        updateTransaction(tx.$id, { category: replacementId })
      )
    );
  }

  // Add new categories
  await Promise.all(toAdd.map((cat: Category) => createCategory(cat, userId)));

  // Delete removed categories
  await Promise.all(
    toDelete.map((cat: Category) => cat.$id && deleteCategory(cat.$id))
  );

  // Return updated categories
  return getCategories(userId);
};

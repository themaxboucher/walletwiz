"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_CATEGORY_COLLECTION_ID: CATEGORY_COLLECTION_ID,
} = process.env;

export const createCategory = async (
  category: Omit<Category, "$id">,
  userId: string
) => {
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

export const getCategories = async (userId: string) => {
  try {
    const { database } = await createAdminClient();
    const categories = await database.listDocuments(
      DATABASE_ID!,
      CATEGORY_COLLECTION_ID!,
      [Query.equal("user", userId)]
    );
    return categories.documents;
  } catch (error) {
    console.error("Error getting categories:", error);
    throw error;
  }
};

export const updateCategory = async (
  categoryId: string,
  updatedCategory: Partial<Omit<Category, "$id">>
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

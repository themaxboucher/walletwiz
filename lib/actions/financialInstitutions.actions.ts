"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite/server";
import { parseStringify } from "../utils";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_FINANCIAL_INSTITUTION_COLLECTION_ID:
    FINANCIAL_INSTITUTION_COLLECTION_ID,
} = process.env;

export const getFinancialInstitutions = async (limit: number = 5000) => {
  try {
    const { database } = await createAdminClient();

    const institutions = await database.listDocuments(
      DATABASE_ID!,
      FINANCIAL_INSTITUTION_COLLECTION_ID!,
      [Query.orderAsc("name"), Query.limit(limit)]
    );

    return parseStringify(institutions.documents);
  } catch (error) {
    console.error("Error getting financial institutions:", error);
    return [];
  }
};

export const createFinancialInstitution = async (institution: {
  name: string;
  domain: string;
}) => {
  try {
    const { database } = await createAdminClient();
    const newInstitution = await database.createDocument(
      DATABASE_ID!,
      FINANCIAL_INSTITUTION_COLLECTION_ID!,
      ID.unique(),
      institution
    );
    return parseStringify(newInstitution);
  } catch (error) {
    console.error("Error creating financial institution:", error);
    throw error;
  }
};

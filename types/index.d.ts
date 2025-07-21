// Utility types
declare type Override<T, R> = Omit<T, keyof R> & R;

// Collection field types
declare type CategoryColor =
  | "red"
  | "yellow"
  | "orange"
  | "blue"
  | "violet"
  | "pink"
  | "green";

// Collection types
declare interface Account {
  $id?: string;
  name: string;
  type: AccountType; // Relationship field
  user?: User; // Relationship field
  currentBalance?: number;
  availableBalance?: number;
  officialName?: string;
  mask?: string;
}

declare interface AccountType {
  $id?: string;
  name: string;
  type: "credit" | "depository" | "other";
  iconName: string;
}

declare interface Category {
  $id?: string;
  name: string;
  iconName: string;
  color: CategoryColor;
  type: "income" | "expense";
  budget?: number | null;
  user?: User; // Relationship field
}

declare interface Payee {
  $id?: string;
  name: string;
  logo?: string | null; // Is this necessary if we have the brand id?
  brandId?: string | null; // Brandfetch brand ID
  user?: User; // Relationship field
  defaultCategory: Category | null; // Relationship field
}

declare interface Transaction {
  $id?: string;
  amount: number;
  payee: Payee; // Relationship field
  category: Category; // Relationship field
  account?: Account; // Relationship field
  date: string;
  note?: string;
  name?: string;
  user?: User; // Relationship field
}
declare interface User {
  email: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
  $emailVerification: boolean;
}

// Override the relationship fields in the main types with strings for the document IDs
declare type TransactionDB = Override<
  Transaction,
  { category: string; user: string; account?: string; payee: PayeeDB }
>;

declare type AccountDB = Override<Account, { type: string }>;

declare type PayeeDB = Override<Payee, { user: string }>;

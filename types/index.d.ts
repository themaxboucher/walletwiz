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

declare interface Transaction {
  $id?: string;
  merchantName: string;
  amount: number;
  category: Category; // Relationship field
  account?: string; // Relationship field
  date: string;
  note?: string;
  name?: string;
  merchantLogo?: string | null;
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
  { category: string; user: string }
>;

declare type AccountDB = Override<Account, { type: string }>;

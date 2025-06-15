declare type Override<T, R> = Omit<T, keyof R> & R;

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

declare type CategoryColor =
  | "red"
  | "yellow"
  | "orange"
  | "blue"
  | "violet"
  | "pink"
  | "green";

declare interface Category {
  $id?: string;
  name: string;
  iconName: string;
  color: CategoryColor;
  type: "income" | "expense";
  value?: string;
  budget?: number;
  user?: User;
}

declare interface Transaction {
  $id?: string | number;
  name?: string;
  merchantName: string;
  amount: number;
  account?: string;
  category: Category;
  date: string;
  merchantLogo?: string | null;
  note?: string;
  user?: User;
}

// Transaction type when the category or user is the document id
declare type TransactionDB = Override<
  Transaction,
  { category: string; user: string }
>;

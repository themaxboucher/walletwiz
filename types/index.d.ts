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

declare interface Category {
  name: string;
  iconName: string;
  color:
    | "red"
    | "yellow"
    | "orange"
    | "cyan"
    | "blue"
    | "violet"
    | "pink"
    | "green";
  type: "income" | "expense";
  value?: string;
  budget?: number;
}

declare interface Transaction {
  id?: string | number;
  name?: string;
  merchantName: string;
  amount: number;
  account?: string;
  category: Category;
  date: string;
  merchantLogo?: string | null;
  note?: string;
  user?: string;
}

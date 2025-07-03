export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getTransactions } from "@/lib/actions/transaction.actions";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { getCategories } from "@/lib/actions/category.actions";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) return null;

  const transactions = await getTransactions(user.$id);

  const categories = await getCategories(user.$id);

  // Sort categories so 'Other Income' and 'Other Expense' are at the end, and the rest alphabetically
  const mainCategories = categories
    .filter(
      (cat: Category) =>
        cat.name !== "Other Income" && cat.name !== "Other Expense"
    )
    .sort((a: Category, b: Category) => a.name.localeCompare(b.name));
  const sortedCategories = [
    ...mainCategories,
    ...categories.filter((cat: Category) => cat.name === "Other Income"),
    ...categories.filter((cat: Category) => cat.name === "Other Expense"),
  ];

  return (
    <DashboardContent
      user={user}
      transactions={transactions}
      categories={sortedCategories}
    />
  );
}

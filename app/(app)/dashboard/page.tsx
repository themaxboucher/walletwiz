export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getTransactions } from "@/lib/actions/transaction.actions";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { getCategories } from "@/lib/actions/category.actions";
import { getAccounts } from "@/lib/actions/account.actions";
import { sortCategories } from "@/lib/utils";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) return null;

  const transactions = await getTransactions(user.$id);
  const accounts = await getAccounts(user.$id);
  const categories = await getCategories(user.$id);
  const sortedCategories = sortCategories(categories);

  return (
    <DashboardContent
      user={user}
      transactions={transactions}
      categories={sortedCategories}
      accounts={accounts}
    />
  );
}

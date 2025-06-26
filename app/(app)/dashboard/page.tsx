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

  return (
    <DashboardContent
      user={user}
      transactions={transactions}
      categories={categories}
    />
  );
}

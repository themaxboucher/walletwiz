import { BalanceChart } from "@/app/(app)/dashboard/balance-chart";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { Transaction } from "./columns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import CategoryCards from "./category-cards";
import TransactionsTable from "./transactions-table";

export default async function DashboardPage() {
  const supabase = createClient();
  let { data: transactions, error } = await supabase
    .from("transactions")
    .select("*");
  if (error) {
    console.log(error);
  }
  // If transactions is undefined or null, we default to an empty array
  const safeTransactions: Transaction[] = transactions || [];

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold md:text-3xl">Dashboard</h1>
        <DatePickerWithRange />
      </div>
      <Separator />
      <CategoryCards />
      <div className="grid grid-cols-2 gap-4">
        <BalanceChart />
        <TransactionsTable transactions={safeTransactions} />
      </div>
    </>
  );
}

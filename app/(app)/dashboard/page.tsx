import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getTransactions } from "@/lib/actions/transaction.actions";
import Greeting from "@/components/dashboard/Greeting";
import { Separator } from "@/components/ui/separator";
import Transactions from "@/components/dashboard/Transactions";
import Balance from "@/components/dashboard/Balance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AmountCard from "@/components/dashboard/AmountCard";

export default async function DashboardPage() {
  const user = await getLoggedInUser();
  if (!user) return null;

  const transactions = await getTransactions(user.$id);

  // Calculate totals from transactions
  const income = transactions
    .filter((tx: Transaction) => tx.amount > 0)
    .reduce((sum: number, tx: Transaction) => sum + tx.amount, 0);

  const expenses = transactions
    .filter((tx: Transaction) => tx.amount < 0)
    .reduce((sum: number, tx: Transaction) => sum + Math.abs(tx.amount), 0);

  const netChange = income - expenses;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold md:text-2xl">
          <Greeting />, {user.firstName}
        </h1>
        <div>Time range selector</div>
      </div>
      <Separator />
      <div className="grid grid-cols-3 gap-5">
        <div className="grid grid-cols-1 gap-5 col-span-2">
          <div className="grid grid-cols-3 gap-5">
            <AmountCard
              title="Income"
              amount={income}
              percentageChange={15.2} // TODO: Calculate actual percentage change
            />
            <AmountCard
              title="Expenses"
              amount={expenses}
              percentageChange={-4.5} // TODO: Calculate actual percentage change
            />
            <AmountCard title="Net Change" amount={netChange} />
          </div>
          <Balance />
          <Transactions transactions={transactions} />
        </div>
        <div className="grid grid-cols-1 gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Budget</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Connect an account</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}

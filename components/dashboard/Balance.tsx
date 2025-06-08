import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import BalanceChart from "./BalanceChart";
import { formatCurrency } from "@/lib/utils";

interface BalanceProps {
  transactions: Transaction[];
}

export default function Balance({ transactions }: BalanceProps) {
  // Calculate current balance
  const currentBalance = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-muted-foreground">Balance</CardTitle>
        <p className="text-2xl font-semibold">
          {formatCurrency(currentBalance)}
        </p>
      </CardHeader>
      <CardContent>
        <BalanceChart transactions={transactions} />
      </CardContent>
    </Card>
  );
}

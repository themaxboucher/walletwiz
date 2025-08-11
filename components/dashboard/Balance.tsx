import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import BalanceChart from "./BalanceChart";
import EmptyBalanceChart from "./EmptyBalanceChart";
import { formatCurrency } from "@/lib/utils";
import AmountCountUp from "./AmountCountUp";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

interface ChartDataPoint {
  date: string;
  balance: number;
}

interface BalanceProps {
  totalBalance: number;
  chartData: ChartDataPoint[];
  transactions: Transaction[];
}

export default function Balance({
  totalBalance,
  chartData,
  transactions,
}: BalanceProps) {
  const enoughTransactions = transactions.length >= 3;

  return (
    <Card>
      <CardHeader className="flex justify-between items-start">
        <div className="space-y-2">
          <CardTitle className="text-muted-foreground">Balance</CardTitle>
          <p className="text-3xl tracking-tight font-semibold">
            <AmountCountUp
              amount={totalBalance}
              formattingFn={formatCurrency}
            />
          </p>
        </div>
        {enoughTransactions && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Info className="size-6 text-muted-foreground cursor-pointer" />
            </HoverCardTrigger>
            <HoverCardContent align="end" className="w-80">
              <p className="text-sm leading-relaxed">
                The balance chart reflects your transaction history. It is only
                fully accurate if all of your transactions have been added.
              </p>
            </HoverCardContent>
          </HoverCard>
        )}
      </CardHeader>
      <CardContent>
        {enoughTransactions ? (
          <BalanceChart chartData={chartData} />
        ) : (
          <EmptyBalanceChart />
        )}
      </CardContent>
    </Card>
  );
}

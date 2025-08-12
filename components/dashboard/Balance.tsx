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
  const enoughTransactions = transactions.length >= 5;

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
              <Info className="size-5 text-muted-foreground cursor-pointer" />
            </HoverCardTrigger>
            <HoverCardContent
              align="end"
              className="w-full max-w-68 flex gap-2 py-2 px-3"
            >
              <Info className="size-4 min-w-4 mt-[0.2rem] text-muted-foreground" />
              <p className="text-xs leading-relaxed">
                The chart is fully accurate only if you’ve entered all
                transactions for this period.
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

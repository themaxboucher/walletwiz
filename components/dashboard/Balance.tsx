import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import BalanceChart from "./BalanceChart";
import { formatCurrency } from "@/lib/utils";
import CountUp from "react-countup";

interface ChartDataPoint {
  date: string;
  balance: number;
}

interface BalanceProps {
  totalBalance: number;
  chartData: ChartDataPoint[];
}

export default function Balance({ totalBalance, chartData }: BalanceProps) {
  return (
    <Card>
      <CardHeader className="gap-2">
        <CardTitle className="text-muted-foreground">Balance</CardTitle>
        <p className="text-3xl tracking-tight font-semibold">
          <CountUp
            end={totalBalance}
            duration={1.2}
            separator=","
            decimals={2}
            formattingFn={formatCurrency}
          />
        </p>
      </CardHeader>
      <CardContent>
        <BalanceChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

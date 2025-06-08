import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import BalanceChart from "./BalanceChart";
import { formatCurrency } from "@/lib/utils";

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
      <CardHeader>
        <CardTitle className="text-muted-foreground">Balance</CardTitle>
        <p className="text-2xl font-semibold">{formatCurrency(totalBalance)}</p>
      </CardHeader>
      <CardContent>
        <BalanceChart chartData={chartData} />
      </CardContent>
    </Card>
  );
}

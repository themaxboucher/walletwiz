import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AmountCardProps {
  title: string;
  amount: number;
  percentageChange?: number;
}

export default function AmountCard(props: AmountCardProps) {
  const { title, amount, percentageChange } = props;

  const isPositive = percentageChange !== undefined && percentageChange >= 0;
  const changeColor = isPositive
    ? "text-primary bg-primary/10"
    : "text-destructive bg-destructive/10";

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-muted-foreground text-sm">{title}</CardTitle>
        <div className="flex justify-between items-end gap-2">
          <div className="text-2xl font-semibold">{formatCurrency(amount)}</div>
          {percentageChange !== undefined && (
            <div
              className={cn(
                "flex items-center text-xs font-medium py-[0.125rem] px-1 rounded-sm",
                changeColor
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              {Math.abs(percentageChange).toFixed(2)}%
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

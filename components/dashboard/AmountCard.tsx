import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  BanknoteArrowUp,
  BanknoteArrowDown,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface AmountCardProps {
  title: string;
  amount: number;
  percentageChange?: number;
  periodText: string;
}

const iconMap: Record<string, LucideIcon> = {
  Income: BanknoteArrowUp,
  Expenses: BanknoteArrowDown,
  Saved: PiggyBank,
};

export default function AmountCard({
  title,
  amount,
  percentageChange,
  periodText,
}: AmountCardProps) {
  const isPositiveChange =
    percentageChange !== undefined && percentageChange >= 0;

  let isGoodChange = isPositiveChange;
  if (title === "Expenses") {
    isGoodChange = !isPositiveChange; // For expenses, a positive percentage change means decrease (good), so invert
  }

  const changeColor = isGoodChange
    ? "text-primary bg-primary/10"
    : "text-destructive bg-destructive/10";

  const Icon = iconMap[title];

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-muted-foreground text-sm flex items-center gap-2">
          {Icon && <Icon className="size-4 text-primary" />}
          {title}
        </CardTitle>
        <div className="flex justify-between items-end gap-2">
          <div className="text-2xl font-semibold">{formatCurrency(amount)}</div>
          {percentageChange !== undefined && (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    "flex items-center text-xs font-medium py-[0.125rem] px-1 rounded-sm",
                    changeColor
                  )}
                >
                  {isPositiveChange ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {formatNumber(Math.abs(percentageChange))}%
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-background border border-border text-forground shadow-sm">
                <span className="font-medium">
                  {formatNumber(Math.abs(percentageChange))}%
                </span>{" "}
                {isPositiveChange ? "increase" : "decrease"} vs. last{" "}
                {periodText}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

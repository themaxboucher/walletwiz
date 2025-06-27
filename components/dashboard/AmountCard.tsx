import { formatCurrency } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "../ui/card";
import {
  ArrowUp,
  ArrowDown,
  Banknote,
  BanknoteArrowUp,
  BanknoteArrowDown,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import CountUp from "react-countup";

interface AmountCardProps {
  title: string;
  amount: number;
  percentageChange?: number;
  periodText: string;
}

const iconMap: Record<string, LucideIcon> = {
  Income: BanknoteArrowUp,
  Expenses: BanknoteArrowDown,
  Saved: Banknote,
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
    ? { text: "text-primary", background: "bg-primary/20" }
    : { text: "text-destructive", background: "bg-destructive/20" };

  const Icon = iconMap[title];

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-muted-foreground text-sm flex items-center gap-2">
          {Icon && <Icon className="size-4 text-primary" />}
          {title}
        </CardTitle>
        <div className="flex justify-between items-end gap-2">
          <div className="text-2xl font-semibold">
            <CountUp
              end={amount}
              duration={1.2}
              separator=","
              decimals={2}
              formattingFn={formatCurrency}
            />
          </div>
          {percentageChange !== undefined && (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn("flex gap-1.5 items-center", changeColor.text)}
                >
                  <div
                    className={cn(
                      "flex justify-center items-center py-[0.125rem] rounded-full size-5",
                      changeColor.background
                    )}
                  >
                    {isPositiveChange ? (
                      <ArrowUp className="size-3.5" />
                    ) : (
                      <ArrowDown className="size-3.5" />
                    )}
                  </div>
                  <span className="text-xs font-semibold">
                    {formatNumber(Math.abs(percentageChange))}%
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="text-xs bg-card border border-border text-forground shadow-xs flex gap-1.5">
                <div
                  className={cn(
                    "flex justify-center items-center rounded-full size-3.5 -ml-1.5",
                    changeColor.background,
                    changeColor.text
                  )}
                >
                  {isPositiveChange ? (
                    <ArrowUp className="size-2.5" />
                  ) : (
                    <ArrowDown className="size-2.5" />
                  )}
                </div>
                <div>
                  <span className={cn("font-medium", changeColor.text)}>
                    {formatNumber(Math.abs(percentageChange))}%
                  </span>{" "}
                  {isPositiveChange ? "increase" : "decrease"}
                  <br /> vs. last {periodText}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

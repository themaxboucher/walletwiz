import { formatCurrency, percentageChange } from "@/lib/utils";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import AmountCountUp from "./AmountCountUp";

interface AmountCardProps {
  title: string;
  amount: number;
  previousAmount?: number;
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
  previousAmount,
  periodText,
}: AmountCardProps) {
  const percentChange = previousAmount
    ? percentageChange(amount, previousAmount)
    : undefined;

  const amountChange = previousAmount ? amount - previousAmount : undefined;

  const isPositiveChange = percentChange !== undefined && percentChange >= 0;

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
            <AmountCountUp amount={amount} formattingFn={formatCurrency} />
          </div>
          {percentChange !== undefined && amountChange !== undefined && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div
                  className={cn(
                    "flex gap-1.5 items-center cursor-pointer",
                    changeColor.text
                  )}
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
                    {formatNumber(Math.abs(percentChange))}%
                  </span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                align="center"
                sideOffset={6}
                className="text-xs flex gap-1.5 py-1.5 px-3 w-full shadow-sm"
              >
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
                <div className="-my-[0.08rem]">
                  <span className={cn("font-medium", changeColor.text)}>
                    {formatCurrency(Math.abs(amountChange))}
                  </span>{" "}
                  {isPositiveChange ? "more" : "less"}
                  <br /> than last {periodText}
                </div>
              </HoverCardContent>
            </HoverCard>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

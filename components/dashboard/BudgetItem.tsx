import { Progress } from "../ui/progress";
import { categoryIcons, categoryColors } from "@/constants";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

interface BudgetItemProps {
  category: Category;
  spent: number;
  budget: number;
}

export default function BudgetItem({
  category,
  spent,
  budget,
}: BudgetItemProps) {
  const Icon = categoryIcons[category.iconName];
  const progress = (spent / budget) * 100;
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  return (
    <div className="space-y-2 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && (
            <Icon className={cn("h-4 w-4", categoryColors[category.color])} />
          )}
          <span className="text-sm font-medium">{category.name}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          {formatCurrency(spent)} / {formatCurrency(budget)}
        </div>
      </div>
      <Progress value={progress <= 100 ? progress : 100} className="h-2" />
      <div
        className={cn(
          "flex justify-between text-xs text-muted-foreground",
          isOverBudget && "text-destructive"
        )}
      >
        <span>{progress.toFixed(0)}% spent</span>
        <span className="flex items-center gap-2">
          {!isOverBudget
            ? formatCurrency(remaining)
            : formatCurrency(Math.abs(remaining))}{" "}
          {!isOverBudget ? "remaining" : "over budget"}
          {isOverBudget && <TriangleAlert className="size-3" />}
        </span>
      </div>
    </div>
  );
}

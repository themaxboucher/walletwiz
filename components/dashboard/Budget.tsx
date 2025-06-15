import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { categories } from "@/constants";
import BudgetItem from "./BudgetItem";
import { useMemo } from "react";
import { Separator } from "../ui/separator";
import EmptyState from "./EmptyState";
import { ChartPie } from "lucide-react";

interface BudgetProps {
  transactions: Array<{
    amount: number;
    category: {
      name: string;
    };
  }>;
}

export default function Budget({ transactions }: BudgetProps) {
  // Calculate spent amount for each category
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.amount < 0) {
        // Only count expenses
        const categoryName = tx.category.name;
        spending[categoryName] =
          (spending[categoryName] || 0) + Math.abs(tx.amount);
      }
    });

    return spending;
  }, [transactions]);

  // Filter out income categories and categories without budgets
  const budgetCategories = categories.filter(
    (category) => category.type === "expense" && category.budget
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget</CardTitle>
        <CardDescription>Your spending goals for the month.</CardDescription>
      </CardHeader>
      <div>
        {budgetCategories.length === 0 ? (
          <EmptyState
            icon={<ChartPie className="size-5 text-primary" />}
            title="No budgets set"
            description="Set a budget for your expense categories to start tracking."
            buttonText="Set Budget"
            onAddClick={() => {}}
          />
        ) : (
          budgetCategories.map((category, index) => (
            <div key={category.name}>
              <BudgetItem
                category={category}
                spent={categorySpending[category.name] || 0}
                budget={category.budget || 0}
              />
              {index < budgetCategories.length - 1 && (
                <div className="my-5">
                  <Separator />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

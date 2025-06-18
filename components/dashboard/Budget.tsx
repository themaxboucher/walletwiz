import { Card, CardHeader, CardTitle } from "../ui/card";
import BudgetItem from "./BudgetItem";
import { useMemo, useState } from "react";
import { Separator } from "../ui/separator";
import EmptyState from "./EmptyState";
import { ChartPie } from "lucide-react";
import { MonthSelector } from "./MonthSelector";
import BudgetDialog from "./BudgetDialog";
import { Button } from "../ui/button";

interface BudgetProps {
  transactions: Transaction[];
  categories: Category[];
}

export default function Budget({ transactions, categories }: BudgetProps) {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "short" })
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter transactions for the selected month and year
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      const txMonth = txDate.toLocaleString("default", { month: "short" });
      const txYear = txDate.getFullYear().toString();
      return txMonth === selectedMonth && txYear === selectedYear;
    });
  }, [transactions, selectedMonth, selectedYear]);

  // Calculate spent amount for each category
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};

    filteredTransactions.forEach((tx) => {
      if (tx.amount < 0) {
        // Only count expenses
        const categoryName = tx.category.name;
        spending[categoryName] =
          (spending[categoryName] || 0) + Math.abs(tx.amount);
      }
    });

    return spending;
  }, [filteredTransactions]);

  // Filter out income categories and categories without budgets
  const budgetCategories = categories.filter(
    (category) => category.type === "expense" && category.budget
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Budget</CardTitle>
          <div className="flex items-center gap-2">
            {budgetCategories.length > 0 && (
              <MonthSelector
                value={selectedMonth}
                onValueChange={setSelectedMonth}
                yearValue={selectedYear}
                onYearChange={setSelectedYear}
                transactions={transactions}
              />
            )}
            <Button className="h-9 w-9" onClick={() => setIsDialogOpen(true)}>
              <ChartPie className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <div>
        {budgetCategories.length === 0 ? (
          <EmptyState
            icon={<ChartPie className="size-5 text-primary" />}
            title="No budgets set"
            description="Set a budget for your expense categories to start tracking."
            buttonText="Set Budget"
            onAddClick={() => setIsDialogOpen(true)}
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

      <BudgetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        categories={categories}
      />
    </Card>
  );
}

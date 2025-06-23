import { Card, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import BudgetItem from "../dashboard/BudgetItem";

export default function DisplayBudget() {
  const budgetCategories: Category[] = [
    {
      name: "Groceries",
      color: "blue",
      iconName: "ShoppingCart",
      type: "expense",
      budget: 400,
    },
    {
      name: "Transport",
      color: "violet",
      iconName: "Car",
      type: "expense",
      budget: 120,
    },
    {
      name: "Entertainment",
      color: "orange",
      iconName: "Music",
      type: "expense",
      budget: 150,
    },
  ];

  const categorySpending: Record<string, number> = {
    Groceries: 320,
    Transport: 90,
    Entertainment: 110,
  };

  return (
    <Card className="text-left absolute top-10 left-14 right-14">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Budget</CardTitle>
        </div>
      </CardHeader>
      <div>
        {budgetCategories.map((category, index) => (
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
        ))}
      </div>
    </Card>
  );
}

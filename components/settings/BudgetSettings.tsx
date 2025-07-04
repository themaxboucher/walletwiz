import { defaultCategories } from "@/constants";
import BudgetForm from "./BudgetForm";
import { Separator } from "../ui/separator";

interface BudgetSettingsProps {
  user: User;
}

export default function BudgetSettings({ user }: BudgetSettingsProps) {
  return (
    <div className="h-full">
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-semibold">Budget</h2>
        <p className="text-sm text-muted-foreground">
          Set your monthly budget for each expense category to help track your
          spending.
        </p>
      </div>
      <Separator className="my-4" />

      <BudgetForm user={user} />
    </div>
  );
}

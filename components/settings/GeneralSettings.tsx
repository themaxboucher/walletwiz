import { defaultCategories } from "@/constants";
import { Separator } from "../ui/separator";
import BudgetForm from "../dashboard/BudgetForm";
import CategoriesForm from "./CategoriesForm";

interface GeneralSettingsProps {
  user: User;
}

export default function GeneralSettings({ user }: GeneralSettingsProps) {
  return (
    <div className="h-full mb-6">
      <div className="space-y-0.5 mb-6">
        <h2 className="text-xl font-semibold">General</h2>
        <p className="text-sm text-muted-foreground">
          Configure your account settings, preferences, and privacy options.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <div className="space-y-1 mb-4">
          <h3 className="font-semibold">Categories</h3>
          <p className="text-sm text-muted-foreground">
            Select the categories you want to use for your income and expenses.
          </p>
        </div>
        <CategoriesForm user={user} />
      </div>
      <Separator className="mb-4" />
      <div className="space-y-1">
        <div className="space-y-1 mb-4">
          <h3 className="font-semibold">Budget</h3>
          <p className="text-sm text-muted-foreground">
            Set monthly budgets for your categories to help manage your
            finances.
          </p>
        </div>
        <BudgetForm categories={defaultCategories} onCancel={() => {}} />
      </div>
    </div>
  );
}

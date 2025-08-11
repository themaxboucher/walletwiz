import { categories } from "@/constants";
import CategoryChip from "../settings/CategoryChip";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";

interface CategoriesFormProps {
  user: User;
  onChange?: (selected: Category[]) => void;
  selectedCategories: Category[];
}

export default function CategoriesOnboardingForm({
  onChange,
  selectedCategories,
}: CategoriesFormProps) {
  const [selected, setSelected] = useState<Category[]>(selectedCategories);

  const incomeCategories = categories.filter(
    (c) => c.type === "income" && c.name !== "Other Income"
  );
  const expenseCategories = categories.filter(
    (c) => c.type === "expense" && c.name !== "Other Expense"
  );

  // Notify parent of selection changes after commit
  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  function isSelected(category: Category) {
    return selected.some((c) => c.name === category.name);
  }

  function toggleCategory(category: Category) {
    setSelected((prev) => {
      const nextSelected = isSelected(category)
        ? prev.filter((c) => c.name !== category.name)
        : [...prev, category];
      return nextSelected;
    });
  }

  const selectedIncome = incomeCategories.filter(isSelected);
  const unselectedIncome = incomeCategories.filter((c) => !isSelected(c));
  const selectedExpense = expenseCategories.filter(isSelected);
  const unselectedExpense = expenseCategories.filter((c) => !isSelected(c));

  return (
    <div>
      <Label className="mb-3">Income</Label>
      <div className="flex gap-2 flex-wrap mb-4">
        {selectedIncome.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No income categories selected.
          </p>
        )}
        {selectedIncome.map((category) => (
          <div key={category.name} onClick={() => toggleCategory(category)}>
            <CategoryChip
              iconName={category.iconName}
              color={category.color}
              isSelected={isSelected(category)}
            >
              {category.name}
            </CategoryChip>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {unselectedIncome.map((category) => (
          <div key={category.name} onClick={() => toggleCategory(category)}>
            <CategoryChip
              iconName={category.iconName}
              color={category.color}
              isSelected={isSelected(category)}
            >
              {category.name}
            </CategoryChip>
          </div>
        ))}
      </div>
      <Label className="mb-3">Expenses</Label>
      <div className="flex gap-2 flex-wrap mb-4">
        {selectedExpense.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No expense categories selected.
          </p>
        )}
        {selectedExpense.map((category) => (
          <div key={category.name} onClick={() => toggleCategory(category)}>
            <CategoryChip
              iconName={category.iconName}
              color={category.color}
              isSelected={isSelected(category)}
            >
              {category.name}
            </CategoryChip>
          </div>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap mb-6">
        {unselectedExpense.map((category) => (
          <div key={category.name} onClick={() => toggleCategory(category)}>
            <CategoryChip
              iconName={category.iconName}
              color={category.color}
              isSelected={isSelected(category)}
            >
              {category.name}
            </CategoryChip>
          </div>
        ))}
      </div>
    </div>
  );
}

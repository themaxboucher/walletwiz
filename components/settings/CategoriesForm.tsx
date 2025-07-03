import { categories } from "@/constants";
import { Button } from "../ui/button";
import CategoryChip from "./CategoryChip";
import { useEffect, useState } from "react";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { Label } from "../ui/label";
import {
  getCategories,
  updateCategories,
} from "@/lib/actions/category.actions";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoriesFormProps {
  user: User;
}

export default function CategoriesForm({ user }: CategoriesFormProps) {
  const [selected, setSelected] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialUserCategories, setInitialUserCategories] = useState<
    Category[]
  >([]);
  const router = useRouter();

  const incomeCategories = categories.filter(
    (c) => c.type === "income" && c.name !== "Other Income"
  );
  const expenseCategories = categories.filter(
    (c) => c.type === "expense" && c.name !== "Other Expense"
  );

  useEffect(() => {
    async function fetchUserCategories() {
      if (!user?.$id) return;
      try {
        const userCategories = await getCategories(user.$id);
        setSelected(userCategories);
        setInitialUserCategories(userCategories);
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchUserCategories();
  }, [user]);

  function isSelected(category: Category) {
    return selected.some((c) => c.name === category.name);
  }

  function toggleCategory(category: Category) {
    setSelected((prev) =>
      isSelected(category)
        ? prev.filter((c) => c.name !== category.name)
        : [...prev, category]
    );
  }

  async function handleSave() {
    const selectedIncome = selected.filter((c) => c.type === "income");
    const selectedExpense = selected.filter((c) => c.type === "expense");
    if (selectedIncome.length < 2) {
      toast("Please select at least one income category.", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    }
    if (selectedExpense.length < 4) {
      toast("Please select at least three expense categories.", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    }
    if (selectedIncome.length < 2 || selectedExpense.length < 4) {
      return;
    }
    setLoading(true);
    try {
      const userCategories = await updateCategories(
        user.$id,
        selected,
        initialUserCategories
      );
      setSelected(userCategories);
      setInitialUserCategories(userCategories);
      toast("Categories updated successfully.", {
        icon: <CircleCheck className="text-primary size-5" />,
      });
      router.refresh();
    } catch (error) {
      toast("Error updating categories.", {
        icon: <CircleX className="text-destructive size-5" />,
      });
      console.error("Error updating categories:", error);
    } finally {
      setLoading(false);
    }
  }

  const selectedIncome = incomeCategories.filter(isSelected);
  const unselectedIncome = incomeCategories.filter((c) => !isSelected(c));
  const selectedExpense = expenseCategories.filter(isSelected);
  const unselectedExpense = expenseCategories.filter((c) => !isSelected(c));

  return (
    <div>
      <Label className="mb-3">Income</Label>
      <div className="flex gap-2 flex-wrap mb-4">
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

      <Button className="mb-4" disabled={loading} onClick={handleSave}>
        {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {!loading && "Save changes"}
      </Button>
    </div>
  );
}

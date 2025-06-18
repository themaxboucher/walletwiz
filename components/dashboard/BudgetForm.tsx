"use client";

import { Button } from "../ui/button";
import { NumberField } from "../ui/form-fields/NumberField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { categoryIcons, categoryColors } from "@/constants";
import { updateCategory } from "@/lib/actions/category.actions";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import FormAlert from "../FormAlert";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Define the Zod schema for the budget form
const budgetFormSchema = z.record(
  z
    .union([
      z.number().min(0), // Allow zero
      z.number().positive({ message: "Budget amount must be positive" }),
    ])
    .optional()
);

type BudgetFormData = z.infer<typeof budgetFormSchema>;

interface BudgetFormProps {
  categories: Category[];
  onCancel: () => void;
}

export default function BudgetForm({ categories, onCancel }: BudgetFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Filter expense categories and create default values
  const expenseCategories = categories.filter((cat) => cat.type === "expense");
  const defaultValues = expenseCategories.reduce(
    (acc, cat) => ({
      ...acc,
      [cat.name]: cat.budget || undefined,
    }),
    {}
  );

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  async function onSubmit(values: BudgetFormData) {
    setError(null);
    setLoading(true);

    try {
      // Update each category's budget
      const updatePromises = Object.entries(values).map(
        async ([categoryName, amount]) => {
          const category = categories.find((cat) => cat.name === categoryName);
          if (!category || !category.$id) return;

          // If amount is undefined or 0, set budget to null
          await updateCategory(category.$id, {
            budget:
              amount === undefined || amount === 0
                ? null
                : Number(amount.toFixed(2)),
          });
        }
      );

      await Promise.all(updatePromises);
      router.refresh();
      onCancel();
    } catch (error) {
      console.error("Error saving budgets:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save budgets"
      );
    } finally {
      setLoading(false);
    }
  }

  if (expenseCategories.length === 0) {
    return (
      <FormAlert
        message="No expense categories available. Please add expense categories to set budgets."
        type="info"
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {expenseCategories.map((category) => {
          const Icon = categoryIcons[category.iconName];
          return (
            <div key={category.name} className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-[120px]">
                {Icon && (
                  <Icon
                    className={cn("h-4 w-4", categoryColors[category.color])}
                  />
                )}
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <NumberField
                form={form}
                name={category.name}
                placeholder="0.00"
                step="0.01"
                min={0}
                isCurrency={true}
                className="flex-1"
              />
            </div>
          );
        })}

        {error && <FormAlert message={error} type="error" />}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {!loading && "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

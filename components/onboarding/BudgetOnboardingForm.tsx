"use client";

import { NumberField } from "../ui/form-fields/NumberField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { categoryIcons, categoryColors } from "@/constants";
import { useEffect, useMemo } from "react";
import FormAlert from "../FormAlert";
import { cn, sortCategories } from "@/lib/utils";

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
  onChange?: (values: Record<string, number | undefined>) => void;
}

export default function BudgetForm({ categories, onChange }: BudgetFormProps) {
  const error: string | null = null;

  const sortedCategories = useMemo(
    () => sortCategories(categories),
    [categories]
  );
  const expenseCategories = sortedCategories.filter(
    (cat) => cat.type === "expense"
  );
  const defaultValues = useMemo(
    () =>
      expenseCategories.reduce(
        (acc, cat) => ({
          ...acc,
          [cat.name]: cat.budget || undefined,
        }),
        {} as Record<string, number | undefined>
      ),
    [expenseCategories]
  );

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues,
  });

  // Notify parent state on any change
  useEffect(() => {
    const subscription = form.watch((values) => {
      // values is BudgetFormData
      const mapped: Record<string, number | undefined> = Object.fromEntries(
        Object.entries(values).map(([key, val]) => [key, val])
      );
      onChange?.(mapped);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

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
      <form className="space-y-4">
        {expenseCategories.map((category) => {
          const Icon = categoryIcons[category.iconName];
          return (
            <div key={category.name} className="flex items-center gap-8">
              <div className="flex items-center gap-2 min-w-32 max-w-32">
                {Icon && (
                  <Icon
                    className={cn("h-4 w-4", categoryColors[category.color])}
                  />
                )}
                <span className="text-sm font-medium truncate">
                  {category.name}
                </span>
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
      </form>
    </Form>
  );
}

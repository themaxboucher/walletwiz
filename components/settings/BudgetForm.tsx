"use client";

import { Button } from "../ui/button";
import { NumberField } from "../ui/form-fields/NumberField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import { categoryIcons, categoryColors } from "@/constants";
import { updateCategory, getCategories } from "@/lib/actions/category.actions";
import { LoaderCircle } from "lucide-react";
import { useState, useEffect } from "react";
import FormAlert from "../FormAlert";
import { useRouter } from "next/navigation";
import { cn, sortCategories } from "@/lib/utils";
import { toast } from "sonner";
import { CircleCheck, CircleX } from "lucide-react";

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
  user: User;
}

export default function BudgetForm({ user }: BudgetFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCategories() {
      setFetching(true);
      setError(null);
      try {
        if (!user?.$id) return;
        const userCategories = await getCategories(user.$id);
        const sortedCategories = sortCategories(userCategories);
        setCategories(sortedCategories);
      } catch (e) {
        setError("Failed to fetch categories");
      } finally {
        setFetching(false);
      }
    }
    fetchCategories();
  }, [user]);

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

  // Reset form when categories are fetched
  useEffect(() => {
    if (!fetching) {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetching, categories.length]);

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
      toast("Budget saved successfully", {
        icon: <CircleCheck className="text-primary size-5" />,
      });
      router.refresh();
    } catch (error) {
      console.error("Error saving budgets:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save budgets"
      );
      toast("Error saving budget", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="w-full h-96 flex justify-center items-center text-primary">
        <LoaderCircle className="size-10 animate-spin" />
      </div>
    );
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

        <Button type="submit" disabled={loading} className="mb-6 mt-2">
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!loading && "Save changes"}
        </Button>
      </form>
    </Form>
  );
}

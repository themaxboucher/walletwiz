"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, CircleX, LoaderCircle } from "lucide-react";
import BudgetOnboardingForm from "./BudgetOnboardingForm";
import { useMemo, useState } from "react";
import { updateCategory } from "@/lib/actions/category.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BudgetOnboardingContentProps {
  user: User;
  categories: Category[];
}

export default function BudgetOnboardingContent({
  user,
  categories,
}: BudgetOnboardingContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Record<string, number | undefined>>({});

  const budgetedExpenseCategories = useMemo(
    () =>
      categories.filter(
        (c: Category) =>
          c.type === "expense" &&
          !!(values[c.name] ?? c.budget) &&
          (values[c.name] ?? c.budget)! > 0
      ),
    [categories, values]
  );
  const canFinish = budgetedExpenseCategories.length >= 2;

  async function handleFinish() {
    if (!canFinish || loading) return;
    setLoading(true);
    try {
      const expenseCategories = categories.filter((c) => c.type === "expense");
      const updates = expenseCategories.map(async (cat) => {
        const raw = values[cat.name];
        const amount = raw === undefined ? cat.budget ?? undefined : raw;
        if (amount === undefined) return; // no change and no existing
        if (!cat.$id) return;
        await updateCategory(cat.$id, {
          budget: amount === 0 ? null : Number(amount.toFixed(2)),
        });
      });
      await Promise.all(updates);
      router.push("/dashboard");
    } catch (e) {
      toast("Error saving budget", {
        icon: <CircleX className="text-destructive size-5" />,
      });
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-10 min-h-[28rem] flex flex-col justify-between my-4">
      <div className="flex flex-col items-center text-center gap-1">
        <h1 className="text-2xl font-medium">Set your budget</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set your budget for at least 2 expense categories.
        </p>
      </div>
      <div className="m-auto w-full max-w-md">
        <BudgetOnboardingForm
          user={user}
          categories={categories}
          onChange={setValues}
        />
      </div>

      <div className="flex justify-between items-start gap-3 pt-2">
        <Button asChild variant="outline">
          <Link href="/onboarding/categories">
            <ChevronLeft className="size-4" /> Back
          </Link>
        </Button>

        <Button onClick={handleFinish} disabled={!canFinish || loading}>
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            "Finish"
          )}
        </Button>
      </div>
    </div>
  );
}

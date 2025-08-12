"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, CircleX, LoaderCircle } from "lucide-react";
import CategoriesOnboardingForm from "./CategoriesOnboardingForm";
import { useState } from "react";
import { updateCategories } from "@/lib/actions/category.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CategoriesOnboardingContentProps {
  user: User;
  categories: Category[];
}

export default function CategoriesOnboardingContent({
  user,
  categories,
}: CategoriesOnboardingContentProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const selectedIncome = selectedCategories.filter(
    (c: Category) => c.type === "income"
  );
  const selectedExpense = selectedCategories.filter(
    (c: Category) => c.type === "expense"
  );
  const canContinue = selectedIncome.length >= 3 && selectedExpense.length >= 3;

  async function handleContinue() {
    if (!canContinue || loading) return;
    setLoading(true);
    try {
      await updateCategories(user.$id, selectedCategories, categories);
      router.push("/onboarding/budget");
    } catch (e) {
      // Optionally handle error state
      setLoading(false);
      toast("Error updating categories", {
        icon: <CircleX className="text-destructive size-5" />,
      });
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-8 min-h-[28rem] flex flex-col justify-between my-4">
      <div className="flex flex-col items-center text-center gap-1">
        <h1 className="text-2xl font-medium">Select your categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Choose categories relevant to your income and expenses.
        </p>
      </div>

      <CategoriesOnboardingForm
        user={user}
        onChange={setSelectedCategories}
        selectedCategories={categories}
      />

      <div className="flex justify-between items-start gap-3 pt-2">
        <Button asChild variant="outline">
          <Link href="/onboarding/accounts">
            <ChevronLeft className="size-4" /> Back
          </Link>
        </Button>
        <div className="flex flex-col items-end">
          <Button onClick={handleContinue} disabled={!canContinue || loading}>
            {loading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

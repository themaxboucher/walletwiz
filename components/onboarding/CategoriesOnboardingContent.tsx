"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, CircleX, LoaderCircle } from "lucide-react";
import CategoriesOnboardingForm from "./CategoriesOnboardingForm";
import { useState } from "react";
import { updateCategories } from "@/lib/actions/category.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BlurFade } from "../magicui/blur-fade";

interface CategoriesOnboardingContentProps {
  user: User;
  categories: Category[];
}

const defaultSelectedCategories: Category[] = [
  {
    name: "Salary",
    color: "blue",
    iconName: "Briefcase",
    type: "income",
  },
  {
    name: "Housing",
    color: "red",
    iconName: "Home",
    type: "expense",
  },
  {
    name: "Utilities",
    color: "yellow",
    iconName: "Lightbulb",
    type: "expense",
  },
  {
    name: "Groceries",
    color: "blue",
    iconName: "ShoppingCart",
    type: "expense",
  },
];

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
  // Check if at least 1 income and 3 expense categories are selected.
  // Since 'Other' categories are selected by default, we need to check if there are at least 2 and 4 categories of each type.
  const canContinue = selectedIncome.length >= 2 && selectedExpense.length >= 4;

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
        <BlurFade direction="up" className="space-y-2">
          <h1 className="heading-3">Select your categories</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            How do you want to categorize your transactions?
          </p>
        </BlurFade>
        <div className="flex items-center gap-1.5 mt-6">
          <div className="h-1.5 w-8 bg-primary/20 rounded-full" />
          <div className="h-1.5 w-8 bg-primary rounded-full" />
          <div className="h-1.5 w-8 bg-primary/20 rounded-full" />
        </div>
      </div>

      <BlurFade direction="up" delay={0.2}>
        <CategoriesOnboardingForm
          user={user}
          onChange={setSelectedCategories}
          selectedCategories={
            categories.length > 3
              ? categories
              : [...categories, ...defaultSelectedCategories]
          }
        />
      </BlurFade>

      <div className="flex justify-between items-start gap-3 pt-2">
        <Button asChild variant="outline">
          <Link href="/onboarding/accounts">
            <ChevronLeft className="size-4" /> Back
          </Link>
        </Button>
        <div className="flex flex-col items-end">
          <Button onClick={handleContinue} disabled={!canContinue || loading}>
            {loading ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getCategories } from "@/lib/actions/category.actions";
import BudgetOnboardingContent from "../../../components/onboarding/BudgetOnboardingContent";
import { redirect } from "next/navigation";

export default async function BudgetOnboardingPage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/login");

  const categories = await getCategories(user.$id);

  return <BudgetOnboardingContent user={user} categories={categories} />;
}

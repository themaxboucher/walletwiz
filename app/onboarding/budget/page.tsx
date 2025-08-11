import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getCategories } from "@/lib/actions/category.actions";
import BudgetOnboardingContent from "../../../components/onboarding/BudgetOnboardingContent";

export default async function BudgetOnboardingPage() {
  const user = await getLoggedInUser();
  const categories = await getCategories(user.$id);

  return <BudgetOnboardingContent user={user} categories={categories} />;
}

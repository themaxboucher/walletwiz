import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getCategories } from "@/lib/actions/category.actions";
import CategoriesOnboardingContent from "../../../components/onboarding/CategoriesOnboardingContent";

export default async function CategoriesOnboardingPage() {
  const user = await getLoggedInUser();
  const categories = await getCategories(user.$id);

  return <CategoriesOnboardingContent user={user} categories={categories} />;
}

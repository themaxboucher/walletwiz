export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getCategories } from "@/lib/actions/category.actions";
import CategoriesOnboardingContent from "../../../components/onboarding/CategoriesOnboardingContent";
import { redirect } from "next/navigation";

export default async function CategoriesOnboardingPage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/login");

  const categories = await getCategories(user.$id);

  return <CategoriesOnboardingContent user={user} categories={categories} />;
}

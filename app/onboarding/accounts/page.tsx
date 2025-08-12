export const dynamic = "force-dynamic";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccounts } from "@/lib/actions/account.actions";
import AccountsOnboardingContent from "../../../components/onboarding/AccountsOnboardingContent";
import { redirect } from "next/navigation";

export default async function AccountsOnboardingPage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/login");

  const accounts = await getAccounts(user.$id);

  return <AccountsOnboardingContent user={user} accounts={accounts} />;
}

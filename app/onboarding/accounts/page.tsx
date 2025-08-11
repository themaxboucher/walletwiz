import { getLoggedInUser } from "@/lib/actions/user.actions";
import { getAccounts } from "@/lib/actions/account.actions";
import AccountsOnboardingContent from "../../../components/onboarding/AccountsOnboardingContent";

export default async function AccountsOnboardingPage() {
  const user = await getLoggedInUser();
  const accounts = await getAccounts(user.$id);

  return <AccountsOnboardingContent user={user} accounts={accounts} />;
}

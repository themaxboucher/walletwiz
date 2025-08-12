import Logo from "@/components/Logo";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import AccountMenu from "@/components/dashboard/AccountMenu";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getLoggedInUser();

  // Block routes if user is not logged in
  if (!user) redirect("/login");

  // Redirect to check-email if user is logged in but not verified
  if (user && !user.$emailVerification) redirect("/confirm-email");

  // Block routes if the user has not completed onboarding
  if (user && !user.hasCompletedOnboarding) redirect("/onboarding/accounts");

  return (
    <div className="min-h-screen max-w-full">
      <div className="flex flex-col max-w-full">
        <header className="flex h-14 justify-between items-center gap-4 border-b border-border bg-card px-4 lg:h-[60px] lg:px-6">
          <Logo />
          <AccountMenu user={user} />
        </header>
        <main className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-6 lg:gap-6 lg:px-8 lg:pb-4 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}

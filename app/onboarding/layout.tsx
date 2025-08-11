import Logo from "@/components/Logo";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  // Block routes if user is not logged in
  if (!loggedIn) redirect("/login");

  // Redirect to check-email if user is logged in but not verified
  if (loggedIn && !loggedIn.$emailVerification) redirect("/confirm-email");

  return (
    <>
      <header className="w-full flex justify-center items-center px-8 py-6 absolute">
        <Logo />
      </header>
      <div className="w-full h-screen flex flex-col justify-center items-center gap-6 px-6">
        {children}
      </div>
    </>
  );
}

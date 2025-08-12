import Logo from "@/components/Logo";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Block routes if user is logged in
  const loggedIn = await getLoggedInUser();
  // Only redirect verified users to the dashboard. Allow newly signed-up (unverified) users to stay.
  if (loggedIn?.$emailVerification) redirect("/dashboard");

  return (
    <>
      <header className="w-full flex justify-center items-center px-8 py-6 absolute top-0 left-0 right-0">
        <Logo />
      </header>
      <div className="w-full min-h-screen flex justify-center items-center px-6 py-20">
        {children}
      </div>
    </>
  );
}

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
  if (loggedIn) redirect("/dashboard");

  return (
    <>
      <header className="w-full flex justify-center items-center px-8 py-6 absolute">
        <Logo />
      </header>
      <div className="w-full h-screen flex justify-center items-center px-6">
        {children}
      </div>
    </>
  );
}

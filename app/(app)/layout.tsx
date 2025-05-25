import Logo from "@/components/Logo";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

// Import the new client component
import EmailVerificationDialog from "@/components/auth/EmailVerificationDialog";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Block routes if user is not logged in
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) redirect("/login");

  return (
    <div className="min-h-screen max-w-full">
      <EmailVerificationDialog user={loggedIn} />

      <div className="flex flex-col max-w-full">
        <header className="flex h-14 justify justify-between items-center gap-4 border-b border-border bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Logo />
        </header>
        <main className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-6 lg:gap-6 lg:px-8 lg:pb-4 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}

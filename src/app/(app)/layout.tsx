import Logo from "@/components/logo";
import AccountMenu from "./dashboard/account-menu";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen max-w-full">
      <div className="flex flex-col max-w-full">
        <header className="flex h-14 justify justify-between items-center gap-4 border-b border-border bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Logo />
          <AccountMenu />
        </header>
        <main className="flex flex-1 flex-col gap-4 px-4 pb-4 pt-6 lg:gap-6 lg:px-8 lg:pb-4 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}

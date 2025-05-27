import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

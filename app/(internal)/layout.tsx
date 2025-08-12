import Logo from "@/components/Logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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

import Sidebar from "@/components/sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
}

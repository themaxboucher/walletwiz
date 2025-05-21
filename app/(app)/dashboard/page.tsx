import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold md:text-3xl">Good morning, John</h1>
        <Button>Logout</Button>
      </div>
    </>
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex justify-center items-center h-screen w-full">
      <div className="flex flex-col justify-start items-center gap-4">
        <div className="text-center">
          <h1 className="font-bold text-2xl">404</h1>
          <p>Page not found.</p>
        </div>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </main>
  );
}

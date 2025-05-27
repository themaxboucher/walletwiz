import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex justify-center items-center min-h-screen w-full p-4">
      <div className="flex flex-col justify-start items-center gap-6 max-w-sm text-center">
        <div className="relative w-[280px] h-[180px] sm:w-[424px] sm:h-[256px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src="https://medsia2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGRsZjA4dnY0dXd4ZXp3ZjFwNjlqcWtqdmVuZTlxM29iczhhZW0waiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/g01ZnwAUvutuK8GIQn/giphy.gif"
            alt="John Travolta looking around confused"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-2">
          <h1 className="font-bold text-2xl">404</h1>
          <p className="text-muted-foreground">Looks like you're lost!</p>
        </div>
        <Button asChild size="lg">
          <Link href="/">Take me home</Link>
        </Button>
      </div>
    </main>
  );
}

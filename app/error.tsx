"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { RefreshCw } from "lucide-react";

export default function ErrorPage() {
  return (
    <main className="flex justify-center items-center min-h-screen w-full p-4">
      <div className="flex flex-col justify-start items-center gap-6 max-w-sm text-center">
        <div className="relative w-[280px] h-[180px] sm:w-[424px] sm:h-[256px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDlrenphMnAxYnQ1M2FvOXZ5cjg2aDd0bHJodjd3YWhlbzNtcjUzcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohs81rDuEz9ioJzAA/giphy.gif"
            alt="Angry man smashing computer"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-2">
          <h1 className="font-bold text-2xl">Oops!</h1>
          <p className="text-muted-foreground">Something went wrong.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()} size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Take me home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

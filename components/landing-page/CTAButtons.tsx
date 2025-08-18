import Link from "next/link";
import { Button } from "../ui/button";

export default function CTAButtons({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="mt-8 flex justify-start items-center gap-2 relative">
      <div className="absolute inset-0 w-[40vw] h-20 rounded-full bg-primary/20 dark:bg-primary/10 blur-3xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      {!loggedIn ? (
        <>
          <Button asChild size="lg" className="sm:text-lg sm:py-6 sm:px-10">
            <Link href="/signup">Try WalletWiz — It's free</Link>
          </Button>
        </>
      ) : (
        <Button asChild size="lg" className="sm:text-lg sm:py-6 sm:px-10">
          <Link href="/dashboard">View dashboard</Link>
        </Button>
      )}
    </div>
  );
}

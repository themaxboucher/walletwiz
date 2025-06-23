import Link from "next/link";
import { Button } from "../ui/button";

export default function CTAButtons({ loggedIn }: { loggedIn: boolean }) {
  return (
    <div className="mt-8 flex justify-start items-center gap-2">
      {!loggedIn ? (
        <>
          <Button asChild size="lg">
            <Link href="/signup">Get started — it's free</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            size="lg"
            className="hidden sm:inline-flex"
          >
            <a href="#features">Explore Features</a>
          </Button>
        </>
      ) : (
        <Button asChild size="lg">
          <Link href="/dashboard">View dashboard</Link>
        </Button>
      )}
    </div>
  );
}

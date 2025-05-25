import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Link from "next/link";

export default async function Home() {
  const loggedIn = await getLoggedInUser();

  return (
    <main className="">
      <Navbar />
      <section className="section-large">
        <div className="max-w-lg">
          <h1 className="heading-1">
            The easy way to keep track of your money.
          </h1>
          <p className="mt-4">
            WalletWiz lets you take control of your finances by showing you
            exactly exactly what's happening with your money.
          </p>
          <div className="mt-8 flex justify-start items-center gap-2">
            {!loggedIn ? (
              <>
                <Button asChild>
                  <Link href="/signup">Get started</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/dashboard">View dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="">
      <Navbar />
      <section className="section-large">
        <div className="max-w-lg">
          <h1 className="heading-1">
            Keeping track of your finances doesn't have to be complicated — or
            expensive.
          </h1>
          <p className="mt-4">
            WalletWiz lets you take control of your finances by showing you
            exactly exactly what's happening with your money.
          </p>
          <div className="mt-8 flex justify-start items-center gap-2">
            {!user ? (
              <>
                <Button asChild>
                  <Link href="/auth/signup">Get started</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Log in</Link>
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

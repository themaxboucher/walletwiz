import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <p className="heading-3">WalletWiz</p>
      <ModeToggle />
      <section className="section-large">
        <div>
          <h1 className="heading-1">
            Keeping track of your finances doesn't have to be complicated — or
            expensive.
          </h1>
          <p>
            WalletWiz lets you take control of your finances by showing you
            exactly exactly what's happening with your money.
          </p>
          <Button asChild>
            <Link href="/auth/signup">Get started</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Log in</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { ThemeSelector } from "../ThemeSelector";

interface NavbarProps {
  loggedIn: boolean;
}

export default function Navbar({ loggedIn }: NavbarProps) {
  return (
    <header className="w-full max-w-[87rem] mx-auto flex justify-between items-center px-8 py-4">
      <Logo />
      <ThemeSelector />

      <div className="sm:flex items-center gap-2 hidden">
        {!loggedIn ? (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get started -- it's free</Link>
            </Button>
          </>
        ) : (
          <Button asChild>
            <Link href="/dashboard">View dashboard</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

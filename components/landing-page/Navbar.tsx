import Link from "next/link";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { ThemeSelector } from "../ThemeSelector";

interface NavbarProps {
  loggedIn: boolean;
}

export default function Navbar({ loggedIn }: NavbarProps) {
  return (
    <header className="w-full max-w-[84rem] mx-auto flex justify-between items-center p-5 md:px-8 relative z-10">
      <Logo />
      <div className="sm:flex items-center gap-2 hidden">
        {!loggedIn ? (
          <>
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Try it free</Link>
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

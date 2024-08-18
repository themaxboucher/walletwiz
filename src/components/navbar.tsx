import Link from "next/link";
import Logo from "./logo";
import { ModeToggle } from "./ui/mode-toggle";

export default function Navbar() {
  return (
    <header className="w-full border-b border-border bg-muted/40 flex justify-between items-center px-8 py-4">
      <Logo />

      <ModeToggle />
    </header>
  );
}

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-4">
      <ModeToggle />
      <h1 className="heading-2">WalletWiz</h1>
      <p className="mt-2">
        This is a blob of text to see if my font is working.
      </p>
      <Button variant="default" className="mt-4">
        Get started
      </Button>
    </div>
  );
}

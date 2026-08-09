import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="section-large py-0">
      <div className="w-full py-6 space-y-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 border-t border-border">
        <Logo />
        <div className="text-xs text-muted-foreground">
          © 2026 WalletWiz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

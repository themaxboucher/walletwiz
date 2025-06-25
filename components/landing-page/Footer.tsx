import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="section-large py-0">
      <div className="w-full py-6 space-y-4 flex flex-col sm:flex-row justify-center sm:justify-between items-center sm:items-end gap-2 border-t border-border">
        <div className="flex flex-col items-center sm:items-start gap-2 m-0">
          <Logo />
          <div className="text-xs text-muted-foreground">
            © 2025 WalletWiz. All rights reserved.
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Built with 💚 by{" "}
          <a
            href="https://www.maxboucher.com/"
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Max Boucher
          </a>
        </div>
      </div>
    </footer>
  );
}

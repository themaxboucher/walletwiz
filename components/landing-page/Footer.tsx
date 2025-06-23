import Logo from "../Logo";

export default function Footer() {
  return (
    <footer className="section-large py-0">
      <div className="w-full border-t border-border flex justify-between py-8">
        <div className="flex flex-col gap-2">
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

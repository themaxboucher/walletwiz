import Link from "next/link";
import Image from "next/image";
import InfoBadge from "./InfoBadge";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-[0.4rem]">
      <Image
        src="/walletwiz-logo.svg"
        alt="WalletWiz Logo"
        width={32}
        height={32}
        className="size-8"
      />
      <div className="text-lg font-extrabold">WalletWiz</div>
      <InfoBadge>BETA</InfoBadge>
    </Link>
  );
}

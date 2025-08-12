import Link from "next/link";
import Image from "next/image";
import InfoBadge from "./InfoBadge";
import type { ReactNode } from "react";

type LogoProps = {
  href?: string | null;
};

export default function Logo({ href = "/" }: LogoProps) {
  const content: ReactNode = (
    <>
      <Image
        src="/walletwiz-logo.svg"
        alt="WalletWiz Logo"
        width={32}
        height={32}
        className="size-8"
      />
      <div className="text-lg font-extrabold">WalletWiz</div>
      <InfoBadge>BETA</InfoBadge>
    </>
  );

  if (href === null) {
    return (
      <div className="flex items-center gap-[0.4rem] hover:cursor-default">
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className="flex items-center gap-[0.4rem]">
      {content}
    </Link>
  );
}

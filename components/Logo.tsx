import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex justify-center items-center gap-[0.4rem]">
      <Image
        src="/walletwiz-logo.svg"
        alt="WalletWiz Logo"
        width={32}
        height={32}
        className="h-8 w-8"
      />
      <div className="text-lg font-extrabold">WalletWiz</div>
    </Link>
  );
}

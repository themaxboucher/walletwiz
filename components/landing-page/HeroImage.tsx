"use client";

import Image from "next/image";
import { useTheme } from "next-themes";

export default function HeroImage() {
  const { theme } = useTheme();
  return (
    <Image
      src={
        theme === "light"
          ? "/walletwiz-dashboard-light.png"
          : "/walletwiz-dashboard-dark.png"
      }
      alt="WalletWiz dashboard"
      width={1400}
      height={1000}
      className="rounded-t-xl shadow-2xl border border-b-0 w-full max-w-5xl"
      style={{ objectFit: "cover" }}
      priority
    />
  );
}

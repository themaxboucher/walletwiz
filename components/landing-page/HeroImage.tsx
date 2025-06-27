"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function HeroImage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) {
    // Render a placeholder or nothing until theme is resolved
    return <div style={{ width: "100%", height: 400 }} />;
  }

  return (
    <Image
      src={
        resolvedTheme === "light"
          ? "/walletwiz-dashboard-light.png"
          : "/walletwiz-dashboard-dark.png"
      }
      alt="WalletWiz dashboard"
      width={1400}
      height={1000}
      className="rounded-t-sm md:rounded-t-lg shadow-2xl border border-border border-b-0 w-full max-w-5xl bg-background"
      style={{ objectFit: "cover" }}
      priority
    />
  );
}

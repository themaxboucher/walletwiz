"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroImage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  // Transform scroll progress to image movement
  // As scrollYProgress goes from 0 to 1, y goes from 0 to -100%
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) {
    // Render a placeholder or nothing until theme is resolved
    return <div style={{ width: "100%", height: 400 }} />;
  }

  return (
    <div className="flex flex-col rounded-md sm:rounded-lg shadow border border-border w-[90vw] max-w-5xl bg-background relative z-10 overflow-hidden">
      <div className="h-5 sm:h-9 py-1 sm:py-2 px-2 sm:px-4 border-b border-border flex justify-between items-center bg-card">
        <div className="flex items-center gap-1 sm:gap-1.5 w-[10%] h-full py-0.5 sm:py-1">
          <div className="h-full aspect-square bg-muted rounded-full" />
          <div className="h-full aspect-square bg-muted rounded-full" />
          <div className="h-full aspect-square bg-muted rounded-full" />
        </div>
        <div className="w-[40%] h-full rounded-sm bg-muted flex justify-center items-center"></div>
        <div className="w-[10%]" />
      </div>
      <div className="relative aspect-video overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0">
          <Image
            src={
              resolvedTheme === "light"
                ? "/walletwiz-dashboard-light.png"
                : "/walletwiz-dashboard-dark.png"
            }
            alt="WalletWiz dashboard"
            width={2850}
            height={2658}
            className="absolute inset-0 w-full object-contain"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}

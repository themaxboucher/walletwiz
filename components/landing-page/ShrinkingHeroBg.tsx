"use client";
import { useEffect, useState } from "react";

interface ShrinkingHeroBgProps {
  className?: string;
}

export default function ShrinkingHeroBg({ className }: ShrinkingHeroBgProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Interpolate width from 100vw to 82rem as scrollY goes from 0 to 200px
  const minWidthRem = 82;
  const maxWidthVw = 100;
  const scrollRange = 200;
  const t = Math.min(scrollY / scrollRange, 1);
  const width = `calc(${maxWidthVw}vw - (${maxWidthVw}vw - ${minWidthRem}rem) * ${t})`;

  return (
    <div
      className={`rounded-b-2xl bg-gradient-to-t from-25% from-primary/20 to-transparent overflow-hidden transition-all duration-200 absolute left-1/2 -translate-x-1/2 top-0 h-full pointer-events-none z-0 ${
        className || ""
      }`}
      style={{ width }}
      aria-hidden="true"
    />
  );
}

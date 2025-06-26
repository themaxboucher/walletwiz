"use client";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";

export default function ShrinkingHeroBg() {
  const ref = useRef<HTMLDivElement>(null);

  // Track the scroll progress of the hero section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end 60%"], // End animation at bottom 50% of element
  });

  const rawWidth = useTransform(scrollYProgress, [0, 1], ["86rem", "78rem"]); // TODO: Fix initial width

  // Add springiness to the width
  const width = useSpring(rawWidth, {
    stiffness: 200,
    damping: 30,
    mass: 1,
  });

  const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "1rem"]);

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none z-0">
      <motion.div
        style={{
          width,
          height: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }}
        className="bg-gradient-to-t from-25% from-primary/20 to-transparent overflow-hidden absolute top-0"
        aria-hidden="true"
      />
    </div>
  );
}

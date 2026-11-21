"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DURATION, EASING } from "@/lib/motion";

export interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  children: React.ReactNode;
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  distance = 24,
  className,
  ...props
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: DURATION.section,
        delay,
        ease: EASING.orbit,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

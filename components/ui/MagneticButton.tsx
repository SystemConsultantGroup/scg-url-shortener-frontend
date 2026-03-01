"use client";

import { motion } from "framer-motion";
import gsap from "gsap";
import React, { useRef } from "react";
import type { HTMLMotionProps } from "framer-motion";

interface MagneticButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children"
> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export default function MagneticButton({
  children,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
  ...buttonProps
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return;
    const { clientY } = e;
    const { height, top } = ref.current!.getBoundingClientRect();
    const y = clientY - (top + height / 2);

    gsap.to(ref.current, {
      x: 0,
      y: y * 0.15,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
  };

  const variants = {
    primary: "bg-foreground text-background hover:opacity-90",
    secondary:
      "bg-soft-gray text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700",
    ghost:
      "bg-transparent text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800",
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium transition-colors ${variants[variant]} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${className}`}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}

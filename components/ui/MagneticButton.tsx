'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  variant = 'primary',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientY } = e;
    const { height, top } = ref.current!.getBoundingClientRect();
    const y = clientY - (top + height / 2);

    gsap.to(ref.current, { x: 0, y: y * 0.15, duration: 0.5, ease: 'power3.out' });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
  };

  const variants = {
    primary: 'bg-foreground text-background hover:opacity-90',
    secondary: 'bg-soft-gray text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700',
    ghost: 'bg-transparent text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800',
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative inline-flex cursor-pointer items-center justify-center rounded-full px-8 py-4 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
}

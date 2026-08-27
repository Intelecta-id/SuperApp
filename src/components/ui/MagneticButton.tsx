"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  variant = "primary",
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const variants = {
    primary:
      "bg-white text-black font-semibold hover:bg-zinc-200 border border-white shadow-[0_0_30px_rgba(255,255,255,0.25)]",
    secondary:
      "bg-surface/80 text-white font-medium hover:bg-surface-hover border border-white/15 hover:border-white/40 backdrop-blur-md",
    ghost:
      "bg-transparent text-foreground-secondary hover:text-white border border-transparent hover:border-white/10",
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.1 }}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

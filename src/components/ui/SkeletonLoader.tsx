import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circle" | "card";
  width?: string | number;
  height?: string | number;
}

export const SkeletonLoader: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
}) => {
  const variantStyles = {
    text: "h-4 w-full rounded-sm",
    rectangular: "rounded-md",
    circle: "rounded-full",
    card: "h-64 w-full rounded-md",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white/[0.04] border border-white/[0.06]",
        variantStyles[variant],
        className
      )}
      style={{
        width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
      }}
    >
      {/* Titanium Shimmer Sweep */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
};

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "cyan" | "blue" | "none"; // Map to variant for compatibility
  variant?: "violet" | "zinc" | "none";
}

export function Card({
  children,
  className = "",
  glowColor,
  variant = "zinc",
  ...props
}: CardProps) {
  // Backward compatibility mapping
  let activeVariant = variant;
  if (glowColor) {
    if (glowColor === "cyan") activeVariant = "violet";
    else if (glowColor === "blue") activeVariant = "zinc";
    else activeVariant = "none";
  }

  const borderClasses = {
    violet: "border-zinc-800/60 hover:border-violet-500/30 bg-zinc-900/40 hover:bg-zinc-900/45 shadow-sm",
    zinc: "border-zinc-800/60 hover:border-zinc-750 bg-zinc-900/30 hover:bg-zinc-900/35 shadow-sm",
    none: "border-zinc-900 bg-zinc-950/20",
  };

  return (
    <div
      className={`backdrop-blur-md rounded-xl border p-6 transition-all duration-300 ${borderClasses[activeVariant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}


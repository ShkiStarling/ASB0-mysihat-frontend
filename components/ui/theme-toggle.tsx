"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={toggleTheme}
      className={cn(
        "relative h-10 w-10 rounded-full",
        "transition-colors duration-200",
        "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50",
        className
      )}
    >
      {/* Keep layout stable even before mount */}
      <span className="sr-only">Toggle theme</span>

      {/* Sun (visible in light) */}
      <Sun
        className={cn(
          "absolute inset-0 m-auto size-5",
          "text-amber-400",
          "transition-all duration-300",
          mounted
            ? isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
            : "opacity-100"
        )}
      />

      {/* Moon (visible in dark) */}
      <Moon
        className={cn(
          "absolute inset-0 m-auto size-5",
          "text-violet-400",
          "transition-all duration-300",
          mounted
            ? isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
            : "opacity-0"
        )}
      />
    </Button>
  );
}

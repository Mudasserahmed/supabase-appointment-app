"use client";

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "icon" | "dropdown";
  onClick?: () => void;
}

export default function ThemeToggle({ className, variant = "icon", onClick }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();

  const handleClick = () => {
    toggleTheme();
    onClick?.();
  };

  if (variant === "dropdown") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent rounded-lg transition-colors cursor-pointer",
          className
        )}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-foreground" />
      ) : (
        <Moon className="h-5 w-5 text-foreground" />
      )}
    </button>
  );
}

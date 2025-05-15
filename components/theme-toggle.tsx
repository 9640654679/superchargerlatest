"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative flex items-center justify-center rounded-md p-2 hover:bg-zinc-800/40 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 transition-all text-zinc-900 dark:text-zinc-100" />
      <Moon className="absolute h-5 w-5 transition-all text-zinc-900 dark:text-zinc-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
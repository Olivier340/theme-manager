"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps as NextThemesProviderProps } from "next-themes";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: string;
  attribute?: string;
  enableSystem?: boolean;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "class",
  enableSystem = true,
}: ThemeProviderProps) {
  const nextThemesProps: NextThemesProviderProps = {
    attribute: attribute as NextThemesProviderProps["attribute"],
    defaultTheme,
    enableSystem,
  };

  return (
    <NextThemesProvider {...nextThemesProps}>
      {children}
    </NextThemesProvider>
  );
}


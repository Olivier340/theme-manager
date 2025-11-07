import type { Theme, ThemeParserOptions } from "./theme-types";

const DEFAULT_PREFIX = "theme";

export function formatThemeLabel(id: string): string {
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function parseThemesFromCSS(
  cssContent: string,
  options?: ThemeParserOptions,
): Theme[] {
  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  const themeRegex = new RegExp(`\\.${prefix}-([a-z0-9-]+)\\s*\\{`, "g");
  const matches = cssContent.matchAll(themeRegex);

  const themeIds = new Set<string>();

  for (const match of matches) {
    themeIds.add(match[1]);
  }

  return Array.from(themeIds)
    .sort()
    .map((id) => ({
      id,
      label: formatThemeLabel(id),
    }));
}


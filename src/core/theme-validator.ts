import type { Theme } from "./theme-types";

export function validateThemeId(
  themeId: string,
  availableThemes: Theme[],
): boolean {
  return availableThemes.some((theme) => theme.id === themeId);
}

export function getThemeById(
  themeId: string,
  availableThemes: Theme[],
): Theme | undefined {
  return availableThemes.find((theme) => theme.id === themeId);
}


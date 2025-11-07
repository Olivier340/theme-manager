import { NextResponse } from "next/server";
import { getAvailableThemes } from "./get-available-themes";
import type { ThemeConfig } from "../core/theme-types";

export type ThemeApiRouteOptions = ThemeConfig;

export function createThemeApiRoute(options?: ThemeApiRouteOptions) {
  return async function GET() {
    try {
      const themes = getAvailableThemes(options);
      return NextResponse.json({ themes });
    } catch {
      return NextResponse.json(
        { error: "Failed to get themes" },
        { status: 500 },
      );
    }
  };
}


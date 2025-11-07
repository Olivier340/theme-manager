import fs from "fs";
import path from "path";
import { parseThemesFromCSS } from "../core/theme-parser";
import type { Theme, ThemeConfig } from "../core/theme-types";

function detectFramework(): "nextjs" | "vite" | "unknown" {
  if (typeof window === "undefined") {
    try {
      const packageJsonPath = path.join(process.cwd(), "package.json");
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8"),
        );
        if (packageJson.dependencies?.next || packageJson.devDependencies?.next) {
          return "nextjs";
        }
        if (
          packageJson.dependencies?.vite ||
          packageJson.devDependencies?.vite
        ) {
          return "vite";
        }
      }
    } catch {
      return "unknown";
    }
  }
  return "unknown";
}

function getDefaultCssPath(): string {
  const framework = detectFramework();
  
  if (framework === "nextjs") {
    return path.join(process.cwd(), "app", "globals.css");
  }
  
  if (framework === "vite") {
    const possiblePaths = [
      path.join(process.cwd(), "src", "index.css"),
      path.join(process.cwd(), "src", "main.css"),
      path.join(process.cwd(), "src", "styles.css"),
      path.join(process.cwd(), "src", "globals.css"),
    ];
    
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        return possiblePath;
      }
    }
    
    return possiblePaths[0];
  }
  
  return path.join(process.cwd(), "app", "globals.css");
}

const DEFAULT_FALLBACK_THEMES: Theme[] = [
  { id: "default", label: "Default" },
  { id: "claude", label: "Claude" },
];

export function getAvailableThemes(
  options?: ThemeConfig,
): Theme[] {
  try {
    const cssPath = options?.cssPath ?? getDefaultCssPath();
    const cssContent = fs.readFileSync(cssPath, "utf-8");

    const themes = parseThemesFromCSS(cssContent, {
      prefix: options?.prefix,
    });

    if (themes.length === 0) {
      return options?.fallbackThemes ?? DEFAULT_FALLBACK_THEMES;
    }

    return themes;
  } catch (error) {
    const fallbackThemes =
      options?.fallbackThemes ?? DEFAULT_FALLBACK_THEMES;
    if (error instanceof Error) {
      console.error(
        "Failed to parse themes from CSS:",
        error.message,
      );
    }
    return fallbackThemes;
  }
}

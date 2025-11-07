"use client";
import { parseThemesFromCSS } from "../core/theme-parser";
const DEFAULT_FALLBACK_THEMES = [
    { id: "default", label: "Default" },
    { id: "claude", label: "Claude" },
];
export async function getAvailableThemesClient(options) {
    try {
        let cssContent;
        if (options?.cssContent) {
            cssContent = options.cssContent;
        }
        else {
            const cssPath = options?.cssPath ?? "/index.css";
            const response = await fetch(cssPath);
            if (!response.ok) {
                throw new Error(`Failed to fetch CSS: ${response.statusText}`);
            }
            cssContent = await response.text();
        }
        const themes = parseThemesFromCSS(cssContent, {
            prefix: options?.prefix,
        });
        if (themes.length === 0) {
            return options?.fallbackThemes ?? DEFAULT_FALLBACK_THEMES;
        }
        return themes;
    }
    catch (error) {
        const fallbackThemes = options?.fallbackThemes ?? DEFAULT_FALLBACK_THEMES;
        if (error instanceof Error) {
            console.error("Failed to parse themes from CSS:", error.message);
        }
        return fallbackThemes;
    }
}

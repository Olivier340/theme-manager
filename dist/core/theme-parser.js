const DEFAULT_PREFIX = "theme";
export function formatThemeLabel(id) {
    return id
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
export function parseThemesFromCSS(cssContent, options) {
    const prefix = options?.prefix ?? DEFAULT_PREFIX;
    const themeRegex = new RegExp(`\\.${prefix}-([a-z0-9-]+)\\s*\\{`, "g");
    const matches = cssContent.matchAll(themeRegex);
    const themeIds = new Set();
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

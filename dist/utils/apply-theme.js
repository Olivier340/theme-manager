const DEFAULT_PREFIX = "theme";
export function applyTheme(element, themeId, prefix) {
    const themePrefix = prefix ?? DEFAULT_PREFIX;
    const themeClass = `${themePrefix}-${themeId}`;
    removeTheme(element, prefix);
    element.classList.add(themeClass);
}
export function removeTheme(element, prefix) {
    const themePrefix = prefix ?? DEFAULT_PREFIX;
    const classes = Array.from(element.classList);
    const themeClasses = classes.filter((cls) => cls.startsWith(`${themePrefix}-`));
    for (const cls of themeClasses) {
        element.classList.remove(cls);
    }
}

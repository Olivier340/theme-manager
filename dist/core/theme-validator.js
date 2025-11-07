export function validateThemeId(themeId, availableThemes) {
    return availableThemes.some((theme) => theme.id === themeId);
}
export function getThemeById(themeId, availableThemes) {
    return availableThemes.find((theme) => theme.id === themeId);
}

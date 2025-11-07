export type Theme = {
    id: string;
    label: string;
};
export type ThemeParserOptions = {
    prefix?: string;
};
export type ThemeConfig = {
    cssPath?: string;
    prefix?: string;
    fallbackThemes?: Theme[];
};
export type UseThemesOptions = {
    apiPath?: string;
    staleTime?: number;
};
//# sourceMappingURL=theme-types.d.ts.map
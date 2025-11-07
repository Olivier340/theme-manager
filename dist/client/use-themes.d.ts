import type { Theme, ThemeConfig, UseThemesOptions } from "../core/theme-types";
export type UseThemesOptionsExtended = UseThemesOptions & {
    useClientParser?: boolean;
    clientParserOptions?: ThemeConfig;
};
export declare function useThemes(options?: UseThemesOptionsExtended): import("@tanstack/react-query").UseQueryResult<Theme[], Error>;
//# sourceMappingURL=use-themes.d.ts.map
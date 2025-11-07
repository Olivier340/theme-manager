import type { ReactNode } from "react";
type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: string;
    attribute?: string;
    enableSystem?: boolean;
};
export declare function ThemeProvider({ children, defaultTheme, attribute, enableSystem, }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=theme-provider.d.ts.map
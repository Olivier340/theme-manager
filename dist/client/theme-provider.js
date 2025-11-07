"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeProvider as NextThemesProvider } from "next-themes";
export function ThemeProvider({ children, defaultTheme = "system", attribute = "class", enableSystem = true, }) {
    const nextThemesProps = {
        attribute: attribute,
        defaultTheme,
        enableSystem,
    };
    return (_jsx(NextThemesProvider, { ...nextThemesProps, children: children }));
}

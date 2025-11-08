"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { useThemes } from "./use-themes";
import { applyTheme } from "../utils/apply-theme";
export function BrandingPage({ currentTheme, onThemeChange, components, title = "Branding", description = "Manage the theme for your application.", cardTitle = "Theme Settings", cardDescription = "Choose a theme that will be applied across your application.", colorModeLabel = "Color Mode", themeSelectLabel = "Select Theme", loadingText = "Loading themes...", successMessage, errorMessage, apiPath, icons, }) {
    // Charger depuis localStorage si currentTheme n'est pas fourni
    const getInitialTheme = () => {
        if (currentTheme)
            return currentTheme;
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("selectedTheme");
            return savedTheme || "default";
        }
        return "default";
    };
    const [selectedTheme, setSelectedTheme] = useState(getInitialTheme);
    const { data: availableThemes = [], isLoading } = useThemes(apiPath ? { apiPath } : undefined);
    const { theme: currentColorTheme, setTheme: setColorTheme, resolvedTheme } = useTheme();
    const preservedThemeRef = useRef(null);
    useEffect(() => {
        if (currentColorTheme) {
            preservedThemeRef.current = currentColorTheme;
        }
    }, [currentColorTheme]);
    // Appliquer le thème au chargement depuis localStorage
    useEffect(() => {
        if (typeof window !== "undefined" && !isLoading && selectedTheme) {
            applyTheme(document.body, selectedTheme);
        }
    }, [isLoading, selectedTheme]);
    const handleThemeChange = async (themeId) => {
        setSelectedTheme(themeId);
        try {
            // Appliquer le thème immédiatement
            if (typeof window !== "undefined") {
                applyTheme(document.body, themeId);
                // Stocker le thème personnalisé dans localStorage
                localStorage.setItem("selectedTheme", themeId);
            }
            await onThemeChange(themeId);
            // Stocker le mode couleur (déjà fait par next-themes, mais on le préserve ici aussi)
            const themeToPreserve = preservedThemeRef.current ?? currentColorTheme;
            if (themeToPreserve && typeof window !== "undefined") {
                localStorage.setItem("theme", themeToPreserve);
            }
        }
        catch (error) {
            console.error("Failed to update theme:", error);
        }
    };
    const { Card, CardHeader, CardTitle, CardDescription, CardContent, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Typography, Button, } = components;
    const SunMediumIcon = icons?.SunMedium;
    const MoonIcon = icons?.Moon;
    const MonitorIcon = icons?.Monitor;
    if (isLoading) {
        return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: title }), _jsx("p", { className: "text-muted-foreground", children: description })] }), _jsx(Card, { children: _jsx(CardContent, { className: "flex items-center justify-center py-8", children: Typography ? (_jsx(Typography, { variant: "muted", children: loadingText })) : (_jsx("p", { className: "text-muted-foreground", children: loadingText })) }) })] }));
    }
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: title }), _jsx("p", { className: "text-muted-foreground", children: description })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: cardTitle }), _jsx(CardDescription, { children: cardDescription })] }), _jsxs(CardContent, { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-col gap-2", children: [Typography ? (_jsx(Typography, { variant: "small", className: "font-medium", children: colorModeLabel })) : (_jsx("label", { className: "text-sm font-medium", children: colorModeLabel })), _jsx("div", { className: "flex gap-2", children: Button ? (_jsxs(_Fragment, { children: [_jsxs(Button, { type: "button", onClick: () => setColorTheme("light"), className: `flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${currentColorTheme === "light"
                                                                ? "border-primary bg-accent"
                                                                : ""}`, children: [SunMediumIcon && _jsx(SunMediumIcon, { className: "size-4" }), _jsx("span", { children: "Light" })] }), _jsxs(Button, { type: "button", onClick: () => setColorTheme("dark"), className: `flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${currentColorTheme === "dark"
                                                                ? "border-primary bg-accent"
                                                                : ""}`, children: [MoonIcon && _jsx(MoonIcon, { className: "size-4" }), _jsx("span", { children: "Dark" })] }), _jsxs(Button, { type: "button", onClick: () => setColorTheme("system"), className: `flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${currentColorTheme === "system" ||
                                                                (!currentColorTheme && !resolvedTheme)
                                                                ? "border-primary bg-accent"
                                                                : ""}`, children: [MonitorIcon && _jsx(MonitorIcon, { className: "size-4" }), _jsx("span", { children: "System" })] })] })) : (_jsxs(_Fragment, { children: [_jsxs("button", { type: "button", onClick: () => setColorTheme("light"), className: `flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${currentColorTheme === "light"
                                                                ? "border-primary bg-accent"
                                                                : ""}`, children: [SunMediumIcon && _jsx(SunMediumIcon, { className: "size-4" }), _jsx("span", { children: "Light" })] }), _jsxs("button", { type: "button", onClick: () => setColorTheme("dark"), className: `flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${currentColorTheme === "dark"
                                                                ? "border-primary bg-accent"
                                                                : ""}`, children: [MoonIcon && _jsx(MoonIcon, { className: "size-4" }), _jsx("span", { children: "Dark" })] }), _jsxs("button", { type: "button", onClick: () => setColorTheme("system"), className: `flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${currentColorTheme === "system" ||
                                                                (!currentColorTheme && !resolvedTheme)
                                                                ? "border-primary bg-accent"
                                                                : ""}`, children: [MonitorIcon && _jsx(MonitorIcon, { className: "size-4" }), _jsx("span", { children: "System" })] })] })) })] }), _jsxs("div", { className: "flex flex-col gap-2", children: [Typography ? (_jsx(Typography, { variant: "small", className: "font-medium", children: themeSelectLabel })) : (_jsx("label", { className: "text-sm font-medium", children: themeSelectLabel })), _jsxs(Select, { value: selectedTheme, onValueChange: handleThemeChange, children: [_jsx(SelectTrigger, { className: "w-full", children: _jsx(SelectValue, { placeholder: "Choose a theme" }) }), _jsx(SelectContent, { children: availableThemes.map((theme) => (_jsx(SelectItem, { value: theme.id, children: theme.label }, theme.id))) })] })] })] }), _jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: availableThemes.map((theme) => (_jsx(ThemePreview, { theme: theme, isSelected: selectedTheme === theme.id, onClick: () => handleThemeChange(theme.id), Card: Card, CardContent: CardContent, Typography: Typography }, theme.id))) })] })] })] }));
}
function ThemePreview({ theme, isSelected, onClick, Card, CardContent, Typography, }) {
    return (_jsx(Card, { className: `cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-primary ring-2" : ""}`, onClick: onClick, children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: `theme-${theme.id} bg-background rounded-lg border p-4`, children: [_jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "bg-primary h-3 w-3/4 rounded" }), _jsx("div", { className: "bg-secondary h-2 w-1/2 rounded" }), _jsx("div", { className: "bg-muted h-2 w-2/3 rounded" })] }), _jsxs("div", { className: "text-foreground mt-3 flex items-center justify-between", children: [Typography ? (_jsx(Typography, { variant: "small", className: "font-medium", children: theme.label })) : (_jsx("span", { className: "text-sm font-medium", children: theme.label })), isSelected && (_jsx("div", { className: "bg-primary h-2 w-2 rounded-full" }))] })] }) }) }));
}

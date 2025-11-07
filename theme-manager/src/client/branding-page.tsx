"use client";

import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import type { Theme } from "../core/theme-types";
import { useThemes } from "./use-themes";

export type BrandingPageComponents = {
  Card: React.ComponentType<{
    children: ReactNode;
    className?: string;
    onClick?: () => void;
  }>;
  CardHeader: React.ComponentType<{ children: ReactNode; className?: string }>;
  CardTitle: React.ComponentType<{ children: ReactNode; className?: string }>;
  CardDescription: React.ComponentType<{
    children: ReactNode;
    className?: string;
  }>;
  CardContent: React.ComponentType<{
    children: ReactNode;
    className?: string;
  }>;
  Select: React.ComponentType<{
    value: string;
    onValueChange: (value: string) => void;
    children: ReactNode;
  }>;
  SelectTrigger: React.ComponentType<{
    children: ReactNode;
    className?: string;
  }>;
  SelectValue: React.ComponentType<{ placeholder?: string }>;
  SelectContent: React.ComponentType<{ children: ReactNode }>;
  SelectItem: React.ComponentType<{
    value: string;
    children: ReactNode;
  }>;
  Typography?: React.ComponentType<{
    variant?: string;
    className?: string;
    children: ReactNode;
  }>;
  Button?: React.ComponentType<{
    onClick?: () => void;
    className?: string;
    children: ReactNode;
    type?: "button" | "submit" | "reset";
  }>;
};

export type BrandingPageProps = {
  currentTheme: string;
  onThemeChange: (themeId: string) => Promise<void> | void;
  components: BrandingPageComponents;
  title?: string;
  description?: string;
  cardTitle?: string;
  cardDescription?: string;
  colorModeLabel?: string;
  themeSelectLabel?: string;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
  apiPath?: string;
  icons?: {
    SunMedium?: React.ComponentType<{ className?: string }>;
    Moon?: React.ComponentType<{ className?: string }>;
    Monitor?: React.ComponentType<{ className?: string }>;
  };
};

export function BrandingPage({
  currentTheme,
  onThemeChange,
  components,
  title = "Branding",
  description = "Manage the theme for your application.",
  cardTitle = "Theme Settings",
  cardDescription = "Choose a theme that will be applied across your application.",
  colorModeLabel = "Color Mode",
  themeSelectLabel = "Select Theme",
  loadingText = "Loading themes...",
  successMessage,
  errorMessage,
  apiPath,
  icons,
}: BrandingPageProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const { data: availableThemes = [], isLoading } = useThemes(
    apiPath ? { apiPath } : undefined
  );
  const { theme: currentColorTheme, setTheme: setColorTheme, resolvedTheme } =
    useTheme();
  const preservedThemeRef = useRef<string | null>(null);

  useEffect(() => {
    if (currentColorTheme) {
      preservedThemeRef.current = currentColorTheme;
    }
  }, [currentColorTheme]);

  const handleThemeChange = async (themeId: string) => {
    setSelectedTheme(themeId);
    try {
      await onThemeChange(themeId);
      const themeToPreserve =
        preservedThemeRef.current ?? currentColorTheme;
      if (themeToPreserve && typeof window !== "undefined") {
        localStorage.setItem("theme", themeToPreserve);
      }
    } catch (error) {
      console.error("Failed to update theme:", error);
    }
  };

  const {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
    Typography,
    Button,
  } = components;

  const SunMediumIcon = icons?.SunMedium;
  const MoonIcon = icons?.Moon;
  const MonitorIcon = icons?.Monitor;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-8">
            {Typography ? (
              <Typography variant="muted">{loadingText}</Typography>
            ) : (
              <p className="text-muted-foreground">{loadingText}</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>{cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {Typography ? (
                <Typography variant="small" className="font-medium">
                  {colorModeLabel}
                </Typography>
              ) : (
                <label className="text-sm font-medium">{colorModeLabel}</label>
              )}
              <div className="flex gap-2">
                {Button ? (
                  <>
                    <Button
                      type="button"
                      onClick={() => setColorTheme("light")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${
                        currentColorTheme === "light"
                          ? "border-primary bg-accent"
                          : ""
                      }`}
                    >
                      {SunMediumIcon && <SunMediumIcon className="size-4" />}
                      <span>Light</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setColorTheme("dark")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${
                        currentColorTheme === "dark"
                          ? "border-primary bg-accent"
                          : ""
                      }`}
                    >
                      {MoonIcon && <MoonIcon className="size-4" />}
                      <span>Dark</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setColorTheme("system")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${
                        currentColorTheme === "system" ||
                        (!currentColorTheme && !resolvedTheme)
                          ? "border-primary bg-accent"
                          : ""
                      }`}
                    >
                      {MonitorIcon && <MonitorIcon className="size-4" />}
                      <span>System</span>
                    </Button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setColorTheme("light")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${
                        currentColorTheme === "light"
                          ? "border-primary bg-accent"
                          : ""
                      }`}
                    >
                      {SunMediumIcon && <SunMediumIcon className="size-4" />}
                      <span>Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorTheme("dark")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${
                        currentColorTheme === "dark"
                          ? "border-primary bg-accent"
                          : ""
                      }`}
                    >
                      {MoonIcon && <MoonIcon className="size-4" />}
                      <span>Dark</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setColorTheme("system")}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md border p-3 transition-all hover:bg-accent ${
                        currentColorTheme === "system" ||
                        (!currentColorTheme && !resolvedTheme)
                          ? "border-primary bg-accent"
                          : ""
                      }`}
                    >
                      {MonitorIcon && <MonitorIcon className="size-4" />}
                      <span>System</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {Typography ? (
                <Typography variant="small" className="font-medium">
                  {themeSelectLabel}
                </Typography>
              ) : (
                <label className="text-sm font-medium">{themeSelectLabel}</label>
              )}
              <Select value={selectedTheme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a theme" />
                </SelectTrigger>
                <SelectContent>
                  {availableThemes.map((theme) => (
                    <SelectItem key={theme.id} value={theme.id}>
                      {theme.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availableThemes.map((theme) => (
              <ThemePreview
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme === theme.id}
                onClick={() => handleThemeChange(theme.id)}
                Card={Card}
                CardContent={CardContent}
                Typography={Typography}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type ThemePreviewProps = {
  theme: Theme;
  isSelected: boolean;
  onClick: () => void;
  Card: React.ComponentType<{
    children: ReactNode;
    className?: string;
    onClick?: () => void;
  }>;
  CardContent: React.ComponentType<{
    children: ReactNode;
    className?: string;
  }>;
  Typography?: React.ComponentType<{
    variant?: string;
    className?: string;
    children: ReactNode;
  }>;
};

function ThemePreview({
  theme,
  isSelected,
  onClick,
  Card,
  CardContent,
  Typography,
}: ThemePreviewProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-primary ring-2" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div
          className={`theme-${theme.id} bg-background rounded-lg border p-4`}
        >
          <div className="space-y-2">
            <div className="bg-primary h-3 w-3/4 rounded"></div>
            <div className="bg-secondary h-2 w-1/2 rounded"></div>
            <div className="bg-muted h-2 w-2/3 rounded"></div>
          </div>
          <div className="text-foreground mt-3 flex items-center justify-between">
            {Typography ? (
              <Typography variant="small" className="font-medium">
                {theme.label}
              </Typography>
            ) : (
              <span className="text-sm font-medium">{theme.label}</span>
            )}
            {isSelected && (
              <div className="bg-primary h-2 w-2 rounded-full"></div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


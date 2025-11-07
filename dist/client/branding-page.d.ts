import type { ReactNode } from "react";
export type BrandingPageComponents = {
    Card: React.ComponentType<{
        children: ReactNode;
        className?: string;
        onClick?: () => void;
    }>;
    CardHeader: React.ComponentType<{
        children: ReactNode;
        className?: string;
    }>;
    CardTitle: React.ComponentType<{
        children: ReactNode;
        className?: string;
    }>;
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
    SelectValue: React.ComponentType<{
        placeholder?: string;
    }>;
    SelectContent: React.ComponentType<{
        children: ReactNode;
    }>;
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
        SunMedium?: React.ComponentType<{
            className?: string;
        }>;
        Moon?: React.ComponentType<{
            className?: string;
        }>;
        Monitor?: React.ComponentType<{
            className?: string;
        }>;
    };
};
export declare function BrandingPage({ currentTheme, onThemeChange, components, title, description, cardTitle, cardDescription, colorModeLabel, themeSelectLabel, loadingText, successMessage, errorMessage, apiPath, icons, }: BrandingPageProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=branding-page.d.ts.map
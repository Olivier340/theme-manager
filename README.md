# @ogasphere/theme-manager

A reusable theme management package for Next.js and Vite applications. Automatically discovers themes from CSS files and provides utilities for theme management.

## Features

- Automatic theme discovery from CSS files
- Type-safe theme management
- React hooks for client-side usage
- Server-side functions for Next.js
- Client-side parser for Vite
- CLI tool for adding new themes
- Framework-agnostic core logic
- Framework auto-detection (Next.js / Vite)
- **Ready-to-use branding page component**
- **Base theme CSS styles included**

## Installation

```bash
pnpm add @ogasphere/theme-manager
```

## 🤖 Prompt pour IDE (Cursor / Claude Code)

Copiez ce prompt dans votre IDE pour une intégration automatique complète :

```
Intègre le package @ogasphere/theme-manager dans ce projet. 

CONTEXTE:
- Framework: [Next.js ou Vite - détecte automatiquement]
- Type de projet: [nouveau projet ou projet existant - détecte automatiquement]
- Package: @ogasphere/theme-manager (github:Olivier340/theme-manager)

TÂCHES À EFFECTUER:

1. INSTALLATION:
   - Installer le package: pnpm add github:Olivier340/theme-manager
   - Installer les dépendances nécessaires si manquantes: lucide-react, @radix-ui/react-select (si shadcn/ui utilisé)

2. INTÉGRATION CSS:
   - Détecter le fichier CSS global (app/globals.css, src/index.css, src/globals.css, etc.)
   - Ajouter l'import: @import "@ogasphere/theme-manager/styles/themes.css";
   - Placer l'import après les imports Tailwind si présents

3. CONFIGURATION THEME PROVIDER (Next.js uniquement):
   - Créer ou modifier app/providers.tsx (ou app/layout.tsx)
   - Importer ThemeProvider depuis "@ogasphere/theme-manager/client"
   - Envelopper l'application avec ThemeProvider
   - Configurer defaultTheme="system" et enableSystem

4. API ROUTE (Next.js uniquement):
   - Créer app/api/themes/route.ts
   - Importer getAvailableThemes depuis "@ogasphere/theme-manager/server"
   - Créer un endpoint GET qui retourne { themes } en JSON
   - Gérer les erreurs avec NextResponse

5. PAGE BRANDING:
   - Créer app/branding/page.tsx (Next.js) ou src/pages/branding.tsx (Vite)
   - Importer BrandingPage depuis "@ogasphere/theme-manager/client"
   - Importer les composants UI nécessaires (Card, Select, etc. depuis shadcn/ui ou équivalent)
   - Importer les icônes depuis lucide-react (SunMedium, Moon, Monitor)
   - Créer la logique handleThemeChange qui:
     * Applique le thème au body avec applyTheme depuis "@ogasphere/theme-manager/utils"
     * Sauvegarde dans localStorage
   - Restaurer le thème au chargement depuis localStorage
   - Passer tous les props nécessaires à BrandingPage (currentTheme, onThemeChange, components, icons)

6. APPLICATION DU THÈME GLOBALEMENT:
   - Créer un composant ThemeInitializer ou intégrer dans le layout
   - Utiliser useEffect pour appliquer le thème sauvegardé au chargement
   - Appliquer le thème au document.body avec applyTheme

7. VÉRIFICATIONS:
   - Vérifier que tous les imports sont corrects
   - Vérifier que les composants UI requis sont disponibles
   - S'assurer que le CSS est bien importé
   - Tester que la page branding est accessible

IMPORTANT:
- Adapter le code selon le framework détecté (Next.js vs Vite)
- Utiliser les chemins corrects selon la structure du projet
- Si shadcn/ui n'est pas installé, proposer une alternative ou installer les composants nécessaires
- Créer tous les fichiers manquants
- Ne pas modifier les fichiers existants de manière destructive
- Documenter les changements effectués
```

## Quick Start

### 1. Import Base Theme Styles

Import the base theme CSS in your global stylesheet:

```css
/* app/globals.css or styles/globals.css */
@import "@ogasphere/theme-manager/styles/themes.css";
```

Or in your main CSS file:

```css
@import "tailwindcss";
@import "@ogasphere/theme-manager/styles/themes.css";
```

### 2. Use the Branding Page Component

```typescript
"use client";

import { BrandingPage } from "@ogasphere/theme-manager/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Moon, SunMedium } from "lucide-react";

export function MyBrandingPage() {
  const handleThemeChange = async (themeId: string) => {
    // Your theme update logic here
    await updateTheme(themeId);
  };

  return (
    <BrandingPage
      currentTheme="default"
      onThemeChange={handleThemeChange}
      components={{
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
      }}
      icons={{
        SunMedium,
        Moon,
        Monitor,
      }}
    />
  );
}
```

## Usage

### Next.js Setup

#### 1. Server-side: Get Available Themes

```typescript
import { getAvailableThemes } from "@ogasphere/theme-manager/server";

const themes = getAvailableThemes();
```

#### 2. API Route (Next.js)

```typescript
// app/api/themes/route.ts
import { getAvailableThemes } from "@ogasphere/theme-manager/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const themes = getAvailableThemes();
    return NextResponse.json({ themes });
  } catch {
    return NextResponse.json(
      { error: "Failed to get themes" },
      { status: 500 },
    );
  }
}
```

#### 3. Client-side: Use Themes Hook

```typescript
"use client";

import { useThemes } from "@ogasphere/theme-manager/client";

export function ThemeSelector() {
  const { data: themes, isLoading } = useThemes();

  if (isLoading) return <div>Loading themes...</div>;

  return (
    <select>
      {themes?.map((theme) => (
        <option key={theme.id} value={theme.id}>
          {theme.label}
        </option>
      ))}
    </select>
  );
}
```

#### 4. Apply Theme to Element

```typescript
import { applyTheme } from "@ogasphere/theme-manager/utils";

const element = document.body;
applyTheme(element, "modern-minimal");
```

### Branding Page Component

The package includes a ready-to-use `BrandingPage` component that provides a complete UI for theme selection and color mode switching.

#### Basic Usage

```typescript
"use client";

import { BrandingPage } from "@ogasphere/theme-manager/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Moon, SunMedium } from "lucide-react";

export function MyBrandingPage() {
  const handleThemeChange = async (themeId: string) => {
    // Your theme update logic here
    await updateTheme(themeId);
  };

  return (
    <BrandingPage
      currentTheme="default"
      onThemeChange={handleThemeChange}
      components={{
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
      }}
      icons={{
        SunMedium,
        Moon,
        Monitor,
      }}
    />
  );
}
```

#### Customization

You can customize all text labels and messages:

```typescript
<BrandingPage
  currentTheme="default"
  onThemeChange={handleThemeChange}
  components={components}
  icons={icons}
  title="Custom Branding"
  description="Customize your application theme"
  cardTitle="Theme Settings"
  cardDescription="Choose a theme"
  colorModeLabel="Color Mode"
  themeSelectLabel="Select Theme"
  loadingText="Loading..."
  successMessage="Theme updated!"
  errorMessage="Failed to update theme"
  apiPath="/api/themes"
/>
```

#### Props

- `currentTheme`: The currently selected theme ID
- `onThemeChange`: Callback function called when theme changes
- `components`: Object containing your UI components (Card, Select, etc.)
- `icons`: Optional object with icon components (SunMedium, Moon, Monitor)
- `title`: Page title (default: "Branding")
- `description`: Page description
- `cardTitle`: Card title
- `cardDescription`: Card description
- `colorModeLabel`: Label for color mode section
- `themeSelectLabel`: Label for theme select
- `loadingText`: Loading message
- `successMessage`: Success toast message
- `errorMessage`: Error toast message
- `apiPath`: Custom API path for fetching themes (default: "/api/themes")

### CSS Theme Styles

The package includes base theme CSS styles. Import them in your global stylesheet:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@ogasphere/theme-manager/styles/themes.css";
```

The CSS file includes:
- Base theme variables for the default theme
- Dark mode variants
- Support for custom themes (add your own `.theme-{id}` classes)

### Advanced Configuration

#### Custom CSS Path

```typescript
import { getAvailableThemes } from "@ogasphere/theme-manager/server";

const themes = getAvailableThemes({
  cssPath: path.join(process.cwd(), "styles", "themes.css"),
  prefix: "custom-theme",
  fallbackThemes: [
    { id: "default", label: "Default" },
  ],
});
```

#### Custom API Path

```typescript
import { useThemes } from "@ogasphere/theme-manager/client";

const { data: themes } = useThemes({
  apiPath: "/api/custom/themes",
  staleTime: 10 * 60 * 1000, // 10 minutes
});
```

### Vite Setup

#### 1. Client-side: Parse Themes Directly

```typescript
"use client";

import { useThemes } from "@ogasphere/theme-manager/client";

export function ThemeSelector() {
  const { data: themes, isLoading } = useThemes({
    useClientParser: true,
    clientParserOptions: {
      cssPath: "/src/index.css", // Path to your CSS file
    },
  });

  if (isLoading) return <div>Loading themes...</div>;

  return (
    <select>
      {themes?.map((theme) => (
        <option key={theme.id} value={theme.id}>
          {theme.label}
        </option>
      ))}
    </select>
  );
}
```

#### 2. Alternative: Use Client Parser Directly

```typescript
"use client";

import { getAvailableThemesClient } from "@ogasphere/theme-manager/client";

async function loadThemes() {
  const themes = await getAvailableThemesClient({
    cssPath: "/index.css", // Public path or use cssContent option
  });
  return themes;
}
```

**Note:** For Vite, you can also import CSS as text and pass it directly:

```typescript
import cssContent from "./index.css?raw";
import { getAvailableThemesClient } from "@ogasphere/theme-manager/client";

const themes = await getAvailableThemesClient({
  cssContent, // Pass CSS content directly
});
```

#### 3. Vite API Route (if using a backend)

If you're using Vite with a backend API, you can create an API endpoint:

```typescript
// src/api/themes.ts or your API route handler
import { getAvailableThemes } from "@ogasphere/theme-manager/server";

export async function getThemes() {
  return getAvailableThemes({
    cssPath: path.join(process.cwd(), "src", "index.css"),
  });
}
```

**Note:** For Vite projects, the package automatically detects the framework and uses appropriate default paths:

- `src/index.css`
- `src/main.css`
- `src/styles.css`
- `src/globals.css`

### Adding New Themes

Use the CLI tool to add new Shadcn themes:

```bash
pnpm theme-manager-add <theme-name> <theme-url> [css-path]
```

Example:

```bash
pnpm theme-manager-add modern-minimal https://tweakcn.com/r/themes/modern-minimal.json
```

### Theme Provider

The package includes a theme provider that wraps `next-themes`:

```typescript
"use client";

import { ThemeProvider } from "@ogasphere/theme-manager/client";

export function Providers({ children }) {
  return (
    <ThemeProvider defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

## API Reference

### Core

#### `parseThemesFromCSS(cssContent: string, options?: ThemeParserOptions): Theme[]`

Parse CSS content to extract theme classes.

#### `formatThemeLabel(id: string): string`

Convert theme ID to human-readable label (e.g., "modern-minimal" → "Modern Minimal").

#### `validateThemeId(themeId: string, availableThemes: Theme[]): boolean`

Validate if a theme ID exists in the available themes.

#### `getThemeById(themeId: string, availableThemes: Theme[]): Theme | undefined`

Get a theme by its ID.

### Server

#### `getAvailableThemes(options?: ThemeConfig): Theme[]`

Get all available themes from CSS file. Returns fallback themes if parsing fails.

### Client

#### `useThemes(options?: UseThemesOptions)`

React hook that fetches themes from API using TanStack Query.

#### `ThemeProvider`

React component that wraps `next-themes` ThemeProvider.

### Utils

#### `applyTheme(element: HTMLElement, themeId: string, prefix?: string): void`

Apply a theme class to an HTML element.

#### `removeTheme(element: HTMLElement, prefix?: string): void`

Remove all theme classes from an HTML element.

## Types

```typescript
type Theme = {
  id: string;
  label: string;
};

type ThemeConfig = {
  cssPath?: string;
  prefix?: string;
  fallbackThemes?: Theme[];
};

type UseThemesOptions = {
  apiPath?: string;
  staleTime?: number;
};
```

## Migration Guide

### From Local Implementation

1. Install the package:
   ```bash
   pnpm add @ogasphere/theme-manager
   ```

2. Replace imports:
   ```typescript
   // Before
   import { getAvailableThemes } from "@/lib/themes/get-available-themes";
   
   // After
   import { getAvailableThemes } from "@ogasphere/theme-manager/server";
   ```

3. Update API route:
   ```typescript
   // app/api/themes/route.ts
   import { getAvailableThemes } from "@ogasphere/theme-manager/server";
   ```

4. Update hooks:
   ```typescript
   // Before
   import { useThemes } from "@/hooks/use-themes";
   
   // After
   import { useThemes } from "@ogasphere/theme-manager/client";
   ```

5. Use validation utilities:
   ```typescript
   import { validateThemeId } from "@ogasphere/theme-manager/core";
   
   if (!validateThemeId(themeId, availableThemes)) {
     throw new Error("Invalid theme ID");
   }
   ```

## CSS Structure

The package expects themes to be defined in CSS with the following structure:

```css
.theme-{id} {
  --background: ...;
  --foreground: ...;
  /* ... other CSS variables */
}

.dark .theme-{id} {
  --background: ...;
  --foreground: ...;
  /* ... dark mode variables */
}
```

## License

MIT


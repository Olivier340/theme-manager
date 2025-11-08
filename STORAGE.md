# Stockage des préférences de thème

## Stockage automatique dans localStorage

Depuis la version 1.1.0, le package stocke automatiquement les préférences de thème dans le `localStorage` du navigateur.

### Ce qui est stocké automatiquement

1. **Mode couleur (light/dark/system)** 
   - Clé : `"theme"`
   - Géré par : `next-themes` (automatique)
   - Stockage : Automatique lors du changement de mode

2. **Thème personnalisé (themeId)**
   - Clé : `"selectedTheme"`
   - Géré par : `@ogasphere/theme-manager` (automatique)
   - Stockage : Automatique lors du changement de thème via `BrandingPage`

### Fonctionnement

Le composant `BrandingPage` :
- **Sauvegarde automatiquement** le thème sélectionné dans `localStorage` avec la clé `"selectedTheme"`
- **Charge automatiquement** le thème depuis `localStorage` au montage si `currentTheme` n'est pas fourni
- **Applique automatiquement** le thème au `body` au chargement

```typescript
// Exemple d'utilisation
<BrandingPage
  currentTheme="default" // Optionnel : si non fourni, charge depuis localStorage
  onThemeChange={handleThemeChange}
  // ... autres props
/>
```

## Persistance dans une base de données

Si vous souhaitez persister les préférences de thème dans une base de données (Supabase, PostgreSQL, etc.) au lieu de ou en plus du localStorage, voici comment procéder :

### 1. Modifier la fonction `onThemeChange`

Créez une fonction qui sauvegarde dans votre BDD :

```typescript
// Exemple avec Supabase
import { createClient } from '@supabase/supabase-js';
import { applyTheme } from '@ogasphere/theme-manager/utils';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function handleThemeChange(themeId: string) {
  try {
    // 1. Appliquer le thème immédiatement (pour l'UX)
    if (typeof window !== "undefined") {
      applyTheme(document.body, themeId);
    }

    // 2. Sauvegarder dans localStorage (fallback)
    localStorage.setItem("selectedTheme", themeId);

    // 3. Sauvegarder dans Supabase
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from("user_preferences")
        .upsert(
          {
            user_id: user.id,
            theme_id: themeId,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id",
          }
        );

      if (error) {
        console.error("Erreur lors de la sauvegarde:", error);
        // Le thème reste dans localStorage même en cas d'erreur
      }
    }
  } catch (error) {
    console.error("Erreur lors du changement de thème:", error);
  }
}
```

### 2. Charger le thème depuis la BDD au chargement

Créez un hook personnalisé pour charger le thème :

```typescript
// hooks/use-theme-preference.ts
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { createClient } from '@supabase/supabase-js';
import { applyTheme } from "@ogasphere/theme-manager/utils";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useThemePreference() {
  const [currentTheme, setCurrentTheme] = useState<string>("default");
  const [isLoading, setIsLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    async function loadTheme() {
      if (!user) {
        // Si pas d'utilisateur, utiliser localStorage
        const savedTheme = localStorage.getItem("selectedTheme") || "default";
        setCurrentTheme(savedTheme);
        applyTheme(document.body, savedTheme);
        setIsLoading(false);
        return;
      }

      try {
        // Charger depuis Supabase
        const { data, error } = await supabase
          .from("user_preferences")
          .select("theme_id")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 = pas de résultat trouvé
          console.error("Erreur lors du chargement:", error);
          const savedTheme = localStorage.getItem("selectedTheme") || "default";
          setCurrentTheme(savedTheme);
          applyTheme(document.body, savedTheme);
        } else if (data) {
          setCurrentTheme(data.theme_id);
          applyTheme(document.body, data.theme_id);
          // Synchroniser avec localStorage
          localStorage.setItem("selectedTheme", data.theme_id);
        } else {
          // Pas de préférence enregistrée, utiliser localStorage ou défaut
          const savedTheme = localStorage.getItem("selectedTheme") || "default";
          setCurrentTheme(savedTheme);
          applyTheme(document.body, savedTheme);
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        const savedTheme = localStorage.getItem("selectedTheme") || "default";
        setCurrentTheme(savedTheme);
        applyTheme(document.body, savedTheme);
      } finally {
        setIsLoading(false);
      }
    }

    loadTheme();
  }, [user]);

  return {
    currentTheme,
    isLoading,
  };
}
```

### 3. Utiliser le hook dans votre page

```typescript
// app/branding/page.tsx
"use client";

import { BrandingPage } from "@ogasphere/theme-manager/client";
import { useThemePreference } from "@/hooks/use-theme-preference";
// ... autres imports

export default function BrandingPageRoute() {
  const { currentTheme, isLoading } = useThemePreference();

  const handleThemeChange = async (themeId: string) => {
    // Votre logique de sauvegarde dans la BDD
    await handleThemeChange(themeId);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <BrandingPage
      currentTheme={currentTheme}
      onThemeChange={handleThemeChange}
      // ... autres props
    />
  );
}
```

### 4. Structure de table Supabase (exemple)

```sql
-- Table pour stocker les préférences utilisateur
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- RLS (Row Level Security)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);
```

## Stratégie de fallback

Le package utilise une stratégie de fallback en cascade :

1. **Priorité 1** : Valeur fournie via la prop `currentTheme`
2. **Priorité 2** : Valeur depuis `localStorage.getItem("selectedTheme")`
3. **Priorité 3** : Valeur par défaut `"default"`

Cette stratégie garantit que :
- Le thème fonctionne même sans connexion à la BDD
- Les préférences sont conservées localement
- L'expérience utilisateur reste fluide

## Notes importantes

- Le stockage dans localStorage est **automatique** et ne peut pas être désactivé
- Si vous utilisez une BDD, vous pouvez **compléter** le localStorage (pas le remplacer)
- Le mode couleur (light/dark/system) est toujours géré par `next-themes` dans localStorage
- Le thème personnalisé peut être synchronisé avec votre BDD via `onThemeChange`


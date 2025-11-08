# Prompt : Persister les préférences de thème dans une base de données

## Prompt pour IDE (Cursor / Claude Code)

```
Intègre la persistance des préférences de thème dans une base de données pour le package @ogasphere/theme-manager.

CONTEXTE:
- Package: @ogasphere/theme-manager (version 1.2.0+)
- Le package stocke déjà automatiquement dans localStorage avec la clé "selectedTheme"
- Framework: [Next.js ou Vite - détecte automatiquement]
- Base de données: [PostgreSQL / Supabase / MySQL / MongoDB - spécifier]
- Table: user_settings (ou user_preferences)
- Structure de table proposée:
  - id (UUID ou INT PRIMARY KEY)
  - user_id (UUID ou INT, FOREIGN KEY vers users)
  - theme_id (TEXT ou VARCHAR, DEFAULT 'default')
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
  - UNIQUE(user_id)

TÂCHES À EFFECTUER:

1. CRÉATION DE LA TABLE:
   - Créer la migration SQL pour la table user_settings
   - Ajouter les index nécessaires (user_id)
   - Configurer les contraintes (UNIQUE, FOREIGN KEY)
   - Si Supabase: activer RLS (Row Level Security) avec les politiques appropriées
   - Si autre BDD: créer les permissions nécessaires

2. CLIENT BASE DE DONNÉES:
   - Installer et configurer le client de la BDD (Supabase, Prisma, Drizzle, etc.)
   - Créer un fichier de configuration pour la connexion
   - Gérer les variables d'environnement (DATABASE_URL, etc.)

3. HOOK PERSONNALISÉ:
   - Créer un hook useThemePreference() qui:
     * Charge le thème depuis la BDD au montage
     * Utilise localStorage comme fallback si pas d'utilisateur connecté
     * Synchronise localStorage avec la BDD
     * Gère les états de chargement et d'erreur
   - Le hook doit retourner: { currentTheme, isLoading, saveTheme }

4. FONCTION DE SAUVEGARDE:
   - Créer une fonction saveThemeToDatabase(themeId: string) qui:
     * Sauvegarde dans localStorage immédiatement (pour l'UX)
     * Applique le thème au body avec applyTheme
     * Upsert dans la table user_settings
     * Gère les erreurs avec fallback sur localStorage
   - Si utilisateur non connecté: sauvegarder uniquement dans localStorage

5. FONCTION DE CHARGEMENT:
   - Créer une fonction loadThemeFromDatabase() qui:
     * Vérifie si l'utilisateur est connecté
     * Charge depuis la BDD si connecté
     * Charge depuis localStorage si non connecté ou erreur
     * Applique le thème au body au chargement
     * Retourne le thème par défaut si rien trouvé

6. INTÉGRATION AVEC BRANDING PAGE:
   - Modifier la fonction onThemeChange pour utiliser saveThemeToDatabase
   - Passer currentTheme depuis useThemePreference() au composant BrandingPage
   - Gérer l'état de chargement pendant la récupération du thème

7. INITIALISATION AU CHARGEMENT:
   - Créer un composant ThemeInitializer qui:
     * Utilise useThemePreference()
     * Applique le thème au body au chargement de l'application
     * Gère le cas SSR (Next.js) avec useEffect
   - Intégrer dans le layout principal (app/layout.tsx ou équivalent)

8. GESTION DES ERREURS:
   - Gérer les cas d'erreur (réseau, BDD indisponible, etc.)
   - Toujours avoir un fallback sur localStorage
   - Logger les erreurs pour le debugging
   - Afficher des messages d'erreur à l'utilisateur si nécessaire

9. SYNCHRONISATION:
   - Si l'utilisateur se connecte: charger depuis la BDD et écraser localStorage
   - Si l'utilisateur se déconnecte: utiliser localStorage uniquement
   - Si changement de thème: mettre à jour BDD + localStorage simultanément

10. VÉRIFICATIONS:
    - Vérifier que le thème est bien sauvegardé dans la BDD
    - Vérifier que le thème est bien chargé au rechargement
    - Vérifier le fallback localStorage fonctionne
    - Tester avec utilisateur connecté et non connecté
    - Tester les cas d'erreur (BDD indisponible, etc.)

IMPORTANT:
- Le package @ogasphere/theme-manager stocke déjà automatiquement dans localStorage
- Ne pas désactiver le localStorage, l'utiliser comme fallback
- Toujours appliquer le thème immédiatement pour une bonne UX
- Gérer les cas SSR (Server-Side Rendering) pour Next.js
- Adapter le code selon le framework détecté (Next.js vs Vite)
- Utiliser TypeScript avec les types appropriés
- Documenter les changements effectués
```

## Exemple de structure de table

### PostgreSQL / Supabase

```sql
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_id TEXT NOT NULL DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS pour Supabase
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);
```

### MySQL

```sql
CREATE TABLE user_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  theme_id VARCHAR(255) NOT NULL DEFAULT 'default',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
);
```

### MongoDB (Mongoose)

```javascript
const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  themeId: {
    type: String,
    required: true,
    default: 'default'
  }
}, {
  timestamps: true
});

userSettingsSchema.index({ userId: 1 });
```

## Points importants à mentionner

1. **Stratégie de fallback** : Toujours utiliser localStorage comme fallback
2. **UX** : Appliquer le thème immédiatement, puis sauvegarder en BDD
3. **Synchronisation** : Synchroniser localStorage et BDD à chaque changement
4. **SSR** : Gérer le cas Server-Side Rendering pour Next.js
5. **Erreurs** : Gérer gracieusement les erreurs réseau/BDD
6. **Performance** : Utiliser des index sur user_id pour les requêtes rapides


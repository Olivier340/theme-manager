#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { formatThemeLabel } from "../core/theme-parser";

const DEFAULT_CSS_PATH = path.join(process.cwd(), "app", "globals.css");

function extractVariables(css: string, selector: string): string {
  const regex = new RegExp(
    `${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]+)\\}`,
    "s",
  );
  const match = css.match(regex);

  if (!match) {
    throw new Error(`Could not find ${selector} in CSS`);
  }

  const variables = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("--"))
    .map((line) => `  ${line}`)
    .join("\n");

  return variables;
}

function addTheme(
  themeName: string,
  themeUrl: string,
  cssPath?: string,
): void {
  const globalsPath = cssPath ?? DEFAULT_CSS_PATH;
  const backupPath = `${globalsPath}.backup-${Date.now()}`;

  console.log(`\n🎨 Adding theme: ${themeName}`);
  console.log(`📦 From: ${themeUrl}\n`);

  try {
    console.log("📋 1. Backing up globals.css...");
    fs.copyFileSync(globalsPath, backupPath);
    console.log(`   ✓ Backup created: ${backupPath}`);

    console.log("\n📥 2. Installing Shadcn theme...");
    execSync(`pnpm dlx shadcn@latest add ${themeUrl}`, { stdio: "inherit" });

    console.log("\n🔍 3. Extracting theme variables...");
    const modifiedCss = fs.readFileSync(globalsPath, "utf-8");
    const rootVars = extractVariables(modifiedCss, ":root");
    const darkVars = extractVariables(modifiedCss, ".dark");

    console.log("\n♻️  4. Restoring original globals.css...");
    fs.copyFileSync(backupPath, globalsPath);

    console.log("\n➕ 5. Adding new theme class...");
    const originalCss = fs.readFileSync(globalsPath, "utf-8");

    const newThemeSection = `
/* Theme: ${formatThemeLabel(themeName)} */
.theme-${themeName} {
${rootVars}
}

.dark .theme-${themeName} {
${darkVars}
}
`;

    const updatedCss = originalCss + newThemeSection;
    fs.writeFileSync(globalsPath, updatedCss);

    console.log(`   ✓ Theme class .theme-${themeName} added`);

    fs.unlinkSync(backupPath);

    console.log("\n✅ Theme added successfully!");
    console.log(`\n📝 You can now use the theme:`);
    console.log(`   - It will automatically appear in the theme selector`);
    console.log(`   - Theme ID: ${themeName}`);
    console.log(`   - Theme Label: ${formatThemeLabel(themeName)}`);
  } catch (error) {
    console.error("\n❌ Error adding theme:", error);

    if (fs.existsSync(backupPath)) {
      console.log("\n♻️  Restoring backup...");
      fs.copyFileSync(backupPath, globalsPath);
      fs.unlinkSync(backupPath);
      console.log("   ✓ Original globals.css restored");
    }

    process.exit(1);
  }
}

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("❌ Usage: theme-manager-add <theme-name> <theme-url> [css-path]");
  console.error("\nExample:");
  console.error(
    "  theme-manager-add modern-minimal https://tweakcn.com/r/themes/modern-minimal.json",
  );
  console.error(
    "  theme-manager-add modern-minimal https://tweakcn.com/r/themes/modern-minimal.json app/globals.css",
  );
  process.exit(1);
}

const [themeName, themeUrl, cssPath] = args;
addTheme(themeName, themeUrl, cssPath);


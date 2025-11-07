import { NextResponse } from "next/server";
import type { ThemeConfig } from "../core/theme-types";
export type ThemeApiRouteOptions = ThemeConfig;
export declare function createThemeApiRoute(options?: ThemeApiRouteOptions): () => Promise<NextResponse<{
    themes: import("..").Theme[];
}> | NextResponse<{
    error: string;
}>>;
//# sourceMappingURL=theme-api-route.d.ts.map
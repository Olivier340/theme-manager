import { NextResponse } from "next/server";
import { getAvailableThemes } from "./get-available-themes";
export function createThemeApiRoute(options) {
    return async function GET() {
        try {
            const themes = getAvailableThemes(options);
            return NextResponse.json({ themes });
        }
        catch {
            return NextResponse.json({ error: "Failed to get themes" }, { status: 500 });
        }
    };
}

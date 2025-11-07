"use client";

import { useQuery } from "@tanstack/react-query";
import type { Theme, ThemeConfig, UseThemesOptions } from "../core/theme-types";
import { getAvailableThemesClient } from "./get-available-themes-client";

const DEFAULT_API_PATH = "/api/themes";
const DEFAULT_STALE_TIME = 5 * 60 * 1000;

async function fetchThemesFromApi(apiPath: string): Promise<Theme[]> {
  const response = await fetch(apiPath);
  if (!response.ok) {
    throw new Error("Failed to fetch themes");
  }
  const data = (await response.json()) as { themes: Theme[] };
  return data.themes;
}

export type UseThemesOptionsExtended = UseThemesOptions & {
  useClientParser?: boolean;
  clientParserOptions?: ThemeConfig;
};

export function useThemes(options?: UseThemesOptionsExtended) {
  const apiPath = options?.apiPath ?? DEFAULT_API_PATH;
  const staleTime = options?.staleTime ?? DEFAULT_STALE_TIME;
  const useClientParser = options?.useClientParser ?? false;

  return useQuery({
    queryKey: ["themes", apiPath, useClientParser],
    queryFn: async () => {
      if (useClientParser) {
        return getAvailableThemesClient(options?.clientParserOptions);
      }
      return fetchThemesFromApi(apiPath);
    },
    staleTime,
  });
}


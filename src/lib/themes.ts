export interface ThemePreset {
  id: string;
  name: string;
  tokens: {
    surface: string;
    panel: string;
    accent: string;
    muted: string;
    foreground: string;
    success: string;
    danger: string;
    warning: string;
  };
}

export const themes: ThemePreset[] = [
  {
    id: "midnight",
    name: "Midnight",
    tokens: {
      surface: "#0b1014",
      panel: "#121a21",
      accent: "#7dd3fc",
      muted: "#8da1ad",
      foreground: "#e2e8f0",
      success: "#29d391",
      danger: "#ff6b6b",
      warning: "#f6c453",
    },
  },
  {
    id: "ember",
    name: "Ember",
    tokens: {
      surface: "#140c08",
      panel: "#1c1210",
      accent: "#f97316",
      muted: "#a18072",
      foreground: "#fde8d8",
      success: "#22c55e",
      danger: "#ef4444",
      warning: "#eab308",
    },
  },
  {
    id: "arctic",
    name: "Arctic",
    tokens: {
      surface: "#0a0f1a",
      panel: "#111827",
      accent: "#38bdf8",
      muted: "#7b8fa6",
      foreground: "#e0eaf5",
      success: "#34d399",
      danger: "#f87171",
      warning: "#fbbf24",
    },
  },
  {
    id: "verdant",
    name: "Verdant",
    tokens: {
      surface: "#07100c",
      panel: "#0f1a14",
      accent: "#4ade80",
      muted: "#7da690",
      foreground: "#d4eddf",
      success: "#22d3ee",
      danger: "#fb7185",
      warning: "#facc15",
    },
  },
  {
    id: "amethyst",
    name: "Amethyst",
    tokens: {
      surface: "#0e0a14",
      panel: "#16101f",
      accent: "#a78bfa",
      muted: "#9485a8",
      foreground: "#e4ddf0",
      success: "#34d399",
      danger: "#f87171",
      warning: "#fcd34d",
    },
  },
];

const STORAGE_KEY = "stoic-theme";

export function getStoredThemeId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

export function storeThemeId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, id);
}

export function getThemeById(id: string): ThemePreset | undefined {
  return themes.find((t) => t.id === id);
}

export function getDefaultTheme(): ThemePreset {
  return themes[0];
}

export function shuffleTheme(currentId: string): ThemePreset {
  const others = themes.filter((t) => t.id !== currentId);
  return others[Math.floor(Math.random() * others.length)];
}

export function applyTheme(theme: ThemePreset): void {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.tokens)) {
    root.style.setProperty(`--theme-${key}`, value);
  }
}

import { useEffect, useState } from "react";
import { Shuffle, Palette } from "lucide-react";
import {
  themes,
  getStoredThemeId,
  storeThemeId,
  getThemeById,
  getDefaultTheme,
  shuffleTheme,
  applyTheme,
  type ThemePreset,
} from "@/lib/themes";
import { cn } from "@/lib/utils";

export function ThemeSwitcher() {
  const [current, setCurrent] = useState<ThemePreset>(getDefaultTheme());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedId = getStoredThemeId();
    const theme = storedId ? getThemeById(storedId) : undefined;
    const resolved = theme ?? getDefaultTheme();
    setCurrent(resolved);
    applyTheme(resolved);
  }, []);

  function selectTheme(theme: ThemePreset) {
    setCurrent(theme);
    storeThemeId(theme.id);
    applyTheme(theme);
    setOpen(false);
  }

  function handleShuffle() {
    const next = shuffleTheme(current.id);
    selectTheme(next);
  }

  return (
    <div className="relative flex items-center gap-1">
      <button
        onClick={handleShuffle}
        className="rounded-md p-2 text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
        title="Tema aleatório"
        aria-label="Trocar tema aleatoriamente"
      >
        <Shuffle className="h-4 w-4" />
      </button>

      <button
        onClick={() => setOpen(!open)}
        className="rounded-md p-2 text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
        title="Escolher tema"
        aria-label="Abrir seletor de temas"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-muted/20 bg-panel p-2 shadow-lg">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => selectTheme(theme)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  current.id === theme.id
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground hover:bg-muted/10"
                )}
              >
                <span
                  className="h-3 w-3 rounded-full border border-muted/30"
                  style={{ backgroundColor: theme.tokens.accent }}
                />
                {theme.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

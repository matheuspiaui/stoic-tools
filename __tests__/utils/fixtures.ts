/**
 * Shared test fixtures derived from the tool registry.
 *
 * Every tool registered in src/lib/tools.ts is automatically included,
 * so new tools get tested across all base specs with zero extra code.
 */

export interface ToolFixture {
  slug: string;
  name: string;
  description: string;
  path: string;
}

/**
 * Mirror of the tool registry for tests.
 * Keep in sync with src/lib/tools.ts — if a tool is added there,
 * add it here so all base tests cover it automatically.
 */
export const toolFixtures: ToolFixture[] = [
  {
    slug: "unit-converter",
    name: "Conversor de Unidades",
    description: "Converta valores entre diferentes unidades de medida.",
    path: "/tools/unit-converter",
  },
  {
    slug: "text-case-converter",
    name: "Conversor de Texto",
    description: "Transforme texto entre diferentes formatos de capitalização.",
    path: "/tools/text-case-converter",
  },
];

/** All pages that should be tested (home + tools) */
export const allPages = [
  { name: "Home", path: "/" },
  ...toolFixtures.map((t) => ({ name: t.name, path: t.path })),
];

/** Site URL used in build (must match astro.config.mjs) */
export const SITE_URL = "https://stoic-tools.vercel.app";

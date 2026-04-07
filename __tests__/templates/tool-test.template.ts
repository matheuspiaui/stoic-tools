/**
 * =============================================================================
 * TEMPLATE DE TESTE PARA NOVA TOOL
 * =============================================================================
 *
 * Como usar:
 *   1. Copie este arquivo para __tests__/tools/<slug>.spec.ts
 *   2. Substitua os placeholders marcados com TODO
 *   3. Adicione a tool em __tests__/utils/fixtures.ts (toolFixtures)
 *   4. Implemente os testes de negócio na seção marcada abaixo
 *
 * O que você ganha de graça (via base specs em __tests__/base/):
 *   - Accessibility (axe-core WCAG 2.1 AA)
 *   - SEO (meta tags, sitemap, headings)
 *   - Mobile (responsive, no overflow)
 *   - Cross-browser (chromium, firefox, webkit)
 *   - PWA (manifest, theme-color, icons)
 *   - Visual regression (screenshot comparisons)
 *
 * Este arquivo é para testes de NEGÓCIO específicos da sua tool.
 * =============================================================================
 */
import { test, expect } from "@playwright/test";

// TODO: Substituir pelo path da sua tool
const PATH = "/tools/YOUR-TOOL-SLUG";

test.describe("YOUR TOOL NAME — business logic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  // -------------------------------------------------------------------------
  // Estado inicial
  // -------------------------------------------------------------------------
  test("shows empty state initially", async ({ page }) => {
    // TODO: Verificar o empty state da sua tool
    // await expect(page.getByText("Aguardando...")).toBeVisible();
  });

  // -------------------------------------------------------------------------
  // Testes de negócio — adicione os seus abaixo
  // -------------------------------------------------------------------------
  test.skip("converts input to expected output", async ({ page }) => {
    // TODO: Preencher inputs e verificar resultado
    // await page.locator("#my-input").fill("test value");
    // await expect(page.getByText("expected result")).toBeVisible();
  });

  test.skip("handles edge cases", async ({ page }) => {
    // TODO: Testar valores limites, campos vazios, etc.
  });

  test.skip("interactive elements work correctly", async ({ page }) => {
    // TODO: Testar botões, selects, toggles específicos da tool
  });
});

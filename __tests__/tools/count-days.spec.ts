import { test, expect } from "@playwright/test";

const PATH = "/tools/count-days";

test.describe("Contador de Dias — business logic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("shows empty state when no dates are selected", async ({ page }) => {
    await expect(page.getByText("Aguardando datas")).toBeVisible();
  });

  test("calculates days between two dates", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-01");
    await page.locator("#end-date").fill("2026-01-11");

    await expect(page.getByRole("heading", { name: "Resultado" })).toBeVisible();
    // Use the result panel's bold text to avoid matching button "+10 dias" and roadmap
    const resultValue = page.locator("p.text-2xl");
    await expect(resultValue).toContainText("10 dias");
  });

  test("calculates 0 days for same date (excluding both)", async ({ page }) => {
    await page.locator("#start-date").fill("2026-03-15");
    await page.locator("#end-date").fill("2026-03-15");

    await expect(page.getByRole("heading", { name: "Resultado" })).toBeVisible();
    const resultValue = page.locator("p.text-2xl");
    await expect(resultValue).toContainText("0 dias");
  });

  test("includes start date in count when selected", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-01");
    await page.locator("#end-date").fill("2026-01-11");

    await page.getByLabel("Contar data de início").check();

    const resultValue = page.locator("p.text-2xl");
    await expect(resultValue).toContainText("11 dias");
  });

  test("includes end date in count when selected", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-01");
    await page.locator("#end-date").fill("2026-01-11");

    await page.getByLabel("Contar data de fim").check();

    const resultValue = page.locator("p.text-2xl");
    await expect(resultValue).toContainText("11 dias");
  });

  test("includes both dates in count when both selected", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-01");
    await page.locator("#end-date").fill("2026-01-11");

    await page.getByLabel("Contar data de início").check();
    await page.getByLabel("Contar data de fim").check();

    const resultValue = page.locator("p.text-2xl");
    await expect(resultValue).toContainText("12 dias");
  });

  test("quick add buttons set end date relative to start", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-01");

    await page.getByRole("button", { name: "+10 dias" }).click();

    await expect(page.locator("#end-date")).toHaveValue("2026-01-11");
    const resultValue = page.locator("p.text-2xl");
    await expect(resultValue).toContainText("10 dias");
  });

  test("quick add +30 days button works", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-01");

    await page.getByRole("button", { name: "+30 dias" }).click();

    await expect(page.locator("#end-date")).toHaveValue("2026-01-31");
    const resultValue = page.locator("p.text-2xl");
    await expect(resultValue).toContainText("30 dias");
  });

  test("shows roadmap visualization with dates", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-01");
    await page.locator("#end-date").fill("2026-01-11");

    await expect(page.getByTestId("roadmap-visualization")).toBeVisible();
  });

  test("roadmap shows filled circles when dates are included", async ({
    page,
  }) => {
    await page.locator("#start-date").fill("2026-01-01");
    await page.locator("#end-date").fill("2026-01-11");

    await page.getByLabel("Contar data de início").check();

    const startCircle = page.getByTestId("roadmap-start-circle");
    await expect(startCircle).toHaveAttribute("data-included", "true");
  });

  test("handles end date before start date", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-11");
    await page.locator("#end-date").fill("2026-01-01");

    await expect(page.getByRole("heading", { name: "Resultado" })).toBeVisible();
    const resultValue = page.locator("p.text-2xl");
    await expect(resultValue).toContainText("10 dias");
  });
});

test.describe("Contador de Dias — mobile layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("date inputs do not overflow their container on mobile", async ({ page }) => {
    const viewport = page.viewportSize();
    if (!viewport) return;

    const startInput = page.locator("#start-date");
    const endInput = page.locator("#end-date");

    const startBox = await startInput.boundingBox();
    const endBox = await endInput.boundingBox();

    if (startBox) {
      expect(startBox.x).toBeGreaterThanOrEqual(0);
      expect(startBox.x + startBox.width).toBeLessThanOrEqual(viewport.width);
    }

    if (endBox) {
      expect(endBox.x).toBeGreaterThanOrEqual(0);
      expect(endBox.x + endBox.width).toBeLessThanOrEqual(viewport.width);
    }
  });

  test("quick add buttons wrap properly on small screens", async ({ page }) => {
    await page.locator("#start-date").fill("2026-01-01");
    await page.waitForTimeout(100);

    const viewport = page.viewportSize();
    if (!viewport) return;

    const buttonsContainer = page.locator("#end-date ~ div, .mt-2.flex.flex-wrap");
    const box = await buttonsContainer.first().boundingBox();

    if (box) {
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
    }
  });
});

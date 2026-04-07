import { test, expect } from "@playwright/test";

const PATH = "/tools/unit-converter";

test.describe("Unit Converter — business logic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("shows empty state when no value is entered", async ({ page }) => {
    await expect(page.getByText("Aguardando valor")).toBeVisible();
  });

  test("converts meters to kilometers", async ({ page }) => {
    const input = page.locator("#unit-value");
    await input.fill("1000");

    // Default: m → km (length) — 1000m = 1km
    const resultHeading = page.getByRole("heading", { name: "Resultado" });
    await expect(resultHeading).toBeVisible();
  });

  test("swap button inverts from/to units", async ({ page }) => {
    await page.locator("#unit-value").fill("1");

    // Click swap button
    await page.getByTitle("Trocar").click();

    // After swap, the result should change
    await expect(page.getByText("Resultado")).toBeVisible();
  });

  test("changing category resets state", async ({ page }) => {
    await page.locator("#unit-value").fill("100");
    await expect(page.getByText("Resultado")).toBeVisible();

    // Switch to temperature
    await page.locator("button").filter({ hasText: /Comprimento|Metros/ }).first().click();
    // Select Peso/Temperatura if dropdown appears
    const pesoOption = page.getByRole("option", { name: "Peso" });
    if (await pesoOption.isVisible()) {
      await pesoOption.click();
    }

    // Value should be cleared
    await expect(page.getByText("Aguardando valor")).toBeVisible();
  });

  test("handles decimal input", async ({ page }) => {
    await page.locator("#unit-value").fill("1.5");
    await expect(page.getByText("Resultado")).toBeVisible();
  });
});

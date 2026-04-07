import { test, expect } from "@playwright/test";

const PATH = "/tools/text-case-converter";

test.describe("Text Case Converter — business logic", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PATH);
    await page.waitForLoadState("networkidle");
  });

  test("shows empty state when no text is entered", async ({ page }) => {
    await expect(page.getByText("Aguardando texto")).toBeVisible();
  });

  test("converts text to uppercase", async ({ page }) => {
    await page.locator("#text-input").fill("hello world");
    // Default case type is uppercase
    await expect(page.locator("pre")).toContainText("HELLO WORLD");
  });

  test("converts text to lowercase", async ({ page }) => {
    await page.locator("#text-input").fill("HELLO WORLD");
    await page.getByRole("button", { name: "minúsculas" }).click();
    await expect(page.locator("pre")).toContainText("hello world");
  });

  test("converts text to camelCase", async ({ page }) => {
    await page.locator("#text-input").fill("hello world");
    await page.getByRole("button", { name: "camelCase" }).click();
    await expect(page.locator("pre")).toContainText("helloWorld");
  });

  test("converts text to snake_case", async ({ page }) => {
    await page.locator("#text-input").fill("hello world");
    await page.getByRole("button", { name: "snake_case" }).click();
    await expect(page.locator("pre")).toContainText("hello_world");
  });

  test("converts text to kebab-case", async ({ page }) => {
    await page.locator("#text-input").fill("hello world");
    await page.getByRole("button", { name: "kebab-case" }).click();
    await expect(page.locator("pre")).toContainText("hello-world");
  });

  test("converts text to Title case", async ({ page }) => {
    await page.locator("#text-input").fill("hello world");
    await page.getByRole("button", { name: "Título" }).click();
    await expect(page.locator("pre")).toContainText("Hello World");
  });

  test("copy button appears when result is shown", async ({ page }) => {
    await page.locator("#text-input").fill("test");
    await expect(page.getByRole("button", { name: "Copiar" })).toBeVisible();
  });
});

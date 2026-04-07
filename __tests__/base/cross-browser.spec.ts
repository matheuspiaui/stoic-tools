import { test, expect } from "@playwright/test";
import { allPages } from "../utils/fixtures";

test.describe("Cross-browser rendering", () => {
  for (const page of allPages) {
    test(`${page.name} loads without errors`, async ({ page: p }) => {
      const errors: string[] = [];
      p.on("pageerror", (error) => errors.push(error.message));

      const response = await p.goto(page.path);
      expect(response?.status()).toBe(200);

      // Wait for React hydration
      await p.waitForLoadState("networkidle");

      expect(
        errors,
        `Page should not have JS errors: ${errors.join(", ")}`
      ).toHaveLength(0);
    });

    test(`${page.name} renders visible content`, async ({ page: p }) => {
      await p.goto(page.path);
      await p.waitForLoadState("networkidle");

      // Body should have content
      const bodyText = await p.locator("body").innerText();
      expect(bodyText.trim().length).toBeGreaterThan(0);

      // No broken images
      const images = p.locator("img");
      const count = await images.count();
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        const naturalWidth = await img.evaluate(
          (el: HTMLImageElement) => el.naturalWidth
        );
        const src = await img.getAttribute("src");
        expect(naturalWidth, `Image ${src} should load`).toBeGreaterThan(0);
      }
    });
  }
});

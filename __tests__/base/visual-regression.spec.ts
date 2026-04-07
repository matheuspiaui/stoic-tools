import { test, expect } from "@playwright/test";
import { allPages, toolFixtures } from "../utils/fixtures";

test.describe("Visual regression — full page", () => {
  for (const page of allPages) {
    test(`${page.name} matches screenshot`, async ({ page: p }) => {
      await p.goto(page.path);
      await p.waitForLoadState("networkidle");
      // Hide dynamic content that causes flakiness (e.g. blinking cursors)
      await p.evaluate(() => {
        document.querySelectorAll("input, textarea").forEach((el) => {
          (el as HTMLElement).style.caretColor = "transparent";
        });
      });
      await expect(p).toHaveScreenshot(`${page.name.toLowerCase().replace(/\s+/g, "-")}-full.png`, {
        fullPage: true,
      });
    });
  }
});

test.describe("Visual regression — tool components", () => {
  for (const tool of toolFixtures) {
    test(`${tool.name} empty state`, async ({ page }) => {
      await page.goto(tool.path);
      await page.waitForLoadState("networkidle");
      // Capture the main content area (excludes sidebar for stability)
      const content = page.locator("main, [class*='flex-1']").last();
      await expect(content).toHaveScreenshot(
        `${tool.slug}-empty-state.png`
      );
    });
  }
});

import { test, expect } from "@playwright/test";
import { allPages } from "../utils/fixtures";
import { assertMobileUsable } from "../utils/base-assertions";

test.describe("Mobile responsiveness", () => {
  for (const page of allPages) {
    test(`${page.name} has no horizontal overflow`, async ({ page: p }) => {
      await p.goto(page.path);
      await assertMobileUsable(p);
    });

    test(`${page.name} renders main content`, async ({ page: p }) => {
      await p.goto(page.path);
      // Main content area should be visible
      const body = p.locator("body");
      await expect(body).toBeVisible();

      // Page should not be blank
      const text = await p.locator("body").innerText();
      expect(text.trim().length).toBeGreaterThan(0);
    });
  }

  test("sidebar is hidden on small viewports by default", async ({
    page,
    browserName,
  }) => {
    // This test validates mobile behavior — on desktop projects with large
    // viewports the sidebar is always visible via md:static.
    const viewportWidth = page.viewportSize()?.width ?? 1280;
    test.skip(viewportWidth >= 768, "Only applies to mobile viewports");

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const sidebar = page.locator("aside");
    // On mobile, sidebar starts with -translate-x-full (off-screen left)
    const box = await sidebar.boundingBox();
    expect(
      !box || box.x + box.width <= 0,
      "Sidebar should be off-screen on mobile"
    ).toBe(true);
  });
});

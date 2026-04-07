import { test, expect } from "@playwright/test";
import { allPages } from "../utils/fixtures";
import { assertPwaMeta } from "../utils/base-assertions";

test.describe("PWA readiness", () => {
  for (const page of allPages) {
    test(`${page.name} has PWA meta tags`, async ({ page: p }) => {
      await p.goto(page.path);
      await assertPwaMeta(p);
    });
  }

  test("manifest.json is valid", async ({ request }) => {
    const response = await request.get("/manifest.json");
    expect(response.status()).toBe(200);

    const manifest = await response.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBe("/");
    expect(manifest.display).toBe("standalone");
    expect(manifest.theme_color).toBeTruthy();
    expect(manifest.background_color).toBeTruthy();
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);

    // Must have at least 192 and 512 sizes
    const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
  });

  test("PWA icons are accessible", async ({ request }) => {
    for (const path of ["/icons/icon-192.png", "/icons/icon-512.png"]) {
      const response = await request.get(path);
      expect(response.status(), `${path} should be accessible`).toBe(200);
    }
  });
});

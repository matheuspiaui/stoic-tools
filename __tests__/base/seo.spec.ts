import { test, expect } from "@playwright/test";
import { allPages, SITE_URL, toolFixtures } from "../utils/fixtures";
import { assertSeoTags, assertHeadingHierarchy } from "../utils/base-assertions";

test.describe("SEO fundamentals", () => {
  for (const page of allPages) {
    test(`${page.name} has required meta tags`, async ({ page: p }) => {
      await p.goto(page.path);
      await assertSeoTags(p);
    });

    test(`${page.name} has valid heading hierarchy`, async ({ page: p }) => {
      await p.goto(page.path);
      await assertHeadingHierarchy(p);
    });
  }
});

test.describe("Sitemap", () => {
  test("sitemap-index.xml exists and is valid XML", async ({ request }) => {
    const response = await request.get("/sitemap-index.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<sitemapindex");
    expect(body).toContain("<sitemap>");
  });

  test("sitemap contains all tool URLs", async ({ request }) => {
    // First get the sitemap index to find the actual sitemap URL
    const indexResponse = await request.get("/sitemap-index.xml");
    const indexBody = await indexResponse.text();

    // Extract sitemap location from the index
    const locMatch = indexBody.match(/<loc>(.+?)<\/loc>/);
    expect(locMatch, "Sitemap index must contain a <loc>").toBeTruthy();

    const sitemapUrl = locMatch![1].replace(SITE_URL, "");
    const sitemapResponse = await request.get(sitemapUrl);
    expect(sitemapResponse.status()).toBe(200);
    const sitemapBody = await sitemapResponse.text();

    // Every tool URL must be in the sitemap
    for (const tool of toolFixtures) {
      expect(
        sitemapBody,
        `Sitemap must contain ${tool.path}`
      ).toContain(tool.path);
    }

    // Home page must be in the sitemap
    expect(sitemapBody).toContain(`${SITE_URL}/`);
  });

  test("robots.txt references the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Sitemap:");
    expect(body).toContain("sitemap-index.xml");
  });
});

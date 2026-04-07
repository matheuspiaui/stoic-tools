/**
 * Reusable assertion helpers for the 5 test pillars.
 * Import these in tool-specific tests to get baseline coverage for free.
 */
import { type Page, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Run axe accessibility scan and assert no violations (WCAG 2.1 AA) */
export async function assertAccessibility(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations, formatViolations(results.violations)).toHaveLength(
    0
  );
}

/** Assert essential SEO tags are present */
export async function assertSeoTags(page: Page) {
  // Title exists and is not empty
  const title = await page.title();
  expect(title).toBeTruthy();
  expect(title.length).toBeGreaterThan(0);

  // Meta description
  const description = page.locator('meta[name="description"]');
  await expect(description).toHaveAttribute("content", /.+/);

  // Canonical URL
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", /^https?:\/\//);

  // Open Graph
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /.+/
  );
  await expect(
    page.locator('meta[property="og:description"]')
  ).toHaveAttribute("content", /.+/);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    /^https?:\/\//
  );

  // Language
  const lang = await page.locator("html").getAttribute("lang");
  expect(lang).toBeTruthy();
}

/** Assert heading hierarchy: single h1, no skipped levels */
export async function assertHeadingHierarchy(page: Page) {
  const h1Count = await page.locator("h1").count();
  expect(h1Count, "Page must have exactly one <h1>").toBe(1);
}

/** Assert PWA meta tags and manifest */
export async function assertPwaMeta(page: Page) {
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    /manifest\.json/
  );
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    /.+/
  );
  await expect(
    page.locator('meta[name="mobile-web-app-capable"]')
  ).toHaveAttribute("content", "yes");
}

/** Assert page is usable at mobile viewport */
export async function assertMobileUsable(page: Page) {
  // No horizontal overflow
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(
    hasHorizontalScroll,
    "Page should not have horizontal scroll on mobile"
  ).toBe(false);

  // Viewport meta tag
  const viewport = page.locator('meta[name="viewport"]');
  await expect(viewport).toHaveAttribute("content", /width=device-width/);
}

function formatViolations(
  violations: { id: string; impact?: string | null; description: string; nodes: unknown[] }[]
): string {
  if (violations.length === 0) return "";
  return violations
    .map(
      (v) =>
        `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`
    )
    .join("\n");
}

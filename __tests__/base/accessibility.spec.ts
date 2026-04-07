import { test } from "@playwright/test";
import { allPages } from "../utils/fixtures";
import { assertAccessibility } from "../utils/base-assertions";

test.describe("Accessibility (WCAG 2.1 AA)", () => {
  for (const page of allPages) {
    test(`${page.name} passes axe scan`, async ({ page: p }) => {
      await p.goto(page.path);
      await assertAccessibility(p);
    });
  }
});

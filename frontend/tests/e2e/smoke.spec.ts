// Smoke e2e tests - Basic page load verification
import { test, expect } from "@playwright/test";

test.describe("Smoke Tests", () => {
  test("home page loads and displays main elements", async ({ page }) => {
    await page.goto("/");
    
    // Verify main heading (the h1 element specifically)
    await expect(page.locator("h1")).toContainText(/pagasa weather decision support demo/i);
    
    // Verify upload section
    await expect(page.getByText(/upload weather image/i)).toBeVisible();
    
    // Verify sample section
    await expect(page.getByText(/use sample image/i)).toBeVisible();
    
    // Verify product type selector exists
    await expect(page.getByLabel(/weather product type/i)).toBeVisible();
  });

  test("history page loads", async ({ page }) => {
    await page.goto("/history");
    // History appears in breadcrumb navigation
    await expect(page.getByLabel("breadcrumb")).toContainText(/history/i);
  });

  test("ops page loads with system status", async ({ page }) => {
    await page.goto("/ops", { waitUntil: "networkidle" });
    await expect(page.getByText("System Operations Dashboard")).toBeVisible();
    await expect(page.getByText(/system status/i)).toBeVisible();
  });
});
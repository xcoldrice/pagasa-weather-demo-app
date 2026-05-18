// Operations e2e tests - System health and monitoring
import { test, expect } from "@playwright/test";

test.describe("Operations Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/ops", { waitUntil: "networkidle" });
  });

  test("displays main dashboard heading", async ({ page }) => {
    await expect(page.getByText("System Operations Dashboard")).toBeVisible();
  });

  test("shows system health status", async ({ page }) => {
    await expect(page.getByText(/system status/i)).toBeVisible();
    
    // Status chip should be present (either "ready", "error", or "unknown")
    const statusChip = page.locator('[class*="MuiChip"]').first();
    await expect(statusChip).toBeVisible();
  });

  test("displays database connection status", async ({ page }) => {
    await expect(page.getByText(/database/i).first()).toBeVisible();
    await expect(page.getByText(/connected|disconnected/i).first()).toBeVisible();
  });

  test("displays redis cache status", async ({ page }) => {
    await expect(page.getByText(/redis cache/i)).toBeVisible();
    await expect(page.getByText(/connected|disconnected/i).nth(1)).toBeVisible();
  });

  test("shows version information section", async ({ page }) => {
    await expect(page.getByText(/version information/i)).toBeVisible();
    await expect(page.getByText(/application version/i)).toBeVisible();
    await expect(page.getByText(/git commit sha/i)).toBeVisible();
  });

  test("displays analytics trends section", async ({ page }) => {
    await expect(page.getByText(/analytics trends/i)).toBeVisible();
    
    // Check for trend metrics
    await expect(page.getByText(/total recent runs/i)).toBeVisible();
    await expect(page.getByText(/avg max value/i)).toBeVisible();
    await expect(page.getByText(/avg mean value/i)).toBeVisible();
    await expect(page.getByText(/high risk runs/i)).toBeVisible();
  });

  test("all status indicators are visible", async ({ page }) => {
    // Should have at least 3 status indicators (system, database, redis)
    const statusCards = page.locator('[class*="MuiCard"]');
    const count = await statusCards.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
// History e2e tests - Run history and data grid functionality
import { test, expect } from "@playwright/test";

test.describe("History Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/history");
  });

  test("displays history page with data grid", async ({ page }) => {
    // History appears in breadcrumb
    await expect(page.getByLabel("breadcrumb")).toContainText(/history/i);
    
    // DataGrid should be present
    const dataGrid = page.locator('[role="grid"]');
    await expect(dataGrid).toBeVisible();
  });

  test("shows refresh button", async ({ page }) => {
    const refreshButton = page.getByLabel("refresh");
    await expect(refreshButton).toBeVisible();
  });

  test("refresh button reloads data", async ({ page }) => {
    const refreshButton = page.getByLabel("refresh");
    await expect(refreshButton).toBeVisible();
    
    // Click refresh
    await refreshButton.click();
    
    // Grid should still be visible after refresh
    const dataGrid = page.locator('[role="grid"]');
    await expect(dataGrid).toBeVisible();
  });

  test("data grid has expected column headers", async ({ page }) => {
    // Wait for grid to load
    await page.waitForSelector('[role="grid"]', { timeout: 10000 });
    
    // Check for column headers
    await expect(page.getByText("Run ID")).toBeVisible();
    await expect(page.getByText("Product Type")).toBeVisible();
    await expect(page.getByText("Status")).toBeVisible();
  });

  test("clicking a row navigates to results page", async ({ page }) => {
    // Wait for data to load
    await page.waitForSelector('[role="grid"]', { timeout: 10000 });
    
    // Find first row with data (skip header)
    const firstRow = page.locator('[role="row"]').nth(1);
    const rowCount = await page.locator('[role="row"]').count();
    
    if (rowCount > 1) {
      // Click the row
      await firstRow.click();
      
      // Should navigate to results page
      await expect(page).toHaveURL(/\/results\//, { timeout: 10000 });
    }
  });

  test("view action button works", async ({ page }) => {
    // Wait for grid to load
    await page.waitForSelector('[role="grid"]', { timeout: 10000 });
    
    // Look for view button (eye icon)
    const viewButton = page.getByLabel(/view/i).first();
    const hasViewButton = await viewButton.count();
    
    if (hasViewButton > 0) {
      await viewButton.click();
      await expect(page).toHaveURL(/\/results\//, { timeout: 10000 });
    }
  });

  test("handles empty state gracefully", async ({ page }) => {
    // Grid should be visible even if empty
    const dataGrid = page.locator('[role="grid"]');
    await expect(dataGrid).toBeVisible({ timeout: 10000 });
  });
});

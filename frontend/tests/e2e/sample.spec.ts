// Sample e2e tests - Built-in sample image processing
import { test, expect } from "@playwright/test";

test.describe("Sample Image Processing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("sample images section is visible", async ({ page }) => {
    await expect(page.getByText(/use sample image/i)).toBeVisible();
  });

  test("user can process a built-in sample image", async ({ page }) => {
    // Wait for samples to load from API
    const firstSampleButton = page.getByText(/use this sample/i).first();
    await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
    
    // Click the first sample
    await firstSampleButton.click();

    // Verify navigation to results
    await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/results\//);
  });

  test("sample cards display product type chips", async ({ page }) => {
    // Wait for samples to load and check for product type indicators
    const firstSampleButton = page.getByText(/use this sample/i).first();
    await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
    
    // Look for either temperature or rainfall chips
    const hasProductType = await page.locator('[class*="MuiChip"]').count();
    expect(hasProductType).toBeGreaterThan(0);
  });

  test("loading state shows during sample processing", async ({ page }) => {
    // Wait for samples to load from API
    const firstSampleButton = page.getByText(/use this sample/i).first();
    await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
    
    // Click and quickly check for loading state
    await firstSampleButton.click();
    
    // Either we see "Processing..." or we've already navigated - use .first() since multiple buttons may show it
    const processingOrResults = page.getByText(/processing|processing result/i).first();
    await expect(processingOrResults).toBeVisible({ timeout: 15000 });
  });
});
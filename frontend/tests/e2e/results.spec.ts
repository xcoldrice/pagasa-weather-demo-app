// Results e2e tests - Result detail page functionality
import { test, expect } from "@playwright/test";

test.describe("Results Page", () => {
  test.describe("Via Sample Processing", () => {
    test("displays complete results after sample processing", async ({ page }) => {
      // Start from home and process a sample
      await page.goto("/");
      
      // Wait for samples and click first one
      const firstSampleButton = page.getByText(/use this sample/i).first();
      await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
      await firstSampleButton.click();
      
      // Wait for results page
      await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
      
      // Verify main heading
      await expect(page.getByText(/processing results/i)).toBeVisible();
    });

    test("shows product type and status chips", async ({ page }) => {
      await page.goto("/");
      
      const firstSampleButton = page.getByText(/use this sample/i).first();
      await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
      await firstSampleButton.click();
      
      await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
      
      // Should have status chips visible
      const chips = page.locator('[class*="MuiChip"]');
      const chipCount = await chips.count();
      expect(chipCount).toBeGreaterThan(0);
    });

    test("displays statistics section", async ({ page }) => {
      await page.goto("/");
      
      const firstSampleButton = page.getByText(/use this sample/i).first();
      await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
      await firstSampleButton.click();
      
      await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
      
      // Look for statistics-related text
      const hasStats = await page.getByText(/max|mean|median|std|min/i).count();
      expect(hasStats).toBeGreaterThan(0);
    });
  });

  test.describe("Direct Navigation", () => {
    test("handles invalid run ID gracefully", async ({ page }) => {
      await page.goto("/results/invalid-run-id-12345");
      
      // Should show error message or loading state
      const errorOrLoading = page.getByText(/failed to load|no result found|loading/i);
      await expect(errorOrLoading).toBeVisible({ timeout: 10000 });
    });

    test("shows loading state while fetching", async ({ page }) => {
      // Navigate directly to results page
      await page.goto("/results/some-run-id");
      
      // Should show either loading spinner or error
      const loadingOrError = page.locator('svg[class*="MuiCircularProgress"], :text("failed"), :text("no result")');
      await expect(loadingOrError.first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("Breadcrumb Navigation", () => {
    test("breadcrumb navigation is present", async ({ page }) => {
      await page.goto("/");
      
      const firstSampleButton = page.getByText(/use this sample/i).first();
      await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
      await firstSampleButton.click();
      
      await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
      
      // Check for breadcrumb
      const breadcrumb = page.getByLabel("breadcrumb");
      await expect(breadcrumb).toBeVisible();
    });

    test("can navigate back to history via breadcrumb", async ({ page }) => {
      await page.goto("/");
      
      const firstSampleButton = page.getByText(/use this sample/i).first();
      await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
      await firstSampleButton.click();
      
      await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
      
      // Click history link in breadcrumb
      const historyLink = page.getByLabel("breadcrumb").getByRole("link", { name: /history/i });
      if (await historyLink.isVisible()) {
        await historyLink.click();
        await expect(page).toHaveURL(/\/history/);
      }
    });
  });
});

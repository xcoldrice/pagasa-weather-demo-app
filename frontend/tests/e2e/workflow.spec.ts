// Workflow e2e tests - Complete user journeys
import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe("Complete User Workflows", () => {
  test("complete sample workflow: home -> process -> results -> history", async ({ page }) => {
    // Step 1: Start at home page
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/pagasa weather decision support demo/i);
    
    // Step 2: Process a sample image
    const firstSampleButton = page.getByText(/use this sample/i).first();
    await expect(firstSampleButton).toBeVisible({ timeout: 10000 });
    await firstSampleButton.click();
    
    // Step 3: View results
    await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/results\//);
    
    // Verify we're on results page with data
    await expect(page.getByText(/processing results/i)).toBeVisible();
    
    // Step 4: Navigate to history
    await page.goto("/history");
    await expect(page.getByLabel("breadcrumb")).toContainText(/history/i);
    
    // Verify grid is present
    const dataGrid = page.locator('[role="grid"]');
    await expect(dataGrid).toBeVisible();
  });

  test("complete upload workflow: select type -> upload -> process -> view results", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    
    // Wait for form to load
    await expect(page.locator('div[role="combobox"]')).toBeVisible({ timeout: 10000 });
    
    // Step 1: Select product type
    const select = page.locator('div[role="combobox"]');
    await select.click();
    await page.getByRole("option", { name: /temperature/i }).click();
    
    // Step 2: Upload file
    const filePath = path.join(__dirname, "../../../backend/tests/fixtures/sample_temperature.png");
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Verify file selected - check button text changed
    await expect(page.getByText(/sample_temperature\.png/i).first()).toBeVisible({ timeout: 10000 });
    
    // Step 3: Process
    await page.locator('button[type="submit"]').click();
    
    // Step 4: View results
    await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/results\//);
  });

  test("navigation workflow: test all main navigation links", async ({ page }) => {
    // Start at home
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/pagasa weather decision support demo/i);
    
    // Navigate to History
    await page.goto("/history");
    await expect(page.getByLabel("breadcrumb")).toContainText(/history/i);
    
    // Navigate to Ops
    await page.goto("/ops");
    await expect(page.getByText("System Operations Dashboard")).toBeVisible();
    
    // Navigate back to Home
    await page.goto("/");
    await expect(page.locator("h1")).toContainText(/pagasa weather decision support demo/i);
  });

  test("process multiple samples in sequence", async ({ page }) => {
    await page.goto("/");
    
    // Process first sample
    const firstButton = page.getByText(/use this sample/i).first();
    await expect(firstButton).toBeVisible({ timeout: 10000 });
    await firstButton.click();
    await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
    
    const firstUrl = page.url();
    expect(firstUrl).toContain("/results/");
    
    // Go back to home
    await page.goto("/");
    
    // Process another sample (if available)
    const sampleButtons = page.getByText(/use this sample/i);
    await page.waitForTimeout(2000); // Wait for samples to load
    const buttonCount = await sampleButtons.count();
    
    if (buttonCount > 1) {
      await sampleButtons.nth(1).click();
      await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
      
      const secondUrl = page.url();
      expect(secondUrl).toContain("/results/");
      
      // URLs should be different (different run IDs)
      expect(secondUrl).not.toBe(firstUrl);
    }
  });

  test("error handling: navigate to results then back to home after error", async ({ page }) => {
    // Try to access invalid results page
    await page.goto("/results/nonexistent-run-id");
    
    // Should show error or no result message
    await expect(page.getByText(/failed to load|no result found/i)).toBeVisible({ timeout: 10000 });
    
    // Navigate back to home
    await page.goto("/");
    
    // Should still work normally
    await expect(page.locator("h1")).toContainText(/pagasa weather decision support demo/i);
  });

  test("responsive navigation: sidebar and mobile menu", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    
    // Verify navigation items are present in the page
    await expect(page.getByText('Home').first()).toBeAttached();
    await expect(page.getByText('History').first()).toBeAttached();
    await expect(page.getByText('Ops').first()).toBeAttached();
  });
});

// Upload e2e tests - File upload and processing workflows
import { test, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe("Upload Functionality", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Wait for the upload form to be ready by checking for the combobox
    await expect(page.locator('div[role="combobox"]')).toBeVisible({ timeout: 10000 });
  });

  test("upload form displays correctly", async ({ page }) => {
    // Verify form elements
    await expect(page.getByLabel(/weather product type/i).first()).toBeVisible();
    await expect(page.getByText(/choose image file/i)).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("user can select product type", async ({ page }) => {
    const select = page.locator('div[role="combobox"]');
    
    // Test temperature selection
    await select.click();
    await page.getByRole("option", { name: /temperature/i }).click();
    await expect(select).toHaveText("Temperature");
    
    // Test rainfall selection
    await select.click();
    await page.getByRole("option", { name: /rainfall/i }).click();
    await expect(select).toHaveText("Rainfall");
  });

  test("user can upload and process temperature image", async ({ page }) => {
    const filePath = path.join(__dirname, "../../../backend/tests/fixtures/sample_temperature.png");

    // Select product type
    const select = page.locator('div[role="combobox"]');
    await select.click();
    await page.getByRole("option", { name: /temperature/i }).click();
    
    // Upload file
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Verify file name is displayed (use first to avoid strict mode)
    await expect(page.getByText(/sample_temperature\.png/i).first()).toBeVisible();
    
    // Submit
    await page.locator('button[type="submit"]').click();

    // Verify navigation to results page
    await expect(page.getByText(/processing result/i)).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/results\//);
  });

  test("displays file size after selection", async ({ page }) => {
    const filePath = path.join(__dirname, "../../../backend/tests/fixtures/sample_temperature.png");
    
    await page.setInputFiles('input[type="file"]', filePath);
    
    // Should show file info
    await expect(page.getByText(/KB/i)).toBeVisible();
  });
});
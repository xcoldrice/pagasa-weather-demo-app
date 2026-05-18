# E2E Test Suite Documentation

## Overview

Comprehensive end-to-end test suite for the PAGASA Weather Decision Support Demo application using Playwright.

## Test Files

### 1. **smoke.spec.ts** - Smoke Tests
Basic sanity checks to ensure all main pages load correctly.

**Tests:**
- Home page loads with main elements
- History page loads
- Ops page loads with system status
- Navigation sidebar is present

**Run:** `npx playwright test smoke`

---

### 2. **upload.spec.ts** - Upload Functionality
Tests for weather image upload and processing workflows.

**Tests:**
- Upload form displays correctly
- Product type selection (Temperature/Rainfall)
- File upload with size display
- Complete upload and processing flow
- Navigation to results after upload

**Run:** `npx playwright test upload`

---

### 3. **sample.spec.ts** - Sample Image Processing
Tests for built-in sample image processing functionality.

**Tests:**
- Sample images section visibility
- Sample image processing flow
- Product type chips display
- Loading state during processing
- Navigation to results after sample processing

**Run:** `npx playwright test sample`

---

### 4. **history.spec.ts** - History Page
Tests for run history and data grid functionality.

**Tests:**
- Data grid display and columns
- Refresh button functionality
- Row click navigation to results
- View action button
- Empty state handling

**Run:** `npx playwright test history`

---

### 5. **results.spec.ts** - Results Page
Tests for processing result detail views.

**Tests:**
- Results display after sample processing
- Product type and status chips
- Statistics section display
- Direct navigation with invalid run ID
- Loading state handling
- Breadcrumb navigation

**Run:** `npx playwright test results`

---

### 6. **ops.spec.ts** - Operations Dashboard
Tests for system health and monitoring dashboard.

**Tests:**
- Dashboard heading display
- System health status
- Database connection status
- Redis cache status
- Version information display
- Analytics trends metrics
- All status indicators visible

**Run:** `npx playwright test ops`

---

### 7. **workflow.spec.ts** - Complete User Workflows
End-to-end tests covering complete user journeys.

**Tests:**
- Complete sample workflow (home → process → results → history)
- Complete upload workflow
- Navigation between all main pages
- Processing multiple samples in sequence
- Error handling and recovery
- Responsive navigation

**Run:** `npx playwright test workflow`

---

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Specific Test File
```bash
npx playwright test smoke.spec.ts
```

### Run Tests in UI Mode (Recommended for Development)
```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run Tests in Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run Tests with Debug
```bash
npx playwright test --debug
```

### Generate Test Report
```bash
npx playwright test
npx playwright show-report
```

---

## Prerequisites

1. **Backend Service Running**
   - The backend API must be running on `http://localhost:8000`
   - Database and Redis should be available

2. **Frontend Dev Server Running**
   - Frontend must be running on `http://localhost:3000`
   - Start with: `npm run dev`

3. **Test Fixtures**
   - Sample images must exist in `../backend/tests/fixtures/`
   - At least `sample_temperature.png` should be available

---

## Configuration

The test configuration is in `playwright.config.ts`:

```typescript
{
  baseURL: 'http://localhost:3000',
  testDir: './tests/e2e',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
}
```

---

## Test Structure

Each test file follows this pattern:

```typescript
test.describe("Feature Name", () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test("specific functionality", async ({ page }) => {
    // Test implementation
  });
});
```

---

## Best Practices

1. **Use Semantic Locators**: Tests use `getByRole`, `getByText`, `getByLabel` for robust selectors
2. **Wait for Elements**: Tests use `expect().toBeVisible()` with appropriate timeouts
3. **Test Isolation**: Each test is independent and can run in any order
4. **Descriptive Names**: Test names clearly describe what is being tested
5. **Group Related Tests**: `test.describe` blocks group related functionality

---

## Common Issues & Solutions

### Issue: "Cannot navigate to invalid URL"
**Solution**: Ensure `baseURL` is configured in `playwright.config.ts`

### Issue: "Timeout waiting for element"
**Solution**: 
- Ensure backend and frontend services are running
- Check if element selector is correct
- Increase timeout if needed: `{ timeout: 15000 }`

### Issue: "Element not found"
**Solution**: 
- Verify the component is actually rendered
- Check for loading states
- Use `page.waitForSelector()` for dynamic content

### Issue: "Tests fail in CI but pass locally"
**Solution**:
- Check service availability in CI environment
- Increase timeouts for CI
- Ensure proper test data setup

---

## Coverage

The test suite covers:

- ✅ Page loads and navigation
- ✅ Form interactions and validation
- ✅ File uploads
- ✅ Sample image processing
- ✅ Data grid interactions
- ✅ API integrations
- ✅ Error handling
- ✅ Loading states
- ✅ Complete user workflows

---

## Continuous Integration

To run tests in CI:

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test

- name: Upload test report
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

---

## Future Enhancements

- [ ] Add visual regression tests
- [ ] Add accessibility (a11y) tests
- [ ] Add performance tests
- [ ] Add API mocking for isolated tests
- [ ] Add test data factories
- [ ] Add parallel execution optimization

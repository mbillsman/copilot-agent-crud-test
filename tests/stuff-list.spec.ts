import { test, expect } from '@playwright/test';

test.describe('Stuff List Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the stuff list page
    await page.goto('/');
  });

  test('should display page header and table structure', async ({ page }) => {
    // Check for main page elements
    await expect(page.locator('h1')).toContainText('Stuff Manager');
    await expect(page.locator('text=Manage your stuff items')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Stuff List');

    // Check for table headers
    await expect(page.locator('th', { hasText: 'ID' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Name' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Description' })).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    // Check for loading spinner when page first loads
    await expect(page.locator('[role="status"]')).toBeVisible();
    
    // Wait for loading to complete
    await expect(page.locator('[role="status"]')).not.toBeVisible({ timeout: 10000 });
  });

  test('should display stuff items or empty state', async ({ page }) => {
    // Wait for the page to load completely
    await page.waitForSelector('table', { timeout: 10000 });

    // Check if we have data or empty state
    const hasData = await page.locator('tbody tr').count();
    
    if (hasData > 0) {
      // If we have data, verify it's displayed properly
      await expect(page.locator('tbody tr').first()).toBeVisible();
      
      // Check that we have table data cells
      await expect(page.locator('tbody tr td').first()).toBeVisible();
    } else {
      // If no data, check for empty state message
      await expect(page.locator('text=No stuff items found.')).toBeVisible();
    }
  });

  test('should handle pagination when data is available', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('table', { timeout: 10000 });

    // Check if we have enough data for pagination
    const hasData = await page.locator('tbody tr').count();
    
    if (hasData >= 10) {
      // Test pagination controls exist
      await expect(page.locator('button', { hasText: 'Previous' }).first()).toBeVisible();
      await expect(page.locator('button', { hasText: 'Next' }).first()).toBeVisible();
      
      // Previous button should be disabled on first page
      await expect(page.locator('button', { hasText: 'Previous' }).first()).toBeDisabled();
      
      // If we have exactly 10 items, Next button should be disabled
      // If we have more than 10 items, test clicking Next
      const nextButton = page.locator('button', { hasText: 'Next' }).first();
      const isNextEnabled = await nextButton.isEnabled();
      
      if (isNextEnabled) {
        // Click next button and verify page changes
        await nextButton.click();
        
        // Wait for page change (page number should update)
        await expect(page.locator('text=Page 2')).toBeVisible({ timeout: 5000 });
        
        // Previous button should now be enabled
        await expect(page.locator('button', { hasText: 'Previous' }).first()).toBeEnabled();
        
        // Test going back to previous page
        await page.locator('button', { hasText: 'Previous' }).first().click();
        
        // Should be back on page 1
        await expect(page.locator('text=Page 1')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return an error
    await page.route('**/stuff*', route => {
      route.abort('failed');
    });

    // Reload the page to trigger the error
    await page.reload();

    // Check for error message
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Error!')).toBeVisible();
    await expect(page.locator('text=Failed to fetch stuff items')).toBeVisible();
  });

  test('should display empty state when API returns no data', async ({ page }) => {
    // Mock API to return empty array
    await page.route('**/stuff*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });

    // Reload the page to trigger the empty response
    await page.reload();

    // Check for empty state message
    await expect(page.locator('text=No stuff items found.')).toBeVisible({ timeout: 10000 });
  });

  test('should display mocked data correctly', async ({ page }) => {
    // Mock API to return test data
    const mockData = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Test Item ${i + 1}`,
      description: `Description for test item ${i + 1}`
    }));

    await page.route('**/stuff*', route => {
      const url = new URL(route.request().url());
      const page = parseInt(url.searchParams.get('page') || '1');
      const pageSize = 10;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = mockData.slice(startIndex, endIndex);

      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(pageData)
      });
    });

    // Reload the page to get mocked data
    await page.reload();

    // Wait for data to load
    await expect(page.locator('tbody tr')).toHaveCount(10, { timeout: 10000 });

    // Verify first item
    await expect(page.locator('text=Test Item 1')).toBeVisible();
    await expect(page.locator('text=Description for test item 1')).toBeVisible();

    // Verify last item on first page
    await expect(page.locator('text=Test Item 10')).toBeVisible();

    // Test pagination to second page
    const nextButton = page.locator('button', { hasText: 'Next' }).first();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Wait for second page to load
    await expect(page.locator('text=Page 2')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('tbody tr')).toHaveCount(2, { timeout: 5000 });

    // Verify items on second page
    await expect(page.locator('text=Test Item 11')).toBeVisible();
    await expect(page.locator('text=Test Item 12')).toBeVisible();

    // Next button should be disabled on last page
    await expect(page.locator('button', { hasText: 'Next' }).first()).toBeDisabled();
  });
});

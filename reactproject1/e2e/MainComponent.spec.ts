// tests/mainComponent.spec.ts
import { test, expect } from '@playwright/test';

test.describe('MainComponent', () => {
    test('should load the main component and display the search bar', async ({ page }) => {
        await page.goto('./'); // Adjust the URL to match your local development server
        await expect(page).toHaveTitle(/Reservation/); // Adjust the title to match your app's title

        // Verify the search bar is present
        await expect(page.getByTestId(`arrivalDate`)).toBeVisible();
        await expect(page.getByTestId(`departureDate`)).toBeVisible();
        await expect(page.locator('input[name="firstName"]')).toBeVisible();
        await expect(page.locator('input[name="lastName"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('button:has-text("Create")')).toBeVisible();
        await expect(page.locator('button:has-text("Search")')).toBeVisible();
        await expect(page.locator('button:has-text("Clear")')).toBeVisible();
    });

    test('should perform a search and display results', async ({ page }) => {
        await page.goto('./');

        //// Fill out the search criteria
        await page.fill('input[name="firstName"]', 'John');

        // Click the search button
        await page.click('button:has-text("Search")');

        // Verify the search results are displayed
        await page.waitForTimeout(5000);
        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('table tr')).toHaveCount(3); // Adjust count as per your mock data

        await page.fill('input[name="firstName"]', 'RandomNameNotExist');

        await page.click('button:has-text("Search")');

        await page.waitForTimeout(5000);
        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('table tr')).toHaveCount(1); // Adjust count as per your mock data
    });

    test('should perform a search and display results, and should perform a clear and display result', async ({ page }) => {
        await page.goto('./');

        await page.fill('input[name="firstName"]', 'RandomNameNotExist');

        await page.click('button:has-text("Search")');
        await page.waitForTimeout(5000);

        await expect(page.locator('table')).toBeVisible();
        await expect(page.locator('table tr')).toHaveCount(1); // Adjust count as per your mock data

        await page.click('button:has-text("Clear")');
        await page.waitForTimeout(5000);
        // Perform actions after waiting
        const tableRows = await page.locator('table tbody tr');
        const rowCount = await tableRows.count();
        await expect(rowCount).toBeGreaterThan(1);
    });
});

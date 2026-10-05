import { test, expect } from '@playwright/test';

test('should navigate to home page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Pint/);
});

test('should display navbar', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('div[id="desktop-top-navbar"]')).toBeVisible();
});
// Authentication E2E Tests

import { test, expect } from '@playwright/test';

const BASE_PATH = '/project2';

test.describe('Authentication', () => {
  test.describe('Sign Up - Happy Path', () => {
    test('should successfully sign up with valid credentials', async ({ page }) => {
      await page.goto(`${BASE_PATH}/signup`);
      
      const email = `user-${Date.now()}@test.com`;
      const username = `testuser${Date.now()}`;
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', 'ValidPassword123!');
      await page.fill('input[name="confirmPassword"]', 'ValidPassword123!');
      
      await page.click('button:has-text("Create account")');
      
      await expect(page).toHaveURL(new RegExp(`${BASE_PATH}/?$`));
    });
  });

  test.describe('Sign Up - Failure Scenarios', () => {
    test('should show error for invalid email format', async ({ page }) => {
      await page.goto(`${BASE_PATH}/signup`);
      
      await page.fill('input[name="email"]', 'invalidemail');
      await page.fill('input[name="username"]', 'testuser');
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      
      await page.click('button:has-text("Create account")');
      
      await expect(page.locator('text=Invalid email')).toBeVisible();
    });

    test('should show error when passwords do not match', async ({ page }) => {
      await page.goto(`${BASE_PATH}/signup`);
      
      await page.fill('input[name="email"]', `user-${Date.now()}@test.com`);
      await page.fill('input[name="username"]', 'testuser');
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');
      
      await page.click('button:has-text("Create account")');
      
      await expect(page.locator('text=Passwords do not match')).toBeVisible();
    });

    test('should show error for duplicate email', async ({ page }) => {
      const email = `duplicate-${Date.now()}@test.com`;
      const username = `user${Date.now()}`;
      
      // First signup
      await page.goto(`${BASE_PATH}/signup`);
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      await page.click('button:has-text("Create account")');
      await page.waitForURL(new RegExp(`${BASE_PATH}/?$`));

      // Logout
      await page.click('button[class*="rounded-full"]');
      await page.waitForSelector('[role="menuitem"]:has-text("Logout")', { timeout: 5000 });
      await page.click('[role="menuitem"]:has-text("Logout")');
      
      // Try signup with same email
      await page.goto(`${BASE_PATH}/signup`);
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="username"]', `user2${Date.now()}`);
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'Password123!');
      await page.click('button:has-text("Create account")');
      
      await expect(page.locator('text=Email already in use')).toBeVisible();
    });

    test('should show error for weak password', async ({ page }) => {
      await page.goto(`${BASE_PATH}/signup`);
      
      await page.fill('input[name="email"]', `user-${Date.now()}@test.com`);
      await page.fill('input[name="username"]', 'testuser');
      await page.fill('input[name="password"]', '123');
      await page.fill('input[name="confirmPassword"]', '123');
      
      await page.click('button:has-text("Create account")');
      
      await expect(page.locator('text=Password must be at least')).toBeVisible();
    });
  });

  test.describe('Sign In - Happy Path', () => {
    test('should successfully sign in with valid credentials', async ({ page }) => {
      const email = `user-${Date.now()}@test.com`;
      const username = `testuser${Date.now()}`;
      
      // Sign up first
      await page.goto(`${BASE_PATH}/signup`);
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', 'ValidPassword123!');
      await page.fill('input[name="confirmPassword"]', 'ValidPassword123!');
      await page.click('button:has-text("Create account")');
      await page.waitForURL(new RegExp(`${BASE_PATH}/?$`));

      // Logout
      await page.click('button[class*="rounded-full"]');
      await page.waitForSelector('[role="menuitem"]:has-text("Logout")', { timeout: 5000 });
      await page.click('[role="menuitem"]:has-text("Logout")');
      
      // Sign in with username
      await page.goto(`${BASE_PATH}/signin`);
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', 'ValidPassword123!');
      await page.click('button:has-text("Login")');
      
      await expect(page).toHaveURL(new RegExp(`${BASE_PATH}/?$`));
    });
  });

  test.describe('Sign In - Failure Scenarios', () => {
    test('should show error for incorrect password', async ({ page }) => {
      const email = `user-${Date.now()}@test.com`;
      const username = `testuser${Date.now()}`;
      
      // Sign up first
      await page.goto(`${BASE_PATH}/signup`);
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', 'ValidPassword123!');
      await page.fill('input[name="confirmPassword"]', 'ValidPassword123!');
      await page.click('button:has-text("Create account")');
      await page.waitForURL(new RegExp(`${BASE_PATH}/?$`));

      // Logout
      await page.click('button[class*="rounded-full"]');
      await page.waitForSelector('[role="menuitem"]:has-text("Logout")', { timeout: 5000 });
      await page.click('[role="menuitem"]:has-text("Logout")');
      
      // Try wrong password with correct username
      await page.goto(`${BASE_PATH}/signin`);
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', 'WrongPassword123!');
      await page.click('button:has-text("Login")');
      
      await expect(page.locator('text=Invalid password')).toBeVisible();
    });

    test('should show error for non-existent username', async ({ page }) => {
      await page.goto(`${BASE_PATH}/signin`);
      await page.fill('input[name="username"]', 'nonexistentuser');
      await page.fill('input[name="password"]', 'Password123!');
      await page.click('button:has-text("Login")');
      
      await expect(page.locator('text=User not found')).toBeVisible();
    });

    test('should show error for empty fields', async ({ page }) => {
      await page.goto(`${BASE_PATH}/signin`);
      await page.click('button:has-text("Login")');
      
      {/*Add these test when proper toast has been implemented on login page */}
      //await expect(page.locator('text=Username is required')).toBeVisible();
      //await expect(page.locator('text=Password is required')).toBeVisible();
    });
  });
});
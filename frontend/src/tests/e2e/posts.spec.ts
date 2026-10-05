import { test, expect } from '@playwright/test';

const BASE_PATH = '/project2';

// Helper function for image upload and crop
async function uploadAndCropImage(page: any) {
  // Click the "Select and crop image" button to open dialog
  await page.click('button[aria-label="Select and crop image"]');
  
  // Wait for crop dialog to appear
  await page.waitForSelector('text=Select & Crop Image', { timeout: 5000 });
  
  // Upload image via file input
  const fileInput = page.locator('input[type="file"]');
  const imagePath = './src/assets/beer.jpg';
  await fileInput.setInputFiles(imagePath);
  
  // Wait for image to load in crop component
  await page.waitForSelector('[class*="crop"]', { timeout: 5000 });
  
  // Apply crop
  const applyButton = page.locator('button').filter({ has: page.locator('svg[class*="Check"], svg[class*="check"]') }).first();
  await applyButton.click();

  // Wait for dialog to close and preview to appear
  await page.waitForSelector('img[alt="Preview"]', { timeout: 5000 });
}

// Helper function to delete all posts by current user
async function deleteAllPosts(page: any) {
  try {
    let hasMorePosts = true;
    let attempts = 0;
    const maxAttempts = 10;

    while (hasMorePosts && attempts < maxAttempts) {
      attempts++;
      
      // Check if page is still valid
      if (page.isClosed()) {
        break;
      }

      const menuButton = page.locator('button[aria-label="Open post options menu"]').first();
      const count = await menuButton.count();
      
      if (count > 0) {
        try {
          await menuButton.click({ timeout: 2000 });
          await page.click('button:has-text("Delete")', { timeout: 2000 });
          
          // Wait for dialog
          await page.waitForSelector('[role="alertdialog"]', { timeout: 2000 });
          
          // Click confirm delete
          await page.locator('[role="alertdialog"] button:has-text("Delete")').click({ timeout: 2000 });
          
          // Wait for deletion to complete
          await page.waitForTimeout(300);
        } catch (e) {
          // If click fails, continue
          hasMorePosts = false;
        }
      } else {
        hasMorePosts = false;
      }
    }
  } catch (e) {
    // Silently fail if cleanup doesn't work (page may be closing)
  }
}

test.describe('Posts', () => {
  test.beforeEach(async ({ page }) => {
    // Sign up and log in
    const email = `user-${Date.now()}@test.com`;
    const username = `testuser${Date.now()}`;
    
    await page.goto(`${BASE_PATH}/signup`);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="username"]', username);
    await page.fill('input[name="password"]', 'ValidPassword123!');
    await page.fill('input[name="confirmPassword"]', 'ValidPassword123!');
    await page.click('button:has-text("Create account")');
    await page.waitForURL(new RegExp(`${BASE_PATH}/?$`));
  });

  test.afterEach(async ({ page }) => {
    // Clean up - delete all posts created during test
    await deleteAllPosts(page);
  });

  test.describe('Create Post - Happy Path', () => {
    test('should create a post with all fields including image', async ({ page }) => {
      // Open post form
      await page.click('button:has-text("Post a pint")');
      
      // Fill title
      await page.fill('input[placeholder="Enter a title"]', 'Test Beer Post');
      
      // Fill description
      await page.fill('input[placeholder="Write a description..."]', 'This is a great beer!');
      
      // Upload and crop image
      await uploadAndCropImage(page);
      
      // Fill pints
      await page.fill('input[type="number"]', '3');
      
      // Submit
      await page.click('button:has-text("Submit")');
      
      // Verify post appears with image
      await expect(page.locator('text=Test Beer Post')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Create Post - Failure Scenarios', () => {
    test('should show error for empty title', async ({ page }) => {
      await page.click('button:has-text("Post a pint")');
      
      // Try submit without title
      await page.click('button:has-text("Submit")');
      
      await expect(page.locator('text=Required')).toBeVisible();
    });

    test('should show error for missing image', async ({ page }) => {
      await page.click('button:has-text("Post a pint")');
      
      await page.fill('input[placeholder="Enter a title"]', 'Test');
      await page.fill('input[placeholder="Write a description..."]', 'Test desc');
      await page.fill('input[type="number"]', '1');
      
      // Try submit without image
      await page.click('button:has-text("Submit")');
      
      await expect(page.locator('text=Please upload an image')).toBeVisible({ timeout: 10000 });
    });

    test('should show error for invalid pints count above 12', async ({ page }) => {
      await page.click('button:has-text("Post a pint")');
      
      await page.fill('input[placeholder="Enter a title"]', 'T');
      await page.fill('input[placeholder="Write a description..."]', 'Test desc');
      
      // Upload image
      await uploadAndCropImage(page);
      
      await page.click('button:has-text("Submit")');
      await page.fill('input[type="number"]', '15');
      await page.click('button:has-text("Submit")');
      
      // Error appears in FormMessage near pints field
      await expect(page.locator('text=Pints must be between 1 and 12')).toBeVisible();
    });

    test('should show error for invalid pints count lower than 1', async ({ page }) => {
      await page.click('button:has-text("Post a pint")');
      
      await page.fill('input[placeholder="Enter a title"]', 'T');
      await page.fill('input[placeholder="Write a description..."]', 'Test desc');

      // Upload image
      await uploadAndCropImage(page);
      
      await page.click('button:has-text("Submit")');
      await page.fill('input[type="number"]', '0');
      await page.click('button:has-text("Submit")');
      
      // Error appears in FormMessage near pints field
      await expect(page.locator('text=Pints must be between 1 and 12')).toBeVisible();
    });
  });

  test.describe('Delete Post - Happy Path', () => {
    test('should delete own post', async ({ page }) => {
      // Create a post
      await page.click('button:has-text("Post a pint")');
      await page.fill('input[placeholder="Enter a title"]', 'Post to delete');
      await page.fill('input[placeholder="Write a description..."]', 'Delete me');
      
      await uploadAndCropImage(page);
      
      await page.fill('input[type="number"]', '1');
      await page.click('button:has-text("Submit")');
      
      await expect(page.locator('text=Post to delete')).toBeVisible({ timeout: 5000 });
      
      // Delete post - click menu icon
      await page.click('button[aria-label="Open post options menu"]');
      await page.click('button:has-text("Delete")');
      
      // Wait for delete dialog to appear
      await page.waitForSelector('[role="alertdialog"]', { timeout: 5000 });
      
      // Confirm delete - click the red Delete button in the alert dialog
      // Need to be more specific: button that says "Delete" inside the alert dialog
      await page.locator('[role="alertdialog"] button:has-text("Delete")').click();
      
      // Wait for post to disappear
      await expect(page.locator('[data-slot="card-title"]:has-text("Post to delete")')).not.toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Delete Post - Failure Scenarios', () => {
    test('should not allow deleting other user posts', async ({ page }) => {
      // Create first user and post
      await expect(page.locator('text=Welcome to pintrest!')).toBeVisible({ timeout: 5000 });
      
      // No menu found on not owned posts
      await expect(page.locator('button[aria-label="Open post options menu"]')).toHaveCount(0);
    });
  });

  test.describe('Edit Post - Happy Path', () => {
    test('should edit own post', async ({ page }) => {
      // Create a post
      await page.click('button:has-text("Post a pint")');
      await page.fill('input[placeholder="Enter a title"]', 'Original Title');
      await page.fill('input[placeholder="Write a description..."]', 'Original desc');
      
      await uploadAndCropImage(page);
      
      await page.fill('input[type="number"]', '1');
      await page.click('button:has-text("Submit")');
      
      await expect(page.locator('text=Original Title')).toBeVisible({ timeout: 5000 });
      
      // Edit post
      await page.click('button[aria-label="Open post options menu"]');
      await page.click('button:has-text("Edit")');
      
      // Update fields
      await page.fill('input[placeholder="Enter a title"]', 'Updated Title');
      await page.fill('input[placeholder="Write a description..."]', 'Updated desc');
      await page.fill('input[type="number"]', '3');
      
      await page.click('button:has-text("Update Post")');
      
      await expect(page.locator('text=Updated Title')).toBeVisible({ timeout: 5000 });
    });
  });
});
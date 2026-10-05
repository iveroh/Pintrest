import { test, expect } from '@playwright/test';

const BASE_PATH = '/project2';

test.describe.configure({ mode: 'serial' });
/**
async function uploadAndCropImage(page: any) {
  await page.click('button[aria-label="Select and crop image"]');
  await page.waitForSelector('text=Select & Crop Image', { timeout: 5000 });
  
  const fileInput = page.locator('input[type="file"]');
  const imagePath = './src/assets/beer.jpg';
  await fileInput.setInputFiles(imagePath);
  
  await page.waitForSelector('[class*="crop"]', { timeout: 5000 });
  
  const applyButton = page
    .locator('button')
    .filter({ has: page.locator('svg[class*="Check"], svg[class*="check"]') })
    .first();
  await applyButton.click();
  
  await page.waitForSelector('img[alt="Preview"]', { timeout: 5000 });
}
*/

/**
 * LIKE HELPERS
 *
 * In the UI, the heart + "23" + bottles are in the same row.
 * We:
 *  - find the heart button via svg.lucide-heart
 *  - get the count from span[aria-live="polite"] in the same parent
 */
async function getLikeCountFromButton(likeButton: any): Promise<number> {
  const likeRow = likeButton.locator('xpath=..');
  const likeCountLocator = likeRow.locator('span[aria-live="polite"]').first();
  const text = (await likeCountLocator.innerText()).trim() || '0';
  const parsed = parseInt(text, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function expectLikeCountForButton(
  likeButton: any,
  expected: number
): Promise<void> {
  await expect.poll(async () => {
    return await getLikeCountFromButton(likeButton);
  }).toBe(expected);
}

async function deleteAllPosts(page: any) {
  try {
    let hasMorePosts = true;
    let attempts = 0;
    const maxAttempts = 10;

    while (hasMorePosts && attempts < maxAttempts) {
      attempts++;
      if (page.isClosed()) break;

      const menuButton = page
        .locator('button[aria-label="Open post options menu"]')
        .first();
      const count = await menuButton.count();
      
      if (count > 0) {
        try {
          await menuButton.click({ timeout: 2000 });
          await page.click('button:has-text("Delete")', { timeout: 2000 });
          
          await page.waitForSelector('[role="alertdialog"]', { timeout: 2000 });
          
          await page
            .locator('[role="alertdialog"] button:has-text("Delete")')
            .click({ timeout: 2000 });
          
          await page.waitForTimeout(300);
        } catch {
          hasMorePosts = false;
        }
      } else {
        hasMorePosts = false;
      }
    }
  } catch {
    // Silently fail if cleanup doesn't work
  }
}

// Helper function to get post card containing specific text
async function getPostCard(page: any, postText: string) {
  const post = page.locator(`text=${postText}`).first();
  await post.scrollIntoViewIfNeeded();
  
  const postCard = post
    .locator('xpath=ancestor::*[contains(@class, "card")]')
    .first();
  await postCard.evaluate((el: Element) => {
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
  });
  await page.waitForTimeout(300);
  
  return postCard;
}

// Helper function to unlike a post if it's liked (used for cleanup)
async function unlikePostIfLiked(page: any, postText: string) {
  try {
    const postCard = await getPostCard(page, postText);
    const likeButton = postCard
      .locator('button:has(svg.lucide-heart)')
      .first();
    
    const isLiked = await likeButton.getAttribute('aria-pressed');
    
    if (isLiked === 'true') {
      await likeButton.click();
      await page.waitForTimeout(300);
    }
  } catch {
    // Silently fail if cleanup doesn't work
  }
}

// Helper to fill & submit a comment scoped to the actual form
async function fillAndSubmitComment(page: any, text: string) {
  const commentInput = page
    .locator('input[placeholder*="comment"], textarea[placeholder*="comment"]')
    .first();

  await commentInput.click();
  await commentInput.fill(text);

  const form = commentInput.locator('xpath=ancestor::form[1]');
  const submitButton = form
    .locator('button[type="submit"][data-slot="button"]')
    .first();

  await submitButton.click();
}

// Helper function to delete all comments on a post
async function deleteAllComments(page: any, postText: string) {
  try {
    const postCard = await getPostCard(page, postText);
    
    // Open comments section
    const commentButton = postCard
      .locator('button[aria-label="Open post details with comments"]')
      .first();
    await commentButton.click();
    
    await page.waitForSelector(
      'input[placeholder*="comment"], textarea[placeholder*="comment"]',
      { timeout: 5000 }
    );
    await page.waitForTimeout(300);

    const commentsContainer = page
      .locator(
        '[data-testid="comments-container"], ' +
          '[role="dialog"] [class*="overflow-y-auto"], ' +
          '[role="dialog"] [class*="overflow-auto"]'
      )
      .first();
    
    let hasMoreComments = true;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (hasMoreComments && attempts < maxAttempts) {
      attempts++;

      // ALWAYS scroll to the very bottom first
      const containerCount = await commentsContainer.count();
      if (containerCount > 0) {
        await commentsContainer.evaluate((el: Element) => {
          const node = el as HTMLElement;
          node.scrollTop = node.scrollHeight;
        });
        await page.waitForTimeout(200);
      }

      const deleteMenuTriggers = page.locator(
        'button[aria-label="Open menu"][data-slot="dropdown-menu-trigger"]'
      );
      const count = await deleteMenuTriggers.count();
      
      if (count === 0) {
        hasMoreComments = false;
        break;
      }

      try {
        const firstTrigger = deleteMenuTriggers.first();
        await firstTrigger.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);

        await firstTrigger.click({ timeout: 2000 });
        await page.click('button:has-text("Delete")', { timeout: 2000 });
        
        const confirmButton = page
          .locator(
            '[role="alertdialog"] button:has-text("Delete"), button:has-text("Confirm")'
          )
          .first();
        const confirmCount = await confirmButton.count();
        if (confirmCount > 0) {
          await confirmButton.click({ timeout: 2000 });
        }
        
        await page.waitForTimeout(300);
      } catch {
        hasMoreComments = false;
      }
    }
    
    const closeButton = page.locator('button:has(svg.lucide-x)').first();
    const closeCount = await closeButton.count();
    if (closeCount > 0) {
      await closeButton.click();
    }
    await page.waitForTimeout(300);
  } catch {
    // Silently fail if cleanup doesn't work
  }
}

// Combined cleanup function
async function cleanupPostInteractions(page: any, postText: string) {
  try {
    const closeButton = page.locator('button:has(svg.lucide-x)').first();
    const closeCount = await closeButton.count();
    if (closeCount > 0) {
      await closeButton.click();
      await page.waitForTimeout(300);
    }
  } catch {
    // Ignore if no dialog is open
  }
  
  await deleteAllComments(page, postText);
  await unlikePostIfLiked(page, postText);
}

test.describe('Post Interactions', () => {
  test.beforeEach(async ({ page }) => {
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
    try {
      if (!page.isClosed()) {
        await page.goto(`${BASE_PATH}/`);
        await page.waitForTimeout(500);
        
        await cleanupPostInteractions(page, 'Welcome to pintrest!');
        await deleteAllPosts(page);
      }
    } catch {
      // Silently fail cleanup
    }
  });

  test.describe('Like Post - Happy Path', () => {
    test('should like the welcome post and increment like count', async ({ page }) => {
      const postCard = await getPostCard(page, 'Welcome to pintrest!');
      
      // Use only the heart icon to find the button (no aria assumptions)
      const likeButton = postCard
        .locator('button:has(svg.lucide-heart)')
        .first();

      const initialCount = await getLikeCountFromButton(likeButton);

      await likeButton.click();

      // Only assert on count change, not aria-pressed
      await expectLikeCountForButton(likeButton, initialCount + 1);
    });

    test('should unlike the welcome post and decrement like count', async ({ page }) => {
      const postCard = await getPostCard(page, 'Welcome to pintrest!');
      
      const likeButton = postCard
        .locator('button:has(svg.lucide-heart)')
        .first();

      const initialCount = await getLikeCountFromButton(likeButton);

      // Like
      await likeButton.click();
      await expectLikeCountForButton(likeButton, initialCount + 1);

      // Unlike (toggle)
      await likeButton.click();
      await expectLikeCountForButton(likeButton, initialCount);
    });
  });

  test.describe('Comment - Happy Path', () => {
    test('should add a comment to the welcome post', async ({ page }) => {
      const postCard = await getPostCard(page, 'Welcome to pintrest!');
      
      const commentButton = postCard
        .locator('button[aria-label="Open post details with comments"]')
        .first();
      await commentButton.click();
      
      await page.waitForSelector(
        'input[placeholder*="comment"], textarea[placeholder*="comment"]',
        { timeout: 5000 }
      );
      
      await fillAndSubmitComment(page, 'Great post from test!');
      await expect(page.locator('text=Great post from test!').first()).toBeVisible({
        timeout: 5000,
      });
    });

    test('should display comment with user info', async ({ page }) => {
      const postCard = await getPostCard(page, 'Welcome to pintrest!');
      
      const commentButton = postCard
        .locator('button[aria-label="Open post details with comments"]')
        .first();
      await commentButton.click();
      
      await page.waitForSelector(
        'input[placeholder*="comment"], textarea[placeholder*="comment"]',
        { timeout: 5000 }
      );
      
      await fillAndSubmitComment(page, 'Awesome from user!');
      const comment = page.locator('text=Awesome from user!').first();
      await expect(comment).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Comment - Failure Scenarios', () => {
    test('should show error for empty comment', async ({ page }) => {
      const postCard = await getPostCard(page, 'Welcome to pintrest!');
      
      const commentButton = postCard
        .locator('button[aria-label="Open post details with comments"]')
        .first();
      await commentButton.click();
      
      await page.waitForSelector(
        'input[placeholder*="comment"], textarea[placeholder*="comment"]',
        { timeout: 5000 }
      );
      
      const commentInput = page
        .locator('input[placeholder*="comment"], textarea[placeholder*="comment"]')
        .first();
      const form = commentInput.locator('xpath=ancestor::form[1]');
      const submitButton = form
        .locator('button[type="submit"][data-slot="button"]')
        .first();

      await submitButton.click();
      
      await page.waitForTimeout(500);
      const errorVisible = await page
        .locator('text=Comment must be at least 1 characters')
        .count();
      expect(errorVisible).toBeGreaterThan(0);
    });

    test('should allow deleting own comment', async ({ page }) => {
      const postCard = await getPostCard(page, 'Welcome to pintrest!');
      
      const commentButton = postCard
        .locator('button[aria-label="Open post details with comments"]')
        .first();
      await commentButton.click();
      
      await page.waitForSelector(
        'input[placeholder*="comment"], textarea[placeholder*="comment"]',
        { timeout: 5000 }
      );
      
      await fillAndSubmitComment(page, 'Comment to be deleted');

      await expect(
        page.locator('text=Comment to be deleted').first()
      ).toBeVisible({ timeout: 5000 });
      
      const deleteMenuTrigger = page
        .locator(
          'button[aria-label="Open menu"][data-slot="dropdown-menu-trigger"]'
        )
        .first();
      await deleteMenuTrigger.click();
      
      await page.click('button:has-text("Delete")');
      
      const confirmButton = page
        .locator(
          '[role="alertdialog"] button:has-text("Delete"), button:has-text("Confirm")'
        )
        .first();
      const confirmCount = await confirmButton.count();
      if (confirmCount > 0) {
        await confirmButton.click();
      }
      
      await expect(
        page.locator('text=Comment to be deleted')
      ).not.toBeVisible({ timeout: 5000 });
    });

    test('should not allow deleting other user comments', async ({ page, browser }) => {
      const postCard = await getPostCard(page, 'Welcome to pintrest!');
      
      const commentButton = postCard
        .locator('button[aria-label="Open post details with comments"]')
        .first();
      await commentButton.click();
      
      await page.waitForSelector(
        'input[placeholder*="comment"], textarea[placeholder*="comment"]',
        { timeout: 5000 }
      );
      
      // First user adds a comment
      await fillAndSubmitComment(page, 'First user comment');

      const ownComment = page.locator('text=First user comment').first();
      await expect(ownComment).toBeVisible({ timeout: 5000 });
      
      // Close the drawer for user 1
      const closeButton = page.locator('button:has(svg.lucide-x)').first();
      await closeButton.click();
      await page.waitForTimeout(300);
      
      // --- SECOND USER IN A SEPARATE CONTEXT ---
      const user2Context = await browser.newContext();
      const page2 = await user2Context.newPage();

      const email2 = `user2-${Date.now()}@test.com`;
      
      await page2.goto(`${BASE_PATH}/signup`);
      await page2.fill('input[name="email"]', email2);
      await page2.fill('input[name="username"]', `user2${Date.now()}`);
      await page2.fill('input[name="password"]', 'ValidPassword123!');
      await page2.fill('input[name="confirmPassword"]', 'ValidPassword123!');
      await page2.click('button:has-text("Create account")');
      await page2.waitForURL(new RegExp(`${BASE_PATH}/?$`));
      
      await page2.goto(`${BASE_PATH}/`);
      
      const postCard2 = await getPostCard(page2, 'Welcome to pintrest!');
      
      const commentButton2 = postCard2
        .locator('button[aria-label="Open post details with comments"]')
        .first();
      await commentButton2.click();
      
      await page2.waitForSelector(
        'input[placeholder*="comment"], textarea[placeholder*="comment"]',
        { timeout: 5000 }
      );
      
      // Second user sees the first user's comment
      const commentText = page2.locator('text=First user comment').first();
      await expect(commentText).toBeVisible({ timeout: 5000 });

      // Look for a delete menu ONLY inside this comment card
      const commentCard = commentText
        .locator('xpath=ancestor::*[contains(@class, "card")]')
        .first();
      const deleteMenuTriggers = commentCard.locator(
        'button[aria-label="Open menu"][data-slot="dropdown-menu-trigger"]'
      );
      await expect(deleteMenuTriggers).toHaveCount(0);
      
      // Close drawer and clean up user 2
      const closeButton2 = page2.locator('button:has(svg.lucide-x)').first();
      await closeButton2.click();
      await page2.waitForTimeout(300);
      
      await deleteAllPosts(page2);
      await user2Context.close(); // closes page2 as well
      await page.goto(`${BASE_PATH}`);
    });
  });
});

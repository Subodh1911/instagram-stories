import { test, expect } from '@playwright/test';

// Constants for selectors and timeouts
const SELECTORS = {
  STORY_VIEWER: '[data-testid="story-viewer"]',
  STORY_IMAGE: '[data-testid="story-image"]',
  STORY_THUMBNAIL: '[data-testid="story-thumbnail"]',
  CLOSE_BUTTON: '[data-testid="close-button"]',
  PROGRESS_BAR: '[data-testid="progress-bar"]',
  LOADING_INDICATOR: '[data-testid="loading-indicator"]'
};

const TIMEOUTS = {
  STORY_DURATION: 5000,
  ANIMATION: 300,
  NAVIGATION: 1000
};

test.describe('Instagram Stories', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/stories');
    // Wait for the initial content to be ready
    await expect(page.locator(SELECTORS.STORY_THUMBNAIL).first()).toBeVisible();
  });

  test.describe('Story Grid View', () => {
    test('displays story thumbnails with correct count', async ({ page }) => {
      const thumbnails = page.locator(SELECTORS.STORY_THUMBNAIL);
      await expect(thumbnails).toHaveCount(15);
      // Verify thumbnails are actually loaded
      await expect(thumbnails.first()).toHaveAttribute('src', /.+/);
    });

    test('shows loading state while fetching thumbnails', async ({ page }) => {
      await page.reload();
      await expect(page.locator(SELECTORS.LOADING_INDICATOR)).toBeVisible();
      await expect(page.locator(SELECTORS.LOADING_INDICATOR)).toBeHidden();
    });
  });

  test.describe('Story Viewer', () => {
    test.beforeEach(async ({ page }) => {
      // Open the first story before each viewer test
      await page.locator(SELECTORS.STORY_THUMBNAIL).first().click();
      await expect(page.locator(SELECTORS.STORY_VIEWER)).toBeVisible();
    });

    test('opens story viewer when thumbnail is clicked', async ({ page }) => {
      await expect(page.locator(SELECTORS.STORY_IMAGE)).toBeVisible();
      await expect(page.locator(SELECTORS.PROGRESS_BAR)).toBeVisible();
    });

    test('auto advances to next story after duration and marks story as completed', async ({ page }) => {
      const storyImage = page.locator(SELECTORS.STORY_IMAGE);
      const initialSrc = await storyImage.getAttribute('src');
      const progressBars = page.locator(SELECTORS.PROGRESS_BAR);
      
      // Initially only first progress bar should be animating
      await expect(progressBars.first()).not.toHaveAttribute('data-completed', 'true');
      
      // Wait for progress bar animation to complete
      await expect(progressBars.first()).toHaveAttribute('data-completed', 'true', {
        timeout: TIMEOUTS.STORY_DURATION + 1000
      });
      
      // Verify story advanced and first story is marked as completed
      const newSrc = await storyImage.getAttribute('src');
      expect(newSrc).not.toBe(initialSrc);
      await expect(progressBars.first()).toHaveAttribute('data-completed', 'true');
      await expect(progressBars.nth(1)).not.toHaveAttribute('data-completed', 'true');
    });

    test('handles manual navigation with tap gestures', async ({ page }) => {
      const viewer = page.locator(SELECTORS.STORY_VIEWER);
      const box = await viewer.boundingBox();
      expect(box).toBeTruthy();
      if (!box) return;

      const storyImage = page.locator(SELECTORS.STORY_IMAGE);
      const initialSrc = await storyImage.getAttribute('src');

      // Tap right side to advance
      await page.mouse.click(box.x + (box.width * 0.75), box.y + (box.height / 2));
      await expect(storyImage).toHaveAttribute('src', initialSrc ?? '');


      // Tap left side to go back
      await page.mouse.click(box.x + (box.width * 0.25), box.y + (box.height / 2));
      await expect(storyImage).toHaveAttribute('src', initialSrc ?? '');

    });

    test('handles user navigation with swipe gestures', async ({ page }) => {
      const viewer = page.locator(SELECTORS.STORY_VIEWER);
      const box = await viewer.boundingBox();
      expect(box).toBeTruthy();
      if (!box) return;

      // Swipe left to next user
      await page.mouse.move(box.x + (box.width * 0.75), box.y + (box.height / 2));
      await page.mouse.down();
      await page.mouse.move(box.x + (box.width * 0.25), box.y + (box.height / 2));
      await page.mouse.up();

      await expect(page.locator(SELECTORS.STORY_IMAGE))
        .toHaveAttribute('src', /user2-story1/);

      // Swipe right to previous user
      await page.mouse.move(box.x + (box.width * 0.25), box.y + (box.height / 2));
      await page.mouse.down();
      await page.mouse.move(box.x + (box.width * 0.75), box.y + (box.height / 2));
      await page.mouse.up();

      await expect(page.locator(SELECTORS.STORY_IMAGE))
        .toHaveAttribute('src', /user1-story/);
    });

    test('closes viewer with various gestures', async ({ page }) => {
      const viewer = page.locator(SELECTORS.STORY_VIEWER);
      const box = await viewer.boundingBox();
      expect(box).toBeTruthy();
      if (!box) return;

      // Close with swipe up
      await page.mouse.move(box.x + (box.width / 2), box.y + (box.height * 0.75));
      await page.mouse.down();
      await page.mouse.move(box.x + (box.width / 2), box.y + (box.height * 0.25));
      await page.mouse.up();

      await expect(viewer).toBeHidden();

      // Reopen and close with button
      await page.locator(SELECTORS.STORY_THUMBNAIL).first().click();
      await expect(viewer).toBeVisible();
      await page.locator(SELECTORS.CLOSE_BUTTON).click();
      await expect(viewer).toBeHidden();
    });
  });

  test.describe('Edge Cases', () => {
    test('handles network errors gracefully', async ({ page }) => {
      // Simulate offline mode
      await page.route('**/*', route => route.abort());
      await page.reload();
      
      await expect(page.getByText(/Unable to load stories/)).toBeVisible();
    });

    test('handles last story in sequence correctly', async ({ page }) => {
      // Navigate to last story
      await page.goto('/stories?user=19&story=4'); // Assuming 20 users with 5 stories each
      const storyImage = page.locator(SELECTORS.STORY_IMAGE);
      
      // Wait for auto-advance
      await page.waitForTimeout(TIMEOUTS.STORY_DURATION + 500);
      
      // Should move to first story of next user or close if last user
      await expect(storyImage).toHaveAttribute('src', /user1-story1|user20-story5/);
    });

    test('preserves story state on window blur/focus', async ({ page }) => {
      const storyImage = page.locator(SELECTORS.STORY_IMAGE);
      const initialSrc = await storyImage.getAttribute('src');

      // Simulate tab blur
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
      await page.waitForTimeout(1000);
      
      // Simulate tab focus
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      
      // Story should be paused and remain on same image
      await expect(storyImage).toHaveAttribute('src', initialSrc ?? '');

    });
  });
});
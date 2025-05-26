# Test info

- Name: Instagram Stories >> Story Viewer >> handles user navigation with swipe gestures
- Location: /Users/subodh.kumar/tutorials/instagram-stories/tests/story-flow.spec.ts:93:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toHaveAttribute(expected)

Locator: locator('[data-testid="story-image"]')
Expected pattern: /user2-story1/
Received string:  "src/assets/story_1.jpg"
Call log:
  - expect.toHaveAttribute with timeout 5000ms
  - waiting for locator('[data-testid="story-image"]')
    9 × locator resolved to <img alt="Story 101" data-testid="story-image" src="src/assets/story_1.jpg"/>
      - unexpected value "src/assets/story_1.jpg"

    at /Users/subodh.kumar/tutorials/instagram-stories/tests/story-flow.spec.ts:106:10
```

# Page snapshot

```yaml
- img "alice"
- text: alice
- button "Close story viewer": ✕
- img "Story 101"
```

# Test source

```ts
   6 |   STORY_IMAGE: '[data-testid="story-image"]',
   7 |   STORY_THUMBNAIL: '[data-testid="story-thumbnail"]',
   8 |   CLOSE_BUTTON: '[data-testid="close-button"]',
   9 |   PROGRESS_BAR: '[data-testid="progress-bar"]',
   10 |   LOADING_INDICATOR: '[data-testid="loading-indicator"]'
   11 | };
   12 |
   13 | const TIMEOUTS = {
   14 |   STORY_DURATION: 5000,
   15 |   ANIMATION: 300,
   16 |   NAVIGATION: 1000
   17 | };
   18 |
   19 | test.describe('Instagram Stories', () => {
   20 |   test.beforeEach(async ({ page }) => {
   21 |     await page.goto('/stories');
   22 |     // Wait for the initial content to be ready
   23 |     await expect(page.locator(SELECTORS.STORY_THUMBNAIL).first()).toBeVisible();
   24 |   });
   25 |
   26 |   test.describe('Story Grid View', () => {
   27 |     test('displays story thumbnails with correct count', async ({ page }) => {
   28 |       const thumbnails = page.locator(SELECTORS.STORY_THUMBNAIL);
   29 |       await expect(thumbnails).toHaveCount(15);
   30 |       // Verify thumbnails are actually loaded
   31 |       await expect(thumbnails.first()).toHaveAttribute('src', /.+/);
   32 |     });
   33 |
   34 |     test('shows loading state while fetching thumbnails', async ({ page }) => {
   35 |       await page.reload();
   36 |       await expect(page.locator(SELECTORS.LOADING_INDICATOR)).toBeVisible();
   37 |       await expect(page.locator(SELECTORS.LOADING_INDICATOR)).toBeHidden();
   38 |     });
   39 |   });
   40 |
   41 |   test.describe('Story Viewer', () => {
   42 |     test.beforeEach(async ({ page }) => {
   43 |       // Open the first story before each viewer test
   44 |       await page.locator(SELECTORS.STORY_THUMBNAIL).first().click();
   45 |       await expect(page.locator(SELECTORS.STORY_VIEWER)).toBeVisible();
   46 |     });
   47 |
   48 |     test('opens story viewer when thumbnail is clicked', async ({ page }) => {
   49 |       await expect(page.locator(SELECTORS.STORY_IMAGE)).toBeVisible();
   50 |       await expect(page.locator(SELECTORS.PROGRESS_BAR)).toBeVisible();
   51 |     });
   52 |
   53 |     test('auto advances to next story after duration and marks story as completed', async ({ page }) => {
   54 |       const storyImage = page.locator(SELECTORS.STORY_IMAGE);
   55 |       const initialSrc = await storyImage.getAttribute('src');
   56 |       const progressBars = page.locator(SELECTORS.PROGRESS_BAR);
   57 |       
   58 |       // Initially only first progress bar should be animating
   59 |       await expect(progressBars.first()).not.toHaveAttribute('data-completed', 'true');
   60 |       
   61 |       // Wait for progress bar animation to complete
   62 |       await expect(progressBars.first()).toHaveAttribute('data-completed', 'true', {
   63 |         timeout: TIMEOUTS.STORY_DURATION + 1000
   64 |       });
   65 |       
   66 |       // Verify story advanced and first story is marked as completed
   67 |       const newSrc = await storyImage.getAttribute('src');
   68 |       expect(newSrc).not.toBe(initialSrc);
   69 |       await expect(progressBars.first()).toHaveAttribute('data-completed', 'true');
   70 |       await expect(progressBars.nth(1)).not.toHaveAttribute('data-completed', 'true');
   71 |     });
   72 |
   73 |     test('handles manual navigation with tap gestures', async ({ page }) => {
   74 |       const viewer = page.locator(SELECTORS.STORY_VIEWER);
   75 |       const box = await viewer.boundingBox();
   76 |       expect(box).toBeTruthy();
   77 |       if (!box) return;
   78 |
   79 |       const storyImage = page.locator(SELECTORS.STORY_IMAGE);
   80 |       const initialSrc = await storyImage.getAttribute('src');
   81 |
   82 |       // Tap right side to advance
   83 |       await page.mouse.click(box.x + (box.width * 0.75), box.y + (box.height / 2));
   84 |       await expect(storyImage).toHaveAttribute('src', initialSrc ?? '');
   85 |
   86 |
   87 |       // Tap left side to go back
   88 |       await page.mouse.click(box.x + (box.width * 0.25), box.y + (box.height / 2));
   89 |       await expect(storyImage).toHaveAttribute('src', initialSrc ?? '');
   90 |
   91 |     });
   92 |
   93 |     test('handles user navigation with swipe gestures', async ({ page }) => {
   94 |       const viewer = page.locator(SELECTORS.STORY_VIEWER);
   95 |       const box = await viewer.boundingBox();
   96 |       expect(box).toBeTruthy();
   97 |       if (!box) return;
   98 |
   99 |       // Swipe left to next user
  100 |       await page.mouse.move(box.x + (box.width * 0.75), box.y + (box.height / 2));
  101 |       await page.mouse.down();
  102 |       await page.mouse.move(box.x + (box.width * 0.25), box.y + (box.height / 2));
  103 |       await page.mouse.up();
  104 |
  105 |       await expect(page.locator(SELECTORS.STORY_IMAGE))
> 106 |         .toHaveAttribute('src', /user2-story1/);
      |          ^ Error: Timed out 5000ms waiting for expect(locator).toHaveAttribute(expected)
  107 |
  108 |       // Swipe right to previous user
  109 |       await page.mouse.move(box.x + (box.width * 0.25), box.y + (box.height / 2));
  110 |       await page.mouse.down();
  111 |       await page.mouse.move(box.x + (box.width * 0.75), box.y + (box.height / 2));
  112 |       await page.mouse.up();
  113 |
  114 |       await expect(page.locator(SELECTORS.STORY_IMAGE))
  115 |         .toHaveAttribute('src', /user1-story/);
  116 |     });
  117 |
  118 |     test('closes viewer with various gestures', async ({ page }) => {
  119 |       const viewer = page.locator(SELECTORS.STORY_VIEWER);
  120 |       const box = await viewer.boundingBox();
  121 |       expect(box).toBeTruthy();
  122 |       if (!box) return;
  123 |
  124 |       // Close with swipe up
  125 |       await page.mouse.move(box.x + (box.width / 2), box.y + (box.height * 0.75));
  126 |       await page.mouse.down();
  127 |       await page.mouse.move(box.x + (box.width / 2), box.y + (box.height * 0.25));
  128 |       await page.mouse.up();
  129 |
  130 |       await expect(viewer).toBeHidden();
  131 |
  132 |       // Reopen and close with button
  133 |       await page.locator(SELECTORS.STORY_THUMBNAIL).first().click();
  134 |       await expect(viewer).toBeVisible();
  135 |       await page.locator(SELECTORS.CLOSE_BUTTON).click();
  136 |       await expect(viewer).toBeHidden();
  137 |     });
  138 |   });
  139 |
  140 |   test.describe('Edge Cases', () => {
  141 |     test('handles network errors gracefully', async ({ page }) => {
  142 |       // Simulate offline mode
  143 |       await page.route('**/*', route => route.abort());
  144 |       await page.reload();
  145 |       
  146 |       await expect(page.getByText(/Unable to load stories/)).toBeVisible();
  147 |     });
  148 |
  149 |     test('handles last story in sequence correctly', async ({ page }) => {
  150 |       // Navigate to last story
  151 |       await page.goto('/stories?user=19&story=4'); // Assuming 20 users with 5 stories each
  152 |       const storyImage = page.locator(SELECTORS.STORY_IMAGE);
  153 |       
  154 |       // Wait for auto-advance
  155 |       await page.waitForTimeout(TIMEOUTS.STORY_DURATION + 500);
  156 |       
  157 |       // Should move to first story of next user or close if last user
  158 |       await expect(storyImage).toHaveAttribute('src', /user1-story1|user20-story5/);
  159 |     });
  160 |
  161 |     test('preserves story state on window blur/focus', async ({ page }) => {
  162 |       const storyImage = page.locator(SELECTORS.STORY_IMAGE);
  163 |       const initialSrc = await storyImage.getAttribute('src');
  164 |
  165 |       // Simulate tab blur
  166 |       await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  167 |       await page.waitForTimeout(1000);
  168 |       
  169 |       // Simulate tab focus
  170 |       await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  171 |       
  172 |       // Story should be paused and remain on same image
  173 |       await expect(storyImage).toHaveAttribute('src', initialSrc ?? '');
  174 |
  175 |     });
  176 |   });
  177 | });
```
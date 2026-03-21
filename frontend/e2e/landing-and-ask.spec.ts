import { test, expect } from '@playwright/test';

test.describe('io-gita E2E Walkthrough', () => {
  test('Landing page loads with all sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero section
    await expect(page.locator('h1')).toContainText('io-gita');
    await page.screenshot({ path: 'screenshots/01-landing-hero.png', fullPage: false });

    // Scroll through sections
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/02-landing-verse.png', fullPage: false });

    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/03-landing-comparison.png', fullPage: false });

    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/04-landing-pillars.png', fullPage: false });

    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/05-landing-cta.png', fullPage: false });

    // Full page screenshot
    await page.screenshot({ path: 'screenshots/06-landing-fullpage.png', fullPage: true });
  });

  test('Ask page — dilemma input and question flow', async ({ page }) => {
    await page.goto('/ask');
    await page.waitForLoadState('networkidle');

    // Step 1: Dilemma text input
    await expect(page.locator('h2')).toContainText('What weighs on your mind');
    await page.screenshot({ path: 'screenshots/07-ask-dilemma-empty.png' });

    // Type a dilemma
    await page.fill('textarea', 'I am torn between following my passion and choosing stability for my family.');
    await page.screenshot({ path: 'screenshots/08-ask-dilemma-filled.png' });

    // Click Continue
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/09-ask-question-1.png' });

    // Answer first 3 questions to show the flow
    for (let i = 0; i < 3; i++) {
      // Click first option each time
      const buttons = page.locator('button.w-full.text-left');
      const count = await buttons.count();
      if (count > 0) {
        await buttons.first().click();
        await page.waitForTimeout(1200);
        await page.screenshot({ path: `screenshots/10-ask-question-${i + 2}.png` });
      }
    }

    await page.screenshot({ path: 'screenshots/11-ask-progress.png' });
  });

  test('Ask page — full page screenshot', async ({ page }) => {
    await page.goto('/ask');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'screenshots/12-ask-fullpage.png', fullPage: true });
  });
});

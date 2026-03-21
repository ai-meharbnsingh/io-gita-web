import { test, expect } from '@playwright/test';

test('Full flow: dilemma → 11 questions → result page', async ({ page }) => {
  test.setTimeout(120000);

  await page.goto('/ask');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/flow-01-start.png' });

  // Step 1: Type dilemma
  await page.fill('textarea', 'I am torn between following my passion for music and choosing a stable career for my family.');
  await page.screenshot({ path: 'screenshots/flow-02-dilemma.png' });

  // Click Continue
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(1500);

  // Step 2: Answer all 11 questions
  for (let q = 0; q < 11; q++) {
    // Wait for the question to appear (handles breath pauses too)
    await page.waitForSelector('button.w-full.text-left', { timeout: 10000 });
    await page.waitForTimeout(500);

    await page.screenshot({ path: `screenshots/flow-q${String(q + 1).padStart(2, '0')}.png` });

    // Click the first answer option
    const options = page.locator('button.w-full.text-left');
    await options.first().click();

    // Wait for ack + transition (800ms ack + possible 3s breath)
    await page.waitForTimeout(2000);

    // If a breath pause happened, wait for it to finish
    const breathVisible = await page.locator('text=Take a breath').isVisible().catch(() => false)
      || await page.locator('text=You\'re doing something').isVisible().catch(() => false)
      || await page.locator('text=Almost there').isVisible().catch(() => false);
    if (breathVisible) {
      await page.waitForTimeout(3500);
    }
  }

  // Step 3: Click "Reveal My Truth"
  await page.waitForSelector('button:has-text("Reveal My Truth")', { timeout: 15000 });
  await page.screenshot({ path: 'screenshots/flow-13-all-answered.png' });
  await page.click('button:has-text("Reveal My Truth")');

  // Step 4: Computing screen
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/flow-14-computing.png' });

  // Step 5: Wait for result to appear (backend + 8s progress bar animation)
  await page.waitForSelector('text=YOUR PATTERN', { timeout: 60000 });
  await page.waitForTimeout(1000);

  // Screenshot the result page sections
  await page.screenshot({ path: 'screenshots/flow-15-result-top.png' });

  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/flow-16-result-mid.png' });

  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/flow-17-result-bottom.png' });

  // Full page
  await page.screenshot({ path: 'screenshots/flow-18-result-fullpage.png', fullPage: true });

  // Verify key elements exist
  await expect(page.locator('text=YOUR PATTERN')).toBeVisible();
  await expect(page.locator('text=JOURNEY')).toBeVisible();
  await expect(page.locator('text=WHICH FORCES WON')).toBeVisible();
  await expect(page.locator('text=SETTLED AT')).toBeVisible();
});

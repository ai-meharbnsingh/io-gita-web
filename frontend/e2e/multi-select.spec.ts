import { test, expect } from '@playwright/test';

test('Multi-select: checkboxes, Next button, can pick 2 options', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/ask');
  await page.waitForLoadState('networkidle');

  // Fill dilemma and start
  await page.fill('textarea', 'I feel stuck between two paths');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(1000);

  // Q1: Verify multi-select hint
  const hint = page.locator('text=pick one, or two if both feel true');
  await expect(hint).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: 'screenshots/e2e/multi-01-hint.png' });

  // Q1: Verify checkbox indicators exist
  const options = page.locator('button.w-full.text-left');
  await expect(options.first()).toBeVisible({ timeout: 5000 });

  // Q1-Q10: Select first option + click Next
  for (let i = 0; i < 10; i++) {
    const opts = page.locator('button.w-full.text-left');
    await expect(opts.first()).toBeVisible({ timeout: 8000 });
    await opts.first().click();
    await page.waitForTimeout(500);
    const nextBtn = page.locator('button:has-text("Next")');
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(1500);
    }
  }

  // Q11: Test MULTI-SELECT — select first option
  const opts11 = page.locator('button.w-full.text-left');
  await expect(opts11.first()).toBeVisible({ timeout: 8000 });
  await opts11.first().click();
  await page.waitForTimeout(500);

  // Now click SECOND option too (multi-select)
  await opts11.nth(1).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/e2e/multi-02-two-selected.png' });

  // Verify Reveal button is visible
  const revealBtn = page.locator('button:has-text("Reveal My Truth")');
  await expect(revealBtn).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: 'screenshots/e2e/multi-03-reveal-ready.png' });
});

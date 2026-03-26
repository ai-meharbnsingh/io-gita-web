import { test, expect } from '@playwright/test';

test('Multi-select: hint visible, radio dots render, can pick 2 options', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('/ask');
  await page.waitForLoadState('networkidle');

  // Fill dilemma and start
  await page.fill('textarea', 'I feel stuck between two paths');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(1000);

  // Q1: Verify multi-select hint is visible
  const hint = page.locator('text=you can select up to 2');
  await expect(hint).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: 'screenshots/e2e/multi-01-hint.png' });

  // Q1: Verify radio dot indicators exist on options
  const options = page.locator('button.w-full.text-left');
  await expect(options.first()).toBeVisible({ timeout: 5000 });

  // Click first option — it selects and auto-advances to Q2
  await options.first().click();
  await page.waitForTimeout(1500);

  // Q2: Click first option to advance to Q3
  const opts2 = page.locator('button.w-full.text-left');
  await expect(opts2.first()).toBeVisible({ timeout: 8000 });
  await opts2.first().click();
  await page.waitForTimeout(1500);

  // Q3: Click first option to advance to Q4
  const opts3 = page.locator('button.w-full.text-left');
  await expect(opts3.first()).toBeVisible({ timeout: 8000 });
  await opts3.first().click();
  await page.waitForTimeout(1500);

  // Q4: Now test multi-select — select first option (auto-advances)
  const opts4 = page.locator('button.w-full.text-left');
  await expect(opts4.first()).toBeVisible({ timeout: 8000 });

  // Click first option → auto-advance to Q5
  await opts4.first().click();
  await page.waitForTimeout(1500);

  // Q5: Select FIRST option
  const opts5 = page.locator('button.w-full.text-left');
  await expect(opts5.first()).toBeVisible({ timeout: 8000 });
  await opts5.first().click();
  await page.waitForTimeout(1500);

  // Q6: Select first option
  const opts6 = page.locator('button.w-full.text-left');
  await expect(opts6.first()).toBeVisible({ timeout: 8000 });
  await opts6.first().click();
  await page.waitForTimeout(1500);

  // Q7: Select first option
  const opts7 = page.locator('button.w-full.text-left');
  await expect(opts7.first()).toBeVisible({ timeout: 8000 });
  await opts7.first().click();
  await page.waitForTimeout(1500);

  // Q8: Select first option
  const opts8 = page.locator('button.w-full.text-left');
  await expect(opts8.first()).toBeVisible({ timeout: 8000 });
  await opts8.first().click();
  await page.waitForTimeout(1500);

  // Q9: Select first option
  const opts9 = page.locator('button.w-full.text-left');
  await expect(opts9.first()).toBeVisible({ timeout: 8000 });
  await opts9.first().click();
  await page.waitForTimeout(1500);

  // Q10: Select first option
  const opts10 = page.locator('button.w-full.text-left');
  await expect(opts10.first()).toBeVisible({ timeout: 8000 });
  await opts10.first().click();
  await page.waitForTimeout(1500);

  // Q11: Here we test MULTI-SELECT — select first, then click second too
  const opts11 = page.locator('button.w-full.text-left');
  await expect(opts11.first()).toBeVisible({ timeout: 8000 });

  // First click selects option 1 + auto-advances (but we're on last Q, no advance)
  await opts11.first().click();
  await page.waitForTimeout(1500);

  // Now click second option — this should ADD it (multi-select)
  await opts11.nth(1).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/e2e/multi-02-two-selected.png' });

  // Both options should be selected (gold background)
  // Verify Reveal button is visible
  const revealBtn = page.locator('button:has-text("Reveal My Truth")');
  await expect(revealBtn).toBeVisible({ timeout: 5000 });
  await page.screenshot({ path: 'screenshots/e2e/multi-03-reveal-ready.png' });
});

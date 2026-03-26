import { test, expect } from '@playwright/test';

test.describe('UI Changes E2E — 3 Cases', () => {
  test.setTimeout(120000); // 2 min per test — 11 questions with breath pauses + slowMo

  // ─── CASE 1: Landing page CTA is visible and clickable ───
  test('Case 1: Landing page has clear CTA buttons', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hero loads
    await expect(page.locator('h1')).toContainText('io-gita');
    await page.screenshot({ path: 'screenshots/e2e/case1-01-hero.png' });

    // CTA button "See My Inner Forces" should be visible in hero
    const heroCTA = page.locator('button:has-text("See My Inner Forces")');
    await expect(heroCTA).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case1-02-hero-cta-visible.png' });

    // Scroll to bottom CTA section
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 800));
    await page.waitForTimeout(1500);

    // "Start Now" button should be visible
    const bottomCTA = page.locator('button:has-text("Start Now")');
    await expect(bottomCTA).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case1-03-bottom-cta.png' });

    // Click hero CTA → should navigate to /ask
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await heroCTA.click();
    await page.waitForURL('**/ask');
    await expect(page).toHaveURL(/\/ask/);
    await page.screenshot({ path: 'screenshots/e2e/case1-04-navigated-to-ask.png' });
  });

  // ─── CASE 2: Ask page — example questions + question flow ───
  test('Case 2: Example questions appear and question flow works', async ({ page }) => {
    await page.goto('/ask');
    await page.waitForLoadState('networkidle');

    // Textarea is visible
    await expect(page.locator('textarea')).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case2-01-ask-empty.png' });

    // Example questions should be visible when textarea is empty
    const exampleLabel = page.locator('text=NOT SURE WHAT TO WRITE');
    await expect(exampleLabel).toBeVisible();

    const exampleButtons = page.locator('button:has-text("I can")');
    const count = await exampleButtons.count();
    expect(count).toBeGreaterThan(0);
    await page.screenshot({ path: 'screenshots/e2e/case2-02-example-questions.png' });

    // Click an example → textarea fills
    await exampleButtons.first().click();
    await page.waitForTimeout(500);
    const textareaValue = await page.locator('textarea').inputValue();
    expect(textareaValue.length).toBeGreaterThan(10);
    await page.screenshot({ path: 'screenshots/e2e/case2-03-example-clicked.png' });

    // Example questions should hide after text is filled
    await expect(exampleLabel).not.toBeVisible();

    // Continue button should be enabled
    const continueBtn = page.locator('button:has-text("Continue")');
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();
    await page.waitForTimeout(1000);

    // Should now be on first question
    await page.screenshot({ path: 'screenshots/e2e/case2-04-first-question.png' });

    // Progress dots should be visible
    const progressDots = page.locator('.rounded-full').first();
    await expect(progressDots).toBeVisible();

    // Answer all 11 questions: select option then click Next
    for (let i = 0; i < 11; i++) {
      const options = page.locator('button.w-full.text-left');
      await expect(options.first()).toBeVisible({ timeout: 8000 });
      await options.first().click();
      await page.waitForTimeout(500);
      // Click "Next" to advance (last question won't have Next if allDone shows Reveal)
      const nextBtn = page.locator('button:has-text("Next")');
      if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(1500); // ack + breath pause
      }
      if (i % 4 === 0) {
        await page.screenshot({ path: `screenshots/e2e/case2-05-question-${i + 1}.png` });
      }
    }

    // "Reveal My Truth" button should appear
    const revealBtn = page.locator('button:has-text("Reveal My Truth")');
    await expect(revealBtn).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'screenshots/e2e/case2-06-all-answered.png' });

    // Click reveal → loading page should appear
    await revealBtn.click();
    await page.waitForTimeout(1500);

    // Loading page should have clear "computing" message
    const loadingMsg = page.locator('text=Your results are being computed');
    await expect(loadingMsg).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'screenshots/e2e/case2-07-loading-page.png' });

    // "WHILE YOU WAIT" separator should be visible
    const waitLabel = page.locator('text=WHILE YOU WAIT');
    await expect(waitLabel).toBeVisible();

    // Progress bar should exist
    const progressBar = page.locator('.bg-\\[\\#B8860B\\]').first();
    await expect(progressBar).toBeVisible();

    // Timer should show elapsed time
    const timerText = page.locator('text=elapsed');
    await expect(timerText).toBeVisible();

    // Disclaimer at bottom
    const disclaimer = page.locator('text=your personal results will appear');
    await expect(disclaimer).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case2-08-loading-details.png' });
  });

  // ─── CASE 3: Results page — no jargon, clear labels, Hindi spacing ───
  // We mock the result since backend may not be running
  test('Case 3: Results page renders with plain language (mocked)', async ({ page }) => {
    // Intercept the API call and return mock data
    await page.route('**/api/guna-query', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          trajectory: {
            final_basin: "dharma_karma",
            final_display: "Dharma-Karma",
            final_meaning: "The pull of duty meeting the drive to act",
            total_steps: 800,
            phases: [
              { basin: "rajas_karma", display: "Restless Action", meaning: "Driven but scattered energy", duration: 280 },
              { basin: "dharma_karma", display: "Dharma-Karma", meaning: "Duty meets action", duration: 350 },
              { basin: "sattva_jnana", display: "Clarity", meaning: "Moment of clear seeing", duration: 170 },
            ],
            linger: [
              { basin: "dharma_karma", display: "Dharma-Karma", meaning: "Duty meets action", steps: 350, pct: 43.8 },
            ],
            atom_alignments: {
              KARMA: { feeling: "Action \u2014 The drive to keep doing, keep working, keep moving forward", input: 0.7, final: 0.85, grew: true },
              DHARMA: { feeling: "Duty \u2014 Your sense of responsibility and what you feel you must do", input: 0.5, final: 0.72, grew: true },
              RAJAS: { feeling: "Restlessness \u2014 The energy that won't let you sit still", input: 0.8, final: 0.45, grew: false },
              SATTVA: { feeling: "Clarity \u2014 The calm, clear part of your mind", input: -0.4, final: 0.38, grew: true },
              AHANKARA: { feeling: "Identity \u2014 Who you think you are, tied to what you do", input: 0.6, final: 0.65, grew: true },
              MOKSHA: { feeling: "Freedom \u2014 The deep wish to be free from all this", input: -0.5, final: -0.3, grew: false },
              KAMA: { feeling: "Desire \u2014 What you want, what pulls you toward pleasure or comfort", input: 0.3, final: 0.2, grew: false },
              VAIRAGYA: { feeling: "Letting go \u2014 The quiet ability to release what doesn't serve you", input: -0.2, final: 0.15, grew: true },
            },
          },
          narration: "## What's really driving you\nYour answers show two forces pulling you forward: a deep sense of duty and a need to keep acting. The restlessness you feel is loud, but it's actually fading — it's not what's steering you. What's quietly growing is clarity and a sense of purpose.\n\n*आपके जवाब दो ताकतों को दिखाते हैं: कर्तव्य की गहरी भावना और लगातार कुछ करते रहने की ज़रूरत। बेचैनी ज़ोर से महसूस होती है, लेकिन असल में यह कम हो रही है। जो चुपचाप बढ़ रहा है वो है स्पष्टता और उद्देश्य।*\n\n## Where this leads\nRight now, your inner forces are pulling you toward a life where duty and action work together — not the scattered restlessness you feel today, but a more focused, purposeful kind of doing.\n\n*अभी आपकी भीतरी शक्तियाँ आपको ऐसी ज़िंदगी की ओर ले जा रही हैं जहाँ कर्तव्य और कर्म साथ चलें — बिखरी हुई बेचैनी नहीं, बल्कि एक अधिक केंद्रित और सार्थक करना।*\n\n## What you can do\n1. Try this: Before your next big decision, ask yourself — am I choosing this because it's right, or because I can't sit still?\n\n*इसे आज़माएँ: अगले बड़े फ़ैसले से पहले खुद से पूछें — क्या मैं यह इसलिए चुन रहा हूँ क्योंकि यह सही है, या इसलिए क्योंकि मैं बैठ नहीं सकता?*\n\n2. This week: Pick one responsibility you're carrying out of guilt, not duty. Set it down for 7 days and see what happens.\n\n*इस हफ़्ते: एक ऐसी ज़िम्मेदारी चुनें जो आप अपराधबोध से उठा रहे हैं, कर्तव्य से नहीं। इसे 7 दिन के लिए छोड़ दें और देखें क्या होता है।*\n\n3. Try this: The clarity that's growing in you needs space. Spend 10 minutes today doing nothing — not meditating, not thinking, just nothing.\n\n*यह करें: जो स्पष्टता आपमें बढ़ रही है उसे जगह चाहिए। आज 10 मिनट कुछ न करें — ध्यान नहीं, सोचना नहीं, बस कुछ नहीं।*",
          entropy_text: "Moderate inner turbulence — your mind explored several states before settling.",
        }),
      });
    });

    await page.goto('/ask');
    await page.waitForLoadState('networkidle');

    // Fill dilemma
    await page.fill('textarea', 'I feel torn between my career ambitions and my family responsibilities');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(1000);

    // Answer all 11 questions: select + Next
    for (let i = 0; i < 11; i++) {
      const options = page.locator('button.w-full.text-left');
      await expect(options.first()).toBeVisible({ timeout: 8000 });
      await options.first().click();
      await page.waitForTimeout(500);
      const nextBtn = page.locator('button:has-text("Next")');
      if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(1500);
      }
    }

    // Click reveal
    const revealBtn = page.locator('button:has-text("Reveal My Truth")');
    await expect(revealBtn).toBeVisible({ timeout: 10000 });
    await revealBtn.click();

    // Wait for results (mocked, should be instant)
    await page.waitForTimeout(2000);

    // ── Verify result page labels are plain language ──
    // "WHAT WE FOUND" (not "YOUR PATTERN")
    const label = page.locator('text=WHAT WE FOUND');
    await expect(label).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: 'screenshots/e2e/case3-01-result-header.png' });

    // Pattern name should show
    await expect(page.locator('h2:has-text("Dharma-Karma")')).toBeVisible();

    // No technical jargon visible in result content (check main area, not scripts)
    const mainText = await page.locator('main').textContent();
    expect(mainText).not.toContain('topology');
    expect(mainText).not.toContain('entropy');
    expect(mainText).not.toContain('attractor');
    expect(mainText).not.toContain('convergence');

    // Card titles should be plain language
    await expect(page.locator("text=What's Really Driving You")).toBeVisible();
    await expect(page.locator('text=Where This Leads')).toBeVisible();
    await expect(page.locator('text=What You Can Do')).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case3-02-result-cards.png' });

    // Scroll to see forces section
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(800);

    // "WHAT'S STRONGEST IN YOU" (not "WHICH FORCES WON")
    await expect(page.locator("text=WHAT'S STRONGEST IN YOU")).toBeVisible();

    // Force explanations should show
    await expect(page.locator('text=getting stronger').first()).toBeVisible();
    await expect(page.locator('text=fading').first()).toBeVisible();

    // Each force should have an explanation line
    await expect(page.locator('text=The drive to keep doing').first()).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case3-03-forces-explained.png' });

    // Scroll more to settlement
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(800);

    // "WHERE YOU ARE RIGHT NOW" (not "SETTLED AT")
    await expect(page.locator('text=WHERE YOU ARE RIGHT NOW')).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case3-04-settlement.png' });

    // Hindi text should be in Devanagari (check for a Hindi character)
    const hindiText = page.locator('text=आपके जवाब');
    await expect(hindiText).toBeVisible();

    // Hindi sections should have border-left styling (visual separator)
    const hindiSection = page.locator('.border-l-2').first();
    await expect(hindiSection).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case3-05-hindi-devanagari.png' });

    // Feedback form should be visible at bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    await expect(page.locator('text=How was this?')).toBeVisible();
    await page.screenshot({ path: 'screenshots/e2e/case3-06-feedback-form.png' });

    // Full page result screenshot
    await page.screenshot({ path: 'screenshots/e2e/case3-07-result-fullpage.png', fullPage: true });
  });
});

import { expect, test } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the page title and metadata', async ({ page }) => {
    await expect(page).toHaveTitle(/SecondOrder/);
  });

  test('should render the header with logo and navigation', async ({
    page,
    viewport,
  }) => {
    // Check logo
    const logo = page.getByAltText('SecondOrder icon');
    await expect(logo).toBeVisible();

    // Check brand name
    const brandName = page.getByText('SecondOrder').first();
    await expect(brandName).toBeVisible();

    // Check navigation links (visible on desktop)
    const whatIsItLink = page.getByRole('link', { name: 'What is it' });
    const readyToBuildLink = page.getByRole('link', { name: 'Ready to build' });

    if (viewport && viewport.width < 768) {
      await expect(whatIsItLink).toHaveCount(0);
      await expect(readyToBuildLink).toHaveCount(0);
      return;
    }

    await expect(whatIsItLink).toBeVisible();
    await expect(readyToBuildLink).toBeVisible();
  });

  test('should render hero section with main headline', async ({ page }) => {
    const headline = page.getByRole('heading', {
      name: /See how the assistant frames the task before you trust the answer/i,
    });
    await expect(headline).toBeVisible();

    const subheading = page.getByText(
      /SecondOrder turns hidden orchestration into a product surface/i,
    );
    await expect(subheading).toBeVisible();
  });

  test('should display the CTA button in hero section', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: 'Try the chat' });
    await expect(ctaButton).toBeVisible();

    // Verify it routes into the product experience
    const href = await ctaButton.getAttribute('href');
    expect(href).toBe('/chat');
  });

  test('should display all feature cards', async ({ page }) => {
    const features = [
      'Visible meta mode',
      'Plan preview',
      'Confidence signals',
      'Feedback and evaluation',
    ];

    for (const feature of features) {
      const featureElement = page.getByText(feature, { exact: true });
      await expect(featureElement).toBeVisible();
    }
  });

  test('should display capability stats section', async ({ page }) => {
    await expect(page.getByText('Visible framing', { exact: true })).toBeVisible();
    await expect(page.getByText('Planner + critic', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Feedback + events', { exact: true })).toBeVisible();
  });

  test('should navigate to "What is it" section when link is clicked', async ({
    page,
    viewport,
  }) => {
    // Skip on mobile where nav is hidden
    if (viewport && viewport.width < 768) {
      test.skip();
    }

    const whatIsItLink = page.getByRole('link', { name: 'What is it' });
    await whatIsItLink.click();

    // Wait for navigation to complete
    await page.waitForURL('/#what-is-it');

    // Verify we're at the correct section
    const section = page.locator('#what-is-it');
    await expect(section).toBeInViewport();
  });

  test('should navigate to "Ready to build" section when link is clicked', async ({
    page,
    viewport,
  }) => {
    // Skip on mobile where nav is hidden
    if (viewport && viewport.width < 768) {
      test.skip();
    }

    const readyToBuildLink = page.getByRole('link', {
      name: 'Ready to build',
    });
    await readyToBuildLink.click();

    // Wait for navigation to complete
    await page.waitForURL('/#ready-to-build');

    // Verify we're at the correct section
    const section = page.locator('#ready-to-build');
    await expect(section).toBeInViewport();
  });

  test('should display "What is it" section content', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /A deliberate, adaptive layer for reasoning/i,
    });
    await expect(heading).toBeVisible();

    // Check overview items
    const overviewItems = [
      'A meta layer on top of chat that makes task interpretation visible.',
      'Structured planner and critic passes running behind the assistant.',
      'Event instrumentation for completion, feedback, and plan-preview usage.',
    ];

    for (const item of overviewItems) {
      await expect(page.getByText(item)).toBeVisible();
    }
  });

  test('should display iterative problem solving section', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /A structured loop designed for harder requests/i,
    });
    await expect(heading).toBeVisible();

    // Check numbered steps
    const steps = [
      'Interpret the task and decide whether meta mode is needed.',
      'Generate a compact plan and response strategy for harder requests.',
      'Review the draft for confidence, limitations, and missing context.',
      'Return the answer with visible framing, then capture user feedback.',
    ];

    for (const step of steps) {
      await expect(page.getByText(step)).toBeVisible();
    }
  });

  test('should display self-auditing section', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /Trust signals that expose uncertainty without dumping internals/i,
    });
    await expect(heading).toBeVisible();

    await expect(page.getByText('Planner + critic').nth(1)).toBeVisible();
    await expect(page.getByText('Feedback captured')).toBeVisible();
  });

  test('should display meta-thinking section', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /Cognition that can inspect itself/i,
    });
    await expect(heading).toBeVisible();

    const metaThinkingItems = [
      'Task classification routes complex requests into a structured meta pass.',
      'Planner and critic workflow output drives the UI instead of freeform guesswork.',
      'Trust signals stay compact so the chat still feels fast and conversational.',
    ];

    for (const item of metaThinkingItems) {
      await expect(page.getByText(item)).toBeVisible();
    }
  });

  test('should display final CTA section', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /Put meta cognition into production/i,
    });
    await expect(heading).toBeVisible();

    const ctaButton = page.getByRole('link', {
      name: 'Start the conversation',
    });
    await expect(ctaButton).toBeVisible();

    // Verify it routes into the product experience
    const href = await ctaButton.getAttribute('href');
    expect(href).toBe('/chat');
  });

  test('should have proper responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Navigation should be hidden on mobile
    const whatIsItLink = page.getByRole('link', { name: 'What is it' });
    await expect(whatIsItLink).not.toBeVisible();

    // Logo and brand should still be visible
    const logo = page.getByAltText('SecondOrder icon');
    await expect(logo).toBeVisible();

    // Hero section should be visible
    const headline = page.getByRole('heading', {
      name: /See how the assistant frames the task before you trust the answer/i,
    });
    await expect(headline).toBeVisible();
  });

  test('should have proper responsive design on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    // Navigation should be visible on tablet
    const whatIsItLink = page.getByRole('link', { name: 'What is it' });
    await expect(whatIsItLink).toBeVisible();

    // All major sections should be visible
    const headline = page.getByRole('heading', {
      name: /See how the assistant frames the task before you trust the answer/i,
    });
    await expect(headline).toBeVisible();
  });

  test('should have proper responsive design on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // All content should be visible
    const whatIsItLink = page.getByRole('link', { name: 'What is it' });
    await expect(whatIsItLink).toBeVisible();

    // Check grid layouts are rendering properly
    const headline = page.getByRole('heading', {
      name: /See how the assistant frames the task before you trust the answer/i,
    });
    await expect(headline).toBeVisible();
  });
});

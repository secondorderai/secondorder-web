import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the page title and metadata', async ({ page }) => {
    await expect(page).toHaveTitle(/SecondOrder/);
  });

  test('should render the header with logo and navigation', async ({ page }) => {
    // Check logo
    const logo = page.getByAltText('SecondOrder icon');
    await expect(logo).toBeVisible();

    // Check brand name
    const brandName = page.getByText('SecondOrder').first();
    await expect(brandName).toBeVisible();

    // Check navigation links (visible on desktop)
    const whatIsItLink = page.getByRole('link', { name: 'What is it' });
    const readyToBuildLink = page.getByRole('link', { name: 'Ready to build' });

    // These are hidden on mobile but visible on larger screens
    await expect(whatIsItLink).toBeAttached();
    await expect(readyToBuildLink).toBeAttached();
  });

  test('should render hero section with main headline', async ({ page }) => {
    const headline = page.getByRole('heading', {
      name: /Meta cognition that orchestrates thinking/i,
    });
    await expect(headline).toBeVisible();

    const subheading = page.getByText(
      /SecondOrder builds a self-auditing system/i
    );
    await expect(subheading).toBeVisible();
  });

  test('should display the CTA button in hero section', async ({ page }) => {
    const ctaButton = page.getByRole('link', { name: 'Request early access' });
    await expect(ctaButton).toBeVisible();

    // Verify it's a mailto link
    const href = await ctaButton.getAttribute('href');
    expect(href).toContain('mailto:henry@kinwo.net');
  });

  test('should display all feature cards', async ({ page }) => {
    const features = [
      'Meta thinking layer',
      'Self-improving loop',
      'Model orchestration',
      'Knowledge extraction',
    ];

    for (const feature of features) {
      const featureElement = page.getByText(feature, { exact: true });
      await expect(featureElement).toBeVisible();
    }
  });

  test('should display capability stats section', async ({ page }) => {
    await expect(page.getByText('GPT-5 stack')).toBeVisible();
    await expect(page.getByText('Tool-driven agents')).toBeVisible();
    await expect(page.getByText('Self-learning core')).toBeVisible();
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
      'Thinking of thinking: a meta layer on top of LLMs.',
      'Adaptive chain-of-thought that evolves per task.',
      'Judge agent that selects the best plan and routes work.',
    ];

    for (const item of overviewItems) {
      await expect(page.getByText(item)).toBeVisible();
    }
  });

  test('should display iterative problem solving section', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /A loop designed to refine every output/i,
    });
    await expect(heading).toBeVisible();

    // Check numbered steps
    const steps = [
      'Generate a potential solution.',
      'Receive feedback from the environment or a judge agent.',
      'Analyze gaps, weaknesses, and missing information.',
      'Refine the output and repeat until satisfied.',
    ];

    for (const step of steps) {
      await expect(page.getByText(step)).toBeVisible();
    }
  });

  test('should display self-auditing section', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /Progress monitoring that knows when to stop/i,
    });
    await expect(heading).toBeVisible();

    await expect(page.getByText('Planner + evaluator')).toBeVisible();
    await expect(page.getByText('Verified solution')).toBeVisible();
  });

  test('should display meta-thinking section', async ({ page }) => {
    const heading = page.getByRole('heading', {
      name: /Cognition that can inspect itself/i,
    });
    await expect(heading).toBeVisible();

    const metaThinkingItems = [
      'Self-monitoring to detect flaws and drift in real time.',
      'Self-evaluation of correctness, bias, and coverage.',
      'Adaptive learning that modifies strategies for each new problem.',
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

    const ctaButton = page.getByRole('link', { name: 'Start the conversation' });
    await expect(ctaButton).toBeVisible();

    // Verify it's a mailto link
    const href = await ctaButton.getAttribute('href');
    expect(href).toContain('mailto:henry@kinwo.net');
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
      name: /Meta cognition that orchestrates thinking/i,
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
      name: /Meta cognition that orchestrates thinking/i,
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
      name: /Meta cognition that orchestrates thinking/i,
    });
    await expect(headline).toBeVisible();
  });
});

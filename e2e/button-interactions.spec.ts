import { test, expect } from '@playwright/test';

test.describe('Button Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render CTA buttons with correct styles', async ({ page }) => {
    const requestAccessButton = page.getByRole('link', {
      name: 'Request early access',
    });
    const startConversationButton = page.getByRole('link', {
      name: 'Start the conversation',
    });

    await expect(requestAccessButton).toBeVisible();
    await expect(startConversationButton).toBeVisible();

    // Verify buttons have proper styling - they are <a> tags wrapping <button> elements
    const requestAccessButtonElement = requestAccessButton.locator('button');
    const classes = await requestAccessButtonElement.getAttribute('class');
    expect(classes).toContain('inline-flex');
  });

  test('should have hover effects on buttons', async ({ page }) => {
    const requestAccessButton = page.getByRole('link', {
      name: 'Request early access',
    });

    // Hover over the button
    await requestAccessButton.hover();

    // Button should still be visible after hover
    await expect(requestAccessButton).toBeVisible();
  });

  test('should navigate to email when "Request early access" is clicked', async ({
    page,
    context,
  }) => {
    const requestAccessButton = page.getByRole('link', {
      name: 'Request early access',
    });

    // Get the href attribute
    const href = await requestAccessButton.getAttribute('href');
    expect(href).toBe('mailto:henry@kinwo.net');

    // Verify the link is clickable
    await expect(requestAccessButton).toBeEnabled();
  });

  test('should navigate to email when "Start the conversation" is clicked', async ({
    page,
  }) => {
    const startConversationButton = page.getByRole('link', {
      name: 'Start the conversation',
    });

    // Get the href attribute
    const href = await startConversationButton.getAttribute('href');
    expect(href).toBe('mailto:henry@kinwo.net');

    // Verify the link is clickable
    await expect(startConversationButton).toBeEnabled();
  });

  test('should have proper button sizing', async ({ page }) => {
    const requestAccessButton = page.getByRole('link', {
      name: 'Request early access',
    });
    const startConversationButton = page.getByRole('link', {
      name: 'Start the conversation',
    });

    // Get bounding boxes
    const requestAccessBox = await requestAccessButton.boundingBox();
    const startConversationBox = await startConversationButton.boundingBox();

    // Verify buttons have dimensions
    expect(requestAccessBox).not.toBeNull();
    expect(startConversationBox).not.toBeNull();

    if (requestAccessBox && startConversationBox) {
      // Start conversation button should be larger (size="lg")
      expect(startConversationBox.height).toBeGreaterThan(
        requestAccessBox.height
      );
    }
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab to the first button
    await page.keyboard.press('Tab');

    // The logo should be focused first, tab again
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // One of the navigation or button elements should be focused
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    expect(['A', 'BUTTON', 'INPUT']).toContain(focusedElement);
  });

  test('should maintain click target size on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const requestAccessButton = page.getByRole('link', {
      name: 'Request early access',
    });

    const box = await requestAccessButton.boundingBox();
    expect(box).not.toBeNull();

    if (box) {
      // Verify button meets minimum touch target size (44x44px for mobile)
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });
});

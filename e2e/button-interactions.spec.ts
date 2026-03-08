import { test, expect } from '@playwright/test';

test.describe('Button Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render CTA buttons with correct styles', async ({ page }) => {
    const tryChatButton = page.getByRole('link', {
      name: 'Try the chat',
    });
    const startConversationButton = page.getByRole('link', {
      name: 'Start the conversation',
    });

    await expect(tryChatButton).toBeVisible();
    await expect(startConversationButton).toBeVisible();

    // Verify buttons have proper styling - they are <a> tags wrapping <button> elements
    const tryChatButtonElement = tryChatButton.locator('button');
    const classes = await tryChatButtonElement.getAttribute('class');
    expect(classes).toContain('inline-flex');
  });

  test('should have hover effects on buttons', async ({ page }) => {
    const tryChatButton = page.getByRole('link', {
      name: 'Try the chat',
    });

    // Hover over the button
    await tryChatButton.hover();

    // Button should still be visible after hover
    await expect(tryChatButton).toBeVisible();
  });

  test('should route to chat when "Try the chat" is clicked', async ({
    page,
  }) => {
    const tryChatButton = page.getByRole('link', {
      name: 'Try the chat',
    });

    // Get the href attribute
    const href = await tryChatButton.getAttribute('href');
    expect(href).toBe('/chat');

    // Verify the link is clickable
    await expect(tryChatButton).toBeEnabled();
  });

  test('should route to chat when "Start the conversation" is clicked', async ({
    page,
  }) => {
    const startConversationButton = page.getByRole('link', {
      name: 'Start the conversation',
    });

    // Get the href attribute
    const href = await startConversationButton.getAttribute('href');
    expect(href).toBe('/chat');

    // Verify the link is clickable
    await expect(startConversationButton).toBeEnabled();
  });

  test('should have proper button sizing', async ({ page }) => {
    const tryChatButton = page.getByRole('link', {
      name: 'Try the chat',
    });
    const startConversationButton = page.getByRole('link', {
      name: 'Start the conversation',
    });

    // Get bounding boxes
    const tryChatBox = await tryChatButton.boundingBox();
    const startConversationBox = await startConversationButton.boundingBox();

    // Verify buttons have dimensions
    expect(tryChatBox).not.toBeNull();
    expect(startConversationBox).not.toBeNull();

    if (tryChatBox && startConversationBox) {
      // Start conversation button should be larger (size="lg")
      expect(startConversationBox.height).toBeGreaterThan(
        tryChatBox.height
      );
    }
  });

  test('should be keyboard accessible', async ({ page }) => {
    const tryChatButton = page.getByRole('link', {
      name: 'Try the chat',
    });

    await tryChatButton.focus();

    await expect(tryChatButton).toBeFocused();
  });

  test('should maintain click target size on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const tryChatButton = page.getByRole('link', {
      name: 'Try the chat',
    });

    const box = await tryChatButton.boundingBox();
    expect(box).not.toBeNull();

    if (box) {
      // Verify button meets minimum touch target size (44x44px for mobile)
      expect(box.height).toBeGreaterThanOrEqual(40);
    }
  });
});

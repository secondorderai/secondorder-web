import { expect, test } from '@playwright/test';

type RoutePayload = {
  messageId?: unknown;
} & Record<string, unknown>;

test.describe('Chat Experience', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/chat?**', async (route) => {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({ messages: [] }),
      });
    });

    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: [
          'data: {"type":"start"}',
          '',
          'data: {"type":"start-step"}',
          '',
          'data: {"type":"text-start","id":"assistant-1"}',
          '',
          'data: {"type":"text-delta","id":"assistant-1","delta":"Migration plan ready."}',
          '',
          'data: {"type":"text-end","id":"assistant-1"}',
          '',
          'data: {"type":"finish-step"}',
          '',
          'data: {"type":"finish"}',
          '',
        ].join('\n'),
      });
    });
  });

  test('starts a new chat thread and streams a response', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForURL(/\/chat\/[0-9a-f-]+$/i);

    await expect(page.getByText('Meta-thinking chat')).toBeVisible();
    await expect(
      page.getByText(
        'Bring a messy problem. SecondOrder will frame it before answering.',
      ),
    ).toBeVisible();
    await expect(page.getByText('Planning')).toBeVisible();
    await expect(page.getByText('Analysis')).toBeVisible();
    await expect(page.getByText('Decisions')).toBeVisible();
    await expect(page.getByText('Troubleshooting')).toBeVisible();

    await page
      .getByRole('button', {
        name: /Help me plan a staged launch for a new customer onboarding flow\./,
      })
      .click();
    await expect(page.getByTestId('chat-input')).toHaveValue(
      'Help me plan a staged launch for a new customer onboarding flow.',
    );
    await page.getByTestId('chat-submit').click();

    await expect(
      page.getByText(
        'Help me plan a staged launch for a new customer onboarding flow.',
      ),
    ).toBeVisible();
    await expect(page.getByText('Migration plan ready.')).toBeVisible();
    await expect(
      page.locator('text=Planner summary').or(page.locator('text=Critique summary')),
    ).toHaveCount(0);
  });

  test('shows visible task framing for meta-routed responses', async ({
    page,
  }) => {
    let feedbackPayload: RoutePayload | null = null;
    let planPreviewEventPayload: RoutePayload | null = null;

    await page.route('**/api/chat', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/event-stream',
        body: [
          'data: {"type":"start","messageMetadata":{"taskType":"planning","shouldUseMeta":true,"meta":{"goal":"Create a migration plan for the chat route.","constraints":["Preserve thread URLs","Avoid downtime"],"plan":["Audit flow","Ship API changes"],"responseStrategy":"Summarize the rollout path.","confidence":"medium","limitations":["Needs production traffic assumptions"],"contextGaps":["Current deploy topology"]}}}',
          '',
          'data: {"type":"start-step"}',
          '',
          'data: {"type":"text-start","id":"assistant-2"}',
          '',
          'data: {"type":"text-delta","id":"assistant-2","delta":"Migration plan ready."}',
          '',
          'data: {"type":"text-end","id":"assistant-2"}',
          '',
          'data: {"type":"finish-step"}',
          '',
          'data: {"type":"finish","messageMetadata":{"taskType":"planning","shouldUseMeta":true,"meta":{"goal":"Create a migration plan for the chat route.","constraints":["Preserve thread URLs","Avoid downtime"],"plan":["Audit flow","Ship API changes"],"responseStrategy":"Summarize the rollout path.","confidence":"medium","limitations":["Needs production traffic assumptions"],"contextGaps":["Current deploy topology"]}}}',
          '',
        ].join('\n'),
      });
    });
    await page.route('**/api/chat/feedback', async (route) => {
      feedbackPayload = route.request().postDataJSON() as RoutePayload;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });
    await page.route('**/api/chat/events', async (route) => {
      planPreviewEventPayload = route.request().postDataJSON() as RoutePayload;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/chat');
    await page.waitForURL(/\/chat\/[0-9a-f-]+$/i);

    await page.getByTestId('chat-input').fill('Create a migration plan');
    await page.getByTestId('chat-submit').click();

    await expect(page.getByText('Structured meta pass')).toBeVisible();
    await expect(page.getByText('planning')).toBeVisible();
    await expect(
      page.getByText('Create a migration plan for the chat route.'),
    ).toBeVisible();
    await expect(
      page.getByText('Preserve thread URLs · Avoid downtime'),
    ).toBeVisible();
    await expect(page.getByText('Confidence')).toBeVisible();
    await expect(page.getByText('medium')).toBeVisible();
    await expect(
      page.getByText('Needs production traffic assumptions'),
    ).toBeVisible();
    await expect(page.getByText('More context would help')).toBeVisible();
    await expect(page.getByText('Current deploy topology')).toBeVisible();
    await expect(page.getByText('Audit flow')).not.toBeVisible();

    await page.getByText('Plan preview').click();

    await expect(page.getByText('Audit flow')).toBeVisible();
    await expect(page.getByText('Ship API changes')).toBeVisible();
    await expect
      .poll(() => planPreviewEventPayload)
      .toMatchObject({
      eventType: 'plan_preview_expanded',
      threadId: page.url().split('/').pop(),
      taskType: 'planning',
      metadata: {
        planLength: 2,
      },
    });
    if (!planPreviewEventPayload) {
      throw new Error('Expected plan preview event payload');
    }
    const submittedPlanPreviewEvent = planPreviewEventPayload as unknown as RoutePayload;
    expect(submittedPlanPreviewEvent.messageId).toEqual(expect.any(String));

    await page.getByRole('button', { name: 'Missed constraints' }).click();

    await expect(page.getByText('Saved')).toBeVisible();
    expect(feedbackPayload).toMatchObject({
      threadId: page.url().split('/').pop(),
      taskType: 'planning',
      feedback: 'missed_constraints',
    });
    if (!feedbackPayload) {
      throw new Error('Expected feedback payload');
    }
    const submittedFeedback = feedbackPayload as unknown as RoutePayload;
    expect(submittedFeedback.messageId).toEqual(expect.any(String));
  });

  test('keeps thread URLs isolated from each other', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForURL(/\/chat\/[0-9a-f-]+$/i);
    const firstThreadUrl = page.url();

    await page.goto('/chat');
    await page.waitForURL(/\/chat\/[0-9a-f-]+$/i);
    const secondThreadUrl = page.url();

    expect(firstThreadUrl).not.toBe(secondThreadUrl);
  });
});

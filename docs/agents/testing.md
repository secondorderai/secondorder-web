# Testing

## Commands

- Unit and component tests: `npm test`
- Coverage: `npm run test:coverage`
- E2E tests: `npm run test:e2e`
- Typecheck: `npm run ts-check`

## Patterns

- Vitest is configured in [`vitest.config.ts`](/Users/henry/workspace/secondorder-web/vitest.config.ts) with `jsdom` and shared setup from [`vitest.setup.ts`](/Users/henry/workspace/secondorder-web/vitest.setup.ts).
- Playwright is configured in [`playwright.config.ts`](/Users/henry/workspace/secondorder-web/playwright.config.ts) and starts the app with `npm run dev`.
- Unit tests live alongside shared code such as [`lib/utils.test.ts`](/Users/henry/workspace/secondorder-web/lib/utils.test.ts) and [`components/ui/button.test.tsx`](/Users/henry/workspace/secondorder-web/components/ui/button.test.tsx).
- End-to-end tests live in [`e2e/`](/Users/henry/workspace/secondorder-web/e2e).

## Expectations

- Run the narrowest test set that covers the change.
- Prefer updating or adding focused Vitest tests for shared logic and Playwright tests for user flows.

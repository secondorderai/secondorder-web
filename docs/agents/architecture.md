# Architecture

## Stack

- Next.js `15.5.9`
- React `19.2.3`
- TypeScript with `strict: true`
- Tailwind CSS
- Vercel AI SDK with `@ai-sdk/openai`

## Structure

- [`app/`](/Users/henry/workspace/secondorder-web/app): App Router pages, layouts, and route handlers
- [`app/page.tsx`](/Users/henry/workspace/secondorder-web/app/page.tsx): Marketing site
- [`app/chat/page.tsx`](/Users/henry/workspace/secondorder-web/app/chat/page.tsx): Chat UI
- [`app/api/chat/route.ts`](/Users/henry/workspace/secondorder-web/app/api/chat/route.ts): Chat backend route
- [`components/ui/`](/Users/henry/workspace/secondorder-web/components/ui): Reusable UI primitives
- [`lib/`](/Users/henry/workspace/secondorder-web/lib): Shared utilities

## Cross-Cutting Rules

- Prefer App Router conventions over Pages Router patterns.
- Use the `@/*` alias instead of deep relative imports.
- Keep changes consistent with the existing separation between marketing pages, chat UI, and shared UI primitives.
- Be aware that global security headers are configured in [`next.config.js`](/Users/henry/workspace/secondorder-web/next.config.js), including a CSP that allows calls to `https://api.openai.com`.
- See the high-level diagram in [`docs/architecture-overview.md`](/Users/henry/workspace/secondorder-web/docs/architecture-overview.md) when a task needs system context before implementation.

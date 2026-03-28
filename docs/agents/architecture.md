# Architecture

## Stack

- Next.js `15.5.9`
- React `19.2.3`
- TypeScript with `strict: true`
- Tailwind CSS
- Mastra embedded in the Next.js app
- AI SDK UI layer with `ai` and `@ai-sdk/react`

## Structure

- [`app/`](/Users/henry/workspace/secondorder-web/app): App Router pages, layouts, and route handlers
- [`app/page.tsx`](/Users/henry/workspace/secondorder-web/app/page.tsx): Marketing site
- [`app/chat/page.tsx`](/Users/henry/workspace/secondorder-web/app/chat/page.tsx): Thread redirect entrypoint
- [`app/chat/[threadId]/page.tsx`](/Users/henry/workspace/secondorder-web/app/chat/[threadId]/page.tsx): Thread-aware chat UI
- [`app/api/chat/route.ts`](/Users/henry/workspace/secondorder-web/app/api/chat/route.ts): Chat backend route
- [`mastra/`](/Users/henry/workspace/secondorder-web/mastra): Mastra runtime, agents, workflows, skills, and eval dataset
- [`components/ui/`](/Users/henry/workspace/secondorder-web/components/ui): Reusable UI primitives
- [`lib/`](/Users/henry/workspace/secondorder-web/lib): Shared utilities

## Cross-Cutting Rules

- Prefer App Router conventions over Pages Router patterns.
- Use the `@/*` alias instead of deep relative imports.
- Keep changes consistent with the existing separation between marketing pages, chat UI, and shared UI primitives.
- Be aware that global security headers are configured in [`next.config.js`](/Users/henry/workspace/secondorder-web/next.config.js), including the CSP for same-origin chat API calls.
- See the high-level diagram in [`docs/architecture-overview.md`](/Users/henry/workspace/secondorder-web/docs/architecture-overview.md) when a task needs system context before implementation.

# Vercel AI SDK Chat Integration - Implementation Plan

> **Author**: Principal Software Engineer
> **Date**: January 2026
> **Status**: Draft for Review
> **Issue**: #4

---

## Executive Summary

This document outlines a comprehensive plan to implement a Vercel AI SDK chat integration with a frontend interface at `/chat`. The implementation follows SecondOrder's existing architectural patterns, design system, and coding standards while introducing real-time streaming AI capabilities.

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │   Chat Page     │◄──►│   useChat Hook  │                     │
│  │  /app/chat/     │    │   (AI SDK)      │                     │
│  └────────┬────────┘    └────────┬────────┘                     │
│           │                      │                               │
│  ┌────────▼────────┐             │                               │
│  │  UI Components  │             │                               │
│  │  - ChatMessage  │             │                               │
│  │  - MessageList  │             │                               │
│  │  - ChatInput    │             │                               │
│  └─────────────────┘             │                               │
└──────────────────────────────────┼───────────────────────────────┘
                                   │ HTTP POST (Streaming)
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Server (Next.js Edge)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                     │
│  │  /api/chat      │───►│   streamText    │                     │
│  │  Route Handler  │    │   (AI SDK)      │                     │
│  └─────────────────┘    └────────┬────────┘                     │
│                                  │                               │
│                         ┌────────▼────────┐                     │
│                         │  OpenAI Client  │                     │
│                         │  (@ai-sdk/openai)│                    │
│                         └────────┬────────┘                     │
└──────────────────────────────────┼───────────────────────────────┘
                                   │ HTTPS
                                   ▼
                        ┌─────────────────────┐
                        │    OpenAI API       │
                        │   (gpt-4o-mini)     │
                        └─────────────────────┘
```

### 1.2 Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **AI SDK Version** | `ai@4.x` | Latest stable with improved streaming and TypeScript support |
| **Provider** | `@ai-sdk/openai` | Official Vercel SDK integration for OpenAI |
| **Model** | `gpt-4o-mini` | Cost-effective, fast response times, suitable for demo |
| **Runtime** | Edge Runtime | Lower latency for streaming, global distribution |
| **State Management** | `useChat` hook | Built-in optimistic updates, automatic streaming |

---

## 2. File Structure

### 2.1 New Files to Create

```
app/
├── api/
│   └── chat/
│       └── route.ts              # API route handler for chat
├── chat/
│   ├── page.tsx                  # Main chat page component
│   └── _components/              # Chat-specific components
│       ├── chat-header.tsx       # Header with navigation
│       ├── chat-message.tsx      # Individual message component
│       ├── chat-message-list.tsx # Scrollable message container
│       └── chat-input.tsx        # Input form component

components/
└── ui/
    ├── input.tsx                 # Reusable input component (CVA)
    └── textarea.tsx              # Reusable textarea component (CVA)

lib/
└── ai/
    └── config.ts                 # AI configuration and system prompts

types/
└── chat.ts                       # TypeScript interfaces for chat
```

### 2.2 Files to Modify

| File | Modification |
|------|--------------|
| `package.json` | Add AI SDK dependencies |
| `next.config.js` | Update CSP for OpenAI API calls |
| `app/page.tsx` | Add navigation link to `/chat` (optional) |

---

## 3. Implementation Phases

### Phase 1: Foundation (Dependencies & Configuration)

**Objective**: Set up the technical foundation for AI integration.

#### 3.1.1 Install Dependencies

```bash
npm install ai @ai-sdk/openai
```

**Package Details**:
- `ai` (~50KB gzipped): Core Vercel AI SDK with React hooks and streaming utilities
- `@ai-sdk/openai`: OpenAI provider with full TypeScript support

#### 3.1.2 Environment Configuration

Create `.env.local.example`:
```env
# OpenAI API Key - Required for chat functionality
# Get your key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-...
```

#### 3.1.3 Update Content Security Policy

Modify `next.config.js` to allow OpenAI API connections:

```javascript
// Update connect-src directive
"connect-src 'self' https://api.openai.com;"
```

---

### Phase 2: Backend API Route

**Objective**: Create a streaming API endpoint for chat completions.

#### 3.2.1 API Route Implementation

**File**: `app/api/chat/route.ts`

```typescript
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are SecondOrder, a meta-thinking AI assistant...`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: SYSTEM_PROMPT,
    messages,
  });

  return result.toDataStreamResponse();
}
```

**Key Design Decisions**:

1. **Edge Runtime**: Faster cold starts, lower latency for streaming
2. **System Prompt**: Contextualizes the assistant with SecondOrder's meta-thinking concepts
3. **Error Handling**: Graceful degradation with meaningful error messages
4. **Rate Limiting**: Consider adding rate limiting for production (future enhancement)

#### 3.2.2 System Prompt Strategy

The system prompt should:
- Establish SecondOrder's identity and meta-thinking capabilities
- Provide context about iterative problem solving
- Set expectations for response style (concise, analytical)
- Include knowledge of meta-cognition concepts from the landing page

```typescript
const SYSTEM_PROMPT = `You are SecondOrder, a meta-thinking AI assistant that embodies
the principles of meta-cognition for LLM systems.

Core Capabilities:
- Meta thinking layer: Analyze goals, prompts, and constraints to generate sharper context
- Self-improving loop: Generate answers, absorb feedback, audit progress, and iterate
- Adaptive learning: Modify strategies for each new problem

Your responses should:
1. Be concise and analytical
2. Demonstrate self-monitoring and self-evaluation
3. Reference meta-cognitive principles when relevant
4. Acknowledge uncertainty and suggest iterative improvements

You help users understand and apply meta-thinking principles to their problems.`;
```

---

### Phase 3: Frontend Components

**Objective**: Build reusable, accessible UI components following SecondOrder's design system.

#### 3.3.1 Component Hierarchy

```
ChatPage (app/chat/page.tsx)
│
├── ChatHeader
│   ├── Logo/Back Navigation
│   └── Page Title
│
├── ChatMessageList
│   └── ChatMessage (repeated)
│       ├── Avatar (optional)
│       ├── Message Content
│       └── Timestamp (optional)
│
└── ChatInput
    ├── Textarea
    └── Send Button
```

#### 3.3.2 Design System Alignment

| Element | Style | Design Token |
|---------|-------|--------------|
| Page background | Light neutral | `bg-bone` |
| User messages | Dark bubble, right-aligned | `bg-ink text-bone` |
| Assistant messages | Light bubble, left-aligned | `bg-white border-fog` |
| Input field | Light with border | `bg-bone border-ink/20` |
| Send button | Primary action | `Button` component (default variant) |

#### 3.3.3 Chat Page Component

**File**: `app/chat/page.tsx`

```typescript
'use client';

import { useChat } from 'ai/react';
import { ChatHeader } from './_components/chat-header';
import { ChatMessageList } from './_components/chat-message-list';
import { ChatInput } from './_components/chat-input';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <main className="flex h-screen flex-col bg-bone">
      <ChatHeader />
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </main>
  );
}
```

#### 3.3.4 Message Component

**File**: `app/chat/_components/chat-message.tsx`

```typescript
import { cn } from '@/lib/utils';
import type { Message } from 'ai';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-ink text-bone'
            : 'border border-ink/10 bg-white text-ink'
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      </div>
    </div>
  );
}
```

#### 3.3.5 Input Component (Reusable)

**File**: `components/ui/textarea.tsx`

Following the existing CVA pattern from `button.tsx`:

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-xl border bg-bone px-4 py-3 text-sm transition placeholder:text-ink/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-ink/20",
        ghost: "border-transparent bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
```

---

### Phase 4: User Experience Enhancements

**Objective**: Polish the chat interface with accessibility and UX improvements.

#### 3.4.1 Loading States

```typescript
// Animated typing indicator
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-ink/40" />
    </div>
  );
}
```

#### 3.4.2 Auto-scroll Behavior

```typescript
// Scroll to bottom on new messages
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

#### 3.4.3 Keyboard Shortcuts

- `Enter`: Submit message
- `Shift+Enter`: New line
- `Escape`: Clear input (optional)

#### 3.4.4 Accessibility Considerations

- ARIA labels for interactive elements
- Focus management for keyboard navigation
- Screen reader announcements for new messages
- High contrast color compliance
- Reduced motion support

---

## 4. Error Handling Strategy

### 4.1 Error Categories

| Category | Handling Strategy |
|----------|-------------------|
| **Network Errors** | Retry with exponential backoff, show toast notification |
| **API Key Missing** | Show setup instructions, graceful degradation |
| **Rate Limiting** | Queue requests, show "please wait" message |
| **Model Errors** | Log error, show user-friendly message |
| **Validation Errors** | Inline form validation, prevent submission |

### 4.2 Error Boundary

```typescript
// app/chat/error.tsx
'use client';

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-bone">
      <h2 className="font-display text-2xl">Something went wrong</h2>
      <p className="mt-2 text-ink/70">{error.message}</p>
      <button onClick={reset} className="mt-4">
        Try again
      </button>
    </div>
  );
}
```

### 4.3 API Error Responses

```typescript
// In route.ts
export async function POST(req: Request) {
  try {
    // ... implementation
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

---

## 5. Testing Strategy

### 5.1 Unit Tests (Vitest)

**Components to Test**:
- `ChatMessage`: Renders correctly for user/assistant roles
- `ChatInput`: Handles input changes and submission
- `ChatMessageList`: Renders message list, handles empty state

**Example Test**:
```typescript
// app/chat/_components/chat-message.test.tsx
import { render, screen } from '@testing-library/react';
import { ChatMessage } from './chat-message';

describe('ChatMessage', () => {
  it('renders user message with correct styling', () => {
    const message = { id: '1', role: 'user', content: 'Hello' };
    render(<ChatMessage message={message} />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hello').parentElement).toHaveClass('bg-ink');
  });

  it('renders assistant message with correct styling', () => {
    const message = { id: '2', role: 'assistant', content: 'Hi there' };
    render(<ChatMessage message={message} />);

    expect(screen.getByText('Hi there')).toBeInTheDocument();
    expect(screen.getByText('Hi there').parentElement).toHaveClass('bg-white');
  });
});
```

### 5.2 Integration Tests (Vitest + MSW)

**Mock the OpenAI API**:
```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.post('/api/chat', () => {
    return new HttpResponse(
      'data: {"content":"Hello from mock!"}\n\n',
      { headers: { 'Content-Type': 'text/event-stream' } }
    );
  })
);
```

### 5.3 End-to-End Tests (Playwright)

**File**: `e2e/chat.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Chat Page', () => {
  test('should send a message and receive a response', async ({ page }) => {
    await page.goto('/chat');

    // Type and send a message
    await page.fill('[data-testid="chat-input"]', 'Hello');
    await page.click('[data-testid="send-button"]');

    // Verify message appears
    await expect(page.locator('[data-testid="user-message"]')).toContainText('Hello');

    // Wait for response (with timeout)
    await expect(page.locator('[data-testid="assistant-message"]')).toBeVisible({
      timeout: 30000
    });
  });

  test('should show loading state while waiting for response', async ({ page }) => {
    await page.goto('/chat');

    await page.fill('[data-testid="chat-input"]', 'Hello');
    await page.click('[data-testid="send-button"]');

    // Verify loading indicator appears
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible();
  });
});
```

### 5.4 Test Coverage Goals

| Category | Target |
|----------|--------|
| Unit Tests | 80%+ coverage |
| Integration Tests | Critical paths covered |
| E2E Tests | Happy path + error states |

---

## 6. Security Considerations

### 6.1 API Key Protection

- **Never expose in client**: API key stays server-side only
- **Environment variables**: Use `OPENAI_API_KEY` with no `NEXT_PUBLIC_` prefix
- **Validation**: Check for key presence at startup

### 6.2 Input Validation

```typescript
// Sanitize user input
const MAX_MESSAGE_LENGTH = 4000;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Validate message structure
  if (!Array.isArray(messages)) {
    return new Response('Invalid request body', { status: 400 });
  }

  // Validate message length
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.content?.length > MAX_MESSAGE_LENGTH) {
    return new Response('Message too long', { status: 400 });
  }

  // Continue with processing...
}
```

### 6.3 Rate Limiting (Future Enhancement)

Consider implementing rate limiting for production:
- Per-IP rate limiting
- Per-session message limits
- Token bucket algorithm

### 6.4 Content Security Policy

Update CSP to allow:
- `connect-src`: `https://api.openai.com` for API calls
- Keep existing protections for XSS, clickjacking, etc.

---

## 7. Performance Considerations

### 7.1 Streaming Optimization

- Use Edge Runtime for faster cold starts
- Chunk size optimization for smooth streaming
- Connection keep-alive for multiple messages

### 7.2 Bundle Size

| Package | Size (gzipped) |
|---------|----------------|
| `ai` | ~50KB |
| `@ai-sdk/openai` | ~15KB |
| **Total Impact** | ~65KB |

### 7.3 Rendering Optimization

```typescript
// Memoize message components
const MemoizedMessage = React.memo(ChatMessage);

// Use callback refs for auto-scroll
const scrollRef = useCallback((node: HTMLDivElement | null) => {
  node?.scrollIntoView({ behavior: 'smooth' });
}, []);
```

---

## 8. Deployment Checklist

### 8.1 Pre-Deployment

- [ ] All tests passing (`npm run test`)
- [ ] Type checking passes (`npm run ts-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables documented

### 8.2 Environment Variables (Vercel)

```bash
# Required
OPENAI_API_KEY=sk-...

# Optional (future)
OPENAI_ORG_ID=org-...
RATE_LIMIT_MAX=100
```

### 8.3 Post-Deployment

- [ ] Verify chat functionality works
- [ ] Check streaming performance
- [ ] Monitor error rates
- [ ] Verify CSP headers are correct

---

## 9. Future Enhancements (Out of Scope for v1)

| Enhancement | Priority | Complexity |
|-------------|----------|------------|
| Conversation persistence (database) | Medium | High |
| User authentication | Medium | Medium |
| Multi-model selection | Low | Medium |
| Chat history sidebar | Low | Medium |
| Export conversation | Low | Low |
| Markdown rendering in messages | Medium | Low |
| Code syntax highlighting | Medium | Medium |
| Voice input/output | Low | High |
| File/image attachments | Low | High |

---

## 10. Implementation Timeline

### Suggested Implementation Order

1. **Phase 1**: Dependencies & Configuration (~30 min)
   - Install packages
   - Set up environment variables
   - Update CSP

2. **Phase 2**: API Route (~1 hour)
   - Create route handler
   - Implement streaming
   - Add error handling

3. **Phase 3**: UI Components (~2-3 hours)
   - Create chat page layout
   - Build message components
   - Implement input form
   - Add loading states

4. **Phase 4**: Polish & Testing (~1-2 hours)
   - Write unit tests
   - Add E2E tests
   - Accessibility review
   - Performance optimization

**Total Estimated Effort**: 4-6 hours for full implementation

---

## 11. Success Criteria

### Functional Requirements

- [ ] User can send messages via the chat interface
- [ ] Assistant responses stream in real-time
- [ ] Chat history persists during session
- [ ] Loading states are visible during streaming
- [ ] Error states are handled gracefully

### Non-Functional Requirements

- [ ] TypeScript strict mode compliance
- [ ] ESLint passes with no errors
- [ ] Follows SecondOrder design system
- [ ] Responsive on mobile and desktop
- [ ] Accessible (WCAG 2.1 AA)

### Performance Targets

- [ ] First contentful paint < 1.5s
- [ ] Time to first stream chunk < 2s
- [ ] No layout shift during streaming

---

## 12. Appendix

### A. Useful Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)

### B. Code Examples Repository

All code examples in this document follow the patterns established in the SecondOrder codebase:
- CVA for component variants
- `cn()` utility for class merging
- forwardRef for form components
- TypeScript strict mode

### C. Decision Log

| Decision | Date | Rationale |
|----------|------|-----------|
| Use Edge Runtime | 2026-01 | Lower latency for streaming responses |
| gpt-4o-mini model | 2026-01 | Cost-effective for demo, easily upgradeable |
| Co-locate chat components | 2026-01 | Better code organization, follows Next.js patterns |

---

**Document Version**: 1.0
**Last Updated**: January 2026
**Next Review**: After implementation

# Vercel AI SDK Integration

This document describes how SecondOrder integrates with Vercel AI SDK to provide an interactive chat interface that demonstrates meta-thinking capabilities.

## Overview

The integration uses Vercel AI SDK v6+ and @ai-sdk/react v3+ to create a streaming chat experience powered by OpenAI's GPT models. The chat interface serves as a practical demonstration of SecondOrder's meta-thinking approach to AI cognition.

**Installed Packages:**
- `ai@6.0.5` - Core AI SDK with streaming utilities
- `@ai-sdk/openai@1.1.3` - OpenAI provider
- `@ai-sdk/react@3.0.5` - React hooks and components

## Architecture

### Components

1. **API Route** (`app/api/chat/route.ts`)
   - Edge runtime for low latency
   - Streaming text responses using `streamText`
   - Custom system prompt focused on meta-thinking principles
   - 30-second max duration for responses

2. **Chat Interface** (`components/chat/chat-interface.tsx`)
   - Client-side component using `useChat` hook
   - Real-time message streaming
   - Suggested prompts for user engagement
   - Loading states and visual feedback

3. **Landing Page Integration** (`app/page.tsx`)
   - "Try it now" section showcasing the chat interface
   - Navigation link to chat section

## Setup Instructions

### 1. Install Dependencies

The following packages are required:

```bash
npm install ai @ai-sdk/openai @ai-sdk/react --legacy-peer-deps
```

**Note**: The `--legacy-peer-deps` flag is needed because `@ai-sdk/react@3.0.5` has peer dependency conflicts with React 19.0.0. This is a known compatibility issue and the packages work correctly despite the warning.

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Add your OpenAI API key:

```
OPENAI_API_KEY=sk-...
```

Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys).

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and scroll to the "Try it now" section to test the chat interface.

## Key Features

### Meta-Thinking System Prompt

The chat assistant is configured with a specialized system prompt that embodies SecondOrder's principles:

- Meta-cognition and recursive thinking strategies
- Self-improving iterative problem-solving loops
- Adaptive chain-of-thought reasoning
- Model orchestration and tool selection
- Knowledge extraction and context engineering
- Self-auditing and progress monitoring

### Security & Validation

- **Input Validation**: API route validates messages array exists and is properly formatted
- **Error Handling**: Comprehensive try-catch with appropriate HTTP status codes
- **Type Safety**: Full TypeScript strict mode compliance
- **No Client Exposure**: API keys never sent to client

### User Experience

- **Streaming Responses**: Token-by-token streaming for a smooth, ChatGPT-like experience
- **Suggested Prompts**: Pre-defined questions to help users get started
- **Visual Feedback**: Loading indicators and status badges (Ready/Thinking)
- **Responsive Design**: Works on all screen sizes with Tailwind CSS
- **Performance Optimized**: Memoized transport instance to avoid re-instantiation

## Model Configuration

The current implementation uses OpenAI's `gpt-4o-mini` model, which provides a good balance of performance and cost for demonstration purposes.

### Changing Models

To use a different model, edit `app/api/chat/route.ts`:

```typescript
const result = streamText({
  model: openai('gpt-4o'),  // or 'gpt-4-turbo', 'gpt-3.5-turbo', etc.
  system: '...',
  messages,
});
```

### Using Different Providers

Vercel AI SDK supports multiple providers. To switch from OpenAI to another provider:

```typescript
// Anthropic Claude
import { anthropic } from '@ai-sdk/anthropic';
const result = streamText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  // ...
});

// Google Gemini
import { google } from '@ai-sdk/google';
const result = streamText({
  model: google('gemini-1.5-pro'),
  // ...
});
```

Install the corresponding SDK package:
```bash
npm install @ai-sdk/anthropic
# or
npm install @ai-sdk/google
```

## API Route Details

### Endpoint

- **URL**: `/api/chat`
- **Method**: `POST`
- **Runtime**: Edge
- **Max Duration**: 30 seconds

### Request Format

```json
{
  "messages": [
    {
      "role": "user",
      "content": "What is meta-thinking?"
    }
  ]
}
```

### Response Format

The endpoint returns a streaming response using Server-Sent Events (SSE) with the AI SDK's data stream format. The `useChat` hook automatically handles parsing this format.

## Testing

### Manual Testing

1. Navigate to the landing page
2. Scroll to "Try it now" section
3. Click a suggested prompt or type a custom question
4. Verify streaming response appears smoothly
5. Test multiple exchanges to ensure conversation context is maintained

### Unit Tests

Unit tests for the chat interface are located in `components/chat/chat-interface.test.tsx`. Run tests with:

```bash
npm test components/chat/chat-interface.test.tsx
```

**Note**: The project's test infrastructure requires `@testing-library/dom` to be installed. If tests fail with a module not found error, install it:

```bash
npm install --save-dev @testing-library/dom
```

### Suggested Test Prompts

- "What is meta-thinking?"
- "How does the self-auditing system work?"
- "Explain the iterative problem-solving loop"
- "What makes SecondOrder different from traditional AI?"
- "How do you monitor your own reasoning process?"

## Security Considerations

1. **API Keys**: Never commit API keys to version control. Always use environment variables.
2. **Rate Limiting**: Consider implementing rate limiting for production use.
3. **Input Validation**: The API route should validate user input to prevent abuse.
4. **Error Handling**: Implement proper error boundaries and fallbacks for API failures.

## Performance Optimization

1. **Edge Runtime**: The API route runs on Edge runtime for minimal latency.
2. **Streaming**: Responses stream token-by-token, providing immediate feedback.
3. **Model Selection**: Using `gpt-4o-mini` balances quality with response time and cost.

## Deployment on Vercel

### Environment Variables

Set the `OPENAI_API_KEY` in Vercel's dashboard:

1. Go to Project Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your API key
3. Select which environments (Production, Preview, Development)
4. Save and redeploy

### Edge Functions

The chat API route automatically deploys as an Edge Function, providing:
- Global low latency
- Automatic scaling
- No cold starts

## Future Enhancements

Potential improvements to the integration:

1. **Tool Calling**: Enable the AI to use external tools and functions
2. **Structured Outputs**: Use `generateObject` for specific data extraction
3. **Multi-Model Orchestration**: Automatically select between models based on query complexity
4. **Memory/Context**: Persist conversation history across sessions
5. **Streaming UI**: Add streaming UI components for richer interactions
6. **Analytics**: Track usage patterns and response quality
7. **Custom Embeddings**: Integrate with a vector database for RAG capabilities

## Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Edge Runtime](https://edge-runtime.vercel.app/)

## Troubleshooting

### Chat not working

1. Verify `OPENAI_API_KEY` is set correctly in `.env.local`
2. Check browser console for errors
3. Verify API route is accessible at `/api/chat`
4. Check OpenAI API key has sufficient credits

### Slow responses

1. Consider upgrading to a faster model like `gpt-4o`
2. Check network latency to OpenAI API
3. Verify Edge runtime is being used

### Build errors

1. Ensure all dependencies are installed: `npm install`
2. Run type checking: `npm run ts-check`
3. Clear Next.js cache: `rm -rf .next`

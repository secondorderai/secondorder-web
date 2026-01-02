# Second Order AI - New layer of LLM app

A Next.js landing page showcasing meta-thinking AI concepts with an interactive chat interface powered by Vercel AI SDK.

## Features

- ✅ **Vercel AI SDK Integration**: Interactive chat interface with streaming responses powered by OpenAI GPT models
- **Meta-thinking prompt system**: Dynamic thinking layer that analyzes and adapts to prompts
- **Solver builder**: Tool-driven agents for complex problem solving
- **Self-improving loops**: Multi-step processes with autonomous progress auditing
- **Knowledge extraction**: Maximizes LLM's world knowledge to uncover hidden information
- **Adaptive reasoning**: Harnesses LLM capabilities for better reasoning and problem solving
- **Self-learning memory**: Continuous improvement through feedback loops
- **Model orchestration**: Automatically selects optimal model combinations and approaches
- **Meta-system design**: Produces optimized agents for complex reasoning tasks

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**: Visit http://localhost:3000 and try the interactive chat in the "Try it now" section.

## Vercel AI SDK Integration

The project integrates Vercel AI SDK to demonstrate meta-thinking capabilities through an interactive chat interface. See [doc/vercel-ai-sdk-integration.md](doc/vercel-ai-sdk-integration.md) for detailed documentation.

### Key Components

- **API Route** (`app/api/chat/route.ts`): Streaming chat endpoint with meta-thinking system prompt
- **Chat Interface** (`components/chat/chat-interface.tsx`): Real-time chat UI with suggested prompts
- **Landing Page** (`app/page.tsx`): Integrated "Try it now" section

## What is it?

- Thinking of thinking / Meta thinking
- Dynamic thinking layer on top of LLM
- Adaptive Chain of thoughts
- Analyse the prompt / question / goal to generate extra context, skills to use, tools to use, refined question / goal
- Judge Agent to choose the best input to execute and generate plan using worker agent
- Automate context engineering
- The challenge lies in discovering a reasoning strategy that can both find the necessary pieces of information and assemble them when they are discovered to intelligently determine what information is needed next
- Discovering, appropriate reasoning strategies that are both adaptive to the underlying LLM and work within specified real-world constraints (budgets, tokens, or compute)
- developing better strategies for determining what to ask, refining sequential chain-of-questions, and devising fundamental new methods for assembling the answers

## Iterative problem-solving loop

- generate a potential solution
- receives feedback
- analyzes the feedback
- and then uses the LLM again to refine it
- self-improving process allows us to incrementally build and perfect the answer.

## Self-auditing overview monitoring process

- autonomously audits its own progress
- decides for itself when it has enough information and the solution is satisfactory,

## Meta-Thinking in AI

Meta-thinking in AI refers to the hypothetical or theoretical capability of an artificial intelligence system to reflect on its own cognitive processes, decisions, or learning mechanisms. This concept draws inspiration from human metacognition, which involves planning, monitoring, and evaluating one's own thinking during tasks such as problem-solving or learning.

### Key Aspects

1. Self-Monitoring: The AI observes and evaluates its own performance or outputs in real-time, identifying potential issues or areas for improvement.
2. Self-Evaluation: It assesses the quality, correctness, or appropriateness of its decisions, much like a human might review their work for errors or biases.
3. Adaptive Learning: The AI uses insights from self-reflection to improve future performance, modify its strategies, or even adjust its own architecture dynamically.

## Development

```bash
# Type checking
npm run ts-check

# Linting
npm run lint

# Production build
npm run build

# Tests
npm test
npm run test:ui
npm run test:coverage

# E2E tests
npm run test:e2e
npm run test:e2e:ui
```

## Tech Stack

- **Framework**: Next.js 15.5.9 (App Router)
- **React**: 19.0.0
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS with custom design tokens
- **Fonts**: Manrope (sans) and Playfair Display (display)
- **AI**: Vercel AI SDK with OpenAI integration

## Learn More

- [Vercel AI SDK Integration Guide](doc/vercel-ai-sdk-integration.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)

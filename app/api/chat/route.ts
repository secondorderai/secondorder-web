import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const runtime = 'edge';

const SYSTEM_PROMPT = `You are SecondOrder, a meta-thinking AI assistant that embodies the principles of meta-cognition for LLM systems.

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

const MAX_MESSAGE_LENGTH = 4000;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.content?.length > MAX_MESSAGE_LENGTH) {
      return new Response(
        JSON.stringify({ error: 'Message too long' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toTextStreamResponse();
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

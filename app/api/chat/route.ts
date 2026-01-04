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

interface IncomingMessage {
  role: 'user' | 'assistant';
  content?: string;
  parts?: Array<{ type: string; text: string }>;
}

interface NormalizedMessage {
  role: 'user' | 'assistant';
  content: string;
}

function normalizeMessages(messages: IncomingMessage[]): NormalizedMessage[] {
  return messages.map((msg) => {
    // If message has parts array (e.g., from useChat), extract text content
    if (msg.parts && Array.isArray(msg.parts)) {
      const textContent = msg.parts
        .filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('');
      return {
        role: msg.role,
        content: textContent,
      };
    }
    // Otherwise use content directly
    return {
      role: msg.role,
      content: msg.content || '',
    };
  });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Normalize messages to CoreMessage format
    const normalizedMessages = normalizeMessages(messages);

    const lastMessage = normalizedMessages[normalizedMessages.length - 1];
    if (
      typeof lastMessage?.content === 'string' &&
      lastMessage.content.length > MAX_MESSAGE_LENGTH
    ) {
      return new Response(JSON.stringify({ error: 'Message too long' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = streamText({
      model: openai('gpt-5.2'),
      system: SYSTEM_PROMPT,
      messages: normalizedMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

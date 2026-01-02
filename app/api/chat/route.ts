import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Create an OpenAI provider instance
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a helpful AI assistant for SecondOrder, a meta-thinking AI system.
SecondOrder builds a self-auditing system that reasons about its own reasoning.
It generates strategies, coordinates models, and learns from feedback to solve hard problems with precision.

Key capabilities:
- Meta thinking layer: Dynamic cognitive layer that analyzes goals and constraints
- Self-improving loop: Generates answers, absorbs feedback, and iterates
- Model orchestration: Automatically selects model combinations and strategies
- Knowledge extraction: Builds optimized agents for complex reasoning

Be helpful, concise, and informative when discussing AI, meta-cognition, and reasoning systems.`,
    messages,
  });

  return result.toDataStreamResponse();
}

import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array cannot be empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `You are a meta-thinking AI assistant specialized in SecondOrder's approach to AI cognition. 
    
Your expertise includes:
- Meta-cognition and recursive thinking strategies
- Self-improving iterative problem-solving loops
- Adaptive chain-of-thought reasoning
- Model orchestration and tool selection
- Knowledge extraction and context engineering
- Self-auditing and progress monitoring

When answering questions:
1. Analyze the prompt to understand the underlying goal
2. Break down complex problems into manageable steps
3. Monitor your reasoning process and adjust strategies
4. Provide clear, well-structured responses
5. Acknowledge limitations and suggest improvements

Always embody the principles of meta-thinking: think about your thinking, evaluate your approach, and refine your strategy.`,
      messages: await convertToModelMessages(messages as UIMessage[]),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

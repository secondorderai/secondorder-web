import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { metaChatRequestContextSchema } from '@/lib/chat/contracts';
import {
  getAgentModel,
  getCriticModel,
  getPlannerModel,
  mastraStorage,
  SECOND_ORDER_SYSTEM_PROMPT,
} from './config';

export const chatMemory = new Memory({
  storage: mastraStorage,
  options: {
    lastMessages: 20,
    generateTitle: true,
    semanticRecall: false,
    workingMemory: {
      enabled: false,
    },
  },
});

export const plannerAgent = new Agent({
  id: 'planner-agent',
  name: 'Planner Agent',
  description: 'Generates compact plans for complex user requests.',
  instructions: `You are the SecondOrder planning layer.

Extract:
- the user goal
- important constraints
- a short execution plan
- a response strategy

Keep the output concrete and concise.`,
  model: getPlannerModel(),
});

export const criticAgent = new Agent({
  id: 'critic-agent',
  name: 'Critic Agent',
  description: 'Reviews draft answers for omissions, weak assumptions, and risk.',
  instructions: `You are the SecondOrder critique layer.

Review a draft answer and identify:
- missing constraints
- unsupported assumptions
- places where clarity or caution should improve
- explicit limitations that should be surfaced to the user
- context gaps where more information would materially improve the answer

Be concise and practical.`,
  model: getCriticModel(),
});

export const secondOrderAgent = new Agent({
  id: 'second-order-agent',
  name: 'SecondOrder Agent',
  description: 'The user-facing SecondOrder chat agent.',
  instructions: ({ requestContext }) => {
    const parsedContext = metaChatRequestContextSchema.safeParse(
      requestContext?.all,
    );

    if (!parsedContext.success) {
      return SECOND_ORDER_SYSTEM_PROMPT;
    }

    const context = parsedContext.data;

    return [
      SECOND_ORDER_SYSTEM_PROMPT,
      `Execution mode: ${context.taskType}`,
      `Selected skills: ${context.selectedSkillNames.join(', ') || 'none'}`,
      context.meta.goal ? `Goal: ${context.meta.goal}` : '',
      context.meta.constraints.length > 0
        ? `Constraints: ${context.meta.constraints.join('; ')}`
        : '',
      context.meta.plan.length > 0
        ? `Plan outline: ${context.meta.plan.join(' -> ')}`
        : '',
      context.meta.limitations.length > 0
        ? `Limitations: ${context.meta.limitations.join('; ')}`
        : '',
      context.meta.contextGaps.length > 0
        ? `Context gaps: ${context.meta.contextGaps.join('; ')}`
        : '',
      context.meta.responseStrategy
        ? `Response guidance: ${context.meta.responseStrategy}`
        : '',
      context.shouldUseMeta
        ? 'Use the plan and critique guidance, but only surface the final answer unless the user asks for the intermediate reasoning.'
        : 'Respond directly. Do not expose internal orchestration.',
    ]
      .filter(Boolean)
      .join('\n\n');
  },
  model: getAgentModel(),
  memory: chatMemory,
  requestContextSchema: metaChatRequestContextSchema,
});

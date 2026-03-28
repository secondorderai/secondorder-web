import { z } from 'zod';
import { createStep, createWorkflow } from '@mastra/core/workflows';
import { getMessageTextContent } from '@/lib/chat/messages';
import {
  critiqueResultSchema,
  metaResponseDetailsSchema,
  metaWorkflowResultSchema,
  plannerResultSchema,
} from '@/lib/chat/contracts';
import {
  classifyTask,
  selectSkills,
  shouldUseMetaWorkflow,
  type TaskType,
} from '../skills/registry';
import { criticAgent, plannerAgent } from '../agents';

const workflowInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      parts: z.array(z.object({ type: z.string() }).passthrough()).default([]),
    }),
  ),
  threadId: z.string().uuid(),
  resourceId: z.string().uuid(),
});

const classifyStepOutputSchema = z.object({
  taskType: z.enum([
    'simple_chat',
    'analysis',
    'planning',
    'decision',
    'troubleshooting',
  ]),
  shouldUseMeta: z.boolean(),
  selectedSkillIds: z.array(z.string()),
  selectedSkillNames: z.array(z.string()),
  latestUserMessage: z.string(),
  conversationSummary: z.string(),
});

const planStepOutputSchema = z.object({
  taskType: classifyStepOutputSchema.shape.taskType,
  shouldUseMeta: z.boolean(),
  selectedSkillIds: z.array(z.string()),
  selectedSkillNames: z.array(z.string()),
  latestUserMessage: z.string(),
  conversationSummary: z.string(),
  goal: z.string(),
  constraints: z.array(z.string()),
  plan: z.array(z.string()),
  responseStrategy: z.string(),
});

const draftStepOutputSchema = z.object({
  taskType: planStepOutputSchema.shape.taskType,
  shouldUseMeta: z.boolean(),
  selectedSkillIds: z.array(z.string()),
  selectedSkillNames: z.array(z.string()),
  latestUserMessage: z.string(),
  goal: z.string(),
  constraints: z.array(z.string()),
  plan: z.array(z.string()),
  responseStrategy: z.string(),
  draftAnswer: z.string(),
});

const emptyMeta = {
  goal: '',
  constraints: [],
  plan: [],
  responseStrategy: 'Respond directly and concisely.',
  confidence: 'low' as const,
  limitations: [],
  contextGaps: [],
} satisfies z.infer<typeof metaResponseDetailsSchema>;

function buildFallbackGoal(latestUserMessage: string) {
  return latestUserMessage.trim() || 'Answer the latest user request clearly.';
}

function buildFallbackPlanResult(inputData: z.infer<typeof classifyStepOutputSchema>) {
  return {
    ...inputData,
    goal: buildFallbackGoal(inputData.latestUserMessage),
    constraints: [],
    plan: [],
    responseStrategy: 'Respond directly, keep assumptions explicit, and avoid overclaiming.',
  };
}

function buildFallbackCritiqueResult(inputData: z.infer<typeof draftStepOutputSchema>) {
  return {
    taskType: inputData.taskType,
    shouldUseMeta: true,
    selectedSkillIds: inputData.selectedSkillIds,
    selectedSkillNames: inputData.selectedSkillNames,
    meta: {
      goal: inputData.goal,
      constraints: inputData.constraints,
      plan: inputData.plan,
      responseStrategy: inputData.responseStrategy,
      confidence: 'low' as const,
      limitations: ['Meta review was unavailable for this response.'],
      contextGaps: [] as string[],
    },
  };
}

function buildConversationSummary(
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    parts?: Array<{ type?: string; text?: string }>;
    content?: string;
  }>,
) {
  return messages
    .map((message) => {
      const content = getMessageTextContent(message).trim();
      return content ? `${message.role}: ${content}` : null;
    })
    .filter((value): value is string => Boolean(value))
    .slice(-8)
    .join('\n');
}

const classifyStep = createStep({
  id: 'classify-step',
  inputSchema: workflowInputSchema,
  outputSchema: classifyStepOutputSchema,
  execute: async ({ inputData }) => {
    const latestUserMessage = [...inputData.messages]
      .reverse()
      .find((message) => message.role === 'user');

    const latestUserText = latestUserMessage
      ? getMessageTextContent(latestUserMessage)
      : '';
    const taskType = classifyTask(latestUserText);
    const selectedSkills = selectSkills(taskType);

    return {
      taskType,
      shouldUseMeta: shouldUseMetaWorkflow(taskType),
      selectedSkillIds: selectedSkills.map((skill) => skill.id),
      selectedSkillNames: selectedSkills.map((skill) => skill.name),
      latestUserMessage: latestUserText,
      conversationSummary: buildConversationSummary(inputData.messages),
    };
  },
});

const planStep = createStep({
  id: 'plan-step',
  inputSchema: classifyStepOutputSchema,
  outputSchema: planStepOutputSchema,
  execute: async ({ inputData }) => {
    if (!inputData.shouldUseMeta) {
      return {
        ...inputData,
        goal: '',
        constraints: [],
        plan: [],
        responseStrategy: emptyMeta.responseStrategy,
      };
    }

    try {
      const result = await plannerAgent.generate(
        `Task type: ${inputData.taskType}

Conversation summary:
${inputData.conversationSummary}

Latest user request:
${inputData.latestUserMessage}`,
        {
          structuredOutput: {
            schema: plannerResultSchema,
          },
        },
      );

      const plan = result.object;
      if (!plan) {
        return buildFallbackPlanResult(inputData);
      }

      return {
        ...inputData,
        goal: plan.goal,
        constraints: plan.constraints,
        plan: plan.plan,
        responseStrategy: plan.responseStrategy,
      };
    } catch {
      return buildFallbackPlanResult(inputData);
    }
  },
});

const draftStep = createStep({
  id: 'draft-step',
  inputSchema: planStepOutputSchema,
  outputSchema: draftStepOutputSchema,
  execute: async ({ inputData }) => {
    if (!inputData.shouldUseMeta) {
      return {
        ...inputData,
        draftAnswer: '',
      };
    }

    const draft = await plannerAgent.generate(
      `Create a short draft answer for the following user request.

Goal:
${inputData.goal}

Constraints:
${inputData.constraints.join('; ') || 'None provided'}

Plan:
${inputData.plan.join(' -> ') || 'Answer directly'}

Response strategy:
${inputData.responseStrategy}

User request:
${inputData.latestUserMessage}`,
    );

    return {
      ...inputData,
      draftAnswer: draft.text,
    };
  },
});

const critiqueStep = createStep({
  id: 'critique-step',
  inputSchema: draftStepOutputSchema,
  outputSchema: metaWorkflowResultSchema,
  execute: async ({ inputData }) => {
    if (!inputData.shouldUseMeta) {
      return {
        taskType: inputData.taskType,
        shouldUseMeta: false,
        selectedSkillIds: inputData.selectedSkillIds,
        selectedSkillNames: inputData.selectedSkillNames,
        meta: emptyMeta,
      };
    }

    try {
      const critique = await criticAgent.generate(
        `Review this draft answer for the user's request.

User request:
${inputData.latestUserMessage}

Draft answer:
${inputData.draftAnswer}`,
        {
          structuredOutput: {
            schema: critiqueResultSchema,
          },
        },
      );

      const critiqueResult = critique.object;
      if (!critiqueResult) {
        return buildFallbackCritiqueResult(inputData);
      }

      return {
        taskType: inputData.taskType,
        shouldUseMeta: true,
        selectedSkillIds: inputData.selectedSkillIds,
        selectedSkillNames: inputData.selectedSkillNames,
        meta: {
          goal: inputData.goal,
          constraints: inputData.constraints,
          plan: inputData.plan,
          responseStrategy: [
            inputData.responseStrategy,
            critiqueResult.recommendedAdjustments.join(' '),
          ]
            .filter(Boolean)
            .join(' ')
            .trim(),
          confidence: critiqueResult.confidence,
          limitations: critiqueResult.limitations.length
            ? critiqueResult.limitations
            : critiqueResult.concerns,
          contextGaps: critiqueResult.contextGaps,
        },
      };
    } catch {
      return buildFallbackCritiqueResult(inputData);
    }
  },
});

export const metaChatWorkflow = createWorkflow({
  id: 'meta-chat-workflow',
  inputSchema: workflowInputSchema,
  outputSchema: metaWorkflowResultSchema,
})
  .then(classifyStep)
  .then(planStep)
  .then(draftStep)
  .then(critiqueStep)
  .commit();

export type MetaChatWorkflowResult = z.infer<typeof metaWorkflowResultSchema>;
export type MetaChatTaskType = TaskType;

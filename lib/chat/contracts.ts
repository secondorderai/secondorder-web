import { z } from 'zod';
import { TASK_TYPES } from '@/mastra/skills/registry';

export const threadIdSchema = z.string().uuid();

export const chatPartSchema = z
  .object({
    type: z.string(),
  })
  .passthrough();

export const chatMessageSchema = z
  .object({
    id: z.string().optional(),
    role: z.enum(['system', 'user', 'assistant']),
    parts: z.array(chatPartSchema).default([]),
    metadata: z.unknown().optional(),
  })
  .passthrough();

export const chatPostBodySchema = z.object({
  threadId: threadIdSchema,
  messages: z.array(chatMessageSchema),
});

export const historyQuerySchema = z.object({
  threadId: threadIdSchema,
});

export const feedbackValueSchema = z.enum([
  'helpful',
  'not_helpful',
  'needs_more_depth',
  'missed_constraints',
]);

export const chatFeedbackBodySchema = z.object({
  threadId: threadIdSchema,
  messageId: z.string().min(1),
  taskType: z.enum(TASK_TYPES),
  feedback: feedbackValueSchema,
});

export const chatEventTypeSchema = z.enum([
  'thread_started',
  'message_submitted',
  'task_classified',
  'meta_mode_used',
  'plan_preview_expanded',
  'response_completed',
  'feedback_submitted',
]);

export const chatEventBodySchema = z.object({
  eventType: chatEventTypeSchema,
  threadId: threadIdSchema,
  messageId: z.string().min(1).optional(),
  taskType: z.enum(TASK_TYPES).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const plannerResultSchema = z.object({
  goal: z.string(),
  constraints: z.array(z.string()),
  plan: z.array(z.string()),
  responseStrategy: z.string(),
});

export const critiqueResultSchema = z.object({
  concerns: z.array(z.string()),
  recommendedAdjustments: z.array(z.string()),
  confidence: z.enum(['low', 'medium', 'high']),
  limitations: z.array(z.string()),
  contextGaps: z.array(z.string()),
});

export const metaResponseDetailsSchema = z.object({
  goal: z.string(),
  constraints: z.array(z.string()),
  plan: z.array(z.string()),
  responseStrategy: z.string(),
  confidence: z.enum(['low', 'medium', 'high']),
  limitations: z.array(z.string()),
  contextGaps: z.array(z.string()),
});

export const metaWorkflowResultSchema = z.object({
  taskType: z.enum(TASK_TYPES),
  shouldUseMeta: z.boolean(),
  selectedSkillIds: z.array(z.string()),
  selectedSkillNames: z.array(z.string()),
  meta: metaResponseDetailsSchema,
});

export const metaChatRequestContextSchema = z.object({
  threadId: threadIdSchema,
  resourceId: z.string().uuid(),
  taskType: z.enum(TASK_TYPES),
  shouldUseMeta: z.boolean(),
  selectedSkillIds: z.array(z.string()),
  selectedSkillNames: z.array(z.string()),
  meta: metaResponseDetailsSchema,
});

export type MetaChatRequestContext = z.infer<
  typeof metaChatRequestContextSchema
>;

export type ChatFeedbackBody = z.infer<typeof chatFeedbackBodySchema>;
export type ChatEventBody = z.infer<typeof chatEventBodySchema>;

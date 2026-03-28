import { describe, expect, it } from 'vitest';
import {
  chatEventBodySchema,
  metaChatRequestContextSchema,
  metaWorkflowResultSchema,
} from '@/lib/chat/contracts';

const validMeta = {
  goal: 'Help the user ship a migration safely.',
  constraints: ['No downtime', 'One engineer available'],
  plan: ['Audit dependencies', 'Stage the rollout', 'Monitor errors'],
  responseStrategy: 'Lead with the rollout sequence and note risk controls.',
  confidence: 'medium' as const,
  limitations: ['Environment details are missing'],
  contextGaps: ['Current database size is unknown'],
};

describe('chat contracts', () => {
  it('accepts structured workflow metadata for meta-routed tasks', () => {
    const result = metaWorkflowResultSchema.safeParse({
      taskType: 'planning',
      shouldUseMeta: true,
      selectedSkillIds: ['interpret-task', 'build-plan'],
      selectedSkillNames: ['Interpret Task', 'Build Plan'],
      meta: validMeta,
    });

    expect(result.success).toBe(true);
  });

  it('requires structured metadata in request context', () => {
    const result = metaChatRequestContextSchema.safeParse({
      threadId: '11111111-1111-4111-8111-111111111111',
      resourceId: '22222222-2222-4222-8222-222222222222',
      taskType: 'analysis',
      shouldUseMeta: true,
      selectedSkillIds: ['interpret-task'],
      selectedSkillNames: ['Interpret Task'],
      meta: validMeta,
    });

    expect(result.success).toBe(true);
  });

  it('rejects missing structured confidence data', () => {
    const result = metaWorkflowResultSchema.safeParse({
      taskType: 'decision',
      shouldUseMeta: true,
      selectedSkillIds: [],
      selectedSkillNames: [],
      meta: {
        ...validMeta,
        confidence: undefined,
      },
    });

    expect(result.success).toBe(false);
  });

  it('accepts structured chat instrumentation events', () => {
    const result = chatEventBodySchema.safeParse({
      eventType: 'plan_preview_expanded',
      threadId: '11111111-1111-4111-8111-111111111111',
      messageId: 'assistant-1',
      taskType: 'planning',
      metadata: {
        planLength: 3,
      },
    });

    expect(result.success).toBe(true);
  });
});

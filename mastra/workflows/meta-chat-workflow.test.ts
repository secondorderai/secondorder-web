import { beforeEach, describe, expect, it, vi } from 'vitest';

const plannerGenerateMock = vi.fn();
const criticGenerateMock = vi.fn();

vi.mock('../agents', () => ({
  plannerAgent: {
    generate: plannerGenerateMock,
  },
  criticAgent: {
    generate: criticGenerateMock,
  },
}));

async function runWorkflow(latestUserMessage: string) {
  const { metaChatWorkflow } = await import('./meta-chat-workflow');
  const run = await metaChatWorkflow.createRun({
    resourceId: '11111111-1111-4111-8111-111111111111',
  });

  return run.start({
    inputData: {
      threadId: '22222222-2222-4222-8222-222222222222',
      resourceId: '11111111-1111-4111-8111-111111111111',
      messages: [
        {
          role: 'user',
          parts: [{ type: 'text', text: latestUserMessage }],
        },
      ],
    },
  });
}

describe('metaChatWorkflow', () => {
  beforeEach(() => {
    plannerGenerateMock.mockReset();
    criticGenerateMock.mockReset();
  });

  it('keeps the workflow successful when plan generation fails', async () => {
    plannerGenerateMock
      .mockRejectedValueOnce(new Error('planner unavailable'))
      .mockResolvedValueOnce({ text: 'Fallback draft answer' });
    criticGenerateMock.mockResolvedValue({
      object: {
        concerns: [],
        recommendedAdjustments: [],
        confidence: 'medium',
        limitations: [],
        contextGaps: [],
      },
    });

    const result = await runWorkflow('Help me plan a migration rollout.');

    expect(result.status).toBe('success');
    if (result.status !== 'success') {
      throw new Error('Expected workflow success');
    }

    expect(result.result.shouldUseMeta).toBe(true);
    expect(result.result.taskType).toBe('planning');
    expect(result.result.meta.goal).toBe('Help me plan a migration rollout.');
    expect(result.result.meta.plan).toEqual([]);
    expect(result.result.meta.responseStrategy).toContain(
      'Respond directly, keep assumptions explicit, and avoid overclaiming.',
    );
  });

  it('falls back to low-confidence metadata when critique generation fails', async () => {
    plannerGenerateMock
      .mockResolvedValueOnce({
        object: {
          goal: 'Plan the rollout.',
          constraints: ['Avoid downtime'],
          plan: ['Audit dependencies', 'Ship in phases'],
          responseStrategy: 'Lead with the staged rollout.',
        },
      })
      .mockResolvedValueOnce({ text: 'Draft answer' });
    criticGenerateMock.mockRejectedValueOnce(new Error('critic unavailable'));

    const result = await runWorkflow('Help me plan a migration rollout.');

    expect(result.status).toBe('success');
    if (result.status !== 'success') {
      throw new Error('Expected workflow success');
    }

    expect(result.result.shouldUseMeta).toBe(true);
    expect(result.result.meta.confidence).toBe('low');
    expect(result.result.meta.plan).toEqual([
      'Audit dependencies',
      'Ship in phases',
    ]);
    expect(result.result.meta.limitations).toEqual([
      'Meta review was unavailable for this response.',
    ]);
  });
});

export interface MetaChatEvalCase {
  id: string;
  prompt: string;
  focus: 'answer-relevance' | 'plan-adherence' | 'critique-rigor';
  expectedSignals: string[];
}

export const metaChatEvalDataset: MetaChatEvalCase[] = [
  {
    id: 'analysis-architecture-tradeoff',
    prompt:
      'Analyze the tradeoffs between embedding an agent runtime inside Next.js versus moving it to a separate service.',
    focus: 'answer-relevance',
    expectedSignals: ['tradeoffs', 'latency', 'operational complexity'],
  },
  {
    id: 'planning-migration',
    prompt:
      'Create a migration plan from a simple chat route to a multi-step agent system with planner and critic layers.',
    focus: 'plan-adherence',
    expectedSignals: ['phases', 'backend changes', 'frontend changes'],
  },
  {
    id: 'critique-unsupported-claim',
    prompt:
      'Review a draft answer that recommends a framework migration but does not mention persistence, testing, or rollback risk.',
    focus: 'critique-rigor',
    expectedSignals: ['missing constraints', 'testing', 'rollback'],
  },
];

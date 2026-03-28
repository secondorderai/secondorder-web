export const TASK_TYPES = [
  'simple_chat',
  'analysis',
  'planning',
  'decision',
  'troubleshooting',
] as const;

export type TaskType = (typeof TASK_TYPES)[number];

export interface SkillDescriptor {
  id: 'interpret-task' | 'build-plan' | 'draft-answer' | 'self-critique';
  name: string;
  description: string;
  appliesTo: readonly TaskType[];
}

export const SKILL_REGISTRY: SkillDescriptor[] = [
  {
    id: 'interpret-task',
    name: 'Interpret Task',
    description:
      'Clarify the user goal, explicit constraints, and missing context before solving.',
    appliesTo: TASK_TYPES,
  },
  {
    id: 'build-plan',
    name: 'Build Plan',
    description:
      'Produce a compact execution strategy for analysis, planning, decision, and troubleshooting tasks.',
    appliesTo: ['analysis', 'planning', 'decision', 'troubleshooting'],
  },
  {
    id: 'draft-answer',
    name: 'Draft Answer',
    description:
      'Turn the active strategy into a direct response shaped for the user.',
    appliesTo: TASK_TYPES,
  },
  {
    id: 'self-critique',
    name: 'Self Critique',
    description:
      'Review the draft for omissions, weak assumptions, and unsupported claims.',
    appliesTo: ['analysis', 'planning', 'decision', 'troubleshooting'],
  },
];

const TASK_RULES: Array<{
  taskType: Exclude<TaskType, 'simple_chat'>;
  patterns: RegExp[];
}> = [
  {
    taskType: 'troubleshooting',
    patterns: [
      /\b(debug|bug|broken|error|fix|issue|failing|failure|stack trace|not working)\b/i,
      /\bwhy (?:is|does|did)\b/i,
    ],
  },
  {
    taskType: 'planning',
    patterns: [
      /\b(plan|roadmap|milestone|timeline|phases?|steps?)\b/i,
      /\bhow should (?:i|we)\b/i,
    ],
  },
  {
    taskType: 'decision',
    patterns: [
      /\bchoose|decision|trade[- ]?off|compare|which should\b/i,
      /\bpros? and cons?\b/i,
    ],
  },
  {
    taskType: 'analysis',
    patterns: [
      /\b(analy[sz]e|analysis|evaluate|assess|review|investigate|break down)\b/i,
      /\bwhat are the implications\b/i,
    ],
  },
];

export function classifyTask(message: string): TaskType {
  const normalized = message.trim();

  if (!normalized) {
    return 'simple_chat';
  }

  for (const rule of TASK_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(normalized))) {
      return rule.taskType;
    }
  }

  return normalized.length > 280 ? 'analysis' : 'simple_chat';
}

export function shouldUseMetaWorkflow(taskType: TaskType): boolean {
  return taskType !== 'simple_chat';
}

export function selectSkills(taskType: TaskType): SkillDescriptor[] {
  return SKILL_REGISTRY.filter((skill) => skill.appliesTo.includes(taskType));
}

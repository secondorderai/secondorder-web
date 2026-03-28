import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import {
  DefaultExporter,
  Observability,
  SensitiveDataFilter,
} from '@mastra/observability';

const DEFAULT_MODEL = 'openai/gpt-5.1';

export const SECOND_ORDER_SYSTEM_PROMPT = `You are SecondOrder, a meta-thinking AI assistant that embodies the principles of meta-cognition for LLM systems.

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

export function getAgentModel() {
  return process.env.SECONDORDER_AGENT_MODEL ?? DEFAULT_MODEL;
}

export function getPlannerModel() {
  return process.env.SECONDORDER_PLANNER_MODEL ?? getAgentModel();
}

export function getCriticModel() {
  return process.env.SECONDORDER_CRITIC_MODEL ?? getAgentModel();
}

export function createMastraStorage() {
  const url = process.env.MASTRA_STORAGE_URL ?? 'file:./.mastra/secondorder.db';

  if (url.startsWith('file:')) {
    const filePath = url.slice('file:'.length);
    const directory = path.dirname(filePath);
    mkdirSync(directory, { recursive: true });
  }

  return new LibSQLStore({
    id: 'secondorder-storage',
    url,
    authToken: process.env.MASTRA_STORAGE_AUTH_TOKEN,
  });
}

export function createMastraLogger() {
  return new PinoLogger({
    name: 'secondorder',
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  });
}

export function createMastraObservability() {
  return new Observability({
    configs: {
      default: {
        serviceName: 'secondorder-web',
        exporters: [new DefaultExporter()],
        spanOutputProcessors: [new SensitiveDataFilter()],
      },
    },
  });
}

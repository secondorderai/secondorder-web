import { Mastra } from '@mastra/core/mastra';
import { secondOrderAgent, plannerAgent, criticAgent, chatMemory } from './agents';
import {
  createMastraLogger,
  createMastraObservability,
  mastraStorage,
} from './config';
import { metaChatWorkflow } from './workflows/meta-chat-workflow';

export const mastra = new Mastra({
  agents: {
    secondOrderAgent,
    plannerAgent,
    criticAgent,
  },
  workflows: {
    metaChatWorkflow,
  },
  memory: {
    chat: chatMemory,
  },
  storage: mastraStorage,
  logger: createMastraLogger(),
  observability: createMastraObservability(),
});

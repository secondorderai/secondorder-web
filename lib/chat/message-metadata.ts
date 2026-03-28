import type { UIMessage } from 'ai';
import { z } from 'zod';
import { TASK_TYPES } from '@/mastra/skills/registry';
import { metaResponseDetailsSchema } from './contracts';

export const assistantMessageMetadataSchema = z.object({
  taskType: z.enum(TASK_TYPES),
  shouldUseMeta: z.boolean(),
  meta: metaResponseDetailsSchema,
});

export type AssistantMessageMetadata = z.infer<
  typeof assistantMessageMetadataSchema
>;

export function getAssistantMessageMetadata(
  message: Pick<UIMessage, 'role' | 'metadata'>,
) {
  if (message.role !== 'assistant') {
    return null;
  }

  const parsedMetadata = assistantMessageMetadataSchema.safeParse(
    message.metadata,
  );

  return parsedMetadata.success ? parsedMetadata.data : null;
}

import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';
import type { UIMessage } from 'ai';
import { getAssistantMessageMetadata } from '@/lib/chat/message-metadata';
import { ChatMessageFeedback } from './chat-message-feedback';
import { ChatMessageMeta } from './chat-message-meta';

interface ChatMessageProps {
  message: UIMessage;
  threadId: string;
}

function getMessageContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

export function ChatMessage({ message, threadId }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const content = getMessageContent(message);
  const metadata = getAssistantMessageMetadata(message);

  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-ink text-bone'
            : 'border border-ink/10 bg-white text-ink'
        )}
      >
        {!isUser && metadata?.shouldUseMeta && message.id ? (
          <div className="mb-3">
            <ChatMessageMeta
              metadata={metadata}
              threadId={threadId}
              messageId={message.id}
            />
          </div>
        ) : null}
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        ) : (
          <>
            <Markdown content={content} className="text-sm" />
            {metadata && message.id ? (
              <ChatMessageFeedback
                threadId={threadId}
                messageId={message.id}
                taskType={metadata.taskType}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

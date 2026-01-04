import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/markdown';
import type { UIMessage } from 'ai';

interface ChatMessageProps {
  message: UIMessage;
}

function getMessageContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const content = getMessageContent(message);

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
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        ) : (
          <Markdown content={content} className="text-sm" />
        )}
      </div>
    </div>
  );
}

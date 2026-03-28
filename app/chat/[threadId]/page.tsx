import { notFound } from 'next/navigation';
import { threadIdSchema } from '@/lib/chat/contracts';
import { ChatPageClient } from '../_components/chat-page-client';

interface ChatThreadPageProps {
  params: Promise<{
    threadId: string;
  }>;
}

export default async function ChatThreadPage({
  params,
}: ChatThreadPageProps) {
  const { threadId } = await params;
  const parsedThreadId = threadIdSchema.safeParse(threadId);

  if (!parsedThreadId.success) {
    notFound();
  }

  return <ChatPageClient threadId={parsedThreadId.data} />;
}

'use client';

import { useRef, type SyntheticEvent } from 'react';
import type { AssistantMessageMetadata } from '@/lib/chat/message-metadata';
import { trackChatEvent } from '@/lib/chat/track-event';

interface ChatMessageMetaProps {
  metadata: AssistantMessageMetadata;
  threadId: string;
  messageId: string;
}

function formatTaskType(taskType: AssistantMessageMetadata['taskType']) {
  return taskType.replace(/_/g, ' ');
}

function summarizeConstraints(constraints: string[]) {
  if (constraints.length === 0) {
    return null;
  }

  if (constraints.length <= 2) {
    return constraints.join(' · ');
  }

  return `${constraints.slice(0, 2).join(' · ')} +${constraints.length - 2} more`;
}

function summarizeItems(items: string[]) {
  if (items.length === 0) {
    return null;
  }

  if (items.length <= 2) {
    return items.join(' · ');
  }

  return `${items.slice(0, 2).join(' · ')} +${items.length - 2} more`;
}

function getConfidenceTone(confidence: AssistantMessageMetadata['meta']['confidence']) {
  switch (confidence) {
    case 'high':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'medium':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'low':
      return 'border-rose-200 bg-rose-50 text-rose-800';
  }
}

export function ChatMessageMeta({
  metadata,
  threadId,
  messageId,
}: ChatMessageMetaProps) {
  const constraintSummary = summarizeConstraints(metadata.meta.constraints);
  const hasPlan = metadata.meta.plan.length > 0;
  const limitationSummary = summarizeItems(metadata.meta.limitations);
  const contextGapSummary = summarizeItems(metadata.meta.contextGaps);
  const hasTrackedPlanViewRef = useRef(false);

  const handlePlanToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    if (!event.currentTarget.open || hasTrackedPlanViewRef.current) {
      return;
    }

    hasTrackedPlanViewRef.current = true;
    void trackChatEvent({
      eventType: 'plan_preview_expanded',
      threadId,
      messageId,
      taskType: metadata.taskType,
      metadata: {
        planLength: metadata.meta.plan.length,
      },
    }).catch(() => {});
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-bone px-3 py-3">
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
        <span className="rounded-full border border-ink/10 bg-white px-2 py-1 text-[10px] text-ink/70">
          {formatTaskType(metadata.taskType)}
        </span>
        <span>Structured meta pass</span>
      </div>
      <div className="mt-3 space-y-2 text-sm text-ink">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
            Goal
          </p>
          <p className="mt-1 text-sm leading-6">
            {metadata.meta.goal || 'Respond directly and keep the answer tight.'}
          </p>
        </div>
        {constraintSummary ? (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              Constraints
            </p>
            <p className="mt-1 text-sm leading-6 text-ink/70">
              {constraintSummary}
            </p>
          </div>
        ) : null}
        <div className="grid gap-2 md:grid-cols-3">
          <div className="rounded-lg border border-ink/10 bg-white/70 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
              Confidence
            </p>
            <p className="mt-2">
              <span
                className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getConfidenceTone(metadata.meta.confidence)}`}
              >
                {metadata.meta.confidence}
              </span>
            </p>
          </div>
          {limitationSummary ? (
            <div className="rounded-lg border border-ink/10 bg-white/70 px-3 py-2 md:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                Limitations
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/70">
                {limitationSummary}
              </p>
            </div>
          ) : null}
          {contextGapSummary ? (
            <div className="rounded-lg border border-ink/10 bg-white/70 px-3 py-2 md:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                More context would help
              </p>
              <p className="mt-1 text-sm leading-6 text-ink/70">
                {contextGapSummary}
              </p>
            </div>
          ) : null}
        </div>
        {hasPlan ? (
          <details
            className="group rounded-lg border border-ink/10 bg-white/70 px-3 py-2"
            onToggle={handlePlanToggle}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-ink marker:content-none">
              <span>Plan preview</span>
              <span className="text-xs text-ink/55">
                {metadata.meta.plan.length} steps
              </span>
            </summary>
            <ol className="mt-3 space-y-2 border-t border-ink/10 pt-3 text-sm leading-6 text-ink/75">
              {metadata.meta.plan.map((step, index) => (
                <li key={`${index}-${step}`} className="flex gap-2">
                  <span className="min-w-5 text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                    {index + 1}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </details>
        ) : null}
      </div>
    </div>
  );
}

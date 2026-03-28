'use client';

import { useEffect, useId, useState } from 'react';
import { cn } from '@/lib/utils';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

let hasInitializedMermaid = false;

export function MermaidDiagram({
  chart,
  className,
}: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>('');
  const [hasError, setHasError] = useState(false);
  const id = useId().replace(/:/g, '');

  useEffect(() => {
    let isActive = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import('mermaid')).default;

        if (!hasInitializedMermaid) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'loose',
            theme: 'base',
            flowchart: {
              htmlLabels: true,
              useMaxWidth: true,
              curve: 'stepBefore',
            },
            themeVariables: {
              background: '#F7F7F5',
              primaryColor: '#FFFFFF',
              primaryTextColor: '#0B0B0B',
              primaryBorderColor: '#0B0B0B',
              lineColor: '#0B0B0B',
              secondaryColor: '#E6E6E1',
              tertiaryColor: '#F7F7F5',
              fontFamily: 'Manrope, sans-serif',
            },
          });

          hasInitializedMermaid = true;
        }

        const { svg: nextSvg } = await mermaid.render(`secondorder-${id}`, chart);

        if (!isActive) {
          return;
        }

        setSvg(nextSvg);
        setHasError(false);
      } catch {
        if (!isActive) {
          return;
        }

        setHasError(true);
      }
    }

    void renderDiagram();

    return () => {
      isActive = false;
    };
  }, [chart, id]);

  if (hasError) {
    return (
      <div
        className={cn(
          'rounded-3xl border border-ink/10 bg-white/70 p-6 text-sm text-ink/60',
          className,
        )}
      >
        Diagram unavailable.
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-3xl border border-ink/10 bg-white/80 p-4 shadow-soft-edge',
        className,
      )}
    >
      {svg ? (
        <div
          className={cn(
            '[&_foreignObject_div]:font-sans [&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-none',
            '[&_svg_.edgeLabel]:bg-bone [&_svg_.edgeLabel]:px-1',
          )}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="flex min-h-[420px] items-center justify-center text-sm text-ink/50">
          Rendering diagram...
        </div>
      )}
    </div>
  );
}

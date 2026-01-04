import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Meta thinking layer',
    description:
      'A dynamic cognitive layer that analyzes goals, prompts, and constraints to generate sharper context and execution plans.',
  },
  {
    title: 'Self-improving loop',
    description:
      'Generates an answer, absorbs feedback, audits its own progress, and iterates until the solution is solid.',
  },
  {
    title: 'Model orchestration',
    description:
      'Automatically selects model combinations, tools, and reasoning strategies for complex tasks and budgets.',
  },
  {
    title: 'Knowledge extraction',
    description:
      'Builds optimized agents that uncover hidden information and assemble it into usable reasoning paths.',
  },
];

const metaThinking = [
  'Self-monitoring to detect flaws and drift in real time.',
  'Self-evaluation of correctness, bias, and coverage.',
  'Adaptive learning that modifies strategies for each new problem.',
];

const iterativeLoop = [
  'Generate a potential solution.',
  'Receive feedback from the environment or a judge agent.',
  'Analyze gaps, weaknesses, and missing information.',
  'Refine the output and repeat until satisfied.',
];

const overview = [
  'Thinking of thinking: a meta layer on top of LLMs.',
  'Adaptive chain-of-thought that evolves per task.',
  'Prompt analysis that creates refined goals and tool plans.',
  'Judge agent that selects the best plan and routes work.',
  'Context engineering automated end to end.',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bone text-ink">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gray-200 opacity-30" />
        <div className="absolute -top-40 right-[-20%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-ink/10 via-transparent to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-12 sm:px-10">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/icon.svg"
                width={40}
                height={40}
                alt="SecondOrder icon"
                className="h-10 w-10 rounded-2xl border border-ink/10 bg-bone"
              />
              <div className="text-xl font-medium tracking-[0.2em] uppercase">
                SecondOrder
              </div>
            </div>
            <nav className="hidden items-center gap-8 text-sm text-ink/70 md:flex">
              <Link className="transition hover:text-ink" href="#what-is-it">
                What is it
              </Link>
              <Link
                className="transition hover:text-ink"
                href="#ready-to-build"
              >
                Ready to build
              </Link>
              <Link className="transition hover:text-ink" href="/chat">
                Try Chat
              </Link>
            </nav>
          </header>

          <section className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
                New layer of LLM cognition
              </p>
              <h1 className="mt-6 font-display text-5xl leading-tight sm:text-6xl">
                Meta cognition that orchestrates thinking, tools, and
                improvement.
              </h1>
              <p className="mt-6 text-lg text-ink/70">
                SecondOrder builds a self-auditing system that reasons about its
                own reasoning. It generates strategies, coordinates models, and
                learns from feedback to solve hard problems with precision.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/chat">
                  <Button>Try the chat</Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
                    AI gateway
                  </p>
                  <p className="mt-2 text-xl font-semibold">GPT-5.2 stack</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
                    Solver builder
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    Tool-driven agents
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
                    Memory
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    Self-learning core
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-white/70 p-8 shadow-soft-edge backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
                  Capabilities
                </p>
                <span className="text-xs text-ink/50">SecondOrder v1</span>
              </div>
              <div className="mt-8 space-y-6">
                {features.map((feature) => (
                  <div key={feature.title}>
                    <p className="text-lg font-semibold">{feature.title}</p>
                    <p className="mt-2 text-sm text-ink/70">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <section
        className="mx-auto max-w-6xl px-6 py-16 sm:px-10"
        id="what-is-it"
      >
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
              What is it
            </p>
            <h2 className="mt-4 font-display text-4xl">
              A deliberate, adaptive layer for reasoning.
            </h2>
            <p className="mt-4 text-ink/70">
              SecondOrder is a meta system that analyzes prompts, creates
              structured plans, and continuously adjusts its reasoning strategy
              to stay within real-world constraints like compute and budget.
            </p>
          </div>
          <div className="grid gap-4 rounded-3xl border border-ink/10 bg-white/60 p-8">
            {overview.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-ink" />
                <p className="text-sm text-ink/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-3xl border border-ink/10 bg-white/70 p-8">
            <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
              Iterative problem solving
            </p>
            <h3 className="mt-4 font-display text-3xl">
              A loop designed to refine every output.
            </h3>
            <div className="mt-6 space-y-4">
              {iterativeLoop.map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/30 text-sm">
                    {index + 1}
                  </span>
                  <p className="text-sm text-ink/75">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-ink/10 bg-ink text-bone p-8">
            <p className="text-sm uppercase tracking-[0.4em] text-bone/70">
              Self-auditing
            </p>
            <h3 className="mt-4 font-display text-3xl">
              Progress monitoring that knows when to stop.
            </h3>
            <p className="mt-4 text-sm text-bone/80">
              The system autonomously audits its own progress, checks
              completeness, and decides when it has enough information to reach
              a reliable conclusion.
            </p>
            <div className="mt-10 flex items-center justify-between border-t border-bone/20 pt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-bone/60">
                  Judge agent
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Planner + evaluator
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-bone/60">
                  Output
                </p>
                <p className="mt-2 text-lg font-semibold">Verified solution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="rounded-3xl border border-ink/10 bg-white/70 p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
                Meta-thinking in AI
              </p>
              <h2 className="mt-4 font-display text-4xl">
                Cognition that can inspect itself.
              </h2>
              <p className="mt-4 text-ink/70">
                Inspired by human metacognition, SecondOrder plans, monitors,
                and evaluates its own thinking to build more resilient reasoning
                pathways.
              </p>
            </div>
            <div className="space-y-4">
              {metaThinking.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-ink/10 bg-bone p-4"
                >
                  <p className="text-sm text-ink/80">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-bone" id="ready-to-build">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
                Ready to build
              </p>
              <h2 className="mt-4 font-display text-4xl">
                Put meta cognition into production.
              </h2>
              <p className="mt-3 text-ink/70">
                Build a system that improves with every iteration and produces
                reliable reasoning at scale.
              </p>
            </div>
            <Link href="/chat">
              <Button size="lg">Start the conversation</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

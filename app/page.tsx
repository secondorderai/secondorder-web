import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Visible meta mode',
    description:
      'Meta-routed replies show the detected task type, a compact goal summary, constraints, and whether SecondOrder is using a structured pass.',
  },
  {
    title: 'Plan preview',
    description:
      'Complex requests include a compact plan preview that stays collapsed by default and expands when you want to inspect the approach.',
  },
  {
    title: 'Confidence signals',
    description:
      'Each meta response can surface confidence, limitations, and context gaps so the assistant is easier to trust and easier to challenge.',
  },
  {
    title: 'Feedback and evaluation',
    description:
      'Assistant messages support structured feedback, and the chat lifecycle emits evaluation events for product-level measurement.',
  },
];

const metaThinking = [
  'Task classification routes complex requests into a structured meta pass.',
  'Planner and critic workflow output drives the UI instead of freeform guesswork.',
  'Trust signals stay compact so the chat still feels fast and conversational.',
];

const iterativeLoop = [
  'Interpret the task and decide whether meta mode is needed.',
  'Generate a compact plan and response strategy for harder requests.',
  'Review the draft for confidence, limitations, and missing context.',
  'Return the answer with visible framing, then capture user feedback.',
];

const overview = [
  'A meta layer on top of chat that makes task interpretation visible.',
  'Structured planner and critic passes running behind the assistant.',
  'Compact plan previews for planning, analysis, decision, and troubleshooting tasks.',
  'Thread-scoped history and resource isolation across conversations.',
  'Event instrumentation for completion, feedback, and plan-preview usage.',
];

const implementedToday = [
  {
    label: 'Meta UX',
    title: 'Task framing, plan previews, and trust signals',
    description:
      'The shipped chat experience shows how SecondOrder framed a meta-routed task before or alongside the final answer.',
  },
  {
    label: 'Workflow',
    title: 'Planner and critic passes in production',
    description:
      'Complex requests already run through structured planning and critique steps that produce goal, constraints, plan, confidence, and limitation metadata.',
  },
  {
    label: 'Learning loop',
    title: 'Structured feedback and evaluation events',
    description:
      'Users can rate individual assistant messages, and the product records core lifecycle events for measuring outcomes over time.',
  },
  {
    label: 'Chat foundation',
    title: 'Threaded history and onboarding',
    description:
      'The current release preserves thread URLs, loads chat history per thread, and explains the kinds of problems SecondOrder handles well before the first message.',
  },
];

const roadmapPhases = [
  {
    phase: 'Shipped now',
    title: 'Structured meta chat',
    description:
      'Visible task framing, planner and critic workflow output, compact plan previews, confidence signals, structured feedback, and lifecycle instrumentation are live.',
  },
  {
    phase: 'Next',
    title: 'Tools and evidence-aware execution',
    description:
      'The next step is moving from reflective chat into reflective execution with tool routing, evidence-aware answering, and stronger stop conditions.',
  },
  {
    phase: 'Later',
    title: 'Memory and orchestration',
    description:
      'Longer term, SecondOrder can add durable memory, adaptive strategy reuse, and a coordinator layer for multi-pass or multi-model execution when justified.',
  },
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
                Structured meta-thinking assistant
              </p>
              <h1 className="mt-6 font-display text-5xl leading-tight sm:text-6xl">
                See how the assistant frames the task before you trust the answer.
              </h1>
              <p className="mt-6 text-lg text-ink/70">
                SecondOrder turns hidden orchestration into a product surface.
                In `/chat`, complex requests can show task framing, a compact
                plan preview, confidence signals, and structured feedback so the
                assistant is easier to inspect and improve.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/chat">
                  <Button>Try the chat</Button>
                </Link>
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
                    Meta mode
                  </p>
                  <p className="mt-2 text-xl font-semibold">Visible framing</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
                    Workflow
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    Planner + critic
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-ink/50">
                    Evaluation
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    Feedback + events
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
              SecondOrder is a chat product that exposes enough of its meta
              layer to make harder requests legible. It classifies the task,
              builds structured workflow output, and surfaces the parts users
              actually need to evaluate the answer.
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
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-ink/60">
              Implemented today
            </p>
            <h2 className="mt-4 font-display text-4xl">
              A working v1 is already in place.
            </h2>
            <p className="mt-4 text-ink/70">
              SecondOrder is no longer just positioning. The current release
              already ships the first user-visible version of the meta-thinking
              experience inside chat.
            </p>
          </div>
          <div className="grid gap-4">
            {implementedToday.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-ink/10 bg-white/70 p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-ink/55">
                  {item.label}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm text-ink/75">{item.description}</p>
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
              A structured loop designed for harder requests.
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
              Trust signals that expose uncertainty without dumping internals.
            </h3>
            <p className="mt-4 text-sm text-bone/80">
              SecondOrder keeps the internal prompts hidden, but it can surface
              confidence, limitations, and context gaps so the answer is easier
              to inspect before you act on it.
            </p>
            <div className="mt-10 flex items-center justify-between border-t border-bone/20 pt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-bone/60">
                  Workflow
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Planner + critic
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-bone/60">
                  User signal
                </p>
                <p className="mt-2 text-lg font-semibold">Feedback captured</p>
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
              Inspired by human metacognition, SecondOrder makes planning,
              critique, and uncertainty visible enough to build trust without
              exposing raw chain-of-thought.
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

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <div className="rounded-3xl border border-ink/10 bg-ink p-8 text-bone sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-bone/70">
                Product roadmap
              </p>
            <h2 className="mt-4 font-display text-4xl">
                What comes after structured meta chat.
            </h2>
            <p className="mt-4 text-bone/75">
                The current release productizes planning and critique inside
                chat. The next releases push deeper into tools, evidence-aware
                execution, memory, and orchestration.
            </p>
            </div>
            <div className="space-y-4">
              {roadmapPhases.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-bone/15 bg-bone/5 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-bone/55">
                    {item.phase}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm text-bone/75">
                    {item.description}
                  </p>
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
                Try the shipped meta-thinking chat experience and inspect how it
                frames, plans, and qualifies harder problems.
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

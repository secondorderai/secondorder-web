import Link from 'next/link';

export function ChatHeader() {
  return (
    <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4">
      <Link
        href="/"
        className="text-sm text-ink/70 transition hover:text-ink"
      >
        &larr; Back to Home
      </Link>
      <h1 className="font-display text-lg font-semibold text-ink">
        SecondOrder Chat
      </h1>
      <div className="w-20" />
    </header>
  );
}

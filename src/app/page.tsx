import { CounterCard } from '@/components/counter/CounterCard';

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Minimal starter template
        </p>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Counter
        </h1>
        <p className="text-pretty text-base leading-6 text-slate-700 dark:text-slate-300">
          This is intentionally small. Use it as a starting point and grow the
          app by adding routes, data fetching, and components.
        </p>
      </header>

      <CounterCard initialCount={0} />

      <footer className="text-sm text-slate-600 dark:text-slate-400">
        <p>
          Edit <code className="font-mono">src/app/page.tsx</code> to get
          started.
        </p>
      </footer>
    </div>
  );
}


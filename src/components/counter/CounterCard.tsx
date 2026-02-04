'use client';

import { useCallback, useState } from 'react';

const DEFAULT_INITIAL_COUNT = 0;

export function CounterCard({
  initialCount = DEFAULT_INITIAL_COUNT,
}: {
  initialCount?: number;
}) {
  const [count, setCount] = useState(() => initialCount);

  const increment = useCallback(() => {
    setCount((curr) => curr + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((curr) => curr - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialCount);
  }, [initialCount]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Counter
          </h2>
          <p className="max-w-prose text-sm text-slate-600 dark:text-slate-300">
            This component runs on the client (it uses React state).
          </p>
        </div>

        <output
          aria-live="polite"
          aria-atomic="true"
          className="inline-flex min-w-14 items-center justify-center rounded-full bg-slate-900 px-3 py-1 text-base font-semibold tabular-nums text-white dark:bg-slate-50 dark:text-slate-900"
        >
          {count}
        </output>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={decrement}
          className="touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-50/20"
        >
          −1
        </button>
        <button
          type="button"
          onClick={increment}
          className="touch-manipulation rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-50/20"
        >
          +1
        </button>
        <button
          type="button"
          onClick={reset}
          className="touch-manipulation rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-50/20"
        >
          Reset
        </button>
      </div>
    </section>
  );
}


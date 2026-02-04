'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col justify-center gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Something went wrong
      </h1>
      <p className="text-base text-slate-700 dark:text-slate-300">
        {error.message || 'Unknown error'}
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="touch-manipulation rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-50/20"
        >
          Try again
        </button>
      </div>
    </div>
  );
}


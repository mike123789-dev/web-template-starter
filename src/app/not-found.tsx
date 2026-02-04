import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col justify-center gap-4 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Page not found
      </h1>
      <p className="text-base text-slate-700 dark:text-slate-300">
        The page you’re looking for doesn’t exist.
      </p>
      <div>
        <Link
          href="/"
          className="inline-flex touch-manipulation items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-50/20"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}


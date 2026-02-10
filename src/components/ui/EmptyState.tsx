import Link from 'next/link';

import { cn } from '@/lib/cn';

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryActionLabel,
  secondaryActionHref,
  className,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900',
        className
      )}
    >
      <p className="text-base font-semibold text-slate-900 dark:text-slate-50">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      ) : null}
      {actionLabel && actionHref ? (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Link
            href={actionHref}
            className="inline-flex touch-manipulation items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-50/20"
          >
            {actionLabel}
          </Link>
          {secondaryActionLabel && secondaryActionHref ? (
            <Link
              href={secondaryActionHref}
              className="inline-flex touch-manipulation items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-50/20"
            >
              {secondaryActionLabel}
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

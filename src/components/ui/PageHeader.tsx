import Link from 'next/link';

import { cn } from '@/lib/cn';

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  actions,
  className,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          {backHref ? (
            <div>
              <Link
                href={backHref}
                className="inline-flex touch-manipulation items-center gap-2 rounded-lg px-1 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:text-slate-300 dark:hover:text-white dark:focus-visible:ring-slate-50/20"
              >
                <span aria-hidden="true">←</span>
                {backLabel}
              </Link>
            </div>
          ) : null}
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h1>
          {description ? (
            <p className="text-pretty text-base leading-6 text-slate-700 dark:text-slate-300">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}


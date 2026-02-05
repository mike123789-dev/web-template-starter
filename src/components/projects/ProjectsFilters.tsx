'use client';

import { useCallback, useMemo } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/cn';

type StatusFilter = 'all' | 'active' | 'paused' | 'archived';
type SortOption = 'updated' | 'name';

function normalizeStatus(value: string | null): StatusFilter {
  if (value === 'active' || value === 'paused' || value === 'archived') {
    return value;
  }
  return 'all';
}

function normalizeSort(value: string | null): SortOption {
  if (value === 'name') return 'name';
  return 'updated';
}

export function ProjectsFilters({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = useMemo(() => normalizeStatus(searchParams.get('status')), [searchParams]);
  const sort = useMemo(() => normalizeSort(searchParams.get('sort')), [searchParams]);

  const updateParam = useCallback(
    (key: 'status' | 'sort', value: string) => {
      const next = new URLSearchParams(searchParams.toString());
      if (!value || value === 'all') {
        next.delete(key);
      } else {
        next.set(key, value);
      }

      const queryString = next.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Status
        </span>
        <select
          value={status}
          onChange={(e) => updateParam('status', e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus-visible:ring-slate-50/20"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="archived">Archived</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Sort
        </span>
        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:focus-visible:ring-slate-50/20"
        >
          <option value="updated">Last updated</option>
          <option value="name">Name</option>
        </select>
      </label>
    </div>
  );
}


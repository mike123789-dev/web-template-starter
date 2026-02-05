import Link from 'next/link';
import { Suspense } from 'react';

import { ProjectsFilters } from '@/components/projects/ProjectsFilters';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { ProjectsListSkeleton } from '@/components/projects/ProjectsListSkeleton';
import { PageHeader } from '@/components/ui/PageHeader';

type SearchParams = Record<string, string | string[] | undefined>;

function getStringParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});
  const status = getStringParam(resolvedSearchParams.status);
  const sort = getStringParam(resolvedSearchParams.sort);
  const created = getStringParam(resolvedSearchParams.created) === '1';

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <PageHeader
        title="Projects"
        description="A small dashboard that shows list, detail, forms, state, and error handling."
        actions={
          <>
            <Link
              href="/settings"
              className="inline-flex touch-manipulation items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-50/20"
            >
              Settings
            </Link>
            <Link
              href="/projects/new"
              className="inline-flex touch-manipulation items-center rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-50/20"
            >
              New project
            </Link>
          </>
        }
      />

      {created ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-100">
          Project created (mock). Redirected back to the list.
        </div>
      ) : null}

      <Suspense fallback={<div className="h-9" />}>
        <ProjectsFilters />
      </Suspense>

      <Suspense fallback={<ProjectsListSkeleton />}>
        <ProjectsList status={status} sort={sort} />
      </Suspense>

      <footer className="text-sm text-slate-600 dark:text-slate-400">
        <p>
          This starter includes a list, detail view, a form flow, and a mock API
          route. See <code className="font-mono">src/app</code> for routes.
        </p>
      </footer>
    </div>
  );
}


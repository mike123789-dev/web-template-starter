import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProjectStatusBadge } from '@/components/projects/ProjectStatusBadge';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { cn } from '@/lib/cn';
import { getProjectActivity, getProjectById } from '@/lib/projects';

type Params = { id: string };
type SearchParams = Record<string, string | string[] | undefined>;

function getStringParam(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : undefined;
}

function formatTimestamp(isoTimestamp: string) {
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  return formatter.format(new Date(isoTimestamp));
}

function TabLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex touch-manipulation items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:focus-visible:ring-slate-50/20',
        isActive
          ? 'bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Params | Promise<Params>;
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const resolvedSearchParams = await Promise.resolve(searchParams ?? {});

  const id = resolvedParams.id;
  const tab = getStringParam(resolvedSearchParams.tab) === 'activity' ? 'activity' : 'overview';

  const project = await getProjectById(id, { delayMs: 200 });
  if (!project) {
    notFound();
  }

  const activity = tab === 'activity' ? await getProjectActivity(id, { delayMs: 150 }) : [];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10">
      <PageHeader
        title={project.name}
        description={project.description}
        backHref="/"
        backLabel="Back to projects"
        actions={<ProjectStatusBadge status={project.status} />}
      />

      <nav aria-label="Project tabs" className="flex items-center gap-2">
        <TabLink href={`/projects/${project.id}`} isActive={tab === 'overview'}>
          Overview
        </TabLink>
        <TabLink href={`/projects/${project.id}?tab=activity`} isActive={tab === 'activity'}>
          Activity
        </TabLink>
      </nav>

      {tab === 'overview' ? (
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Project ID</dt>
                <dd className="text-sm text-slate-900 dark:text-slate-50">{project.id}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Owner</dt>
                <dd className="text-sm text-slate-900 dark:text-slate-50">{project.owner}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Created</dt>
                <dd className="text-sm text-slate-900 dark:text-slate-50">
                  {formatTimestamp(project.createdAt)}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Updated</dt>
                <dd className="text-sm text-slate-900 dark:text-slate-50">
                  {formatTimestamp(project.updatedAt)}
                </dd>
              </div>
            </dl>

            {project.tags.length > 0 ? (
              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Tags
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="neutral">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <Link
                href="/projects/new"
                className="inline-flex touch-manipulation items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 dark:hover:bg-slate-900 dark:focus-visible:ring-slate-50/20"
              >
                Create another project
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : activity.length === 0 ? (
        <EmptyState
          title="No activity yet"
          description="When updates happen, you’ll see them here."
          actionLabel="Back to overview"
          actionHref={`/projects/${project.id}`}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="flex flex-col gap-3">
              {activity.map((event) => (
                <li
                  key={event.id}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950"
                >
                  <p className="text-sm text-slate-900 dark:text-slate-50">{event.message}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {formatTimestamp(event.timestamp)}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


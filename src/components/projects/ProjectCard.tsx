import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/cn';
import type { Project } from '@/lib/projects';

import { ProjectStatusBadge } from './ProjectStatusBadge';

function formatUpdatedAt(isoTimestamp: string) {
  const formatter = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
  return formatter.format(new Date(isoTimestamp));
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        'block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 dark:focus-visible:ring-slate-50/20'
      )}
      aria-label={`Open project ${project.name}`}
    >
      <Card className="transition-colors hover:border-slate-300 dark:hover:border-slate-700">
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-pretty">{project.name}</CardTitle>
            <ProjectStatusBadge status={project.status} />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{project.description}</p>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">Owner</dt>
              <dd className="text-slate-900 dark:text-slate-50">{project.owner}</dd>
            </div>
            <div className="flex flex-col gap-0.5 text-right">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Updated
              </dt>
              <dd className="text-slate-900 dark:text-slate-50">
                {formatUpdatedAt(project.updatedAt)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}


import { EmptyState } from '@/components/ui/EmptyState';
import { normalizeSortOption, normalizeStatusFilter, filterAndSortProjects } from '@/lib/projects-filter-sort';
import { getProjects } from '@/lib/projects';

import { ProjectCard } from './ProjectCard';

export async function ProjectsList({
  status,
  sort,
}: {
  status?: unknown;
  sort?: unknown;
}) {
  const resolvedStatus = normalizeStatusFilter(status);
  const resolvedSort = normalizeSortOption(sort);
  const hasActiveFilters = resolvedStatus !== 'all' || resolvedSort !== 'updated';
  const retryHref =
    resolvedStatus === 'all' && resolvedSort === 'updated'
      ? '/'
      : `/?status=${resolvedStatus}&sort=${resolvedSort}`;

  let projects;
  try {
    projects = await getProjects({ delayMs: 250 });
  } catch {
    return (
      <EmptyState
        title="Unable to load projects"
        description="Please try again. If this keeps happening, check your connection."
        actionLabel="Try again"
        actionHref={retryHref}
      />
    );
  }
  const visible = filterAndSortProjects(projects, { status: resolvedStatus, sort: resolvedSort });

  if (visible.length === 0) {
    const emptyTitle =
      resolvedStatus === 'all' ? 'No projects found' : `No ${resolvedStatus} projects found`;
    return (
      <EmptyState
        title={emptyTitle}
        description="Try a different filter or clear your filters."
        actionLabel="Create project"
        actionHref="/projects/new"
        secondaryActionLabel={hasActiveFilters ? 'Reset filters' : undefined}
        secondaryActionHref={hasActiveFilters ? '/' : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {visible.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

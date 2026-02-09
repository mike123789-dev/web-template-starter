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

  const projects = await getProjects({ delayMs: 250 });
  const visible = filterAndSortProjects(projects, { status: resolvedStatus, sort: resolvedSort });

  if (visible.length === 0) {
    return (
      <EmptyState
        title="No projects found"
        description="Try changing your filters, or create a new project."
        actionLabel="Create project"
        actionHref="/projects/new"
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

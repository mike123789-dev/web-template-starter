import { EmptyState } from '@/components/ui/EmptyState';
import { getProjects, type Project, type ProjectStatus } from '@/lib/projects';

import { ProjectCard } from './ProjectCard';

type StatusFilter = 'all' | ProjectStatus;
type SortOption = 'updated' | 'name';

function isStatusFilter(value: unknown): value is StatusFilter {
  return value === 'all' || value === 'active' || value === 'paused' || value === 'archived';
}

function isSortOption(value: unknown): value is SortOption {
  return value === 'updated' || value === 'name';
}

function filterAndSortProjects(projects: Project[], options: { status: StatusFilter; sort: SortOption }) {
  const filtered = projects.filter((project) => {
    if (options.status === 'all') return true;
    return project.status === options.status;
  });

  if (options.sort === 'name') {
    return filtered.toSorted((a, b) => a.name.localeCompare(b.name));
  }

  return filtered.toSorted((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export async function ProjectsList({
  status,
  sort,
}: {
  status?: unknown;
  sort?: unknown;
}) {
  const resolvedStatus: StatusFilter = isStatusFilter(status) ? status : 'all';
  const resolvedSort: SortOption = isSortOption(sort) ? sort : 'updated';

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


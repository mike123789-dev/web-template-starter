import type { Project, ProjectStatus } from '@/lib/projects';

export type StatusFilter = 'all' | ProjectStatus;
export type SortOption = 'updated' | 'name';

export function normalizeStatusFilter(value: unknown): StatusFilter {
  if (value === 'active' || value === 'paused' || value === 'archived') {
    return value;
  }
  return 'all';
}

export function normalizeSortOption(value: unknown): SortOption {
  if (value === 'name') return 'name';
  return 'updated';
}

export function filterAndSortProjects(
  projects: Project[],
  options: { status: StatusFilter; sort: SortOption }
) {
  const filtered = projects.filter((project) => {
    if (options.status === 'all') return true;
    return project.status === options.status;
  });

  if (options.sort === 'name') {
    return filtered.toSorted((a, b) => a.name.localeCompare(b.name));
  }

  return filtered.toSorted((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

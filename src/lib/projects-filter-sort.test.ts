import { describe, expect, it } from 'vitest';

import type { Project } from '@/lib/projects';
import { filterAndSortProjects, normalizeSortOption, normalizeStatusFilter } from './projects-filter-sort';

const fixture: Project[] = [
  {
    id: 'p-1',
    name: 'Website refresh',
    description: 'desc',
    status: 'active',
    owner: 'A',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-02-02T00:00:00.000Z',
    tags: [],
  },
  {
    id: 'p-2',
    name: 'Billing cleanup',
    description: 'desc',
    status: 'paused',
    owner: 'B',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    tags: [],
  },
  {
    id: 'p-3',
    name: 'Mobile onboarding',
    description: 'desc',
    status: 'active',
    owner: 'C',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
    tags: [],
  },
];

describe('projects filter/sort helpers', () => {
  it('filters by status', () => {
    const result = filterAndSortProjects(fixture, { status: 'active', sort: 'updated' });
    expect(result.map((project) => project.id)).toEqual(['p-1', 'p-3']);
  });

  it('sorts deterministically for same input', () => {
    const first = filterAndSortProjects(fixture, { status: 'all', sort: 'name' });
    const second = filterAndSortProjects(fixture, { status: 'all', sort: 'name' });
    expect(first.map((project) => project.id)).toEqual(second.map((project) => project.id));
    expect(first.map((project) => project.name)).toEqual([
      'Billing cleanup',
      'Mobile onboarding',
      'Website refresh',
    ]);
  });

  it('falls back to safe defaults for invalid params', () => {
    expect(normalizeStatusFilter('invalid')).toBe('all');
    expect(normalizeStatusFilter(undefined)).toBe('all');
    expect(normalizeSortOption('invalid')).toBe('updated');
    expect(normalizeSortOption(undefined)).toBe('updated');
  });

  it('uses updatedAt desc as default sort', () => {
    const sort = normalizeSortOption(undefined);
    const result = filterAndSortProjects(fixture, { status: 'all', sort });
    expect(result.map((project) => project.id)).toEqual(['p-1', 'p-3', 'p-2']);
  });
});


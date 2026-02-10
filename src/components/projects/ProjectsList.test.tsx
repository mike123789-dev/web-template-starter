import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

vi.mock('@/lib/projects', () => ({
  getProjects: vi.fn(),
}));

import { getProjects } from '@/lib/projects';
import { ProjectsList } from './ProjectsList';

const getProjectsMock = vi.mocked(getProjects);

describe('ProjectsList', () => {
  it('shows filter-aware empty state when no projects match selected status', async () => {
    getProjectsMock.mockResolvedValueOnce([]);

    const html = renderToStaticMarkup(await ProjectsList({ status: 'active', sort: 'updated' }));

    expect(html).toContain('No active projects found');
    expect(html).toContain('Try a different filter or clear your filters.');
  });

  it('shows inline error state with retry action when data loading fails', async () => {
    getProjectsMock.mockRejectedValueOnce(new Error('boom'));

    const html = renderToStaticMarkup(await ProjectsList({ status: 'all', sort: 'updated' }));

    expect(html).toContain('Unable to load projects');
    expect(html).toContain('Try again');
  });
});

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { ProjectsListSkeleton } from './ProjectsListSkeleton';

describe('ProjectsListSkeleton', () => {
  it('exposes an accessible busy state while loading', () => {
    const html = renderToStaticMarkup(<ProjectsListSkeleton />);

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('Loading projects');
  });
});

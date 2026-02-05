import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    const html = renderToStaticMarkup(
      <EmptyState title="No projects found" description="Try adjusting your filters." />
    );

    expect(html).toContain('No projects found');
    expect(html).toContain('Try adjusting your filters.');
  });
});


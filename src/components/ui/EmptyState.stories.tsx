import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/UI/EmptyState',
  component: EmptyState,
  args: {
    title: 'No projects found',
    description: 'Try changing your filters, or create a new project.',
    actionLabel: 'Create project',
    actionHref: '/projects/new',
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

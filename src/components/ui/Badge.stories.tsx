import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  args: {
    children: 'Badge',
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: { variant: 'neutral', children: 'Neutral' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Active' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Paused' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Blocked' },
};


import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';

import { CounterCard } from './CounterCard';

const meta: Meta<typeof CounterCard> = {
  title: 'Components/CounterCard',
  component: CounterCard,
  args: {
    initialCount: 0,
  },
};

export default meta;

type Story = StoryObj<typeof CounterCard>;

export const Default: Story = {};

export const Increment: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '+1' }));
    await expect(canvas.getByText('1')).toBeVisible();
  },
};

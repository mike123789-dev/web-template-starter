import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Badge } from './Badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Website refresh</CardTitle>
            <CardDescription>Update layout and copy for the marketing site.</CardDescription>
          </div>
          <Badge variant="success">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          This is a shared primitive used across pages.
        </p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <span className="text-xs text-slate-500 dark:text-slate-400">Updated Feb 02, 2026</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Owner: Jin Park</span>
      </CardFooter>
    </Card>
  ),
};


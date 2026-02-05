import type { Preview } from '@storybook/nextjs-vite';
import type { Decorator } from '@storybook/react';

import '../src/app/globals.css';

const withAppShell: Decorator = (Story) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-10">
        <Story />
      </div>
    </div>
  );
};

const preview: Preview = {
  decorators: [withAppShell],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;

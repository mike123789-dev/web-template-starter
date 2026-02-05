import React from 'react';
import { vi } from 'vitest';

vi.mock('next/link', () => {
  return {
    default: ({
      href,
      children,
      ...props
    }: {
      href: string;
      children: React.ReactNode;
      [key: string]: unknown;
    }) => (
      React.createElement('a', { href, ...props }, children)
    ),
  };
});


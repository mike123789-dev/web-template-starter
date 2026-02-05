import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const defaultBasePath = process.env.NODE_ENV === 'production' ? '/web-vibe-template' : '';
const basePath = process.env.NEXT_BASE_PATH ?? defaultBasePath;

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },
  ...(basePath ? { basePath } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;


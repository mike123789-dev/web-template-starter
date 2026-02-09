// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const nextTypescript = require('eslint-config-next/typescript');

const config = [
  {
    ignores: [
      'docs/deploy/app-sample-nodejs-main/**',
      '.obsidian/**',
      'docs/.obsidian/**',
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...storybook.configs["flat/recommended"]
];

export default config;

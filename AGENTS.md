# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains the Next.js App Router routes, layouts, and API handlers (for example `src/app/api/health/route.ts`).
- `src/components/` holds reusable UI and client components (for example `src/components/counter/CounterCard.tsx`).
- `public/` stores static assets served at the web root.
- `lib/` is available for shared utilities and server-side helpers.

## Build, Test, and Development Commands
- `npm run dev`: Start the Next.js dev server on the default port.
- `npm run dev:open`: Start dev server and open `http://127.0.0.1:3000`.
- `npm run dev:stop`: Stop the dev server running on port 3000.
- `npm run build`: Create a production build.
- `npm run start`: Serve the production build locally.
- `npm run lint`: Run ESLint with zero warnings allowed.
- `npm run test:unit`: Run Vitest unit tests.
- `npm run test:storybook`: Run Storybook Vitest smoke tests.
- `npm run test:e2e`: Run Playwright E2E tests.
- `npm run test:all`: Run unit, storybook, and E2E tests in sequence.
- `docker compose up --build`: Build and run the app in Docker.

## Coding Style & Naming Conventions
- TypeScript + React with the App Router (`src/app`).
- Indentation: 2 spaces. Semicolons required.
- Use single quotes in TypeScript imports.
- Component files use `PascalCase` (for example `CounterCard.tsx`).
- App Router segments are lowercase (for example `src/app/api/health`).
- Prefer Tailwind CSS utility classes for styling.

## Testing Guidelines
- No test framework is configured yet. If you add tests, document the runner and add an `npm` script.
- Place tests near their modules or under a `tests/` folder; follow the naming pattern `*.test.ts` or `*.test.tsx`.
- If you change code, you must follow `docs/engineering/testing.md` and add the appropriate test cases aligned with that guide.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and unscoped (for example `Add dev stop and open scripts`). This is based on the current, small history.
- PRs should include a clear summary, link any relevant issues, and provide screenshots for UI changes.
- Run `npm run lint` and a production build check (`npm run build`) before requesting review.

## Configuration & Environment
- Node.js version requirement: `>=20.0.0` (see `package.json`).
- For production containers, use the provided `Dockerfile` and `docker-compose.yml`.

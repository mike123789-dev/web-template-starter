# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` contains Next.js App Router routes, layouts, and API handlers (for example `src/app/api/projects/route.ts`).
- `src/components/` holds reusable UI and client components (for example `src/components/projects/ProjectCard.tsx`).
- `src/lib/` contains shared helpers and mock data access (for example `src/lib/projects.ts`).
- `public/` stores static assets served at the web root.

## Build, Test, and Development Commands
- `npm run dev`: Start the Next.js dev server on the default port.
- `npm run dev:open`: Start dev server and open `http://127.0.0.1:3000`.
- `npm run dev:stop`: Stop the dev server running on port 3000.
- `npm run build`: Create a production build.
- `npm run start`: Serve the production build locally.
- `npm run lint`: Run ESLint with zero warnings allowed.
- `npm run typecheck`: Run TypeScript type checking (`tsc --noEmit`).
- `npm run verify`: Run lint + typecheck + unit tests.
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
- Test stack is already configured: Vitest (`test:unit`), Storybook Vitest (`test:storybook`), and Playwright (`test:e2e`).
- Place tests near their modules or under a `tests/` folder; follow `*.test.ts` or `*.test.tsx`.
- For code changes, follow `docs/engineering/testing.md` and the change-to-test checklist in `docs/agent/dod.md`.
- For new features or behavior changes, create or update specs under `docs/specs/features/F-xxx-*/` and map AC to tests in `test-matrix.md`.
- Run `npm run specs:validate` for spec-driven document validation before closing feature work.
- Use `npm run verify` as the minimum pre-review gate for non-trivial code changes.

## Spec-Driven Flow (Short)
- Use `$spec-driven-workflow` for feature-level requirement/spec/test traceability.
- Keep flow simple: `PRD IDs 확인 -> (신규는 specs:new) -> feature spec 문서 작성/갱신 -> tasks/test-matrix 동기화 -> task-governance 기준으로 상세 task 분할 -> specs:validate + 검증 게이트 통과 후 Done`.
- Detailed workflow lives in `.agents/skills/spec-driven-workflow/SKILL.md`.

## Commit & Pull Request Guidelines
- Commit messages are short, imperative, and unscoped (for example `Add dev stop and open scripts`). This is based on the current, small history.
- PRs should include a clear summary, link any relevant issues, and provide screenshots for UI changes.
- Run `npm run verify` and a production build check (`npm run build`) before requesting review.

## Configuration & Environment
- Node.js version requirement: `>=20.0.0` (see `package.json`).
- For production containers, use the provided `Dockerfile` and `docker-compose.yml`.

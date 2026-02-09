# Web Template Starter (Next.js)

Next.js App Router starter focused on practical dashboard patterns for AI-assisted development.

## What is included

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- Project dashboard flow
  - List page: `/`
  - Detail page: `/projects/[id]`
  - New project form: `/projects/new`
  - Settings page with localStorage state: `/settings`
- Mock data layer in `src/lib/mock/projects.json`
- API routes
  - `GET /api/health`
  - `GET /api/version`
  - `GET /api/projects`
  - `POST /api/projects`
- Test stack: Vitest (unit), Storybook test project, Playwright (e2e)
- Production-ready Docker build (`output: 'standalone'`)

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification commands

```bash
npm run lint
npm run typecheck
npm run test:unit
npm run verify
```

`npm run verify` runs lint + typecheck + unit tests.

## Full test commands

```bash
npm run test:storybook
npm run test:e2e
npm run test:all
```

## Spec-Driven Development (SDD)

This repository uses PRD-linked SDD to reduce regressions when adding or changing features.

### Core idea

- `PRD` defines what must be true.
- `Spec/Plan/Tasks` defines what to build and in which order.
- `Test Matrix` proves each acceptance criterion is covered by tests.

### Where to start

- Workspace entry: `docs/specs/README.md`
- PRD source of truth: `docs/specs/prd.md`
- Metadata schema (Obsidian YAML): `docs/specs/frontmatter-schema.md`
- Task split rules: `docs/specs/task-governance.md`

### Feature workflow

1. Create or update `docs/specs/features/F-xxx-<slug>/`.
2. Update `spec.md`, `plan.md`, `tasks.md`, `test-matrix.md`.
3. Split large tasks into `tasks/T-xxx.md` when required by governance rules.
4. Run required gates (`npm run verify`, and `npm run build` for route/api/config impact).
5. Move status through `Draft -> Ready -> In Progress -> Verifying -> Done`.

## Production build (local)

```bash
npm run build
npm run start
```

## Docker

```bash
docker compose up --build
```

## Deploy (n3r)

See `docs/deploy/n3r.md`.

## Project structure

```text
src/
  app/
    page.tsx                  # Projects list page
    projects/[id]/page.tsx    # Project detail page
    projects/new/page.tsx     # New project form page
    settings/page.tsx         # Local preferences page
    api/health/route.ts       # Health endpoint
    api/version/route.ts      # Build/version endpoint
    api/projects/route.ts     # Mock projects API
  components/
    projects/                 # Projects UI components
    settings/                 # Settings UI components
    ui/                       # Shared UI primitives
  lib/
    projects.ts               # Mock data access helpers
    mock/projects.json        # Mock source data
```

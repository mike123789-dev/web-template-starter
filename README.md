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

## Prompt Governance

Prompt-critical docs (`AGENTS.md`, `.agents/skills/**/SKILL.md`) can be validated locally with static checks and `codex exec` output-quality checks.

- Guide: `docs/engineering/prompt-governance.md`
- Static checks: `npm run prompt:guard`
- Output quality checks (weighted score): `npm run prompt:quality`
- Output quality raw pass/fail (promptfoo): `npm run prompt:quality:raw`
- Full suite: `npm run prompt:all`

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
- `progress.md` is the single source for current status.

### Where to start

- Workspace entry: `docs/specs/README.md`
- PRD source of truth: `docs/specs/prd.md`
- Progress board (single source): `docs/specs/progress.md`
- Obsidian setup: `docs/specs/obsidian/setup.md`
- Dashboard wrapper: `docs/specs/obsidian/dashboard.md`
- Metadata schema (Obsidian YAML): `docs/specs/obsidian/frontmatter-schema.md`
- Task split rules: `docs/specs/task-governance.md`

### Feature workflow

1. Create or update `docs/specs/features/F-xxx-<slug>/`.
2. Update `spec.md`, `plan.md`, `tasks.md`, `test-matrix.md`.
3. Split large tasks into `tasks/T-xxx.md` when required by governance rules.
4. Run required gates (`npm run verify`, and `npm run build` for route/api/config impact).
5. Move status through `Draft -> Ready -> In Progress -> Verifying -> Done`.

### SDD automation commands

```bash
npm run specs:new -- --feature-id F-003 --slug project-archive --title "Project Archive" --prd "FR-005,NFR-003"
npm run specs:progress
npm run specs:status
npm run specs:check
npm run specs:validate
```

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

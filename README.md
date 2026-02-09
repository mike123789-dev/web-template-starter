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

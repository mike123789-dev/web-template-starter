# Web Template Starter (Next.js)

Minimal Next.js starter intended to be a clean base for new projects.

## What’s included

- **Next.js App Router + TypeScript**
- **Tailwind CSS**
- **Counter example** (Client Component) with an RSC home page
- **Production-ready Docker build** using `output: "standalone"`
- **Health check endpoint** at `/api/health`

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Production build (local)

```bash
npm run build
npm run start
```

## Docker

### Build + run (Docker CLI)

```bash
docker build -t web-template-starter .
docker run --rm -p 3000:3000 web-template-starter
```

### Build + run (Docker Compose)

```bash
docker compose up --build
```

## Project structure

```text
src/
  app/
    api/health/route.ts   # GET /api/health
    error.tsx             # Route segment error boundary
    not-found.tsx         # 404 page
    layout.tsx            # Root layout + metadata + skip link
    page.tsx              # Home page (RSC)
  components/
    counter/CounterCard.tsx  # Counter (Client Component)
```


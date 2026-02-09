# Prompt Guard (Local)

This folder contains local governance checks for prompt-critical docs.

## Run

```bash
npm run prompt:guard
```

## Output quality eval (Codex CLI)

```bash
npm run prompt:quality
```

This runs `codex exec` through a custom provider and checks whether responses include required commands from `AGENTS.md` and `.agents/skills/spec-driven-workflow/SKILL.md`.

## Full suite

```bash
npm run prompt:all
```

## Report

- CLI result: pass/fail per test case
- Optional web viewer:

```bash
npm run prompt:view
```

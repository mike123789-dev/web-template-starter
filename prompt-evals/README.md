# Prompt Guard (Local)

This folder contains local governance checks for prompt-critical docs.

## Run

```bash
npm run prompt:guard
```

## What it validates

- `AGENTS.md`: required sections, title, placeholder ban words
- `.agents/skills/**/SKILL.md`: frontmatter keys, usage guidance section, sampled local path references

## Report

- CLI result: pass/fail per test case
- Optional web viewer:

```bash
npm run prompt:view
```

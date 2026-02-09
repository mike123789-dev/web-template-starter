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

This runs `codex exec` through a custom provider and calculates a weighted score using a case rubric.

- Each case is scored out of 100 (`format`, `coverage`, `relevance`, `operability`, `safety`)
- Final score is weighted across cases
- Default pass threshold: `85`
- Default minimum score per case: `70`
- Default runs per case: `1`
- Default max latency per case: `120000ms`

```bash
CODEX_QUALITY_THRESHOLD=90 npm run prompt:quality
```

```bash
CODEX_QUALITY_MIN_CASE_SCORE=75 CODEX_QUALITY_RUNS=3 npm run prompt:quality
```

```bash
CODEX_QUALITY_MAX_LATENCY_MS=90000 npm run prompt:quality
```

Raw promptfoo pass/fail view is still available:

```bash
npm run prompt:quality:raw
```

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

## Codex SDK collaboration_mode smoke

```bash
npm run prompt:quality:codex-collab
```

Notes:
- Uses `openai:codex-sdk` provider with `collaboration_mode: plan`
- Requires OpenAI auth context for Promptfoo provider execution

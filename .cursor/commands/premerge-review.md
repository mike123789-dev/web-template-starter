# Pre-merge Review

You are running a final pre-merge review for this repository.

## Review Focus

- regression risk
- missing tests or weak evidence
- merge blockers

## Required Checks

1. Inspect changed files and summarize behavior impact.
2. Verify required gates were executed for the change type.
3. Prioritize findings by severity.

## Output Template

### Pre-merge Review

- Risks:
  - [High|Medium|Low] <risk summary> (file: <path>)
- Missing Tests:
  - <missing test or evidence gap> (recommended command: <command>)
- Blockers:
  - <merge blocker> (owner: <role>, action: <next step>)

If no blockers exist, write:

- Blockers:
  - none

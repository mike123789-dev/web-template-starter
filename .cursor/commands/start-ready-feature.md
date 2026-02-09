# Start Ready Feature

You are starting a `Ready` feature and moving it to active execution.

## Goal

Pick a `Ready` feature and transition it to `In Progress` safely.

## Required Actions

1. Run `npm run specs:status` and find all `Ready` features.
2. If there is exactly one `Ready` feature, use it.
3. If there are multiple `Ready` features, ask the user to choose one by `feature-id`.
4. Run:
   - `npm run specs:feature:status -- --feature-id <F-xxx> --status "In Progress"`
5. Confirm status sync across feature docs and report results.

## Output Format

1. Selected feature
2. Status transition result
3. Commands executed
4. Next immediate task recommendation

# ADR-002: Feature Status Workflow Fixed

- Status: Accepted
- Date: 2026-02-09

## Context

작업 상태 표현이 팀/작업자마다 달라 관리가 어려웠다.

## Decision

`Draft -> Ready -> In Progress -> Verifying -> Done` 상태를 강제한다.

## Consequences

- Positive: 진행 상황 비교와 리뷰 타이밍이 명확해진다.
- Negative: 상태 전이 기준을 문서/리뷰에서 지속적으로 관리해야 한다.
- Follow-up: `progress.md` 생성 규칙과 dashboard Dataview 조회를 정기 점검한다.

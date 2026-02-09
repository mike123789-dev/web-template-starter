# ADR-001: PRD + Feature Specs Co-located

- Status: Accepted
- Date: 2026-02-09

## Context

기능 추가 시 요구사항과 테스트 추적 일관성이 필요했다.

## Decision

`docs/specs/` 아래에 PRD와 기능 문서를 함께 관리한다.

## Consequences

- Positive: 에이전트가 단일 경로에서 맥락을 얻고, 요구사항-테스트 매핑 누락을 줄일 수 있다.
- Negative: 문서가 집중되어 구조 관리 규칙이 더 중요해진다.
- Follow-up: `obsidian/frontmatter-schema.md`, `obsidian/linking-rules.md` 준수 점검을 루틴화한다.

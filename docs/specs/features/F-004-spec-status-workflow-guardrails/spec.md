---
doc_type: "spec"
title: "Spec Status Workflow Guardrails"
feature_id: "F-004"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-006"
  - "NFR-001"
last_updated: "2026-02-09"
---

# Spec: Spec Status Workflow Guardrails

## Related Docs

- [[plan]]
- [[tasks]]
- [[test-matrix]]

## Problem

스펙 상태가 임의로 변경되면 요구사항-작업-검증 간 추적이 끊기고, 진행판이 실제 상태를 반영하지 못한다.

## User Scenarios

1. Given 기능 스펙을 Ready로 올리려 할 때, when 문서에 placeholder/clarification이 남아있다면, then Ready로 전환되지 않고 수정 필요가 명확히 안내된다.
2. Given 구현이 완료된 후, when Verifying/Done으로 전환하려면, then 필요한 검증 명령과 AC-테스트 매핑이 먼저 충족된다.

## In Scope

- 상태 전이 규칙 정의(`Draft -> Ready -> In Progress -> Verifying -> Done`)
- 각 전이 단계별 선행 조건(placeholder/clarification/AC-테스트 매핑/검증 명령) 명문화
- 상태 전환/작업 완료 시 명령 사용 규칙(`specs:feature:status`, `specs:task:done`)

## Out of Scope

- CI/깃 훅으로 상태 전이 자동 강제
- 앱 런타임 기능(페이지/API) 변경

## Acceptance Criteria

- `AC-001`: 각 상태 전이(특히 Ready, Verifying, Done)의 선행 조건이 문서에 명시돼 있다.
- `AC-002`: 상태 전환/작업 완료는 명령 기반으로 처리하도록 규칙이 정의돼 있다.
- `AC-003`: `specs:check`와 `specs:validate`로 상태/매핑 위반을 즉시 발견할 수 있다.

## Edge/Failure Cases

- 수동 markdown 편집으로 상태를 변경해 진행판과 불일치가 발생하는 경우
- `progress.md`를 갱신하지 않아 이전 상태가 남는 경우

## Observability

- `npm run specs:check` 출력의 상태/Blocked/Clarification 컬럼
- `npm run specs:validate`의 AC-테스트 매핑/placeholder 검증 결과

## Open Questions

- None

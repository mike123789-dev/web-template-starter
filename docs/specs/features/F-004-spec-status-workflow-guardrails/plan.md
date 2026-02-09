---
doc_type: "plan"
title: "Spec Status Workflow Guardrails"
feature_id: "F-004"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-006"
  - "NFR-001"
last_updated: "2026-02-09"
---

# Plan: Spec Status Workflow Guardrails

## Related Docs

- [[spec]]
- [[tasks]]
- [[test-matrix]]

## Technical Approach

- 상태 전이 기준과 선행 조건을 문서 규칙으로 명문화
- 상태 전환/작업 완료에 대한 명령 사용 가이드 추가
- 진행판/검증 명령을 통한 상태 점검 루틴을 명시

## Affected Files

- `docs/specs/README.md`
- `docs/specs/sdd-playbook.md`
- `docs/specs/task-governance.md`
- `docs/specs/progress.md` (regenerate)

## Data/API Impact

- 데이터 구조 변경 없음
- API 입력/출력 영향 없음

## Constraints

- 문서 중심 변경으로 한정 (스크립트/런타임 코드 변경 없음)

## Risks and Mitigations

1. Risk: 규칙만 추가되고 실제 사용이 누락될 수 있음
   Mitigation: `specs:check`/`specs:validate` 루틴을 완료 게이트로 명시
2. Risk: 상태 전이 조건이 모호해 해석 차이가 발생
   Mitigation: 각 전이 단계별 체크리스트를 표준 텍스트로 제공

## Validation Strategy

- Minimum gate: `npm run specs:check`
- Additional gate: `npm run specs:validate`

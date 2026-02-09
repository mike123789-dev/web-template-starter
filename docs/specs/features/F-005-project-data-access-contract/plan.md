---
doc_type: "plan"
title: "Project Data Access Contract"
feature_id: "F-005"
status: "Ready"
owner: "unassigned"
linked_prd_ids:
  - "FR-003"
  - "FR-004"
  - "FR-005"
  - "NFR-002"
last_updated: "2026-02-09"
---

# Plan: Project Data Access Contract

## Related Docs

- [[spec]]
- [[tasks]]
- [[test-matrix]]

## Technical Approach

- `src/lib/projects.ts`의 조회 함수 계약을 테스트 우선으로 고정한다.
- `sleep` 모킹/스파이로 `delayMs` 경계 동작을 검증한다.
- 존재/미존재 ID에 대한 반환 타입 계약(`Project | null`, `ProjectActivity[]`)을 명시한다.

## Affected Files

- `src/lib/projects.ts`
- `src/lib/projects-data-access.test.ts` (new)
- `docs/specs/features/F-005-project-data-access-contract/spec.md`
- `docs/specs/features/F-005-project-data-access-contract/tasks.md`
- `docs/specs/features/F-005-project-data-access-contract/test-matrix.md`

## Data/API Impact

- 데이터 구조 변경 없음
- 외부 API 영향 없음 (`src/lib` 계약 문서화/검증)

## Constraints

- mock JSON(`src/lib/mock/projects.json`)을 source of truth로 유지
- 테스트는 10분 이내 기본 게이트(`npm run verify`)에 포함 가능해야 함

## Risks and Mitigations

1. Risk: mock 데이터 변경 시 테스트가 brittle해질 수 있음
   Mitigation: 전체 개수 대신 계약 중심(assert null/[]/label mapping) 검증
2. Risk: 지연 테스트가 flaky해질 수 있음
   Mitigation: 실제 시간 측정 대신 `sleep` 호출 여부를 스파이로 확인

## Validation Strategy

- Minimum gate: `npm run test:unit`
- Additional gate: `npm run verify`

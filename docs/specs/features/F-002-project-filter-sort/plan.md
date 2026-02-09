---
doc_type: "plan"
title: "Project Filter/Sort"
feature_id: "F-002"
status: "Done"
linked_prd_ids:
  - "FR-003"
  - "FR-004"
  - "NFR-002"
last_updated: "2026-02-09"
---

# Plan: Project Filter/Sort

## Related Docs

- [[spec]]
- [[tasks]]
- [[test-matrix]]

## Technical Approach

- 쿼리 파라미터를 `page.tsx`에서 파싱하고 `ProjectsList`로 전달한다.
- 필터/정렬 로직은 전용 helper(`src/lib/projects-filter-sort.ts`)로 분리한다.
- 잘못된 파라미터는 기본값으로 fallback한다.
- 정렬 기본값은 `updated`이며 내부 규칙은 `updatedAt desc`로 고정한다.
- 처리 순서는 항상 `filter -> sort`로 고정한다.

## Affected Files

- `src/app/page.tsx`
- `src/components/projects/ProjectsFilters.tsx`
- `src/components/projects/ProjectsList.tsx`
- `src/lib/projects-filter-sort.ts`
- `src/lib/projects.ts`

## Risks and Mitigations

1. Risk: 필터와 정렬이 동시에 적용될 때 순서 충돌
   Mitigation: spec에 적용 순서(필터 후 정렬) 명시
2. Risk: query param 파싱 불일치
   Mitigation: 공통 parser 함수 사용

## Validation Strategy

- Minimum gate: `npm run verify`
- Additional gate: `npm run test:e2e`, `npm run build`

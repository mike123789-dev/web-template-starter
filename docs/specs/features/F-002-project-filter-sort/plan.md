# Plan: Project Filter/Sort

## Meta

- Feature ID: `F-002`
- Status: `Draft`
- Linked PRD IDs: `FR-003`, `FR-004`, `NFR-002`
- Last Updated: `2026-02-09`

## Technical Approach

- 쿼리 파라미터를 `page.tsx`에서 파싱하고 `ProjectsList`로 전달한다.
- 필터/정렬 로직은 `src/lib/projects.ts` 또는 전용 helper로 분리한다.
- 잘못된 파라미터는 기본값으로 fallback한다.

## Affected Files

- `src/app/page.tsx`
- `src/components/projects/ProjectsFilters.tsx`
- `src/components/projects/ProjectsList.tsx`
- `src/lib/projects.ts`

## Risks and Mitigations

1. Risk: 필터와 정렬이 동시에 적용될 때 순서 충돌
   Mitigation: spec에 적용 순서(필터 후 정렬) 명시
2. Risk: query param 파싱 불일치
   Mitigation: 공통 parser 함수 사용

## Validation Strategy

- Minimum gate: `npm run verify`
- Additional gate: `npm run test:e2e`, `npm run build`

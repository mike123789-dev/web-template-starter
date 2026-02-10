---
doc_type: "plan"
title: "Project List UI States"
feature_id: "F-006"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-001"
  - "FR-002"
  - "FR-005"
  - "NFR-001"
  - "NFR-002"
last_updated: "2026-02-10"
---

# Plan: Project List UI States

## Related Docs

- [[spec]]
- [[tasks]]
- [[test-matrix]]

## Technical Approach

- `ProjectsList`에서 조회 성공/빈 결과/오류 분기를 명확히 나누고, 상태별 UI를 렌더링한다.
- 필터 정규화 결과(`resolvedStatus`, `resolvedSort`)를 빈 상태 문구와 reset CTA 노출 조건에 재사용한다.
- `ProjectsListSkeleton`에 접근성 속성을 추가해 로딩 상태를 화면 리더에 전달한다.
- reset 액션은 링크 기반 쿼리 초기화(`/?` 기본 상태)로 단순하게 유지한다.

## Affected Files

- `src/components/projects/ProjectsList.tsx`
- `src/components/projects/ProjectsListSkeleton.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/app/page.tsx`
- `src/components/projects/ProjectsList.test.tsx` (new)
- `e2e/home.spec.ts`

## Data/API Impact

- 데이터 스키마 변경 없음
- API 계약 변경 없음 (`getProjects` 호출 실패 처리만 UI 레벨에서 보강)

## Constraints

- 기존 필터/정렬 정규화 규칙(`normalizeStatusFilter`, `normalizeSortOption`)과 동작 일관성 유지
- 기존 페이지 레이아웃과 컴포넌트 조합을 깨지 않는 범위에서 상태 UI 추가
- 기본 게이트(`verify`) + 라우트 영향 게이트(`build`)를 10분 내 통과 가능해야 함

## Risks and Mitigations

1. Risk: 상태 분기 추가로 기존 정상 목록 렌더링 회귀 가능성
   Mitigation: 기존 목록 렌더링 E2E 케이스를 유지하고 상태 분기별 단위 테스트 추가
2. Risk: 로딩/오류 UI 추가 시 접근성 속성 누락 가능성
   Mitigation: role/aria 속성 명시 + 테스트에서 텍스트/속성 검증

## Validation Strategy

- Minimum gate: `npm run verify`
- Additional gate: `npm run test:e2e`, `npm run build`

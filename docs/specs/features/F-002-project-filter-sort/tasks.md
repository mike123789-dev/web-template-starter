# Tasks: Project Filter/Sort

## Meta

- Feature ID: `F-002`
- Status: `Draft`
- Linked PRD IDs: `FR-003`, `FR-004`, `NFR-002`
- Last Updated: `2026-02-09`

## Task List

| ID | Task | PRD IDs | Output | Required Test Command | Status |
| --- | --- | --- | --- | --- | --- |
| T-001 | 기본 정렬 규칙 확정 | FR-004 | spec open question 해소 | N/A (product decision) | Todo |
| T-002 | 필터/정렬 규칙 spec 반영 | FR-003, FR-004 | spec/plan 갱신 | `npm run verify` | Todo |
| T-003 | 필터/정렬 로직 구현 | FR-003, FR-004 | 목록 결과 일관화 | `npm run test:unit` | Todo |
| T-004 | 쿼리 파라미터 fallback 처리 | FR-003 | invalid 값 안전 처리 | `npm run verify` | Todo |
| T-005 | 기능 완료 검증 | NFR-002 | 회귀 없음 확인 | `npm run test:e2e` | Todo |

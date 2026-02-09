# Tasks: Project Create Flow

## Meta

- Feature ID: `F-001`
- Status: `Ready`
- Linked PRD IDs: `FR-001`, `FR-002`, `NFR-001`
- Last Updated: `2026-02-09`

## Task List

| ID | Task | PRD IDs | Output | Required Test Command | Status |
| --- | --- | --- | --- | --- | --- |
| T-001 | spec/plan/tasks/test-matrix 동기화 | FR-001, FR-002 | 문서 최신화 | `npm run verify` | Todo |
| T-002 | 클라이언트 폼 필수값 검증 확인 | FR-002 | 폼 검증 코드 정합성 | `npm run test:unit` | Todo |
| T-003 | API POST 유효성 검증 확인 | FR-002 | 400/201 응답 규칙 | `npm run verify` | Todo |
| T-004 | 성공 시 목록 복귀 및 알림 확인 | FR-002 | 리다이렉트/메시지 동작 | `npm run test:e2e` | Todo |
| T-005 | 요구사항-테스트 매핑 점검 | FR-001, NFR-001 | 매핑 누락 0건 | `npm run verify` | Todo |
| T-006 | 릴리즈 전 빌드 검증 | NFR-001 | 빌드 성공 로그 | `npm run build` | Todo |

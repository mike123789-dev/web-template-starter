---
doc_type: "plan"
title: "Project Create Flow"
feature_id: "F-001"
status: "Ready"
linked_prd_ids:
  - "FR-001"
  - "FR-002"
  - "NFR-001"
last_updated: "2026-02-09"
---

# Plan: Project Create Flow

## Related Docs

- [[spec]]
- [[tasks]]
- [[test-matrix]]

## Technical Approach

- 폼 컴포넌트에서 클라이언트 입력 검증을 수행한다.
- API 라우트에서 서버 측 유효성 검증을 중복 적용한다.
- 성공 시 쿼리 파라미터 기반 피드백을 표시한다.

## Affected Files

- `src/components/projects/NewProjectForm.tsx`
- `src/app/projects/new/page.tsx`
- `src/app/api/projects/route.ts`
- `src/app/page.tsx`

## Data/API Impact

- `POST /api/projects` 요청 본문 필드 검증 강화
- 성공 시 mock project payload 반환

## Constraints

- 현재는 mock 데이터 기반 동작이어야 한다.
- 기존 라우트/페이지 구조를 유지한다.

## Risks and Mitigations

1. Risk: 클라이언트/서버 검증 규칙 불일치
   Mitigation: 동일 필수 필드 기준을 spec/test-matrix에서 관리
2. Risk: 리다이렉트 후 사용자 피드백 누락
   Mitigation: 홈 페이지 쿼리 파라미터 기반 알림 동작을 테스트에 포함

## Validation Strategy

- Minimum gate: `npm run verify`
- Additional gate: `npm run test:e2e`, `npm run build`

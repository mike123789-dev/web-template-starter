---
doc_type: "spec"
title: "Project Create Flow"
feature_id: "F-001"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-001"
  - "FR-002"
  - "NFR-001"
last_updated: "2026-02-09"
---

# Spec: Project Create Flow

## Related Docs

- [[plan]]
- [[tasks]]
- [[test-matrix]]

## Problem

새 프로젝트 생성 흐름의 입력 검증/성공 처리/오류 처리 요구사항을 명확히 문서화해 회귀를 줄인다.

## User Scenarios

1. Given 사용자가 `/projects/new` 페이지에 진입했을 때, when 필수 입력을 완료하고 제출하면, then 생성 성공 후 목록으로 복귀한다.
2. Given 사용자가 필수 필드를 비우고 제출했을 때, when 검증이 수행되면, then 오류를 확인하고 제출이 차단된다.

## In Scope

- `NewProjectForm` 입력 검증 규칙
- 생성 성공 시 리다이렉트/성공 피드백
- `/api/projects` POST 요청 유효성 검사

## Out of Scope

- 실제 DB 저장
- 인증/권한 처리

## Acceptance Criteria

- `AC-001`: 이름/소유자/상태/설명 필드가 모두 유효할 때만 생성 요청을 보낸다.
- `AC-002`: 생성 성공 시 목록 페이지로 이동하고 성공 안내를 표시한다.
- `AC-003`: API가 잘못된 JSON 또는 누락 필드를 받으면 400과 에러 메시지를 반환한다.

## Edge/Failure Cases

- 잘못된 JSON 본문 요청
- status 값이 허용 범위를 벗어나는 요청

## Observability

- API 응답 코드(201/400)로 성공/실패를 추적한다.

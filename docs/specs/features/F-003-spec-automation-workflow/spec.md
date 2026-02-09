---
doc_type: "spec"
title: "Spec Automation Workflow"
feature_id: "F-003"
status: "Done"
owner: "unassigned"
linked_prd_ids:
  - "FR-001"
  - "FR-002"
  - "FR-005"
  - "NFR-003"
last_updated: "2026-02-09"
---

# Spec: Spec Automation Workflow

## Related Docs

- [[plan]]
- [[tasks]]
- [[test-matrix]]

## Problem

부트스트랩된 스펙 문서가 템플릿 placeholder 상태로 남으면 진행판에서 `Blocked/Clarification`이 반복되고, 에이전트/리뷰어가 동일 기준으로 작업을 이어가기 어렵다.

## User Scenarios

1. Given 기능 폴더가 생성된 직후, when 담당자가 `spec/plan/tasks/test-matrix`를 실제 내용으로 채우면, then 구현 전 요구사항/검증 기준이 명확해진다.
2. Given 진행상황을 점검할 때, when `npm run specs:check`를 실행하면, then `progress.md`에서 `Blocked`와 `NEEDS CLARIFICATION` 여부를 즉시 확인할 수 있다.

## In Scope

- F-003 문서 4종(`spec/plan/tasks/test-matrix`)의 placeholder 제거
- task 상태/PRD ID/검증 명령 정합성 정리
- 진행판 자동 생성 결과에서 F-003 `Blocked/Clarification` 해소

## Out of Scope

- 앱 런타임 기능(페이지/API) 구현 변경
- CI/CD 파이프라인 자동화 추가

## Acceptance Criteria

- `AC-001`: F-003의 `spec/plan/tasks/test-matrix`가 템플릿 placeholder 없이 실제 작업 문맥으로 작성되어 있다.
- `AC-002`: `tasks.md`에 `Blocked` 상태 task가 없고, `spec.md`에 clarification 태그가 남아있지 않다.
- `AC-003`: 모든 AC가 `test-matrix.md`에 최소 1개 테스트/검증 명령으로 매핑되어 있다.

## Edge/Failure Cases

- `progress.md`를 갱신하지 않아 이전 상태가 남아 오판하는 경우
- PRD ID 오기입(`NFR-001` vs `NFR-003`)으로 추적 링크가 끊기는 경우

## Observability

- `npm run specs:status` 출력의 `Blocked`/`Clarification` 컬럼
- `npm run specs:validate`의 feature 문서 정합성 통과 여부

## Open Questions

- None

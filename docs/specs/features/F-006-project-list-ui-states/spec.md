---
doc_type: "spec"
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

# Spec: Project List UI States

## Related Docs

- [[plan]]
- [[tasks]]
- [[test-matrix]]

## Problem

프로젝트 목록 화면은 현재 로딩/에러/빈 결과 상태가 구분되어 보이지 않아, 사용자가 "데이터가 없는지", "아직 로딩 중인지", "오류가 난 것인지"를 즉시 판단하기 어렵다.

## User Scenarios

1. Given 필터를 적용한 목록 페이지에서 결과가 0건일 때, when 사용자가 화면을 본다, then 적용된 필터 맥락이 포함된 빈 상태 메시지와 필터 초기화 액션을 볼 수 있어야 한다.
2. Given 프로젝트 목록 데이터 조회가 실패했을 때, when 목록 영역이 렌더링된다, then 인라인 오류 상태와 재시도 액션을 볼 수 있어야 한다.
3. Given 초기 진입 또는 쿼리 변경으로 목록을 다시 가져올 때, when 로딩 중이다, then 스켈레톤이 `aria-busy`와 함께 표시되어 접근 가능한 로딩 상태를 제공해야 한다.

## In Scope

- `ProjectsList`의 빈 결과 상태 문구를 필터 맥락 기반으로 개선
- 목록 조회 실패 시 인라인 오류 상태 UI 추가
- `ProjectsListSkeleton` 접근성 보강(`aria-busy`, 설명 텍스트)
- 필터가 적용된 빈 결과에서 "Reset filters" CTA 제공

## Out of Scope

- 백엔드 재시도/지수 백오프 정책 도입
- 서버 영속 데이터 저장소 도입
- 목록 페이지 페이징/무한 스크롤

## Acceptance Criteria

- `AC-001`: 필터 적용 결과가 0건이면 빈 상태에 현재 필터 맥락(예: `active`)을 포함한 메시지를 표시한다.
- `AC-002`: `getProjects` 예외가 발생하면 목록 영역에 "Unable to load projects" 오류 UI와 재시도 이동 액션을 표시한다.
- `AC-003`: 목록 로딩 중에는 스켈레톤 컨테이너에 `aria-busy="true"`가 적용되고, 스크린리더용 로딩 안내 텍스트가 제공된다.
- `AC-004`: 필터가 기본값이 아닐 때만 "Reset filters" 액션이 보이며, 클릭 시 기본 목록 쿼리(`status`, `sort` 제거)로 복귀한다.

## Edge/Failure Cases

- 잘못된 `status/sort` 쿼리값은 기존 규칙대로 안전한 기본값으로 정규화되어야 한다.
- 네트워크/예외 오류가 발생해도 페이지 전체가 깨지지 않고 목록 섹션 내에서 복구 가능한 상태를 유지해야 한다.

## Observability

- 단위 테스트로 빈 상태/오류 상태 분기 렌더링을 검증한다.
- E2E 테스트로 필터 후 빈 상태 및 reset 동작을 검증한다.
- `npm run verify`와 `npm run build`를 게이트로 사용한다.

## Open Questions

- None

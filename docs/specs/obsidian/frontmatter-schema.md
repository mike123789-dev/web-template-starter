# Frontmatter Schema

`docs/specs` 문서의 공통 메타데이터 규칙이다. 모든 문서는 파일 상단에 YAML frontmatter(`---`)를 사용한다.

## Global Rules

1. frontmatter는 문서 첫 줄부터 시작한다.
2. 문자열 값은 큰따옴표(`"`)를 사용한다.
3. 날짜는 `YYYY-MM-DD` 형식을 사용한다.
4. 문서 타입별 필수 키를 누락하면 안 된다.

## Common Keys

- `doc_type` (required): `"spec" | "plan" | "tasks" | "test-matrix" | "task-detail"`
- `title` (required): 문서 제목
- `feature_id` (required): `"F-xxx"` 형식
- `status` (required): 상태값
- `linked_prd_ids` (required): PRD requirement ID 배열
- `last_updated` (required): 마지막 수정일
- `task_id` (required only for `task-detail`): `"T-xxx"` 형식
- `owner` (optional, recommended for all doc types): 담당자

## Status Enum

### Feature-level docs (`spec`, `plan`, `tasks`, `test-matrix`)

- `Draft`
- `Ready`
- `In Progress`
- `Verifying`
- `Done`

### Task detail docs (`task-detail`)

- `Todo`
- `In Progress`
- `Blocked`
- `Done`

## Required Keys by Doc Type

| doc_type | Required Keys |
| --- | --- |
| `spec` | `doc_type`, `title`, `feature_id`, `status`, `linked_prd_ids`, `last_updated` |
| `plan` | `doc_type`, `title`, `feature_id`, `status`, `linked_prd_ids`, `last_updated` |
| `tasks` | `doc_type`, `title`, `feature_id`, `status`, `linked_prd_ids`, `last_updated` |
| `test-matrix` | `doc_type`, `title`, `feature_id`, `status`, `linked_prd_ids`, `last_updated` |
| `task-detail` | `doc_type`, `title`, `feature_id`, `task_id`, `status`, `linked_prd_ids`, `last_updated` |

## Example

```yaml
---
doc_type: "spec"
title: "Project Create Flow"
feature_id: "F-001"
status: "Ready"
owner: "unassigned"
linked_prd_ids:
  - "FR-001"
  - "FR-002"
  - "NFR-001"
last_updated: "2026-02-09"
---
```

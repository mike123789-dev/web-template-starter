---
doc_type: "task-detail"
title: "T-xxx <Short Title>"
feature_id: "F-xxx"
task_id: "T-xxx"
status: "Todo"
owner: "unassigned"
linked_prd_ids:
  - "FR-xxx"
  - "NFR-xxx"
last_updated: "YYYY-MM-DD"
---

# Task Detail: T-xxx <Short Title>

## Related Docs

- [[../tasks]]
- [[../spec]]
- [[../test-matrix]]

## Objective

<이 task가 끝났을 때 달성되어야 하는 단일 목표>

## Scope

### In

- <포함 범위>
- <포함 범위>

### Out

- <제외 범위>

## Dependencies

- <선행 task 또는 외부 결정> / 없으면 `None`

## Implementation Notes

- <핵심 구현 메모>
- <리스크 포인트>

## Files to Touch

- `<path/to/file>`
- `<path/to/file>`

## Validation

| Type | Command | Expected Result |
| --- | --- | --- |
| Required | `npm run verify` | Pass |
| Required | `<command>` | Pass |

## Done Checklist

- [ ] 코드/문서 변경이 task 목적과 일치한다.
- [ ] Required 명령이 모두 통과했다.
- [ ] `tasks.md`의 상태/진행률을 갱신했다.

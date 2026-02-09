# Weekly Review

주 1회 의사결정/우선순위 조정을 위한 리뷰 노트 운영 가이드.

## Routine

1. `npm run specs:check`로 `progress.md` 최신화
2. 이번 주 엔트리 섹션 생성 (`## YYYY-MM-DD Weekly Review`)
3. `Blocked`, `Ready`, `Recently Updated` 스냅샷 확인 후 핵심 결정 기록
4. 필요한 ADR이 있으면 `docs/specs/decisions/`에 추가하고 링크

## Weekly Entry Template

```md
## YYYY-MM-DD Weekly Review

### Decisions
- <이번 주 결정 1> ([[../decisions/ADR-xxx-...|ADR]])
- <이번 주 결정 2>

### Blocked Snapshot
![[../progress.md]]

### Ready To Start Snapshot
- <착수 후보 feature/task>

### Recently Updated Snapshot
- <업데이트된 문서/배경>

### Next Week Focus
- <다음 주 우선순위>
```

## Live Views (Optional)

```dataview
TABLE doc_type AS "Type", feature_id AS "Feature", task_id AS "Task", last_updated AS "Last Updated"
FROM "docs/specs/features"
WHERE status = "Blocked"
SORT last_updated DESC
```

```dataview
TABLE doc_type AS "Type", feature_id AS "Feature", status AS "Status", last_updated AS "Last Updated"
FROM "docs/specs/features"
WHERE status = "Ready"
  AND contains(list("spec", "plan", "tasks", "test-matrix"), doc_type)
SORT last_updated DESC
```

```dataview
TABLE doc_type AS "Type", feature_id AS "Feature", task_id AS "Task", status AS "Status", last_updated AS "Last Updated"
FROM "docs/specs/features"
SORT last_updated DESC
LIMIT 12
```

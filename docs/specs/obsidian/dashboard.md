---
cssclasses:
  - sdd-progress
---

# SDD Dashboard

진행상황은 `docs/specs/progress.md` 하나만 소스로 사용한다.

## Dataview: In Progress

```dataview
TABLE
  doc_type AS "Type",
  feature_id AS "Feature",
  task_id AS "Task",
  choice(status = "Done", "🟩 Done",
    choice(status = "Ready", "🟦 Ready",
      choice(status = "In Progress", "🟨 In Progress",
        choice(status = "Blocked", "🟥 Blocked",
          choice(status = "Draft", "⬜ Draft", "▫ " + status)
        )
      )
    )
  ) AS "Status",
  last_updated AS "Last Updated"
FROM ""
WHERE contains(file.path, "specs/features/")
  AND status = "In Progress"
SORT last_updated DESC
```

## Dataview: Blocked

```dataview
TABLE
  doc_type AS "Type",
  feature_id AS "Feature",
  task_id AS "Task",
  choice(status = "Done", "🟩 Done",
    choice(status = "Ready", "🟦 Ready",
      choice(status = "In Progress", "🟨 In Progress",
        choice(status = "Blocked", "🟥 Blocked",
          choice(status = "Draft", "⬜ Draft", "▫ " + status)
        )
      )
    )
  ) AS "Status",
  last_updated AS "Last Updated"
FROM ""
WHERE contains(file.path, "specs/features/")
  AND status = "Blocked"
SORT last_updated DESC
```

## Dataview: Recently Updated

```dataview
TABLE
  doc_type AS "Type",
  feature_id AS "Feature",
  task_id AS "Task",
  choice(status = "Done", "🟩 Done",
    choice(status = "Ready", "🟦 Ready",
      choice(status = "In Progress", "🟨 In Progress",
        choice(status = "Blocked", "🟥 Blocked",
          choice(status = "Draft", "⬜ Draft", "▫ " + status)
        )
      )
    )
  ) AS "Status",
  last_updated AS "Last Updated"
FROM ""
WHERE contains(file.path, "specs/features/")
SORT last_updated DESC
LIMIT 12
```

## Dataview: Needs Clarification

```dataviewjs
const blocked = dv
  .pages('"docs/specs/features"')
  .where((p) => p.status === 'Blocked');

const rows = [];
for (const p of blocked) {
  const content = (await dv.io.load(p.file.path)) ?? '';
  if (/clarification|질문/i.test(content)) {
    rows.push([
      p.file.link,
      p.doc_type ?? '-',
      p.feature_id ?? '-',
      p.task_id ?? '-',
      p.last_updated ?? '-',
    ]);
  }
}

dv.table(
  ['Document', 'Type', 'Feature', 'Task', 'Last Updated'],
  rows
);
```

## Dataview: Ready To Start

```dataview
TABLE
  doc_type AS "Type",
  feature_id AS "Feature",
  choice(status = "Done", "🟩 Done",
    choice(status = "Ready", "🟦 Ready",
      choice(status = "In Progress", "🟨 In Progress",
        choice(status = "Blocked", "🟥 Blocked",
          choice(status = "Draft", "⬜ Draft", "▫ " + status)
        )
      )
    )
  ) AS "Status",
  last_updated AS "Last Updated"
FROM ""
WHERE contains(file.path, "specs/features/")
  AND status = "Ready"
  AND contains(list("spec", "plan", "tasks", "test-matrix"), doc_type)
SORT last_updated DESC
```

## Single Board

![[../progress.md]]

## Fallback

- Obsidian 임베드가 보이지 않으면 `../progress.md`를 직접 연다.
- 갱신이 안 보이면 터미널에서 `npm run specs:check` 실행 후 다시 연다.

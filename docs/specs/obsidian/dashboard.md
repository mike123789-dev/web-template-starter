# SDD Dashboard

Obsidian + Dataview 기준으로 `docs/specs` 진행 상황을 한 화면에서 본다.

## Feature Summary

```dataview
TABLE feature_id AS "Feature", status AS "Status", linked_prd_ids AS "PRD IDs", last_updated AS "Updated"
FROM ""
WHERE contains(file.path, "specs/features/") AND doc_type = "spec"
SORT feature_id ASC
```

## Draft Features

```dataview
TABLE file.link AS "Spec", feature_id AS "Feature", last_updated AS "Updated"
FROM ""
WHERE contains(file.path, "specs/features/") AND doc_type = "spec" AND status = "Draft"
SORT last_updated DESC
```

## Blocked Task Detail Docs

```dataview
TABLE file.link AS "Task Detail", feature_id AS "Feature", task_id AS "Task", last_updated AS "Updated"
FROM ""
WHERE contains(file.path, "specs/features/") AND doc_type = "task-detail" AND status = "Blocked"
SORT last_updated DESC
```

## Blocked Rows In tasks.md

```dataviewjs
const pages = dv
  .pages()
  .where((p) => p.doc_type === "tasks" && p.file.path.includes("specs/features/"));
const blockedRows = [];

for (const page of pages) {
  const raw = await dv.io.load(page.file.path);
  const lines = raw.split("\n").filter((line) => line.startsWith("| T-"));

  for (const line of lines) {
    const cols = line
      .split("|")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    if (cols.length < 7) continue;

    const [taskId, taskName, , , , detail, status] = cols;
    if (status !== "Blocked") continue;

    blockedRows.push([
      page.file.link,
      taskId,
      taskName,
      detail.replaceAll("`", ""),
      status,
    ]);
  }
}

if (blockedRows.length === 0) {
  dv.paragraph("No blocked task rows in tasks.md");
} else {
  dv.table(["Tasks Doc", "Task ID", "Task", "Detail", "Status"], blockedRows);
}
```

## NEEDS CLARIFICATION

```dataviewjs
const pages = dv.pages().where((p) => p.file.path.includes("specs/features/"));
const flagged = [];

for (const page of pages) {
  const raw = await dv.io.load(page.file.path);
  if (raw.includes("[NEEDS CLARIFICATION]")) {
    flagged.push([page.file.link]);
  }
}

if (flagged.length === 0) {
  dv.paragraph("No [NEEDS CLARIFICATION] markers");
} else {
  dv.table(["Doc"], flagged);
}
```

## Older Than 14 Days

```dataview
TABLE file.link AS "Doc", doc_type AS "Type", status AS "Status", last_updated AS "Updated"
FROM ""
WHERE contains(file.path, "specs/features/") AND date(today) - date(last_updated) > dur(14 days)
SORT last_updated ASC
```

# Task Governance

`tasks.md`와 task 상세 문서(`tasks/T-xxx.md`) 사용 기준을 정의한다.

## Core Rule

- 모든 기능은 `tasks.md`를 반드시 가진다.
- task 상세 문서는 기본 선택 사항이지만, 아래 조건에 해당하면 필수다.

## When Task Detail Is Required

아래 항목 중 하나라도 `Yes`면 `tasks/T-xxx.md`를 만든다.

1. 작업 예상 시간이 1일 이상이다.
2. 변경 파일이 4개 이상이다.
3. 작업 범위가 2개 이상 레이어를 건드린다. 예: `src/app` + `src/lib`, `src/components` + `src/app/api`.
4. 실패 시 사용자 영향이 크거나 롤백 계획이 필요하다.
5. 선행 의존성(다른 task 완료, 외부 의사결정, 외부 팀 입력)이 있다.

## Folder and Naming

- 기능 폴더 기준 경로: `docs/specs/features/F-xxx-<slug>/tasks/`
- 파일명 규칙: `T-001.md`, `T-002.md`
- `tasks.md`의 ID와 상세 파일명이 반드시 일치해야 한다.

## tasks.md Requirements

- 모든 row는 `ID`, `Task`, `PRD IDs`, `Required Test Command`, `Status`를 가져야 한다.
- 상세 문서가 있으면 `Detail` 컬럼에 상대 경로를 기록한다.
- 상세 문서가 없으면 `Detail`은 `-`로 둔다.

## Task Status

- `Todo`
- `In Progress`
- `Blocked`
- `Done`

## Done Criteria (Task Level)

Task를 `Done`으로 바꾸려면 다음을 모두 만족해야 한다.

1. 구현 결과가 `Output`과 일치한다.
2. `Required Test Command`가 성공했다. 또는 `N/A (reason)`가 근거를 가진다.
3. 상세 문서가 있는 task는 해당 문서의 체크리스트가 완료됐다.

## Review Check

- PR 리뷰 전 `tasks.md`와 `tasks/` 폴더 간 불일치가 없어야 한다.
- `Done` 비율과 실제 테스트 결과가 일치해야 한다.
- 문서 링크는 `docs/specs/obsidian/linking-rules.md` 기준을 따른다.

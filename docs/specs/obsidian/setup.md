# Obsidian Setup

`docs/specs`를 Obsidian에서 SDD 워크스페이스로 쓰기 위한 최소 설정이다.

## 1) Vault Scope

- Recommended: `docs` 폴더를 별도 Vault로 연다.

## 2) Templates Plugin

- Core plugin `Templates` 활성화
- Template folder location:
- docs 전용 Vault일 때: `specs/templates`
- repo 루트 Vault일 때: `docs/specs/templates`

## 3) Dataview Plugin (Optional)

- Community plugin `Dataview`는 선택 사항이다.
- 이 저장소의 기본 진행판은 Dataview 없이도 동작한다 (`progress.md`).
- Dataview setting `Enable JavaScript Queries`는 Dataview 대시보드를 따로 쓸 때만 활성화한다.

## 4) Recommended Notes

- Progress board (single source): `progress.md`
- Dashboard wrapper: `obsidian/dashboard.md`
- Weekly review log: `obsidian/weekly-review.md`
- Decision log index: `decisions/README.md`
- Rules: `obsidian/frontmatter-schema.md`, `task-governance.md`, `obsidian/linking-rules.md`
- Bootstrapping: `templates/feature-bootstrap.template.md`

## 5) New Feature Routine

1. `feature-bootstrap.template.md`로 feature `README.md` 생성
2. `spec/plan/tasks/test-matrix` 문서 생성
3. 템플릿 삽입 후 frontmatter 채우기
4. `npm run specs:check` 실행 후 `obsidian/dashboard.md`에서 진행상황 확인

## 6) Weekly Review Routine

1. 주 1회 `npm run specs:check` 실행
2. `obsidian/weekly-review.md`에 이번 주 엔트리 추가
3. Blocked/Ready/Recently Updated를 기반으로 의사결정 기록
4. 구조적 결정은 `decisions/ADR-xxx-...md`로 분리 기록

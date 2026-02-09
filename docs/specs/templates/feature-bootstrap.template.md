# Feature Bootstrap Template

새 기능 시작 시 이 문서를 복사해서 feature 폴더의 `README.md`로 사용한다.

## Naming

- Feature folder: `docs/specs/features/F-xxx-<slug>/`
- Required files:
- `README.md`
- `spec.md`
- `plan.md`
- `tasks.md`
- `test-matrix.md`
- Optional:
- `tasks/T-xxx.md`
- `changelog.md`

## Metadata

- Feature ID: `F-xxx`
- Title: `<Feature Title>`
- Status: `Draft`
- Owner: `<name>`
- Linked PRD IDs: `FR-xxx`, `NFR-xxx`
- Last Updated: `YYYY-MM-DD`

## Checklist

- [ ] `docs/specs/prd.md`에서 관련 requirement ID를 확인했다.
- [ ] `spec.md` 작성 완료
- [ ] `plan.md` 작성 완료
- [ ] `tasks.md` 작성 완료 (PRD IDs + Required Test Command 포함)
- [ ] `test-matrix.md` 작성 완료 (AC 매핑 100%)
- [ ] `obsidian/frontmatter-schema.md` 규칙 준수
- [ ] `task-governance.md` 기준으로 상세 task 필요 여부 판단
- [ ] `obsidian/dashboard.md`에서 상태 확인 가능

## Link Rules

- `spec.md` -> `tasks.md`, `test-matrix.md`
- `tasks.md` -> `spec.md`, `test-matrix.md`
- `test-matrix.md` -> `spec.md`, `tasks.md`
- `tasks/T-xxx.md` -> `tasks.md`, `spec.md`

## Status Flow

- `Draft -> Ready -> In Progress -> Verifying -> Done`

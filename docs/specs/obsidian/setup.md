# Obsidian Setup

`docs/specs`를 Obsidian에서 SDD 워크스페이스로 쓰기 위한 최소 설정이다.

## 1) Vault Scope

- Recommended: `/Users/kang/Desktop/KangByungminDev/WEB/web-template-starter/docs` 폴더를 별도 Vault로 연다.

## 2) Templates Plugin

- Core plugin `Templates` 활성화
- Template folder location:
- docs 전용 Vault일 때: `specs/templates`
- repo 루트 Vault일 때: `docs/specs/templates`

## 3) Dataview Plugin

- Community plugin `Dataview` 설치/활성화
- Dataview setting `Enable JavaScript Queries` 활성화
- 시작 페이지: `docs/specs/obsidian/dashboard.md` 또는 `specs/obsidian/dashboard.md` (Vault 기준에 따라 다름)

## 4) Recommended Notes

- Dashboard: `obsidian/dashboard.md`
- Rules: `obsidian/frontmatter-schema.md`, `task-governance.md`, `obsidian/linking-rules.md`
- Bootstrapping: `templates/feature-bootstrap.template.md`

## 5) New Feature Routine

1. `feature-bootstrap.template.md`로 feature `README.md` 생성
2. `spec/plan/tasks/test-matrix` 문서 생성
3. 템플릿 삽입 후 frontmatter 채우기
4. `obsidian/dashboard.md`에서 Draft/Blocked/clarification 상태 확인

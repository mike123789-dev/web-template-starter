# Spec-Driven Checklist

## Before Implementation

- [ ] 신규 기능이면 `npm run specs:new -- ...`로 문서 스캐폴딩을 생성했다.
- [ ] `docs/specs/prd.md`에서 관련 `FR-*`/`NFR-*`를 확인했다.
- [ ] 대상 기능 폴더(`docs/specs/features/F-xxx-*/`)가 있다.
- [ ] `spec.md`에 `[NEEDS CLARIFICATION]`가 없다.
- [ ] 문서 frontmatter가 `docs/specs/obsidian/frontmatter-schema.md`를 따른다.
- [ ] `tasks.md`의 각 항목에 `PRD IDs`와 `Required Test Command`가 있다.
- [ ] `docs/specs/task-governance.md` 기준으로 상세 task 문서 필요 여부를 판단했다.
- [ ] `docs/specs/obsidian/linking-rules.md` 기준으로 문서 간 링크를 배치했다.

## During Implementation

- [ ] 코드 변경 시 `spec.md`, `plan.md`, `tasks.md`를 함께 갱신한다.
- [ ] 기능 상태를 `Draft -> Ready -> In Progress -> Verifying -> Done` 흐름으로만 변경한다.
- [ ] `npm run specs:check`를 실행해 `docs/specs/progress.md`를 갱신하고 즉시 확인한다.

## Before Done

- [ ] `tasks.md` 완료율 100%
- [ ] 상세 task 문서가 필요한 항목은 `tasks/T-xxx.md`가 존재한다.
- [ ] `test-matrix.md`에서 모든 AC가 테스트에 매핑됨
- [ ] `npm run specs:check` 실행 (진행판 최신화 + 출력 확인)
- [ ] `npm run specs:validate` 통과
- [ ] `npm run verify` 통과
- [ ] 라우트/API/설정 영향이 있으면 `npm run build` 통과

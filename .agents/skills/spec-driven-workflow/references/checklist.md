# Spec-Driven Checklist

## Before Implementation

- [ ] `docs/specs/prd.md`에서 관련 `FR-*`/`NFR-*`를 확인했다.
- [ ] 대상 기능 폴더(`docs/specs/features/F-xxx-*/`)가 있다.
- [ ] `spec.md`에 `[NEEDS CLARIFICATION]`가 없다.
- [ ] `tasks.md`의 각 항목에 `PRD IDs`와 `Required Test Command`가 있다.

## During Implementation

- [ ] 코드 변경 시 `spec.md`, `plan.md`, `tasks.md`를 함께 갱신한다.
- [ ] 기능 상태를 `Draft -> Ready -> In Progress -> Verifying -> Done` 흐름으로만 변경한다.
- [ ] `docs/specs/README.md` 대시보드의 Progress를 최신화한다.

## Before Done

- [ ] `tasks.md` 완료율 100%
- [ ] `test-matrix.md`에서 모든 AC가 테스트에 매핑됨
- [ ] `npm run verify` 통과
- [ ] 라우트/API/설정 영향이 있으면 `npm run build` 통과

# Agent Definition of Done (DoD)

이 문서는 "어떤 변경에 어떤 테스트를 반드시 돌릴지"를 정의한다.

## 공통 체크리스트

- [ ] 요구사항 범위와 변경 파일을 명확히 설명할 수 있다.
- [ ] 변경 이유와 영향 범위를 설명할 수 있다.
- [ ] 실행한 테스트 명령과 결과를 보고에 포함했다.

## Spec Completeness (기능 변경 시 필수)

- [ ] `docs/specs/prd.md`의 요구사항 ID를 참조했다.
- [ ] `docs/specs/features/F-xxx-.../spec.md`가 최신 상태다.
- [ ] `docs/specs/features/F-xxx-.../tasks.md`의 각 task에 PRD ID와 테스트 명령이 있다.
- [ ] 상세 task 분할 여부가 `docs/specs/task-governance.md` 기준과 일치한다.
- [ ] `docs/specs/features/F-xxx-.../test-matrix.md`에서 모든 AC가 테스트에 매핑됐다.
- [ ] `npm run specs:validate`를 통과했다.

## 변경 유형별 필수 테스트

### 1) 문서 전용 변경 (`README`, `docs`, 주석만 수정)

- [ ] 코드/설정 파일이 변경되지 않았다.
- [ ] 실행 필수 테스트 없음

### 2) UI 컴포넌트 변경 (`src/components/**`)

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test:unit`
- [ ] `npm run test:storybook` (스토리/컴포넌트 동작 영향 시)

### 3) 순수 로직 변경 (`src/lib/**`, 유틸 함수)

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run test:unit`

### 4) App Router 페이지/레이아웃 변경 (`src/app/**`)

- [ ] `npm run verify`
- [ ] `npm run test:e2e` (사용자 플로우 영향 시 필수)
- [ ] `npm run build`

### 5) API 라우트 변경 (`src/app/api/**`)

- [ ] `npm run verify`
- [ ] `npm run test:e2e` (API를 사용하는 UI 플로우 영향 시)
- [ ] `npm run build`

### 6) 의존성/빌드/설정 변경 (`package.json`, `next.config.ts`, 테스트 설정)

- [ ] `npm run verify`
- [ ] `npm run test:all`
- [ ] `npm run build`

## 리뷰 요청 전 완료 조건

- [ ] 변경 유형별 필수 항목을 모두 통과했다.
- [ ] 실패/미실행 항목이 있다면 사유와 리스크를 명시했다.
- [ ] 필요 시 후속 작업(추가 테스트, 보완 범위)을 제안했다.

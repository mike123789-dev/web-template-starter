# Prompt Governance 운영 가이드

## 목적

`AGENTS.md`와 `.agents/skills/**/SKILL.md`는 에이전트 동작 품질에 직접 영향을 주는 핵심 문서다.
이 문서의 목적은 다음 2가지를 로컬에서 반복 가능하게 검증하는 것이다.

1. 문서 구조/형식이 최소 품질 기준을 만족하는지
2. 실제 `codex exec` 응답이 기대한 운영 명령을 내놓는지

## 이번 작업에서 적용한 내용

### 1) 정적 품질 검증 (문서 자체 검사)

- 엔진: `promptfoo`
- 커스텀 provider: `scripts/prompt-guard/provider.mjs`
- 설정: `promptfoo.yaml`
- 테스트: `prompt-evals/tests.yaml`

검사 항목:

- `AGENTS.md`
  - 메인 타이틀 고정 여부
  - 필수 섹션 존재 여부
  - placeholder 금칙어(`TODO`, `TBD`, `lorem ipsum`) 유무
- `.agents/skills/**/SKILL.md`
  - frontmatter 존재
  - `name`, `description` 존재
  - H1 타이틀 존재
  - 사용/워크플로 성격의 안내 섹션 또는 문구 존재
  - 문서 내 상대경로 참조가 실제 파일로 존재하는지

### 2) 응답 품질 검증 (`codex exec` 호출)

- 커스텀 provider: `scripts/prompt-guard/codex-exec-provider.mjs`
- 가중치 케이스 정의: `prompt-evals/codex-quality-cases.mjs`
- 가중치 스코어러: `scripts/prompt-guard/quality-score.mjs`
- (옵션) raw pass/fail 설정: `promptfoo.codex-quality.yaml`
- (옵션) raw pass/fail 테스트: `prompt-evals/codex-quality-tests.yaml`

검사 방식:

- `codex exec`로 실제 답변 생성
- 답변을 JSON(`{"commands": string[]}`)으로 강제
- 케이스별 100점 루브릭으로 채점
  - `format` 20점: 엄격 JSON 스키마 준수(추가 키/빈 문자열/중복 제외)
  - `coverage` 40점: 필수 명령 커버리지
  - `relevance` 20점: 명령 수/주제 관련성
  - `operability` 10점: `npm run <script>`가 실제 package scripts에 존재
  - `safety` 10점: 금지 명령 미포함
- 케이스 평균 지연시간이 `CODEX_QUALITY_MAX_LATENCY_MS` 이하여야 통과
- 전체 점수는 케이스 가중 평균으로 계산
  - 케이스 가중치: Done 게이트 45, 진행상태 30, 부트스트랩 25

현재 포함된 품질 케이스:

1. Done 전 필수 게이트 명령에 `specs:check`, `specs:validate` 포함
2. 진행 상태 확인 명령 2개 이상 + `specs:status` 또는 `specs:check` 포함
3. 신규 스펙 부트스트랩 명령에 `specs:new` 포함

## 추가/변경된 파일

- `package.json`
- `promptfoo.yaml`
- `promptfoo.codex-quality.yaml`
- `prompt-evals/README.md`
- `prompt-evals/tests.yaml`
- `prompt-evals/codex-quality-cases.mjs`
- `prompt-evals/codex-quality-tests.yaml`
- `scripts/prompt-guard/provider.mjs`
- `scripts/prompt-guard/codex-exec-provider.mjs`
- `scripts/prompt-guard/quality-score.mjs`

## 실행 방법

### 정적 검증만

```bash
npm run prompt:guard
```

### 응답 품질 검증만

```bash
npm run prompt:quality
```

기본 합격 임계치는 `85%`이며, 아래처럼 조정 가능:

```bash
CODEX_QUALITY_THRESHOLD=90 npm run prompt:quality
```

raw pass/fail 리포트가 필요하면:

```bash
npm run prompt:quality:raw
```

### 전체 검증(권장)

```bash
npm run prompt:all
```

## 최근 실행 결과

- 정적 검증: `2 passed, 0 failed`
- 응답 품질 검증(루브릭): `100.00 / 100`
- 전체 기준: 통과

## 이걸 어떻게 사용하면 좋은가 (권장 운영)

1. `AGENTS.md` 또는 `.agents/skills/**` 수정 직후 `npm run prompt:all` 실행
2. 실패 시 문서 수정 후 재실행해 녹색 상태 확인
3. PR 전 최소 게이트로 `npm run prompt:all` 포함
4. 규칙/테스트를 바꿀 때는 기존 케이스를 삭제하지 말고 케이스를 추가해 회귀 안정성 확보

## 모델/실행 설정 팁

`codex exec` 품질 평가는 로컬 Codex 설정을 따른다.
필요하면 아래 환경변수로 고정/튜닝 가능:

- `CODEX_EVAL_MODEL`: 평가에 사용할 모델 고정
- `CODEX_EVAL_TIMEOUT_MS`: 케이스별 타임아웃 조정(기본 180000ms)
- `CODEX_QUALITY_THRESHOLD`: 전체 합격 임계치(기본 85)
- `CODEX_QUALITY_MIN_CASE_SCORE`: 케이스별 최소 점수(기본 70)
- `CODEX_QUALITY_RUNS`: 케이스 반복 실행 횟수(기본 1)
- `CODEX_QUALITY_MAX_LATENCY_MS`: 케이스 평균 지연 상한(기본 120000ms)

예시:

```bash
CODEX_EVAL_MODEL=gpt-5.1-codex CODEX_EVAL_TIMEOUT_MS=240000 CODEX_QUALITY_THRESHOLD=90 CODEX_QUALITY_MIN_CASE_SCORE=75 CODEX_QUALITY_RUNS=3 CODEX_QUALITY_MAX_LATENCY_MS=90000 npm run prompt:quality
```

## 주의사항

- `prompt:quality`는 `codex` CLI 로그인/사용 가능 상태여야 한다.
- 응답 품질 테스트는 모델 특성상 비결정성이 있으므로, 중요한 규칙은 케이스를 1개가 아니라 여러 케이스로 분산해 안정화하는 것이 좋다.
- 필요 시 CI에서도 동일 명령(`npm run prompt:all`)을 required check로 걸어 로컬/PR 기준을 일치시킨다.

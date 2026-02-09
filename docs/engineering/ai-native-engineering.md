# AI-Native Engineering Checklist

이 문서는 이 저장소가 목표로 하는 "AI 도구를 잘 활용하는 개발 방식"을 팀 실행 관점으로 정리한 체크리스트다.
핵심은 기능 구현 자체보다, 에이전트가 안정적으로 반복 실행되고 사람이 최종 품질을 소유하는 운영 체계를 만드는 것이다.

## 관련 문서

- 실행 절차: `docs/agent/runbook.md`
- 완료 기준: `docs/agent/dod.md`
- 테스트 전략: `docs/engineering/testing.md`
- 프롬프트 거버넌스: `docs/engineering/prompt-governance.md`

## 1) 작업을 잘 정의한다 (Well-specified tasks)

- 요구사항을 애매하게 던지지 않고, 범위/제약/완료조건을 먼저 고정한다.
- 신규 기능이면 `docs/specs/features/F-xxx-.../` 문서 세트를 먼저 만든다.
- `tasks.md`에는 PRD ID와 Required Test Command를 반드시 채운다.

## 2) 계획 산출물을 코드베이스에 남긴다

- 큰 변경은 먼저 계획을 문서화한다 (`plan.md` 또는 `PLAN.md` 성격 문서).
- 계획 없이 바로 코드를 생성하지 않고, 단계별 마일스톤으로 나눈다.
- 계획 변경 이력(왜 바뀌었는지)을 feature 문서에 남긴다.

## 3) 운영 원칙은 Delegate -> Review -> Own 으로 고정한다

- 에이전트에게 초안/반복 작업을 위임한다 (Delegate).
- 리뷰는 사람 책임으로 수행하고 근거를 남긴다 (Review).
- 최종 의사결정과 배포 책임은 사람이 가진다 (Own).

## 4) 병렬 실행은 Thread/Subagent 단위로 분리한다

- 대안 구현이나 역할 분리는 thread fork/subagent로 나눠 병렬 처리한다.
- 긴 작업은 cloud로 위임하고, 로컬에서는 설계/검증을 유지한다.
- subagent는 단일 책임으로 쪼개고, "언제 호출해야 하는지"가 description에 명확히 드러나게 쓴다.
- nested 구조(서브에이전트가 또 서브에이전트를 호출)는 금지하고, 리드 에이전트가 오케스트레이션한다.

## 4-1) Subagent 정의/배치 표준을 고정한다 (Claude/Cursor/Codex 공통)

- 공통 source of truth는 `.agents/agents/`로 두고, 도구별 폴더는 심볼릭 링크로 연결한다.
- 프로젝트 레벨 설정을 버전 관리한다: `.claude/agents/`, `.cursor/agents/`, `.codex/agents/`.
- 사용자 전역 설정은 개인 환경에 둔다: `~/.claude/agents/`, `~/.cursor/agents/`.
- 설정 파일에는 최소 `name`, `description`를 포함한다.
- `description`에는 위임 트리거를 직접 적는다: "Use proactively when ...".
- 프롬프트는 짧고 명확하게 유지한다. 장문 일반론은 위임 정확도를 떨어뜨린다.
- 슬래시 커맨드로 충분한 단순 작업은 subagent로 과설계하지 않는다.
- 처음엔 2~3개 역할로 시작하고, 필요가 명확할 때만 늘린다.

## 5) 테스트를 구현과 분리된 단계로 다룬다

- 구현과 테스트 생성을 같은 세션에서 한 번에 끝내지 않는다.
- 테스트를 별도 단계(가능하면 별도 세션)로 생성/검증한다.
- "새 테스트가 먼저 실패하는지"를 확인한 뒤 구현으로 넘어간다.
- 사용자 플로우 영향이 있으면 브라우저 실검증을 별도 subagent(`browser-verifier`)로 수행한다.

## 5-1) 리드-서브에이전트 협업 규칙을 운영한다

- 리드 에이전트는 팀을 분배하고, 결과를 합치며, 최종 결론만 책임진다.
- 서브에이전트는 병렬 탐색/검증/리뷰를 맡고, 파일 단위 소유권을 분리한다.
- 리드는 서브에이전트가 끝나기 전에 작업을 다시 가져오지 않고 완료를 기다린다.
- 장시간 무감독 실행을 피하고, 중간 체크인으로 방향 이탈을 교정한다.
- 처음 도입 시에는 구현보다 PR 리뷰/리서치/버그 조사 같은 경계가 분명한 업무부터 적용한다.

## 6) 명령 실행 성공 여부를 항상 확인한다

- 에이전트가 실행한 명령이 실제로 성공했는지 로그로 확인한다.
- 이 저장소 기본 게이트는 다음과 같다: 비문서 변경 `npm run verify`, 라우트/API/설정 영향 `npm run build`, 기능 문서 작업 `npm run specs:check && npm run specs:validate`.

## 7) AGENTS.md를 지속 개선해 에이전트 루프를 강화한다

- 에이전트가 매번 참고하는 규칙을 `AGENTS.md`에 명시한다.
- 테스트/린트/리뷰/문서화 규칙을 추가해 시행착오를 줄인다.
- 이 저장소에서는 `prompt:guard`, `prompt:quality`로 규칙 품질을 지속 점검한다.

## 8) 리뷰를 자동화하되, 기준은 명시적으로 준다

- 로컬 변경 전 `/review`로 1차 점검한다.
- 리뷰 초점(보안, 엣지케이스, 회귀 위험)을 프롬프트에 명시한다.
- App Server를 쓰면 detached review thread로 독립 리뷰를 운영할 수 있다.

## 9) 운영/배포 단계까지 에이전트 컨텍스트를 확장한다

- 코드만 보게 하지 말고 로그/배포/이슈 컨텍스트를 연결한다.
- 반복적 운영 업무(오류 분류, 리포트, 이상 징후 탐지)는 자동화 대상으로 본다.
- 단, 민감한 변경 승인과 최종 배포 판단은 사람 책임으로 유지한다.

## 10) 권한/보안 가드레일을 코드처럼 관리한다

- 규칙 파일로 허용/승인/금지 명령을 명확히 분리한다.
- 위험한 셸 래퍼/복합 명령이 우회되지 않도록 prefix rule을 관리한다.
- 팀 정책은 "자동 허용 최소화, 필요한 권한만 단계적으로"를 기본값으로 둔다.

## 11) 이 저장소 권장 Subagent 역할 세트

- `spec-planner`: PRD ID 매핑, `spec/plan/tasks/test-matrix` 동기화, 상태 전이 체크.
- `implementer`: 코드 변경과 최소 영향 구현.
- `test-guardian`: 테스트 추가/보강, `verify`/`build` 게이트 확인.
- `browser-verifier`: [`$agent-browser`](../../.agents/skills/agent-browser/SKILL.md) 기반 실제 브라우저 사용자 플로우 검증.
- `reviewer`: 회귀/보안/성능 관점 리뷰, 리스크 목록화.
- 리드 에이전트는 위 5개 산출물을 합쳐 최종 보고를 작성한다.

## 11-1) browser-verifier 활성화 기준

- `src/app/**` 페이지/레이아웃/라우트 동작 변경
- `src/components/**`의 상호작용 UI 변경(폼, 필터, 정렬, 모달, 네비게이션)
- UI가 의존하는 API 응답 형식/검증 규칙 변경
- 하이드레이션, localStorage, CSR/RSC 경계 이슈 수정
- 버그 리포트가 "브라우저에서만 재현"되는 경우

## 이 저장소에서의 최소 실행 루틴

1. `npm run specs:new -- ...` 또는 기존 feature 문서 갱신
2. `spec.md`, `plan.md`, `tasks.md`, `test-matrix.md` 동기화
3. 코드 작업
4. `npm run specs:check && npm run specs:validate`
5. `npm run verify` (필요 시 `npm run build`)
6. 트리거 충족 시 `browser-verifier`로 실제 브라우저 플로우 검증
7. 기본은 `npm run prompt:guard`로 프롬프트 거버넌스 점검 (영향이 큰 변경/PR 최종 게이트는 `npm run prompt:quality` 또는 `npm run prompt:all`)
8. 필요 시 subagent 팀으로 병렬 검토를 수행하고, 리드가 결과를 통합해 최종 판단

## 출처

- OpenAI Codex Guide: [Building an AI-Native Engineering Team](https://developers.openai.com/codex/guides/build-ai-native-engineering-team/)
- OpenAI Codex Docs: [Workflows](https://developers.openai.com/codex/workflows)
- OpenAI Codex Docs: [CLI Slash Commands (`/fork`, `/review`)](https://developers.openai.com/codex/cli/slash-commands)
- OpenAI Codex Docs: [App Features](https://developers.openai.com/codex/app/features)
- OpenAI Codex Docs: [Worktrees](https://developers.openai.com/codex/app/worktrees)
- OpenAI Codex Docs: [App Server (`thread/fork`, `review/start`, `sourceKinds`)](https://developers.openai.com/codex/app-server)
- OpenAI Codex Docs: [Rules (`prefix_rule`)](https://developers.openai.com/codex/rules)
- Claude Code Docs: [Create custom subagents](https://code.claude.com/docs/en/sub-agents)
- Claude Code Docs: [Using agent teams](https://code.claude.com/docs/en/agent-teams)
- Cursor Docs: [Subagents](https://cursor.com/docs/context/subagents)
- 저장소 내부 기준: `AGENTS.md`
- 저장소 내부 기준: `docs/agent/runbook.md`
- 저장소 내부 기준: `docs/agent/dod.md`
- 저장소 내부 기준: `docs/engineering/testing.md`
- 저장소 내부 기준: `docs/engineering/prompt-governance.md`

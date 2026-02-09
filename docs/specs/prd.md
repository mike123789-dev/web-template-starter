# PRD: AI Agent-Ready Web Template Starter

## 1. Problem

팀이 기능을 빠르게 추가할 때, 요구사항-구현-테스트 추적이 약하면 회귀가 쉽게 발생한다.

## 2. Product Goal

Next.js 템플릿 프로젝트에서 기능 추가 시에도 테스트 안정성을 유지하는 spec-driven 개발 기반을 제공한다.

## 3. Users

- 템플릿을 사용하는 개발자
- AI 에이전트(문서 기반으로 구현/검증 수행)
- 코드 리뷰어

## 4. Success Metrics

- M1: 기능 작업의 100%가 PRD 요구사항 ID를 참조한다.
- M2: 기능 폴더의 Acceptance Criteria 100%가 test-matrix에 매핑된다.
- M3: 기능 완료 시 필수 게이트(`verify`, 필요 시 `build`) 누락률 0%.

## 5. Functional Requirements

- `FR-001`: 모든 신규 기능은 feature 폴더(`docs/specs/features/F-xxx-*`)를 생성해야 한다.
- `FR-002`: 각 기능은 `spec.md`, `plan.md`, `tasks.md`, `test-matrix.md`를 갖춰야 한다.
- `FR-003`: 각 task는 최소 1개 PRD requirement ID를 명시해야 한다.
- `FR-004`: 각 task는 실행 테스트 명령을 명시해야 한다.
- `FR-005`: 모든 acceptance criteria는 테스트 항목에 매핑되어야 한다.
- `FR-006`: 기능 상태는 `Draft -> Ready -> In Progress -> Verifying -> Done`으로 관리한다.

## 6. Non-Functional Requirements

- `NFR-001`: 문서만으로도 제3자(리뷰어/에이전트)가 구현 의도와 검증 방법을 이해할 수 있어야 한다.
- `NFR-002`: 필수 테스트 게이트는 10분 내 실행 가능한 기본 명령을 포함해야 한다.
- `NFR-003`: 문서 체계는 기존 저장소 구조(`docs/agent`, `docs/engineering`)와 충돌하지 않아야 한다.

## 7. Out of Scope

- CI/CD 파이프라인 자동화 구성
- GitHub Projects/Issues 자동 생성
- 배포 인프라 변경

## 8. Release Slices

1. `R1`: 문서 구조 및 템플릿 정착
2. `R2`: 핵심 기능 2개에 초기 spec 세팅
3. `R3`: 운영 중 피드백 반영 및 규칙 고도화

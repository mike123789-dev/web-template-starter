---
doc_type: "plan"
title: "<Feature Title>"
feature_id: "F-xxx"
status: "Draft"
linked_prd_ids:
  - "FR-xxx"
  - "NFR-xxx"
last_updated: "YYYY-MM-DD"
---

# Plan: <Feature Title>

## Technical Approach

- <주요 구현 방향>
- <핵심 컴포넌트/모듈>

## Affected Files

- `<path/to/file>`
- `<path/to/file>`

## Data/API Impact

- <데이터 구조 변경 여부>
- <API 입력/출력 영향>

## Constraints

- <성능/호환성/의존성 제약>

## Risks and Mitigations

1. Risk: <리스크>
   Mitigation: <대응 방안>
2. Risk: <리스크>
   Mitigation: <대응 방안>

## Validation Strategy

- Minimum gate: `npm run verify`
- Additional gate (if needed): `npm run test:e2e`, `npm run build`

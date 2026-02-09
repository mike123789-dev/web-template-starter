# Test Matrix: <Feature Title>

## Meta

- Feature ID: `F-xxx`
- Status: `Draft`
- Last Updated: `YYYY-MM-DD`

## Requirement to Test Mapping

| PRD ID | AC ID | Test Type | Test Command | Test Location | Status |
| --- | --- | --- | --- | --- | --- |
| FR-xxx | AC-001 | Unit | `npm run test:unit` | `src/**/**.test.ts` | Planned |
| FR-xxx | AC-002 | Storybook | `npm run test:storybook` | `src/**/**.stories.tsx` | Planned |
| NFR-xxx | AC-003 | Build | `npm run build` | N/A | Planned |

## Coverage Check

- [ ] 모든 AC가 최소 1개 테스트에 매핑됐다.
- [ ] 필수 게이트(`verify`)가 포함됐다.
- [ ] 변경 영향이 라우트/API면 `build`가 포함됐다.

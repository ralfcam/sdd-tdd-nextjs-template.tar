# Validation: [Feature Name]

## Definition of Done
All items below must be checked before this feature is merged to main.

## Acceptance scenarios

Leave the **Linear** column blank when Linear MCP is not configured. When using Linear, store the issue identifier (e.g. `LIN-123`) for the scenario or parent epic.

| ID | Scenario | Test file | Linear | Status |
|---|---|---|---|---|
| R1-happy | [scenario description] | `tests/e2e/[feature].spec.ts` | | TODO |
| R1-failure | [scenario description] | `tests/unit/[module].test.ts` | | TODO |
| R2-happy | [scenario description] | | | TODO |

Status values: `TODO` → `IN_PROGRESS` → `PASSED` → `FAILED`

## Quality gates
- [ ] All acceptance scenarios: PASSED
- [ ] TypeScript: zero errors (`npm run type-check`)
- [ ] Lint: zero warnings (`npm run lint`)
- [ ] Unit + integration coverage ≥ 80% on new code
- [ ] E2E tests pass on chromium and Mobile Safari
- [ ] Non-functional requirements tested (security, auth, validation, error handling)
- [ ] CHANGELOG.md updated
- [ ] No `console.log` in production code
- [ ] No `any` types introduced

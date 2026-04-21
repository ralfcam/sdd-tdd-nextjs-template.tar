# Validation: User Registration

## Definition of Done

Implementation covers `plan.md` / `requirements.md`; every row below is PASSED after `npm run validate` exits 0.

## Acceptance scenarios

Leave **Linear** blank unless this repo uses Linear MCP (see `.cursor/mcp.json.example`).

| ID | Scenario | Test file | Linear | Status |
|---|---|---|---|---|
| R1-happy | Valid form → user created → redirect to /dashboard | `tests/e2e/auth/register.spec.ts` | | PASSED |
| R1-duplicate | Duplicate email → inline error message | `tests/e2e/auth/register.spec.ts`; `tests/integration/api/register.test.ts` | | PASSED |
| R2-invalid-email | Invalid email format → field-level error | `tests/unit/lib/auth/validate-registration.test.ts`; `tests/e2e/auth/register.spec.ts` | | PASSED |
| R2-weak-password | Short password → field-level error | `tests/unit/lib/auth/validate-registration.test.ts`; `tests/e2e/auth/register.spec.ts` | | PASSED |
| NFR-security | Password is hashed, never plaintext | `tests/unit/lib/auth/register.test.ts`; `tests/integration/api/register.test.ts` | | PASSED |
| NFR-auth | Session cookie is httpOnly | `tests/integration/api/register.test.ts` | | PASSED |

## Quality gates
- [x] All acceptance scenarios: PASSED
- [x] TypeScript: zero errors (`npm run validate`)
- [x] Lint: zero warnings
- [x] Unit + integration coverage ≥ 80% on new code (`npm run test:coverage`)
- [x] E2E tests pass on chromium and Mobile Safari (`npm run validate`)
- [x] CHANGELOG.md updated
- [x] No `console.log` in production code
- [x] No `any` types

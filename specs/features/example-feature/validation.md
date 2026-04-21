# Validation: User Registration

## Definition of Done

**Scaffold state:** E2E tests in `tests/e2e/auth/register.spec.ts` use `test.fixme` and integration tests use `it.todo` until implementation exists per `skills/tdd-cycle.md` Step 2. `npm run validate` stays green; remove `fixme` / implement `todo` as you drive the feature.

## Acceptance scenarios

Leave **Linear** blank unless this repo uses Linear MCP (see `.cursor/mcp.json.example`).

| ID | Scenario | Test file | Linear | Status |
|---|---|---|---|---|
| R1-happy | Valid form → user created → redirect to /dashboard | `tests/e2e/auth/register.spec.ts` | | TODO |
| R1-duplicate | Duplicate email → inline error message | `tests/integration/api/register.test.ts` | | TODO |
| R2-invalid-email | Invalid email format → field-level error | `tests/unit/lib/auth/validate-registration.test.ts` | | TODO |
| R2-weak-password | Short password → field-level error | `tests/unit/lib/auth/validate-registration.test.ts` | | TODO |
| NFR-security | Password is hashed, never plaintext | `tests/unit/lib/auth/register.test.ts` | | TODO |
| NFR-auth | Session cookie is httpOnly | `tests/integration/api/register.test.ts` | | TODO |

## Quality gates
- [ ] All acceptance scenarios: PASSED
- [ ] TypeScript: zero errors
- [ ] Lint: zero warnings
- [ ] Unit + integration coverage ≥ 80% on new code
- [ ] E2E tests pass on chromium and Mobile Safari
- [ ] CHANGELOG.md updated
- [ ] No `console.log` in production code
- [ ] No `any` types

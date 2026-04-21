# Requirements: User Registration

## Acceptance Scenarios

---

### R1: Valid registration creates a user and redirects to dashboard

**Behavior:** When a user submits a valid email and password, the system creates a user record and starts a session.

**Acceptance scenario — happy path:**
- Given: no account exists for `alice@example.com`
- When: the user submits the form with `alice@example.com` and a password of 12+ characters
- Then: the user is redirected to `/dashboard` with an active session

**Acceptance scenario — duplicate email:**
- Given: an account already exists for `alice@example.com`
- When: the user submits the form with the same email
- Then: the form shows "An account with this email already exists"

**Test targets:**
- Unit: `tests/unit/lib/auth/register.test.ts` — pure registration logic
- Integration: `tests/integration/api/register.test.ts` — POST /api/auth/register
- E2E: `tests/e2e/auth/register.spec.ts` — full form flow

---

### R2: Invalid input is rejected with structured errors

**Behavior:** Malformed input returns HTTP 400 with field-level error messages.

**Acceptance scenario — invalid email:**
- Given: the registration form is open
- When: the user submits `not-an-email` as the email
- Then: the form shows "Enter a valid email address" next to the email field

**Acceptance scenario — weak password:**
- Given: the registration form is open
- When: the user submits a password shorter than 12 characters
- Then: the form shows "Password must be at least 12 characters"

**Test targets:**
- Unit: `tests/unit/lib/auth/validate-registration.test.ts`
- Integration: `tests/integration/api/register.test.ts`

---

## Non-functional requirements for this feature
- [ ] Security: password hashed with bcrypt (cost factor ≥ 12); never stored in plaintext
- [ ] Auth: session created server-side; session token is httpOnly cookie
- [ ] Input validation: Zod schema at the API boundary; never trust client-side only
- [ ] Error handling: 500 errors return `{ error: "Internal server error", correlationId }` — no stack traces
- [ ] Performance: registration API responds in < 500ms at P95

# Non-Functional Requirements

These apply to every feature. They are not optional. Each must be tested.

## Security
- No user-supplied data rendered unescaped (XSS).
- No secrets in source code or committed environment files.
- Dependencies audited on every CI run (`npm audit --audit-level=high`).

## Authentication & Authorization
- All non-public routes require a valid session.
- Authorization checks happen server-side, never only on the client.
- Least-privilege principle: users access only their own data.

## Input Validation
- All user input validated at the API boundary (server-side).
- Invalid input returns HTTP 400 with a structured error body.
- Validation rules are co-located with their schema (e.g., Zod schemas next to route handlers).

## Error Handling
- Errors are caught at every async boundary.
- User-facing errors show a helpful message, never a raw stack trace.
- Unexpected errors are logged with a correlation ID.

## Performance
- LCP < 2.5s on a simulated 4G connection.
- No blocking scripts in `<head>`.
- Images use `loading="lazy"` and explicit `width`/`height`.

## Scalability
- Stateless API handlers — no in-memory state between requests.
- When a database is in use, queries use indexes on filtered/sorted columns.

## Database (when applicable)

When this project adds a database (see `tech-stack.md`), the following apply:

- Row-level security and least-privilege access are enforced at the database level, not only in application code.
- Database columns have `NOT NULL` constraints wherever nullable is not intentional.
- Migrations are idempotent and reversible.

## Linear + MCP (when applicable)

When this project uses the Linear MCP integration (see `.cursor/mcp.json.example` and `skills/linear-sync.md`), the following apply:

- Every feature has a corresponding Linear issue; the issue description embeds the scenario IDs from `validation.md`.
- Sub-issues, when used, map 1:1 to rows in `validation.md`.
- Agents may READ Linear issues freely via MCP.
- Agents may WRITE only to: update issue state, post a comment with test-run output, or create an issue when explicitly instructed (or after spec approval when tracking is agreed).
- Agents MUST NOT set an issue to Done unless `npm run validate` (or the file-scoped test command agreed for the change) exited 0 in the same session immediately before that update.

## Data Quality
- Test fixtures cover edge cases: empty collections, null fields, maximum-length strings.
- **Coverage thresholds** (e.g. 80% in Jest) are a **hygiene** metric, not proof of correctness: they catch obviously untested code, not specification completeness. The contract is the 1:1 mapping between scenarios in each feature's `validation.md` and automated tests.

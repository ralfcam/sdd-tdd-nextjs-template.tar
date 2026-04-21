# Tech Stack

## Approved stack

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 15.x | App Router, TypeScript strict |
| Language | TypeScript | 5.x | strict: true, no any |
| Password hashing | bcryptjs | — | Required by constitution security rules for credentials; pure JS implementation suitable for tests and Node routes |
| API validation | Zod | — | Schema validation at HTTP boundaries (`specs/constitution/non-functionals.md`) |
| Styling | Tailwind CSS | 4.x | `@tailwindcss/postcss` + PostCSS; `@import "tailwindcss"` in global CSS |
| Unit/Integration tests | Jest + Testing Library | 29.x / 16.x | jsdom; `jest.config.ts` via `ts-node` |
| E2E tests | Playwright | 1.44.x | chromium + mobile Safari |
| Linting | ESLint | 9.x | `eslint .` (next/core-web-vitals + typescript); ignores `.next/`, `coverage/`, etc. |

## Optional integrations

| Integration | Notes |
|---|---|
| Linear via MCP | Hosted server `https://mcp.linear.app/mcp`; opt-in by copying `.cursor/mcp.json.example` → `.cursor/mcp.json` and authorizing OAuth in Cursor. Does not affect `npm run validate` when unset. See `skills/linear-sync.md`. |

## Dependency rules
- New runtime dependencies require a justification comment in this file.
- Dev-only tools are acceptable without approval, but must be listed.
- Do not add a library that duplicates an already-approved one.

## Configuration invariants
- TypeScript strict mode is always on.
- ESLint must pass with zero warnings.
- `noUncheckedIndexedAccess` is on — handle potential undefined from array access.

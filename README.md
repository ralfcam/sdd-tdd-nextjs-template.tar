# My App

Spec-Driven + Test-Driven Development template for Next.js in Cursor. AI agents should also read [AGENTS.md](AGENTS.md) (constitution-first workflow and validate gate).

## Prerequisites

- **Node.js 20+** (see `.nvmrc`)
- **Cursor** with `.cursor/rules/` (workflow, specs, testing, optional Linear sync)
- Other AI tools can follow [AGENTS.md](AGENTS.md) instead of Cursor rules

## Quick start

```bash
npm install
npx playwright install --with-deps
npm run dev
```

Common scripts:

| Command | What it runs |
|--------|----------------|
| `npm test` | Jest (unit + integration) |
| `npm run test:coverage` | Jest with coverage thresholds |
| `npm run test:e2e` | Playwright |
| `npm run validate` | type-check → lint → test → e2e (merge gate) |

Lint uses the ESLint CLI (`eslint .`) for compatibility with Next.js 16+ (replacing deprecated `next lint`). To migrate an older app: `npx @next/codemod@canary next-lint-to-eslint-cli .`

Copy [`.env.example`](.env.example) to `.env.local` when you add secrets or local config (never commit real secrets).

## How this repo is organized

```
AGENTS.md                 ← Agent instructions (portable across tools)
specs/
  constitution/           ← Read before code: mission, tech-stack, roadmap, non-functionals
  features/
    _template/            ← Feature spec scaffold (or `npm run feature:new`)
    user-management/        ← Example: User Registration (SDD-TDD baseline)
skills/
  feature-spec.md         ← Write plan / requirements / validation
  tdd-cycle.md            ← Red → green → refactor
  changelog.md            ← Keep a Changelog updates
  linear-sync.md          ← Optional: Linear MCP (after .cursor/mcp.json exists)
.cursor/
  rules/                  ← Cursor: workflow.mdc, specs.mdc, testing.mdc, linear-sync.mdc
  mcp.json.example        ← Copy to mcp.json to opt into Linear (mcp.json is gitignored)
src/                      ← Next.js app
tests/
  unit/
  integration/
  e2e/                    ← Playwright; map scenarios to specs/features/*/validation.md
```

## The delivery loop

Every change follows this sequence:

1. **Read the spec** — `specs/constitution/` and `specs/features/<feature>/`
2. **Failing test** — RED
3. **Minimal implementation** — GREEN
4. **Refactor** — under green
5. **`validation.md`** — mark scenarios PASSED
6. **`CHANGELOG.md`**
7. **`npm run validate`** — must pass before PR

## Starting a new feature

```bash
npm run feature:new -- my-feature
```

Then edit `specs/features/my-feature/` (`plan.md`, `requirements.md`, `validation.md`). In Cursor, use `@skills/feature-spec.md` for the spec and `@skills/tdd-cycle.md` for implementation. If Linear MCP is enabled, use `@skills/linear-sync.md` after the spec is approved.

## Optional: Linear via MCP

The template is **fully usable without Linear**; CI and `npm run validate` do not call Linear.

1. From the repo root in **Windows CMD:** `copy .cursor\mcp.json.example .cursor\mcp.json`
2. Restart Cursor → **Settings → MCP** → authorize Linear (OAuth) for `https://mcp.linear.app/mcp`
3. Follow [skills/linear-sync.md](skills/linear-sync.md) when working on specs or tests; optional **Linear** column in each feature `validation.md` holds issue IDs (e.g. `LIN-123`). Details also live under **Linear + MCP (when applicable)** in `specs/constitution/non-functionals.md`.

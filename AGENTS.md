# AGENTS.md

Instructions for AI coding agents (Cursor, Claude Code, Copilot, etc.). Humans: see [README.md](README.md).

## Before any task: read the constitution

Before writing any code, read these in order:

1. `specs/constitution/mission.md`
2. `specs/constitution/tech-stack.md`
3. `specs/constitution/non-functionals.md`
4. `specs/constitution/roadmap.md`
5. The relevant `specs/features/<feature>/{plan,requirements,validation}.md`

These are inviolable. If a task conflicts with them, STOP and surface the conflict.

## Workflow (mandatory)

Spec-Driven + Test-Driven. The full loop lives in `.cursor/rules/workflow.mdc` and `skills/tdd-cycle.md`.

Summary: **red → green → refactor** → update `validation.md` → update `CHANGELOG.md` → `npm run validate`.

## Build, test, validate

- Install: `npm install` then `npx playwright install --with-deps`
- Dev: `npm run dev`
- **Single gate before merge:** `npm run validate` (type-check → lint → test → e2e)

## Code style hard rules

- TypeScript strict; no `any`, no `@ts-ignore` without justification.
- No `console.log` in production code.
- Tests live under `tests/{unit,integration,e2e}` per `.cursor/rules/testing.mdc`.

## Skills

- New feature spec: `@skills/feature-spec.md`
- TDD cycle: `@skills/tdd-cycle.md`
- Changelog: `@skills/changelog.md`
- Linear MCP (optional): `@skills/linear-sync.md` — only when `.cursor/mcp.json` exists (copy from `.cursor/mcp.json.example`)

## Optional integrations

**Linear via MCP** is opt-in. The template runs `npm run validate` without Linear. To enable: copy `.cursor/mcp.json.example` to `.cursor/mcp.json`, authorize Linear in Cursor (Settings → MCP), then use `skills/linear-sync.md` when working on `specs/**` or `tests/**`. The conditional rule `.cursor/rules/linear-sync.mdc` applies to those paths.

## New feature scaffold

```bash
npm run feature:new -- my-feature
```

Then fill `plan.md`, `requirements.md`, and `validation.md` under `specs/features/my-feature/`.

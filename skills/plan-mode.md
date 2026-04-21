---
description: Use Cursor Plan mode for the spec phase; hand off to Agent mode for TDD after human approval.
globs: ["specs/**/*.md", "AGENTS.md"]
---

# Skill: Cursor Plan mode (spec gate)

This repo separates **thinking** (spec) from **doing** (TDD). In **Cursor**, use **Plan mode** for the spec phase and **Agent mode** for tests and implementation. Plan mode is read-only at the tool layer: the agent can read the codebase and draft specs but cannot edit `src/**`, `tests/**`, run shell commands, or use write-path MCP tools until you switch modes.

Non-Cursor tools: follow the same **contract** — treat spec drafting as read-only until the human explicitly approves, then allow writes. See [AGENTS.md](../AGENTS.md) **Modes (Cursor)**.

## When to use Plan mode

- Starting or refining a **new feature** (`specs/features/<slug>/`).
- Large or ambiguous refactors that need a written plan before code.
- Any request that should produce **`plan.md` / `requirements.md` / `validation.md`** first.

## When to leave Plan mode (switch to Agent)

- The human has **approved** the plan (Cursor **Plan** UI approval, `cursor.createPlan` flow, or explicit chat: e.g. "approved, implement").
- The next step is to **write tests or production code** — then use **Agent mode** and `@skills/tdd-cycle.md`.

## Allowed in Plan mode

- Read any file under the repo.
- Use **read-only** MCP tools (e.g. search, docs) if configured.
- Edit **`specs/**`** only: draft or update `plan.md`, `requirements.md`, `validation.md` for the feature under discussion.
- Propose a short ordered list of **first Agent tasks** (e.g. "first failing test: `tests/unit/...` for R1-happy").

## Not allowed in Plan mode

- Edit **`src/**`** or **`tests/**`**.
- Run **terminal / shell** commands (`npm test`, `npm run validate`, etc.).
- Call **write** MCP tools (e.g. Linear **`save_issue`**, **`save_comment`** — those belong in Agent mode after approval; see `@skills/linear-sync.md`).

## Handoff checklist (before Agent mode)

1. **`validation.md`** exists for the feature with at least one acceptance scenario row (IDs aligned with `requirements.md`).
2. Human **approval** is explicit (UI or message).
3. The **first Agent task** is named (usually: write the next failing test for the smallest scenario).

## Anti-patterns

- Switching to **Agent** mid-spec to "just try something" — you lose the approval gate.
- Writing **code** in Plan mode to "clarify" the design — use `requirements.md` and scenarios instead.
- Using Plan mode **only** for Q&A without updating the three spec files — output must land in `specs/features/<slug>/`.
- **Linear writes** before approval — create/update issues only in Agent mode after the human approves the spec (if Linear is enabled).

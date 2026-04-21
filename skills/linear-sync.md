---
description: Sync feature work with Linear via MCP (read issues, write status and comments) when .cursor/mcp.json is configured.
globs: ["specs/**/*.md", "tests/**/*", ".cursor/mcp.json.example"]
---

# Skill: Linear MCP sync (optional)

Use this skill **only** when the project has opted into Linear MCP:

1. Copy `.cursor/mcp.json.example` to `.cursor/mcp.json` at the repo root (do not commit `.cursor/mcp.json`; it is gitignored).
2. In Cursor: **Settings → MCP** — authorize Linear (OAuth against `https://mcp.linear.app/mcp`).

If Linear is not available, **skip all steps below** — `npm run validate` and the SDD+TDD loop do not require Linear.

## Tool name reference (Linear MCP)

Use these tool names as exposed by the Linear MCP server (not generic placeholders):

| Intent | Tool |
|--------|------|
| List/search issues | `list_issues` |
| Fetch one issue | `get_issue` |
| Create or update issue | `save_issue` (omit `id` to create; include `id` or identifier e.g. `LIN-123` to update) |
| List workflow states (team-specific names) | `list_issue_statuses` |
| Add or update comment | `save_comment` (`issueId` + `body` required when creating) |
| Resolve team | `list_teams` / `get_team` |

## Start of feature (after spec review)

1. Read `specs/features/<feature>/validation.md` and note every scenario **ID** in the table.
2. **`list_issues`** with `query` matching the feature slug or title; filter by `team` if your workspace uses multiple teams.
3. If no matching epic/parent issue exists **and** the human asked to track in Linear (or constitution says so when Linear is enabled): **`save_issue`** without `id`, with `title` = feature slug, `team` = your team name/ID, `description` = markdown listing scenario IDs and links/paths to `plan.md` / `requirements.md` / `validation.md`.
4. Optionally create one child issue per scenario row (same IDs in title or description); record identifiers in the **`Linear`** column of `validation.md`.
5. **`get_issue`** on the parent (and children if any) to confirm current `state` before coding.

## During TDD (phase boundaries only)

Do **not** call Linear on every keystroke or every test file save.

1. **After a failing test is written and run (RED):** **`save_issue`** on the active issue: set `state` to an "In Progress" (or equivalent) status name your team uses — resolve names via **`list_issue_statuses`** if unsure.
2. **After implementation makes the new test pass (GREEN):** **`save_comment`** on the issue with `issueId` = identifier, `body` = short markdown: command run, pass/fail, key assertion.
3. **After refactor:** run tests again; if green, add a brief **`save_comment`** if there is something worth logging.

## Done and closing

1. Run **`npm run validate`** (or the narrowest command that proves the change, if the human agreed on a scoped gate).
2. **Only if the command exited 0:** **`save_issue`** with `id` = issue identifier and `state` = your team's **Done** (or **Completed**) state name.
3. **`save_comment`** with final summary: validate output snippet, PR link if any, and list of scenario IDs moved to PASSED in `validation.md`.

**Hard rule:** Never set **`state`** to Done/Completed unless a green validate (or agreed file-scoped equivalent) **just succeeded in this session**.

## Anti-patterns

- Marking Done while tests are failing or validate was not run.
- Duplicating full `validation.md` into Linear on every edit — prefer stable scenario IDs + short comments.
- Creating issues before the human approves the spec.
- Using tool names from blog posts (`linear_get_assigned_issues`, etc.) — use the table above.

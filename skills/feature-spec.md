---
description: Write a feature spec (plan, requirements, validation) from the constitution and _template.
globs: ["specs/features/**/*.md", "specs/constitution/**/*.md"]
---

# Skill: Write a Feature Spec

When asked to write a feature spec for a feature named [FEATURE], follow these steps:

0. **Cursor: use Plan mode.** Switch to **Plan mode** (mode switcher or **Ctrl+.** → **Plan**) before drafting any spec file. Stay in Plan mode through steps 1–6. Only after the human approves the plan should you switch to **Agent mode** and follow `@skills/tdd-cycle.md`. See `@skills/plan-mode.md`.

1. **Read the constitution first.**
   - Read `specs/constitution/mission.md`, `tech-stack.md`, `roadmap.md`, and `non-functionals.md`.
   - Confirm the feature is in scope and on the roadmap. If not, flag it before proceeding.

2. **Create the spec directory.**
   ```
   specs/features/<feature-name>/
   ```
   Or run `npm run feature:new -- <feature-name>` to copy `_template`.

3. **Write plan.md.**
   - State the phase, goal, motivation, in-scope items, out-of-scope items, and estimated complexity.
   - The goal must be one sentence describing a user outcome, not a technical task.

4. **Write requirements.md.**
   - Number every requirement (R1, R2...).
   - For each requirement, write at least one happy-path and one failure-case acceptance scenario in Given/When/Then format.
   - For each requirement, list the test files that will verify it.
   - Add a non-functional requirements section using `non-functionals.md` as the checklist.

5. **Write validation.md.**
   - Create the acceptance scenario table with all scenarios from requirements.md, set to TODO.
   - Include all quality gates from the template.

6. **Do NOT write any code yet.** The spec must be reviewed before implementation begins.

7. **Linear MCP (optional).** After human approval, in **Agent mode** (not Plan mode): if the project has configured Linear (`.cursor/mcp.json` from `.cursor/mcp.json.example`) and tracking is agreed, follow `skills/linear-sync.md` — mirror the feature into Linear, list scenario IDs in the issue description, and fill the **Linear** column in `validation.md`. If Linear is not configured, skip this step.

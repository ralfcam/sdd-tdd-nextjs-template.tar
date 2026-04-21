---
description: Step-by-step TDD red/green/refactor loop tied to feature specs and validation.md.
globs: ["tests/**/*.ts", "tests/**/*.tsx", "src/**/*.ts", "src/**/*.tsx"]
---

# Skill: TDD Cycle

When implementing a requirement from a feature spec, follow this exact sequence:

## Step 1 — Identify the next failing test
Read `specs/features/<feature>/requirements.md`.
Pick the next requirement that has no passing tests. Start with the simplest.

## Step 2 — Write a failing test
Write a test that describes the behavior stated in the acceptance scenario.
Run it. Confirm it is RED (failing). If it passes without implementation, the test is too weak — re-derive it from the requirement, not from what is convenient to verify.
Tests must assert behavior described in `requirements.md`, not implementation details. If you find yourself asserting internal helpers or call counts, stop and re-read the requirement.

## Step 3 — Write minimal implementation
Write only enough production code to make the failing test pass.
Do not add code for requirements that don't yet have tests.

## Step 4 — Run unit and integration tests
`npm run test` (Jest: unit + integration only; does not run Playwright).
All previously passing tests must still pass. If any are now failing, fix regressions before continuing.

## Step 5 — Refactor
Improve naming, reduce duplication, and improve structure while tests remain green.
Refactor is not optional: if you can name duplication, a long function, or a poor name, fix it now under green. Do not move to Step 6 with `// TODO: clean up`.
Run `npm run test` again after refactoring.

## Step 6 — Update validation.md
Change the scenario's status from TODO → IN_PROGRESS → PASSED.

## Step 7 — Repeat
Go back to Step 1 for the next requirement.

## Step 8 — Full validation pass
When all requirements are PASSED, run `npm run validate` (includes E2E).
Only then update the changelog and open a PR.

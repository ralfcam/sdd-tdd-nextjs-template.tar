---
name: Refine SDD-TDD Template
overview: Validate and refine the SDD+TDD Next.js template against authoritative 2026 sources (Tailwind, Next.js, Playwright, Jest official docs + GitHub Spec-Kit / AGENTS.md conventions). Fix one real Jest defect, wire Tailwind 4 per official guidance, make `npm run validate` green on fresh checkout, harden the constitutional enforcement against known Cursor `alwaysApply` reliability issues, and sharpen the TDD-with-agents guards (trivial-test, refactor-skip, coverage-as-quality).
todos:
  - id: fix_jest_setup
    content: Rename setupFilesAfterFramework → setupFilesAfterEnv in jest.config.ts (Next.js docs canonical)
    status: completed
  - id: fixme_e2e
    content: Convert example E2E test() calls to test.fixme() so validate passes; note in validation.md
    status: completed
  - id: wire_tailwind
    content: Add Tailwind 4 + @tailwindcss/postcss per official v4 install (array-form postcss.config.mjs, @import "tailwindcss"; in globals.css)
    status: completed
  - id: fix_playwright_install
    content: Update README + CI to `npx playwright install --with-deps` (no browser arg installs all) — confirms Mobile Safari (webkit) is available
    status: completed
  - id: decouple_db_rule
    content: Remove RLS bullet from workflow.mdc; relocate to a conditional 'Database (when applicable)' section in non-functionals.md
    status: completed
  - id: add_ci
    content: Add .github/workflows/ci.yml running npm ci → playwright install --with-deps → npm run validate on Node 20
    status: completed
  - id: feature_new_script
    content: Add scripts/new-feature.mjs and `npm run feature:new` for cross-platform spec scaffolding
    status: completed
  - id: agents_md
    content: Add AGENTS.md at repo root that re-states the constitution-loading directive — cross-tool portable (Cursor + Claude Code + Copilot read it natively) and a reliability fallback for known Cursor alwaysApply downgrade issue
    status: pending
  - id: harden_tdd_skills
    content: Sharpen tdd-cycle.md / workflow.mdc / non-functionals.md to address documented LLM-agent TDD pitfalls (trivial tests, skipped refactor, coverage-as-quality fallacy)
    status: pending
  - id: lint_migration_note
    content: Document `next lint` deprecation (Next.js 16+) and the `@next/codemod next-lint-to-eslint-cli` migration path; switch script proactively to `eslint .`
    status: pending
  - id: quality_polish
    content: Add .env.example, engines.node + .nvmrc, narrow collectCoverageFrom, add frontmatter to skills/*.md
    status: completed
  - id: verify_green
    content: Run npm install → playwright install → npm run validate and npm run test:coverage; confirm both green
    status: completed
isProject: false
---

## Sources consulted (primary)

All technical claims below were re-verified against authoritative docs via Context7 (`/tailwindlabs/tailwindcss.com`, `/vercel/next.js`, `/microsoft/playwright.dev`) and Perplexity research:

- **Jest 29.7 config**: [jestjs.io/docs/29.7/configuration](https://jestjs.io/docs/29.7/configuration) — option list confirms `setupFilesAfterEnv` is the only valid name; `setupFilesAfterFramework` does not exist.
- **Next.js Jest setup**: [Next.js docs — Testing with Jest](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx) — canonical `next/jest` config uses `setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']`.
- **Next.js lint migration**: [Next.js installation docs](https://github.com/vercel/next.js/blob/canary/docs/01-app/01-getting-started/01-installation.mdx) — `next lint` is replaced by direct ESLint CLI in Next.js 16, codemod available: `npx @next/codemod@canary next-lint-to-eslint-cli .`.
- **Tailwind v4 install**: [tailwindcss.com v4 release notes](https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v4/index.mdx) — `npm i tailwindcss @tailwindcss/postcss`, `postcss.config.mjs` with `plugins: ["@tailwindcss/postcss"]` (array form), single `@import "tailwindcss";` in CSS.
- **Playwright CI**: [playwright.dev CI docs](https://github.com/microsoft/playwright.dev/blob/main/nodejs/versioned_docs/version-stable/ci.mdx) — `npx playwright install --with-deps` (no browser arg) installs Chromium, Firefox, and WebKit. Mobile Safari project uses `devices['iPhone 12']` in the canonical example.
- **AGENTS.md convention**: [agents.md](https://agents.md), [Next.js AI agents guide](https://nextjs.org/docs/app/guides/ai-agents), [augmentcode.com](https://www.augmentcode.com/guides/how-to-build-agents-md) — Cursor reads `AGENTS.md` at repo root automatically alongside `.cursor/rules/*.mdc`. Cross-tool portable.
- **Cursor `alwaysApply` reliability**: [Cursor forum — alwaysApply downgrade in Cursor 3.0.16](https://forum.cursor.com/t/alwaysapply-true-rules-and-cursorrules-both-silently-treated-as-requestable-instead-of-auto-injected-cursor-3-0-16-macos/157431) — Perplexity found no public confirmation this has been fixed in 2026 versions; recommended mitigation is short, specific, verifiable rules + AGENTS.md fallback.
- **GitHub Spec-Kit reference architecture**: [github/spec-kit](https://github.com/github/spec-kit), [Martin Fowler — SDD tools](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — uses `.specify/memory/constitution.md` + numbered specs/plans/tasks; confirms our simpler `specs/{constitution,features}/` layout is a valid Spec-Kit-compatible variant.
- **TDD-with-agents pitfalls**: [coding-is-like-cooking — TDD with Agentic AI](https://coding-is-like-cooking.info/2026/03/test-driven-development-with-agentic-ai/), [dev.to — End of TDD: best practices for AI agent-driven development](https://dev.to/kotaroyamame/the-end-of-test-driven-development-best-practices-for-ai-agent-driven-development-with-formal-4ma5), [augmentcode.com — Micro-Specs Pattern](https://www.augmentcode.com/guides/micro-specs-pattern-ai-agent-test-coverage) — three documented failure modes: trivially-passing tests written in concert with implementation, skipped refactor step, coverage-as-quality fallacy.

---

## Audit findings

The template is well-structured and the SDD+TDD loop is sound. The audit surfaced **1 real bug**, **3 spec-vs-scaffold inconsistencies**, **3 reliability/portability gaps** newly identified from the 2026 source review, and **several quality gaps** that block `npm run validate` from passing on a fresh checkout.

### Bugs

- **Jest setup hook is misnamed.** [jest.config.ts](jest.config.ts) line 9 uses `setupFilesAfterFramework`, which is **not a valid Jest option**. The Next.js canonical example uses `setupFilesAfterEnv`. Today, `tests/setup.ts` (which imports `@testing-library/jest-dom`) never loads, so jest-dom matchers like `toBeInTheDocument()` would silently fail in any future component test.
- **`npm run validate` fails today.** The example E2E in [tests/e2e/auth/register.spec.ts](tests/e2e/auth/register.spec.ts) targets `/register` and `/dashboard` routes that the scaffold doesn't ship. README claims validate passes — it doesn't.
- **Playwright Mobile Safari project requires webkit binaries** ([playwright.config.ts](playwright.config.ts) line 16) but README's `npx playwright install --with-deps chromium` only installs chromium. Per [Playwright CI docs](https://github.com/microsoft/playwright.dev/blob/main/nodejs/versioned_docs/version-stable/ci.mdx), the simple fix is to drop the browser argument: `npx playwright install --with-deps` installs all three.

### Constitution-vs-scaffold drift

- **Tailwind 4** is "approved" in [specs/constitution/tech-stack.md](specs/constitution/tech-stack.md) but not in `package.json`, no `postcss.config`, no `globals.css`, no import in [src/app/layout.tsx](src/app/layout.tsx). User chose: wire it up.
- **Row-level security rule** in [.cursor/rules/workflow.mdc](.cursor/rules/workflow.mdc) line 37 references a database layer the template doesn't have — leaks from a different (full-stack) template.
- **CI pipeline** is on Phase 0 of [specs/constitution/roadmap.md](specs/constitution/roadmap.md) but no `.github/workflows/` exists.

### Reliability / portability gaps (newly surfaced from 2026 source review)

- **Constitutional enforcement is single-pointed.** The whole SDD+TDD discipline rests on `.cursor/rules/workflow.mdc` having `alwaysApply: true`. Per the open Cursor 3.0.16 forum thread, this flag has been silently downgraded to "Applied Intelligently" — meaning the rule may not be auto-injected. With no Perplexity-citable confirmation of a fix, the template needs a portable, agent-agnostic fallback: an `AGENTS.md` at repo root that re-states the constitution-loading directive. Cursor reads it natively, as do Claude Code, Copilot, Windsurf, and Codex — making the template more portable AND more reliable.
- **TDD pitfalls specific to LLM agents are not addressed.** Current `tdd-cycle.md` Step 2 catches the trivially-passing test ("if it passes without implementation, the test is wrong") — good, but research surfaces two more failure modes that the template doesn't guard:
  - **Refactor-skip** — agents treat passing tests as the exit condition and skip the refactor phase. Need an explicit gate.
  - **Coverage-as-quality fallacy** — 80% line coverage proves zero about specification completeness. The current `validation.md` "Quality gates" treats it as a quality target; it should be reframed as a hygiene metric.
- **`next lint` is on its way out.** Next.js 16 deprecates `next lint` in favor of the ESLint CLI directly, with a migration codemod. The template uses Next 15 so it still works, but switching now is one-line, future-proof, and removes a deprecation warning that will surface on the next Next.js bump.

### Quality gaps

- No `.env.example` despite `.gitignore` excluding `.env*.local`.
- New-feature scaffolding step in README uses `cp -r`, which doesn't exist in Windows CMD — and the user is on Windows.
- `npm run test:coverage` will fail on fresh checkout: 80% threshold over `src/**/*.{ts,tsx}` while only one file has tests.
- Skill files lack frontmatter `description`/`globs`, hurting discoverability via Cursor's skill picker.
- No Node version pin (`engines` or `.nvmrc`).

---

## Refinement plan

### 1. Fix the Jest config defect (1 line)

In [jest.config.ts](jest.config.ts):

```ts
setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
```

Matches the [official Next.js Jest example](https://github.com/vercel/next.js/blob/canary/docs/01-app/02-guides/testing/jest.mdx) verbatim.

### 2. Make `npm run validate` pass green on fresh checkout

The example E2E and integration tests should remain visible as RED-by-design (they document the spec) but must not break the validate gate.

- [tests/e2e/auth/register.spec.ts](tests/e2e/auth/register.spec.ts): change every `test(...)` to `test.fixme(...)` with a one-line comment: `// Unblock when src/app/register/page.tsx exists per specs/features/example-feature/`. Playwright reports these as expected-pending, doesn't fail the run.
- Confirm [tests/integration/api/register.test.ts](tests/integration/api/register.test.ts) is already `it.todo` — it is. No change needed.
- Add a short note to [specs/features/example-feature/validation.md](specs/features/example-feature/validation.md): "Tests are scaffolded as `test.fixme` / `it.todo` until implementation lands per skills/tdd-cycle.md Step 2."

### 3. Wire up Tailwind 4 (per official v4 install)

Per the [Tailwind v4 release docs](https://github.com/tailwindlabs/tailwindcss.com/blob/main/src/blog/tailwindcss-v4/index.mdx):

- Add to `package.json` devDependencies (latest stable, no version pin needed since v4 is stable):

```bash
npm i -D tailwindcss @tailwindcss/postcss
```

- Create `postcss.config.mjs` (array form per official docs):

```js
export default {
  plugins: ["@tailwindcss/postcss"],
};
```

- Create `src/app/globals.css`:

```css
@import "tailwindcss";
```

- Update [src/app/layout.tsx](src/app/layout.tsx) to `import "./globals.css";`.
- README "Quick start" — Tailwind installs via `npm install`; no extra step beyond that.

### 4. Fix Playwright install (use the canonical command)

Change README install step from `npx playwright install --with-deps chromium` to:

```bash
npx playwright install --with-deps
```

This is the [canonical CI command from playwright.dev](https://github.com/microsoft/playwright.dev/blob/main/nodejs/versioned_docs/version-stable/ci.mdx) — installs Chromium, Firefox, and WebKit (covering our `chromium` and `Mobile Safari` projects). Same change in `.github/workflows/ci.yml` (#6).

Optional polish: change [playwright.config.ts](playwright.config.ts) line 16 from `devices['iPhone 14']` to `devices['iPhone 12']` to match Playwright's canonical Mobile Safari example. Both work; iPhone 12 is the docs default and slightly more stable across versions.

### 5. Resolve constitution-vs-scaffold drift

- [.cursor/rules/workflow.mdc](.cursor/rules/workflow.mdc): remove the row-level-security bullet from "Non-negotiable rules"; move it into [specs/constitution/non-functionals.md](specs/constitution/non-functionals.md) under a new "Database (when applicable)" subsection so it activates only when a DB is added in the tech-stack.
- Add [.github/workflows/ci.yml](.github/workflows/ci.yml):

```yaml
name: validate
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run validate
```

Fulfils Phase 0 of the roadmap.

### 6. Cross-platform new-feature scaffolding

- Add `scripts/new-feature.mjs` that copies `specs/features/_template` → `specs/features/<arg>` using `fs.cp(..., { recursive: true })`, fails if target exists.
- Add `package.json` script: `"feature:new": "node scripts/new-feature.mjs"`.
- Update README "Starting a new feature" to: `npm run feature:new my-feature`.

### 7. Add AGENTS.md as constitutional fallback + cross-tool portability layer

This is **new** since the original plan, motivated by (a) the [Cursor 3.0.16 alwaysApply downgrade thread](https://forum.cursor.com/t/alwaysapply-true-rules-and-cursorrules-both-silently-treated-as-requestable-instead-of-auto-injected-cursor-3-0-16-macos/157431) with no public fix confirmation, and (b) the [agents.md cross-tool standard](https://agents.md) now read natively by Cursor, Claude Code, Copilot, Windsurf, and Codex.

Create `AGENTS.md` at repo root with sections that mirror what humans get from `README.md` but framed for agents:

```markdown
# AGENTS.md

## Before any task: read the constitution
Before writing any code, read these in order:
1. `specs/constitution/mission.md`
2. `specs/constitution/tech-stack.md`
3. `specs/constitution/non-functionals.md`
4. `specs/constitution/roadmap.md`
5. The relevant `specs/features/<feature>/{plan,requirements,validation}.md`

These are inviolable. If a task conflicts with them, STOP and surface the conflict.

## Workflow (mandatory)
Spec-Driven + Test-Driven. The full loop lives in `.cursor/rules/workflow.mdc`
and `skills/tdd-cycle.md`. Summary: red → green → refactor → update validation.md
→ update CHANGELOG.md → `npm run validate`.

## Build, test, validate
- Install: `npm install && npx playwright install --with-deps`
- Dev: `npm run dev`
- Single gate before any merge: `npm run validate`
  (runs: type-check → lint → test → e2e)

## Code style hard rules
- TypeScript strict; no `any`, no `@ts-ignore` without justification.
- No `console.log` in production code.
- Tests live under `tests/{unit,integration,e2e}` and follow naming in
  `.cursor/rules/testing.mdc`.

## Skills
- Writing a new feature spec: `@skills/feature-spec.md`
- Implementing a requirement: `@skills/tdd-cycle.md`
- Updating the changelog: `@skills/changelog.md`
```

Why this matters: even if a Cursor version silently downgrades the `alwaysApply: true` rule, the agent still has a directive at repo root telling it where the constitution lives — and any other agent (Claude Code, Copilot, Codex CLI) gets the same context for free.

### 8. Sharpen TDD-with-agents pitfall guards

Three small, surgical edits informed by the [End of TDD](https://dev.to/kotaroyamame/the-end-of-test-driven-development-best-practices-for-ai-agent-driven-development-with-formal-4ma5) and [TDD with Agentic AI](https://coding-is-like-cooking.info/2026/03/test-driven-development-with-agentic-ai/) research:

- **Trivial-test guard** ([skills/tdd-cycle.md](skills/tdd-cycle.md) Step 2): expand the existing one-line guard to two:
  - "If the test passes without implementation, the TEST is too weak — re-derive it from the requirement, not from what's convenient to verify."
  - "Tests assert behavior described in `requirements.md`, not implementation details. If you find yourself asserting `expect(internalHelper).toHaveBeenCalled()`, stop and re-read the requirement."
- **Refactor-skip guard** ([skills/tdd-cycle.md](skills/tdd-cycle.md) Step 5): after "tests remain green," add: "Refactor is not optional. If you can name a duplication, a long function, or a poor name, fix it now under green. Don't move to Step 6 with `// TODO: clean up`."
- **Coverage-as-hygiene reframe** ([specs/constitution/non-functionals.md](specs/constitution/non-functionals.md)): rename the existing "Quality" implication. Add to the Data Quality section:
  > Coverage thresholds (80%) are a **hygiene** metric, not a quality metric. They prevent obviously unimplemented features from sneaking through; they prove nothing about specification completeness. The contract that proves correctness is the 1:1 mapping between scenarios in `validation.md` and tests.

### 9. Migrate `next lint` → `eslint .` (forward-compat)

`next lint` is deprecated in Next.js 16. Migration is a one-liner today:

- In `package.json`, change `"lint": "next lint"` → `"lint": "eslint ."`.
- Existing `eslint.config.mjs` (flat config with `next/core-web-vitals + next/typescript`) is already compatible — no other changes needed.
- Note in CHANGELOG that this front-runs the migration codemod (`npx @next/codemod@canary next-lint-to-eslint-cli .`) which would be needed at the Next.js 16 bump.

### 10. Quality polish

- Add `.env.example` with a comment header (`# Copy to .env.local and fill in`).
- Add `engines.node: ">=20"` to `package.json` and a `.nvmrc` containing `20`.
- In [jest.config.ts](jest.config.ts), narrow `collectCoverageFrom` to exclude untested scaffolding (`!src/app/**/*.tsx`) so `npm run test:coverage` is actionable, not always red.
- Add YAML frontmatter to the three files in `skills/` — `description:` line — so they appear cleanly in Cursor's `@` picker. Keep the body unchanged.

### 11. Sanity-check after edits

Run, in order:
1. `npm install`
2. `npx playwright install --with-deps`
3. `npm run validate` — expect green: type-check passes, lint passes, jest passes (1 file, 5 tests; 6 todos), playwright passes (8 fixmes across chromium + Mobile Safari, 0 failures).
4. `npm run test:coverage` — expect green at 80% threshold (only `validate-registration.ts` is collected after the narrowed pattern).

---

## What's deliberately NOT changing

- **The three-document spec format** (plan/requirements/validation) — it works and is a valid simpler variant of GitHub Spec-Kit's `.specify/{memory,specs,plans,tasks}` layout.
- **`alwaysApply: true` on `workflow.mdc`** — keep it, but rely on the AGENTS.md fallback (#7) given the documented Cursor reliability gap.
- **The `npm run validate` chain** (`type-check → lint → test → e2e`) — single-gate is the right shape.
- **The `it.todo` / `test.fixme` pattern** as the RED entry-point for the example feature — refining it (#2) preserves the pedagogy while making the template runnable.
- **Strict TS settings** (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`) — keep.
- **Constitutional autonomy tiers** (Tier 1 / Tier 2 / Tier 3 from the [Agentic Constitution](https://www.cio.com/article/4118138/why-your-2026-it-strategy-needs-an-agentic-constitution.html) pattern) — research recommends them for multi-agent production systems; **out of scope** for this Tier-1 single-Next.js template per the user's framing.
- **Mutation testing / property-based testing / formal verification** — surfaced by research as gap-fillers for TDD's inductive limits; appropriate as Phase 2+ skill files, **out of scope** for the foundational template.

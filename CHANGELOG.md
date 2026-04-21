# Changelog

All notable changes to this project will be documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- Optional Linear MCP integration: `.cursor/mcp.json.example` (copy to gitignored `.cursor/mcp.json`), `.cursor/rules/linear-sync.mdc`, `skills/linear-sync.md`, constitution **Linear + MCP (when applicable)**, optional **Linear** column in feature `validation.md` templates
- Tailwind CSS v4 with `@tailwindcss/postcss`, `postcss.config.mjs`, and `src/app/globals.css`
- `AGENTS.md` for cross-tool agent instructions (constitution-first, validate gate)
- `scripts/new-feature.mjs` and `npm run feature:new` for cross-platform feature scaffolding
- GitHub Actions workflow `.github/workflows/ci.yml` (`npm ci`, Playwright install, `npm run validate`)
- `.env.example`, `.nvmrc`, and `engines.node` (>=20) in `package.json`
- `ts-node` devDependency so Jest can load `jest.config.ts`

### Changed

- Jest: `setupFilesAfterFramework` → `setupFilesAfterEnv` so `tests/setup.ts` / jest-dom load correctly
- Example E2E tests use `test.fixme` until `/register` and `/dashboard` exist; `validation.md` documents scaffold state
- Playwright Mobile Safari project uses `iPhone 12` device preset; README/CI use `npx playwright install --with-deps`
- Lint script: `next lint` → `eslint .` (forward-compatible with Next.js 16; codemod: `npx @next/codemod@canary next-lint-to-eslint-cli .`)
- `collectCoverageFrom` excludes `src/app/**/*.tsx` so `npm run test:coverage` is actionable on the scaffold
- Constitution: row-level security moved to `non-functionals.md` under **Database (when applicable)**; coverage framed as hygiene vs. spec completeness
- Cursor `workflow.mdc`: anti-patterns for weak tests and skipped refactor; skills include YAML frontmatter
- `next.config.ts`: `typedRoutes` at top level (replaces `experimental.typedRoutes` warning)
- `playwright.config.ts`: CI `workers` via conditional spread for `exactOptionalPropertyTypes`
- ESLint flat config: ignore `.next/`, `coverage/`, build artifacts, and `next-env.d.ts`
- `collectCoverageFrom`: exclude `src/types/**` so `npm run test:coverage` meets thresholds on scaffold

## [0.1.0] - 2025-04-15

### Added

- Project scaffold: Next.js 15, TypeScript strict, Jest, Playwright, ESLint
- SDD constitution: mission, tech-stack, roadmap, non-functionals
- TDD workflow: Cursor rules, skills (feature-spec, changelog, tdd-cycle)
- Example feature spec: User Registration (plan, requirements, validation)
- Example tests: unit (validate-registration), integration stub, E2E acceptance tests

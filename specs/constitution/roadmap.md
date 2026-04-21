# Roadmap

## Phase 0 — Foundation (current)
- [x] Project scaffold with strict TypeScript, ESLint, Jest, Playwright
- [x] CI pipeline: type-check → lint → test → e2e (`.github/workflows/ci.yml`)
- [x] Constitution and first feature spec written

## Phase 1 — MVP
- [x] Email + password registration (`specs/features/user-management/`), in-memory persistence for the template baseline

## Phase 2
<!-- Future phases -->

## Branching strategy
- `main` — production-ready; all tests and CI must pass before merge
- `feature/<name>` — one branch per feature spec; merged only after validation.md is complete

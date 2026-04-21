# Feature Plan: User Registration

## Phase
Phase 1 — MVP

## Goal
Allow a new user to create an account with email and password.

## Motivation
Without registration, no user-specific data can be stored or retrieved.

## Scope
### In scope
- Email + password registration form
- Server-side validation and error responses
- Redirect to dashboard on success

### Out of scope
- OAuth / social login (Phase 2)
- Email verification (Phase 2)

## Dependencies
- **Runtime storage:** MVP uses an in-memory user store (`src/lib/auth/memory-store.ts`) suitable for demos and automated tests — replace with a persisted database before production traffic.
- **Sessions:** Cookie-based sessions backed by an in-memory session registry in the template; persist sessions when a database exists.

## Estimated complexity
M

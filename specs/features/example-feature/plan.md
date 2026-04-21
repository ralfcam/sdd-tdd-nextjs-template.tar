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
- Database schema with a `users` table must exist
- Session management must be configured

## Estimated complexity
M

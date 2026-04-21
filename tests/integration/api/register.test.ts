/**
 * Integration tests for POST /api/auth/register
 * These tests exercise the full request/response cycle including DB interactions.
 *
 * Run against a test database: set DATABASE_URL in .env.test
 */

describe("POST /api/auth/register", () => {
  it.todo("should return 201 and set a session cookie when input is valid");
  it.todo("should return 409 when the email is already registered");
  it.todo("should return 400 with field errors when input is invalid");
  it.todo("should return 400 when password is too short");
  it.todo("should store the password as a bcrypt hash, never plaintext");
  it.todo("should set the session cookie with httpOnly flag");
});

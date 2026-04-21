import bcrypt from "bcryptjs";

import type { RegistrationInput, ValidationResult } from "./validate-registration";
import { validateRegistration } from "./validate-registration";
import type { UserRecord, UserStore } from "./user-store";

export type RegisterFailure =
  | { kind: "validation"; errors: NonNullable<ValidationResult["errors"]> }
  | { kind: "duplicate_email" };

export async function registerUser(
  input: RegistrationInput,
  store: UserStore,
): Promise<{ ok: true; user: UserRecord } | { ok: false; failure: RegisterFailure }> {
  const validated = validateRegistration(input);
  if (!validated.success && validated.errors) {
    return { ok: false, failure: { kind: "validation", errors: validated.errors } };
  }

  const existing = store.findByEmail(input.email);
  if (existing) {
    return { ok: false, failure: { kind: "duplicate_email" } };
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = store.create(input.email, passwordHash);
  return { ok: true, user };
}

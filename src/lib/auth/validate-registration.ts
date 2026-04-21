export interface RegistrationInput {
  email: string;
  password: string;
}

export interface ValidationResult {
  success: boolean;
  errors?: {
    email?: string;
    password?: string;
  };
}

/**
 * Validates registration input.
 * This is a pure function — no I/O, no side effects.
 * It is the unit-testable core of the registration workflow.
 */
export function validateRegistration(input: RegistrationInput): ValidationResult {
  const errors: ValidationResult["errors"] = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    errors.email = "Enter a valid email address";
  }

  if (input.password.length < 12) {
    errors.password = "Password must be at least 12 characters";
  }

  const hasErrors = Object.keys(errors).length > 0;
  return hasErrors ? { success: false, errors } : { success: true };
}

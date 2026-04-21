import { validateRegistration } from "@/lib/auth/validate-registration";

describe("validateRegistration", () => {
  describe("email validation", () => {
    it("should return an error when email is not a valid format", () => {
      const result = validateRegistration({ email: "not-an-email", password: "strongpassword123" });
      expect(result.success).toBe(false);
      expect(result.errors?.email).toBe("Enter a valid email address");
    });

    it("should return no email error when email is valid", () => {
      const result = validateRegistration({ email: "alice@example.com", password: "strongpassword123" });
      expect(result.errors?.email).toBeUndefined();
    });
  });

  describe("password validation", () => {
    it("should return an error when password is shorter than 12 characters", () => {
      const result = validateRegistration({ email: "alice@example.com", password: "short" });
      expect(result.success).toBe(false);
      expect(result.errors?.password).toBe("Password must be at least 12 characters");
    });

    it("should accept a password of exactly 12 characters", () => {
      const result = validateRegistration({ email: "alice@example.com", password: "exactly12chr" });
      expect(result.errors?.password).toBeUndefined();
    });
  });

  describe("valid input", () => {
    it("should return success when all fields are valid", () => {
      const result = validateRegistration({ email: "alice@example.com", password: "strongpassword123" });
      expect(result.success).toBe(true);
    });
  });
});

import { registerUser } from "@/lib/auth/register";
import { createMemoryUserStore } from "@/lib/auth/memory-store";

describe("registerUser", () => {
  it("stores a bcrypt hash, never the plaintext password", async () => {
    const store = createMemoryUserStore();
    const result = await registerUser(
      { email: "alice@example.com", password: "strongpassword123" },
      store,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.passwordHash).not.toBe("strongpassword123");
      expect(result.user.passwordHash.startsWith("$2")).toBe(true);
    }
  });

  it("returns duplicate_email when the email is already registered", async () => {
    const store = createMemoryUserStore();
    await registerUser({ email: "alice@example.com", password: "strongpassword123" }, store);
    const second = await registerUser(
      { email: "alice@example.com", password: "anotherpassword12" },
      store,
    );

    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.failure.kind).toBe("duplicate_email");
    }
  });

  it("returns validation errors for invalid input", async () => {
    const store = createMemoryUserStore();
    const result = await registerUser({ email: "not-an-email", password: "short" }, store);

    expect(result.ok).toBe(false);
    if (!result.ok && result.failure.kind === "validation") {
      expect(result.failure.errors.email).toBe("Enter a valid email address");
      expect(result.failure.errors.password).toBe("Password must be at least 12 characters");
    }
  });

  it("exposes findById for created users", async () => {
    const store = createMemoryUserStore();
    const result = await registerUser(
      { email: "findbyid@example.com", password: "strongpassword123" },
      store,
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(store.findById(result.user.id)?.email).toBe("findbyid@example.com");
    }
  });

  it("reset clears the in-memory store", async () => {
    const store = createMemoryUserStore();
    await registerUser({ email: "reset@example.com", password: "strongpassword123" }, store);
    store.reset();
    expect(store.findByEmail("reset@example.com")).toBeUndefined();
  });
});

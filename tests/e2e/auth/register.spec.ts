import { test, expect } from "@playwright/test";

/**
 * E2E acceptance tests for User Registration
 * Scenarios map 1:1 to specs/features/example-feature/requirements.md
 *
 * test.fixme: routes /register and /dashboard do not exist yet — unblock when
 * implementation lands per specs/features/example-feature/ (see tdd-cycle.md Step 2).
 */

test.describe("User Registration", () => {
  test.fixme("R1-happy: valid form → user created → redirected to /dashboard", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("Password").fill("strongpassword123");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page).toHaveURL("/dashboard");
  });

  test.fixme("R1-duplicate: duplicate email → inline error message", async ({ page }) => {
    // Pre-condition: alice@example.com already exists (set up in beforeEach)
    await page.goto("/register");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("Password").fill("strongpassword123");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText("An account with this email already exists")).toBeVisible();
  });

  test.fixme("R2-invalid-email: invalid email format → field-level error", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password").fill("strongpassword123");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test.fixme("R2-weak-password: short password → field-level error", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Email").fill("alice@example.com");
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText("Password must be at least 12 characters")).toBeVisible();
  });
});

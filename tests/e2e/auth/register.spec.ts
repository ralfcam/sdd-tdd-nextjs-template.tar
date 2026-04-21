import { expect, test } from "@playwright/test";

/**
 * E2E acceptance tests for User Registration.
 * Scenarios map 1:1 to specs/features/user-management/requirements.md
 */

function uniqueEmail(): string {
  return `e2e-${crypto.randomUUID()}@example.com`;
}

test.describe.serial("User Registration", () => {
  test("R1-happy: valid form → user created → redirected to /dashboard", async ({ page }) => {
    const email = uniqueEmail();
    await page.goto("/register");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("strongpassword123");
    await page.getByRole("button", { name: /register/i }).click();
    // Client handler awaits fetch before router.push; click() returns before navigation completes.
    await page.waitForURL(/\/dashboard$/);
  });

  test("R1-duplicate: duplicate email → inline error message", async ({ page }) => {
    const email = uniqueEmail();
    const seeded = await page.request.post("/api/auth/register", {
      data: { email, password: "strongpassword123" },
      headers: { "Content-Type": "application/json" },
    });
    expect(seeded.ok()).toBe(true);

    await page.goto("/register");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("anotherpassword12");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText("An account with this email already exists")).toBeVisible({
      timeout: 20_000,
    });
  });

  test("R2-invalid-email: invalid email format → field-level error", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password").fill("strongpassword123");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("R2-weak-password: short password → field-level error", async ({ page }) => {
    await page.goto("/register");
    await page.getByLabel("Email").fill(uniqueEmail());
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: /register/i }).click();
    await expect(page.getByText("Password must be at least 12 characters")).toBeVisible();
  });
});

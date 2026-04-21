/** @jest-environment node */

import { POST } from "@/app/api/auth/register/route";
import { appUserStore, resetAuthStoresForTests } from "@/lib/auth/memory-store";

import { NextRequest } from "next/server";

jest.setTimeout(20_000);

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    resetAuthStoresForTests();
  });

  function request(body: unknown): NextRequest {
    return new NextRequest("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("should return 201 and set a session cookie when input is valid", async () => {
    const response = await POST(request({ email: "api-alice@example.com", password: "strongpassword123" }));

    expect(response.status).toBe(201);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("session=");
    expect(setCookie?.toLowerCase()).toContain("httponly");

    const body: unknown = await response.json();
    expect(body).toEqual({ ok: true });
  });

  it("should return 409 when the email is already registered", async () => {
    const payload = { email: "dup@example.com", password: "strongpassword123" };
    await POST(request(payload));
    const response = await POST(request(payload));

    expect(response.status).toBe(409);
    const body: unknown = await response.json();
    expect(body).toEqual({
      message: "An account with this email already exists",
    });
  });

  it("should return 400 with field errors when input is invalid", async () => {
    const response = await POST(request({ email: "bad", password: "short" }));

    expect(response.status).toBe(400);
    const body = (await response.json()) as { errors?: Record<string, string> };
    expect(body.errors).toBeDefined();
  });

  it("should return 400 when password is too short", async () => {
    const response = await POST(request({ email: "ok@example.com", password: "short" }));

    expect(response.status).toBe(400);
    const body = (await response.json()) as { errors?: { password?: string } };
    expect(body.errors?.password).toBe("Password must be at least 12 characters");
  });

  it("should store the password as a bcrypt hash, never plaintext", async () => {
    await POST(request({ email: "hash@example.com", password: "strongpassword123" }));

    const user = appUserStore.findByEmail("hash@example.com");
    expect(user?.passwordHash.startsWith("$2")).toBe(true);
    expect(user?.passwordHash).not.toBe("strongpassword123");
  });

  it("should set the session cookie with httpOnly flag", async () => {
    const response = await POST(request({ email: "sess@example.com", password: "strongpassword123" }));

    const setCookie = response.headers.get("set-cookie") ?? "";
    expect(setCookie.toLowerCase()).toContain("httponly");
  });
});

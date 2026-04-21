import { randomUUID } from "crypto";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { createSession, appUserStore } from "@/lib/auth/memory-store";
import { registerUser } from "@/lib/auth/register";

export const runtime = "nodejs";

const registerBodySchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z.string().min(12, { message: "Password must be at least 12 characters" }),
});

export async function POST(req: NextRequest): Promise<Response> {
  const correlationId = randomUUID();

  try {
    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = registerBodySchema.safeParse(json);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      const errors: { email?: string; password?: string } = {};
      const emailErr = flat.email?.[0];
      const passwordErr = flat.password?.[0];
      if (emailErr) {
        errors.email = emailErr;
      }
      if (passwordErr) {
        errors.password = passwordErr;
      }
      return NextResponse.json({ errors }, { status: 400 });
    }

    const result = await registerUser(parsed.data, appUserStore);

    if (!result.ok) {
      if (result.failure.kind === "validation") {
        return NextResponse.json({ errors: result.failure.errors }, { status: 400 });
      }
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const sessionToken = createSession(result.user.id);
    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error", correlationId }, { status: 500 });
  }
}

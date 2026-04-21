"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitRegistration();
  }

  async function submitRegistration(): Promise<void> {
    const form = formRef.current;
    if (!form) {
      return;
    }

    setErrors({});
    setFormError(null);

    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: unknown = await response.json().catch(() => ({}));

    if (response.ok) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    if (response.status === 400 && data && typeof data === "object" && "errors" in data) {
      const raw = (data as { errors?: unknown }).errors;
      if (raw && typeof raw === "object") {
        const e = raw as { email?: unknown; password?: unknown };
        const nextErrors: { email?: string; password?: string } = {};
        if (typeof e.email === "string") nextErrors.email = e.email;
        if (typeof e.password === "string") nextErrors.password = e.password;
        setErrors(nextErrors);
      }
      return;
    }

    if (response.status === 409) {
      const msg =
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message?: unknown }).message === "string"
          ? (data as { message: string }).message
          : "An account with this email already exists";
      setFormError(msg);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-4">
      <form
        ref={formRef}
        method="post"
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm"
        noValidate
      >
        <h1 className="text-xl font-semibold text-neutral-900">Create account</h1>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
          {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full rounded border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
          {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
        </div>

        {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

        <button
          type="button"
          className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
          onClick={() => void submitRegistration()}
        >
          Register
        </button>
      </form>
    </main>
  );
}

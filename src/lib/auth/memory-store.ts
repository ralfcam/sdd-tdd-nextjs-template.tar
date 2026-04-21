import { randomUUID } from "node:crypto";

import type { UserRecord, UserStore } from "./user-store";

/**
 * Next.js dev Fast Refresh reloads route modules; module-level Maps would reset mid-request.
 * Shared maps on `globalThis` survive HMR so E2E duplicate-email flows stay stable in `next dev`.
 */
const STORE_KEY = "__SDD_TDD_TEMPLATE_AUTH_STORE__" as const;

interface SharedAuthMaps {
  byEmail: Map<string, UserRecord>;
  byId: Map<string, UserRecord>;
  sessions: Map<string, string>;
}

function getSharedMaps(): SharedAuthMaps {
  const globalObj = globalThis as typeof globalThis & {
    [STORE_KEY]?: SharedAuthMaps;
  };
  if (!globalObj[STORE_KEY]) {
    globalObj[STORE_KEY] = {
      byEmail: new Map(),
      byId: new Map(),
      sessions: new Map(),
    };
  }
  return globalObj[STORE_KEY];
}

function createMemoryUserStoreInternal(): UserStore & { reset(): void } {
  const byEmail = new Map<string, UserRecord>();
  const byId = new Map<string, UserRecord>();

  return {
    findByEmail(email: string): UserRecord | undefined {
      return byEmail.get(email.toLowerCase());
    },
    findById(id: string): UserRecord | undefined {
      return byId.get(id);
    },
    create(email: string, passwordHash: string): UserRecord {
      const normalized = email.toLowerCase();
      const user: UserRecord = {
        id: randomUUID(),
        email: normalized,
        passwordHash,
      };
      byEmail.set(normalized, user);
      byId.set(user.id, user);
      return user;
    },
    reset(): void {
      byEmail.clear();
      byId.clear();
    },
  };
}

/**
 * Fresh store for unit tests — isolated maps per instance.
 */
export function createMemoryUserStore(): UserStore & { reset(): void } {
  return createMemoryUserStoreInternal();
}

function createGlobalStoreAdapter(): UserStore & { reset(): void } {
  return {
    findByEmail(email: string): UserRecord | undefined {
      return getSharedMaps().byEmail.get(email.toLowerCase());
    },
    findById(id: string): UserRecord | undefined {
      return getSharedMaps().byId.get(id);
    },
    create(email: string, passwordHash: string): UserRecord {
      const shared = getSharedMaps();
      const normalized = email.toLowerCase();
      const user: UserRecord = {
        id: randomUUID(),
        email: normalized,
        passwordHash,
      };
      shared.byEmail.set(normalized, user);
      shared.byId.set(user.id, user);
      return user;
    },
    reset(): void {
      const shared = getSharedMaps();
      shared.byEmail.clear();
      shared.byId.clear();
      shared.sessions.clear();
    },
  };
}

const globalStore = createGlobalStoreAdapter();

/** Process-wide store for API routes (template / dev only; replace with a database for production). */
export const appUserStore: UserStore = globalStore;

export function createSession(userId: string): string {
  const shared = getSharedMaps();
  const token = randomUUID();
  shared.sessions.set(token, userId);
  return token;
}

export function getUserIdForSessionToken(token: string | undefined): string | undefined {
  if (!token) {
    return undefined;
  }
  return getSharedMaps().sessions.get(token);
}

/** Clears users and sessions — call from integration tests only. */
export function resetAuthStoresForTests(): void {
  globalStore.reset();
}

import { cookies } from "next/headers";

import { appUserStore, getUserIdForSessionToken } from "./memory-store";
import type { UserRecord } from "./user-store";

export async function getCurrentUser(): Promise<UserRecord | undefined> {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  const userId = getUserIdForSessionToken(token);
  if (!userId) {
    return undefined;
  }
  return appUserStore.findById(userId);
}

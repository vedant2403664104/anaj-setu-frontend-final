import type { SessionUser } from "@/lib/types";

export function getSessionUser(): SessionUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem("anajsetu_user");
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}
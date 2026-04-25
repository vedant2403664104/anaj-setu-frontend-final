/**
 * api-base.ts
 * Centralised base URL and lightweight fetch wrapper for AnajSetu API calls.
 * All dashboard inline fetch() calls may optionally migrate to this over time.
 */

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081";

/**
 * A thin wrapper around fetch that:
 *  - prepends BASE_URL automatically
 *  - sets Content-Type: application/json for POST/PUT by default
 *  - returns the parsed JSON body (or null on empty responses)
 *  - throws a plain Error with the server message on non-ok status
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // 204 No Content – return null cast to T
  if (res.status === 204) return null as T;

  const text = await res.text();
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  if (!res.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? (body as { message: string }).message
        : text || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return body as T;
}

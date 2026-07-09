/**
 * Minimal fetch wrapper for the RapidTriage backend.
 * The base URL comes from EXPO_PUBLIC_API_URL so it can be pointed at a LAN IP
 * when running on a physical device.
 */

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function postJson<TResponse>(
  path: string,
  body: unknown,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<TResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Request to ${path} failed with status ${response.status}`
      );
    }

    return (await response.json()) as TResponse;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Boot-time migration runner.
 *
 * The API used to run migrations inline and `process.exit(1)` on any failure,
 * which turned a momentary database outage into a permanent restart loop.
 * Here we retry with exponential backoff and report state instead of throwing,
 * so the HTTP server can stay up and answer health checks while it waits.
 */

export type DbState = "connecting" | "ready" | "error";

export interface DbStatus {
  state: DbState;
  /** How many migration attempts have been made so far. */
  attempts: number;
  /** Message from the most recent failure, if any. */
  lastError?: string;
}

export interface RetryOptions {
  /** Maximum migration attempts before giving up. */
  retries?: number;
  /** Delay before the first retry; doubles on each subsequent one. */
  baseDelayMs?: number;
  /** Called on every state transition so callers can publish status. */
  onState?: (status: DbStatus) => void;
  /** Injectable for tests; defaults to a real timer. */
  sleep?: (ms: number) => Promise<void>;
}

const defaultSleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function runMigrationsWithRetry(
  runMigration: () => Promise<void>,
  options: RetryOptions = {}
): Promise<DbStatus> {
  const {
    retries = 5,
    baseDelayMs = 1000,
    onState,
    sleep = defaultSleep,
  } = options;

  let status: DbStatus = { state: "connecting", attempts: 0 };
  onState?.(status);

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await runMigration();
      status = { state: "ready", attempts: attempt };
      onState?.(status);
      return status;
    } catch (error) {
      const lastError = error instanceof Error ? error.message : String(error);
      const exhausted = attempt === retries;
      status = {
        state: exhausted ? "error" : "connecting",
        attempts: attempt,
        lastError,
      };
      onState?.(status);
      if (exhausted) return status;
      await sleep(baseDelayMs * 2 ** (attempt - 1));
    }
  }

  return status;
}

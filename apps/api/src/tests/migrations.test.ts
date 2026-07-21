import { runMigrationsWithRetry } from "../migrations";

/** Collects the delays requested so backoff can be asserted without real waiting. */
function fakeSleep() {
  const delays: number[] = [];
  return { delays, sleep: async (ms: number) => void delays.push(ms) };
}

describe("runMigrationsWithRetry", () => {
  it("reports ready after a first-try success", async () => {
    const { sleep, delays } = fakeSleep();
    const status = await runMigrationsWithRetry(async () => {}, { sleep });
    expect(status.state).toBe("ready");
    expect(status.attempts).toBe(1);
    expect(delays).toEqual([]);
  });

  it("retries a transient failure and succeeds", async () => {
    const { sleep } = fakeSleep();
    let calls = 0;
    const status = await runMigrationsWithRetry(
      async () => {
        calls += 1;
        if (calls < 3) throw new Error("getaddrinfo ENOTFOUND dpg-xxx");
      },
      { sleep, retries: 5, baseDelayMs: 100 }
    );
    expect(status.state).toBe("ready");
    expect(status.attempts).toBe(3);
    expect(calls).toBe(3);
  });

  it("backs off exponentially between attempts", async () => {
    const { sleep, delays } = fakeSleep();
    await runMigrationsWithRetry(
      async () => {
        throw new Error("down");
      },
      { sleep, retries: 4, baseDelayMs: 100 }
    );
    // One sleep between each pair of attempts, doubling each time.
    expect(delays).toEqual([100, 200, 400]);
  });

  it("ends in the error state, without throwing, once retries are exhausted", async () => {
    const { sleep } = fakeSleep();
    const status = await runMigrationsWithRetry(
      async () => {
        throw new Error("getaddrinfo ENOTFOUND dpg-xxx");
      },
      { sleep, retries: 3, baseDelayMs: 10 }
    );
    expect(status.state).toBe("error");
    expect(status.attempts).toBe(3);
    expect(status.lastError).toContain("ENOTFOUND");
  });

  it("publishes each state transition to onState", async () => {
    const { sleep } = fakeSleep();
    const seen: string[] = [];
    await runMigrationsWithRetry(
      async () => {
        throw new Error("down");
      },
      { sleep, retries: 2, baseDelayMs: 10, onState: (s) => seen.push(s.state) }
    );
    expect(seen[0]).toBe("connecting");
    expect(seen[seen.length - 1]).toBe("error");
  });
});

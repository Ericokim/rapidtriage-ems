import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests run against the Expo **web** build of the mobile app
 * (react-native-web). The app is offline-first, so on web it uses an in-memory
 * store and these tests exercise the full capture flow in a real browser.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:8081",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm --workspace @rapidtriage/mobile run web -- --port 8081",
    url: "http://localhost:8081",
    reuseExistingServer: true,
    timeout: 180_000,
  },
});

# Tests

The suite has two layers.

## Unit & integration (Jest)

Fast, no browser or device required. Run all with `npm test` from the repo root.

| Suite | Location | Env |
| --- | --- | --- |
| Shared validation (Zod schema) | `packages/shared/src/**/*.test.ts` | ts-jest / node |
| API sync endpoint (Supertest) | `apps/api/src/tests/*.test.ts` | node |
| Mobile logic + form (RNTL) | `apps/mobile/__tests__/**` | jest-expo |

> Unit tests live **with the code they test** so each runs in its correct
> environment (the mobile suite needs the `jest-expo` preset and the Expo
> project context, which can't run from a shared root folder). This is the
> standard monorepo layout.

```bash
npm test            # all 34 unit/integration tests
```

## End-to-end (Playwright)

Drives the Expo **web** build of the app in a real browser (Chromium) and walks
the full capture flow: launch → onboarding → home → new triage → submit → save.

```bash
# one-time: install the browser
npx playwright install chromium

# run (auto-starts the Expo web server)
npm run test:e2e
```

Config: `test/playwright.config.ts`. Specs: `test/e2e/`.

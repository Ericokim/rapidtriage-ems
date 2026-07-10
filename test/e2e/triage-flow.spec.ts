import { test, expect } from "@playwright/test";

/**
 * Happy-path capture flow: launch → (onboarding) → home → new triage →
 * fill both steps → submit → local-save confirmation.
 */
test("captures a triage record end to end", async ({ page }) => {
  await page.goto("/");

  // Splash auto-advances (~2s). Skip onboarding if it appears.
  await page.waitForTimeout(3500);
  const skip = page.getByText("Skip", { exact: true });
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
  }

  // Home
  await expect(page.getByText("Ready for intake")).toBeVisible({ timeout: 20_000 });
  await page.getByText("New Triage", { exact: true }).first().click();

  // Step 1 — patient information
  await page.getByPlaceholder("Enter patient full name").fill("E2E Patient");
  await page
    .getByPlaceholder(/Describe the patient/)
    .fill("Chest pain and shortness of breath");
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 2 — triage details
  await page.getByRole("button", { name: "Priority 1 Critical" }).click();
  await page.getByRole("button", { name: "In-Transit" }).click();
  await page.getByRole("button", { name: "Save & Submit" }).click();

  // Local-save confirmation
  await expect(page.getByText(/saved/i).first()).toBeVisible({ timeout: 15_000 });
});

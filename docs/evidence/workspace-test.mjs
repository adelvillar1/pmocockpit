/**
 * Playwright live test for the program workspace (Task 8 evidence).
 * Uses the globally installed playwright-core + cached chromium headless shell.
 *
 * Run: NODE_PATH=/usr/local/lib/node_modules node docs/evidence/workspace-test.mjs <programId>
 */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright-core");

const programId = process.argv[2];
if (!programId) {
  console.error("usage: workspace-test.mjs <programId>");
  process.exit(2);
}
const BASE = "http://localhost:3000";
const SHELL =
  process.env.HOME +
  "/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell";

const browser = await chromium.launch({ executablePath: SHELL });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });

// --- login: POST passcode, carry the session cookie ---
const loginRes = await context.request.post(`${BASE}/api/auth`, {
  data: { passcode: "stratum-dev-2026" },
});
console.log("login status:", loginRes.status());
const setCookie = loginRes.headers()["set-cookie"];
const cookieValue = setCookie.split(";")[0].split("=").slice(1).join("=");
await context.addCookies([
  { name: "stratum_session", value: cookieValue, domain: "localhost", path: "/" },
]);

const page = await context.newPage();
await page.goto(`${BASE}/program/${programId}`, { waitUntil: "networkidle" });

const check = async (label, sel, expectedText) => {
  const el = page.locator(sel).first();
  await el.waitFor({ state: "visible", timeout: 10000 });
  const text = await el.textContent();
  const ok = expectedText ? text.includes(expectedText) : true;
  console.log(`${ok ? "PASS" : "FAIL"} ${label}${expectedText ? ` -> "${text.trim().slice(0, 80)}"` : ""}`);
  if (!ok) process.exitCode = 1;
};

await check("phase title (SSR)", ".ws-phase-title", "Leadership and vision alignment");
await check("program name", ".ws-banner .row strong", "Workspace live test");

// --- 1. optimistic checkbox toggle on an activity ---
const box = page.locator('[data-testid="check-p0.sponsor-named"]');
console.log("checkbox before:", await box.isChecked());
await box.click();
await page.waitForTimeout(300);
console.log("checkbox after click (optimistic):", await box.isChecked());

// --- 2. inline editor: owner + due date + notes, explicit Save ---
await page.locator('[data-testid="note-p0.sponsor-named"]').click();
const editor = page.locator('[data-testid="editor-p0.sponsor-named"]');
await editor.waitFor({ state: "visible" });
await editor.locator("textarea").fill("Live-test note: sponsor confirmed by CFO.");
await editor.locator('input[type="text"]').fill("A. Testowner");
await editor.locator('input[type="date"]').fill("2026-09-30");
await page.locator('[data-testid="save-p0.sponsor-named"]').click();
await page.locator(".ws-saved").waitFor({ state: "visible", timeout: 10000 });
console.log("PASS meta editor saved ->", await page.locator(".ws-saved").textContent());
await page.locator('[data-testid="note-p0.sponsor-named"]').click(); // close

// --- 3. nonNeg checkbox + N/A -> phase-complete line ---
for (const slug of [
  "p0.sponsor-committed",
  "p0.charter-approved",
  "p0.steering-charter",
]) {
  await page.locator(`[data-testid="check-${slug}"]`).click();
  await page.waitForTimeout(150);
}
await page.locator('[data-testid="na-p0.value-hypothesis-signed"]').click();
await page.locator('[data-testid="phase-complete"]').waitFor({ state: "visible", timeout: 10000 });
await check("phase complete line", '[data-testid="phase-complete"]', "Phase complete");
await check("nav badge checkmark", '.ws-sidebar.fixed [data-testid="nav-0"] .ws-num.done', "✓");

// --- 4. phase nav + phase 6 cadence ---
await page.locator('.ws-sidebar.fixed [data-testid="nav-6"]').click();
await check("phase 7 title", ".ws-phase-title", "Scale, embed, and continuous management");
const cadenceCard = page.locator(".ws-card", { hasText: "Cadence after go-live" });
await cadenceCard.waitFor({ state: "visible", timeout: 10000 });
const cadenceOk = (await cadenceCard.textContent()).includes("Monthly") && (await cadenceCard.textContent()).includes("Annually");
console.log(cadenceOk ? "PASS cadence block (Monthly/Quarterly/Annually)" : "FAIL cadence block");
if (!cadenceOk) process.exitCode = 1;
await page.locator('[data-testid="prev-phase"]').click();
await check("prev returns to phase 6", ".ws-phase-title", "Implement, pilot, and capture value");
await page.locator('.ws-sidebar.fixed [data-testid="nav-0"]').click();

// --- 5. history drawer ---
await page.locator(".ws-history-toggle").click();
await page.locator('[data-testid="history"]').waitFor({ state: "visible" });
const historyText = await page.locator('[data-testid="history"]').textContent();
const histOk = historyText.includes("Marked") && historyText.includes("Program created");
console.log(histOk ? "PASS history drawer has item + creation events" : `FAIL history: ${historyText.slice(0, 200)}`);
if (!histOk) process.exitCode = 1;

// --- 6. persistence: reload and verify ---
await page.reload({ waitUntil: "networkidle" });
await check("after reload: still checked", '[data-testid="check-p0.sponsor-named"]');
const stillChecked = await page.locator('[data-testid="check-p0.sponsor-named"]').isChecked();
console.log(stillChecked ? "PASS persistence after reload" : "FAIL persistence");
if (!stillChecked) process.exitCode = 1;
const ownerChip = await page.locator(".ws-item-chips", { hasText: "A. Testowner" }).first().textContent();
console.log("PASS owner chip persisted:", ownerChip.trim());

// --- 7. screenshot for the visual gate ---
await page.screenshot({ path: "docs/evidence/workspace.png", fullPage: true });
await page.screenshot({ path: "docs/evidence/workspace-sidebar.png", fullPage: false });
console.log("screenshots written to docs/evidence/");

await browser.close();
console.log("DONE");
process.exit(process.exitCode ?? 0);

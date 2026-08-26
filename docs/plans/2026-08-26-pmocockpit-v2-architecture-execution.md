---
status: active
created: 2026-08-26
updated: 2026-08-26
slug: pmocockpit-v2-architecture-execution
parent_plan: docs/plans/2026-08-26-pmocockpit-v2-architecture.md
---

# PMO Cockpit v2 — Execution Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn `Stratum-Program-Toolkit.html` into a Next.js + Postgres app on Railway (prod-only, `main` branch).

**Architecture:** Next.js App Router + tRPC + Prisma 7 on PostgreSQL. Stable-slug content catalog. Passphrase auth (`APP_PASSCODE`). See parent plan for data model and constitution.

**Tech Stack:** Next.js 15 (App Router), TypeScript strict, tRPC v11, Prisma 7, PostgreSQL, pnpm.

**Source of truth for content:** `Stratum-Program-Toolkit.html` (v1). All PROGRAMS/PHASES/BASE/EXTRAS content must be carried over verbatim (text identical) with slugs added.

---

## Task 1: Git init + Next.js scaffold

**Objective:** Repo initialized, Next.js app scaffolded in place, v1 HTML archived.

**Steps:**
1. `git init` in project root; create `.gitignore` (node, .next, .env*, *.tsbuildinfo).
2. Move `Stratum-Program-Toolkit.html` → `docs/v1-reference.html` (kept as artifact; `git mv` after first commit).
3. Scaffold Next.js manually (NOT create-next-app — the dir is non-empty): `package.json` (next@15, react@19, typescript), `tsconfig.json` (strict: true, paths `@/*` → `./src/*`), `src/app/layout.tsx` + `page.tsx` placeholder, `next.config.ts`.
4. `pnpm install`; `pnpm build` → expect success.
5. Commit: `git add -A && git commit -m "chore: scaffold Next.js app, archive v1 HTML"`

**Verify:** `pnpm build` exits 0; `pnpm dev` serves placeholder at :3000; `ls docs/v1-reference.html` exists.

## Task 2: Prisma + schema + client singleton

**Objective:** Database layer ready.

**Steps:**
1. `pnpm add prisma @prisma/client`; `pnpm prisma init` (set datasource url from `DATABASE_URL` env).
2. Write `prisma/schema.prisma` with the three models from parent plan (Program, ChecklistItem, ProgramEvent) — exact fields per parent plan Data model section, including `@@unique([programId, itemKey])`.
3. Create `src/server/db.ts`: global-cached PrismaClient singleton (standard Next.js pattern).
4. Local dev DB: `docker run -d --name pmocockpit-pg -e POSTGRES_PASSWORD=pmo -e POSTGRES_DB=pmocockpit -p 5433:5432 postgres:16` (if Docker unavailable, fallback: create Railway Postgres early and use its `DATABASE_URL` locally via `.env`, gitignored).
5. `pnpm prisma migrate dev --name init` → expect migration applied; `pnpm prisma generate`.
6. Commit schema + migration + db.ts.

**Verify:** `pnpm prisma migrate status` → "Database schema is up to date"; `psql` `\dt` shows 3 tables.

## Task 3: Content catalog with stable slugs

**Objective:** All v1 content in typed TS with permanent slugs; guard script.

**Steps:**
1. Create `src/content/catalog.ts`: export `PROGRAM_TYPES` (9 entries: typeId, name, shortName, tagline, focus, horizon, risks[], kpis[]), `PHASES` (7 entries), and `PHASE_CONTENT: Record<typeId, Record<phaseId, {objective, activities: {slug, text}[], nonNeg: {slug, text}[], tips}>>` — base content merged with per-type extras exactly as v1's `content()` merge does. **Copy all text verbatim from `docs/v1-reference.html` — do not paraphrase.**
2. Slug convention: `p<phase>.<kebab-slug>` e.g. `p0.sponsor-named`, `p1.systems-landscape`. Slugs stable forever; add `CATALOG_SCHEMA_VERSION = 1`.
3. Create `scripts/check-catalog.ts`: fails (exit 1) if (a) any duplicate slug, (b) slug not matching convention, (c) empty text, (d) typeIds/phases not in declared sets. Add `"check:catalog": "tsx scripts/check-catalog.ts"` to package.json.
4. Run check → PASS. Commit.

**Verify:** `pnpm check:catalog` exits 0; `grep -c "p0\." src/content/catalog.ts` > 0; spot-check 3 items' text against v1 HTML (verbatim).

## Task 4: Passcode auth gate

**Objective:** Single-passphrase gate protecting every route.

**Steps:**
1. `src/app/login/page.tsx`: single password field + submit, styled with existing v1 palette tokens (dark bg, muted input). No branding beyond "Stratum".
2. `src/server/auth.ts`: POST handler — compare against `process.env.APP_PASSCODE`, set httpOnly signed cookie (`stratum_session`, 30d, HMAC with `AUTH_SECRET`). Constant-time compare.
3. `src/middleware.ts`: redirect all routes except `/login` to `/login` when cookie absent/invalid. Login POST also in middleware-adjacent route handler `src/app/api/auth/route.ts`.
4. `pnpm build` → pass. Commit.

**Verify:** `pnpm build` exits 0; curl unauthed `/` → 307 to /login; curl with valid passcode → cookie set, `/` 200.

## Task 5: GitHub repo + push

**Objective:** Remote exists, code pushed.

**Steps:**
1. `gh repo create adelvillar1/pmocockpit --private --source . --push` (SSH protocol per gh auth config).
2. Verify: `gh repo view adelvillar1/pmocockpit --json visibility,defaultBranchRef` → PRIVATE, main.

**Verify:** `git remote -v` shows origin; `git log origin/main` has all commits.

## Task 6: tRPC routers (programs + items)

**Objective:** API layer complete.

**Steps:**
1. `pnpm add @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod`; set up `src/server/trpc.ts` (context with db) + `src/server/routers/_app.ts`.
2. `src/server/routers/programs.ts`: `list` (all programs + derived per-phase progress + overall %), `create` (typeId validated against catalog, name, context?), `get` (program + items + events), `setStatus`, `delete`, `exportJson` (full state + CATALOG_SCHEMA_VERSION), `importJson` (validate version, recreate program+items).
3. `src/server/routers/items.ts`: `setStatus` (todo|done|na, writes ProgramEvent: item_done/item_reopened/item_na; sets completedAt), `updateMeta` (notes/owner/dueDate → note_edited event). Item rows lazily created on program create: materialize all catalog items for that typeId with `createMany` + skipDuplicates.
4. Progress derivation helper `src/server/progress.ts`: phase done = all nonNeg done|na; overall % = done nonNeg / total nonNeg. **Derived, never stored.**
5. `pnpm build` + commit.

**Verify:** `npx tsc --noEmit` clean; manual tRPC smoke via `pnpm dev` + browser console or a tsx script: create → setStatus → get shows event + progress.

## Task 7: Portfolio dashboard UI

**Objective:** Landing view: all programs, per-phase progress.

**Steps:**
1. `src/styles/tokens.css`: port v1 palette (`--bg #0b0e12`, `--surface`, `--raised`, `--fg`, `--muted`, `--subtle`, `--primary #9aada8`, `--primary-fg`, `--border`, `--warn`, `--success`) + fonts (IBM Plex Sans, Newsreader via next/font). No Tailwind required — plain CSS with tokens, matching v1's approach.
2. `src/app/page.tsx`: server component listing programs — each row: name, type chip, status, per-phase 7-segment progress strip (done/na/todo), overall %. "New program" button → create flow (type tiles from catalog, name input, optional context input — structured fields, no JSON textareas).
3. Empty state: honest "No programs yet" + create CTA. No fake data.
4. Responsive: single column < 700px.
5. `pnpm build` → pass. Commit.

**Verify:** `pnpm build` exits 0; Playwright still `docs/evidence/dashboard.png` (desktop + 390px) with 2+ programs showing independent progress.

## Task 8: Program workspace UI

**Objective:** The 7-phase workspace, past-v1 features.

**Steps:**
1. `src/app/program/[id]/page.tsx`: sidebar (7 phases, done checkmarks derived, overall %), main panel per phase (objective, activities list, nonNeg list with "Required" chips, tips, KPIs on phase 1, cadence on phase 7 — all from catalog, verbatim).
2. Checkbox toggle → tRPC mutation, optimistic update, no full-page reload. Note/owner/due editor: expanding inline row per item (structured inputs), save on blur/Enter.
3. History drawer: ProgramEvent list (most recent first), human-readable lines.
4. Phase navigation + program actions (pause/complete/archive, reset, JSON export button, JSON import on dashboard).
5. `pnpm build` → pass. Commit.

**Verify:** Playwright E2E script `e2e/workspace.spec.ts`: create program → toggle 2 activities + 1 nonNeg → reload → identical → edit note → appears in history → phase 0 done state shows ✓ when all nonNeg done.

## Task 9: Report view

**Objective:** Print-friendly per-program report replacing txt export.

**Steps:**
1. `src/app/program/[id]/report/page.tsx`: server component, print CSS (`@media print` — light background, page breaks between phases), program meta + all phases with item states, notes, owners, completion dates from events.
2. JSON export/import buttons wired to routers from Task 6.
3. Commit.

**Verify:** Playwright PDF render of report page — all 7 phases present, no layout breakage; `docs/evidence/report.png` still saved.

## Task 10: Railway deploy

**Objective:** Live on Railway, prod-only, `main`. **GATED: explicit user approval before `git push` triggering first deploy.**

**Steps:**
1. `railway init` / link; add Postgres plugin; set `DATABASE_URL`, `APP_PASSCODE`, `AUTH_SECRET` env vars.
2. Railway build: start command `pnpm start`, build `pnpm build`; nixpacks/railway.toml per established patterns. Run `pnpm prisma migrate deploy` on release.
3. Verify deploy: live URL serves login; meta/buildId check; create-program smoke through prod UI.
4. Playwright E2E against prod URL: AC2/AC3/AC4 from parent plan.

**Verify:** AC8 evidence: `curl` live URL + grep served JS for new identifiers; E2E green.

## Task 11: Visual gate + anti-slop

**Objective:** User-approved visuals.

**Steps:**
1. Playwright stills: dashboard, workspace, report at 1440px + 390px.
2. Run anti-slop gates (`slop_tells.mjs --dark`, `taste_audit.mjs --dark`) on pages; fix LOW+ findings or document brand-signature exceptions.
3. Present stills to user for review before marking plan complete.

**Verify:** User approves visuals (this is the "pictures or it didn't happen" gate).

---

## Review rigor

| Task | Risk | Review |
|---|---|---|
| 1, 5 | Low | Combined single reviewer |
| 2, 3 | Medium (schema + content fidelity) | Spec + quality |
| 4 | Medium (auth) | Spec + quality |
| 6, 7, 8 | High (core UX, shared patterns) | Spec + quality |
| 9 | Medium | Spec + quality |
| 10 | Critical (prod deploy) | Parent-gated + user approval |
| 11 | High (visual) | Parent + user |

## Converge checklist (before closing parent plan)

- [ ] Re-read parent plan ACs verbatim; verify each against code/prod
- [ ] All 10 content types render with verbatim text (spot-check 5)
- [ ] Portfolio + workspace + report + history all reachable in UI (no curl-only surfaces)
- [ ] No [NEEDS CLARIFICATION] anywhere; plan statuses consistent
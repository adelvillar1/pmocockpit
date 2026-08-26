---
status: active
created: 2026-08-26
updated: 2026-08-26
slug: pmocockpit-v2-architecture
---

# PMO Cockpit v2 — Architecture Plan

**Source artifact:** `Stratum-Program-Toolkit.html` (268-line single-file checklist app, verified working via Playwright 2026-08-26). Evaluation findings that drive this plan: index-as-key storage bug, no schema versioning, no multi-program portfolio view, no notes/owner/dates on items, text-only export, localStorage-only persistence.

## Constitution (project principles — proposed, ratify on plan activation)

1. **Content is data, code is the engine.** Phase/program content lives in a typed catalog with stable slugs, never hardcoded into render logic.
2. **Stable identity forever.** A checklist item is identified by slug, never by array index. Renaming/reordering content must never shift a user's recorded progress.
3. **Progress is derived, never stored.** Percentages and phase-done states are computed from item statuses at read time.
4. **Every state change is an event.** Completion dates and history come from an append-only event log, not from mutating rows in place.
5. **The existing visual identity survives.** IBM Plex Sans / Newsreader, the current muted-dark palette, expanded into a token system. No generic dashboard restyle.
6. **Anti-slop gate before any visual review** (`creative/anti-ai-slop` checklist + gates).

## Stack (matches established patterns across user's projects)

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router, TS) | Same as Cruising Intelligence; React server components for read-heavy checklist UI |
| API | tRPC routers | Type-safe Prisma-in-tRPC pattern already proven in user's codebases |
| DB | PostgreSQL + Prisma 7 | Railway internal DB via `DATABASE_URL`; Prisma 7 quirks already known (no ambient NODE_PATH) |
| Package mgr | pnpm | Use `./node_modules/.bin/` directly |
| Auth | Single shared passphrase (`APP_PASSCODE` env var, httpOnly cookie session) | User decision 2026-08-26: he is the main user; no per-user accounts |
| Hosting | Railway, single env | User decision 2026-08-26: prod-only, watches `main`; deploy = git push, never `railway up` |
| Remote | GitHub (new repo `pmocockpit`, private) | User decision 2026-08-26 |

## Data model

```prisma
model Program {
  id        String   @id @default(cuid())
  typeId    String                      // catalog key: dx | erp | etrm | ai | twin | apm | ioc | cyber | custom
  name      String                      // user-editable instance name ("GoM DX Wave 1")
  context   String?                     // asset / BU / region free-text
  status    String   @default("active") // active | paused | complete | archived
  createdAt DateTime @default(now())
  items     ChecklistItem[]
  events    ProgramEvent[]
  @@index([status])
}

model ChecklistItem {
  id          String    @id @default(cuid())
  programId   String
  program     Program   @relation(fields: [programId], references: [id], onDelete: Cascade)
  itemKey     String                          // STABLE slug: "p0.sponsor-named" — survives content edits
  group       String                          // activities | nonNeg
  status      String    @default("todo")      // todo | done | na
  notes       String?
  owner       String?
  dueDate     DateTime?
  completedAt DateTime?
  updatedAt   DateTime  @updatedAt
  @@unique([programId, itemKey])
  @@index([programId])
}

model ProgramEvent {
  id        String   @id @default(cuid())
  programId String
  kind      String   // item_done | item_reopened | item_na | note_edited | phase_completed | status_changed | program_created
  itemKey   String?
  payload   Json?    // { group, from, to, note } — small, audit-only
  createdAt DateTime @default(now())
  @@index([programId, createdAt])
}
```

Items are created lazily on first program open (one insert per catalog item, `skipDuplicates`), so catalog edits only affect new/incomplete programs predictably.

## Content catalog

`src/content/catalog.ts` — the existing `PROGRAMS` / `PHASES` / `BASE` / `EXTRAS` data, typed, with **every activity and non-negotiable given a stable slug** (e.g. `p2.roadmap-stage-gates`). Catalog carries a `schemaVersion`. A `scripts/check-catalog.ts` guard runs in CI: fails if any slug is removed or reused with different text (forces conscious migrations instead of silent progress corruption — the #1 bug found in the v1 evaluation).

## Approach (phases)

### Phase 1 — Scaffold + data layer
- Next.js + tRPC + Prisma scaffold in repo; GitHub init; Railway single env, prod-only, linked to the repo's Postgres instance (private networking).
- Prisma schema above + initial migration; catalog module with slugs; lazy item materialization; `check-catalog` guard.
- Auth: passphrase gate via `APP_PASSCODE` env var → httpOnly cookie; middleware protects all routes.
- Seed: nothing fabricated — real catalog content only.

### Phase 2 — Core workspace (parity with v1, then past it)
- Program creation flow: pick type, name it, optional context. All 9 types from the catalog.
- Program workspace: 7-phase sidebar (current nav pattern), activities + non-negotiables lists, checkbox = tRPC mutation + event write (optimistic UI).
- Portfolio dashboard: all programs with per-phase progress strip, overall %, status. This is the view the v1 app couldn't have.
- Per-item expansion: notes (plain text), owner, due date, `na` state. No JSON textareas anywhere (user preference).
- Phase completion derived: all nonNeg done/na → phase ✓ in sidebar + event.

### Phase 3 — Reporting + hygiene
- Report view: print-friendly per-program summary (Markdown-rendered), replacing the txt export; JSON export/import of full program state (with schemaVersion) for backup/migration.
- Event log surfaced per program ("History").
- Empty/degraded states: no fake data anywhere.

### Phase 4 — Deploy + verify
- Single env from `main`; deploy liveness verified by SHA + live JS strings (established Railway verification pattern).
- E2E (Playwright, against prod): create program → toggle items → reload → notes persist → portfolio reflects → report prints.
- Visual gate: Playwright stills of dashboard + workspace at desktop + 390px mobile, run through anti-slop gates, user reviews before ship.

## UI Constraints

- Tokens only (`src/styles/tokens.css` extending the existing palette: `--bg #0b0e12`, `--surface`, `--raised`, `--primary #9aada8`, `--warn`, `--success`). No arbitrary-value Tailwind; no new accent colors.
- Fonts stay IBM Plex Sans (UI) + Newsreader (display). No Inter/system-default display.
- No emoji icons; Lucide if icons are needed. No gradient fills, no border-left-accent cards, no decorative status dots.
- Motion: none beyond native focus/hover states until there's a reason.

## Acceptance Criteria

- [ ] AC1: `pnpm build` passes; `npx tsc --noEmit` clean on fresh clone (verify: CI run green)
- [ ] AC2: Create program of type `dx`, check 2 activities + 1 nonNeg, reload → state identical (verify: Playwright E2E, local prod build)
- [ ] AC3: Portfolio dashboard shows ≥2 programs with correct independent progress (verify: Playwright still)
- [ ] AC4: Editing a checklist item (notes/owner/due) persists and appears in History event log (verify: prod E2E)
- [ ] AC5: `check-catalog` script fails CI when a slug is deleted (verify: local run with deliberately broken catalog)
- [ ] AC6: Report view renders complete program state and prints without layout breakage (verify: Playwright PDF still)
- [ ] AC7: JSON export → wipe program → JSON import → identical state (verify: prod E2E)
- [ ] AC8: `main` deploys to Railway; live URL serves verified SHA (verify: meta.buildId / live JS strings check)
- [ ] AC9: Zero [NEEDS CLARIFICATION] markers remain in this plan before status:active
- [ ] AC10: Visual gate passed: dashboard + workspace stills reviewed by user, anti-slop gates run

## Files (new — repo is currently the single HTML file)

- `src/content/catalog.ts` — typed program/phase/item content with slugs
- `prisma/schema.prisma`, `prisma/migrations/`
- `src/server/routers/{programs,items}.ts` — tRPC
- `src/app/(dashboard)/page.tsx` — portfolio
- `src/app/program/[id]/page.tsx` — workspace
- `src/app/program/[id]/report/page.tsx` — report/print
- `src/styles/tokens.css`
- `scripts/check-catalog.ts`
- `Stratum-Program-Toolkit.html` → `docs/v1-reference.html` (kept as artifact)

## Out of Scope

- Multi-tenant orgs/SSO; roles beyond auth model chosen below
- AI assistant features (candidate for v3: LLM-assisted "describe your program → suggested setup" per user's structured-input preference — noted, not built)
- Mobile native; responsive web only
- ETL/integration with external O&G systems

## Decisions (resolved 2026-08-26)

1. **Auth:** single shared passphrase via `APP_PASSCODE` env var + httpOnly cookie; no per-user accounts. (User decision: he is the main user.)
2. **Hosting:** Railway prod-only, single env watching `main`. No staging. (User decision: small app, main user is the owner.)
3. **Repo:** public GitHub repo `pmocockpit` at creation; user will flip to private manually; **Railway linking must wait until the repo is private** (user decision 2026-08-26: "railway only after the repo is private").

## Risks

- **Catalog slug discipline** is the load-bearing decision — the CI guard must exist before any content edits happen, not after.
- Prisma 7 + Next.js build quirks on Railway — known mitigations exist from prior projects (pnpm bin paths, no ambient NODE_PATH).
- Scope: aggressive-feature preference means Phases 2–3 could balloon; the lazy-item-creation + derived-progress pattern keeps the data layer small enough to hold it.
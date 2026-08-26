/**
 * check-catalog — guard for src/content/catalog.ts.
 *
 * User progress is keyed by item slug, so the catalog must only change
 * consciously. This script fails (exit 1, listing ALL violations) when:
 *   a. a slug does not match /^p\d+\.[a-z0-9]+(-[a-z0-9]+)*$/
 *      (or its phase prefix disagrees with the phase it lives in)
 *   b. a slug is duplicated within one (typeId, phaseId, group)
 *   c. any text/objective/tips field is empty or whitespace-only
 *   d. structure is incomplete: unknown/missing typeId, missing phase 0..6,
 *      or a phase with no activities or no non-negotiables
 *   e. CATALOG_SCHEMA_VERSION is not a positive integer
 *
 * With --verify-against-v1 it additionally asserts that EVERY catalog string
 * (items, objectives, tips, phase titles, program-type metadata) appears
 * verbatim in docs/v1-reference.html — the permanent verbatim fidelity gate.
 *
 * Run: pnpm check:catalog          (structural checks)
 *      pnpm check:catalog -- --verify-against-v1
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CATALOG_SCHEMA_VERSION,
  PHASE_CONTENT,
  PHASE_IDS,
  PHASES,
  PROGRAM_TYPES,
  PROGRAM_TYPE_IDS,
} from "../src/content/catalog";

const SLUG_RE = /^p\d+\.[a-z0-9]+(-[a-z0-9]+)*$/;
const GROUPS = ["activities", "nonNeg"] as const;

const violations: string[] = [];
const note = (msg: string): void => {
  violations.push(msg);
};

// ---- (e) schema version ----
if (!Number.isInteger(CATALOG_SCHEMA_VERSION) || CATALOG_SCHEMA_VERSION <= 0) {
  note(`CATALOG_SCHEMA_VERSION must be a positive integer, got: ${String(CATALOG_SCHEMA_VERSION)}`);
}

// ---- phases ----
if (PHASES.length !== 7) note(`PHASES must have 7 entries, got ${PHASES.length}`);
const phaseIdSet = new Set(PHASES.map((p) => p.id));
for (const p of PHASES) {
  if (!p.title.trim()) note(`phase ${p.id}: empty title`);
  if (!p.short.trim()) note(`phase ${p.id}: empty short`);
}
for (const id of [0, 1, 2, 3, 4, 5, 6]) {
  if (!phaseIdSet.has(id)) note(`PHASES is missing phase id ${id}`);
}

// ---- program types ----
if (PROGRAM_TYPES.length !== 9) note(`PROGRAM_TYPES must have 9 entries, got ${PROGRAM_TYPES.length}`);
const declaredTypeIds = new Set<string>();
for (const t of PROGRAM_TYPES) {
  if (declaredTypeIds.has(t.typeId)) note(`PROGRAM_TYPES: duplicate typeId "${t.typeId}"`);
  declaredTypeIds.add(t.typeId);
  for (const field of ["name", "shortName", "tagline", "focus", "horizon"] as const) {
    if (!t[field].trim()) note(`PROGRAM_TYPES ${t.typeId}: empty ${field}`);
  }
  if (t.risks.length === 0) note(`PROGRAM_TYPES ${t.typeId}: risks is empty`);
  if (t.kpis.length === 0) note(`PROGRAM_TYPES ${t.typeId}: kpis is empty`);
  for (const s of [...t.risks, ...t.kpis]) {
    if (!s.trim()) note(`PROGRAM_TYPES ${t.typeId}: empty risk/kpi string`);
  }
}

// ---- (d) PHASE_CONTENT structure ----
const contentTypes = Object.keys(PHASE_CONTENT);
for (const typeId of contentTypes) {
  if (!declaredTypeIds.has(typeId)) note(`PHASE_CONTENT: typeId "${typeId}" not declared in PROGRAM_TYPES`);
}
for (const typeId of declaredTypeIds) {
  const byPhase = PHASE_CONTENT[typeId];
  if (!byPhase) {
    note(`PHASE_CONTENT: missing typeId "${typeId}"`);
    continue;
  }
  const phaseKeys = Object.keys(byPhase).map(Number).sort((a, b) => a - b);
  for (const id of [0, 1, 2, 3, 4, 5, 6]) {
    if (!phaseKeys.includes(id)) note(`PHASE_CONTENT ${typeId}: missing phase ${id}`);
  }
  for (const key of phaseKeys) {
    if (!PHASE_IDS.includes(key)) note(`PHASE_CONTENT ${typeId}: unexpected phase ${key} (expected 0..6)`);
  }
  for (const phaseId of phaseKeys) {
    const content = byPhase[phaseId];
    if (!content) continue;
    if (!content.objective.trim()) note(`PHASE_CONTENT ${typeId}/${phaseId}: empty objective`);
    if (!content.tips.trim()) note(`PHASE_CONTENT ${typeId}/${phaseId}: empty tips`);
    if (content.activities.length < 1) note(`PHASE_CONTENT ${typeId}/${phaseId}: no activities`);
    if (content.nonNeg.length < 1) note(`PHASE_CONTENT ${typeId}/${phaseId}: no nonNeg`);

    for (const group of GROUPS) {
      const seen = new Map<string, number>();
      const items = content[group];
      items.forEach((item, idx) => {
        const where = `${typeId}/${phaseId}/${group}[${idx}]`;
        // (c) text
        if (!item.text.trim()) note(`empty text at ${where} (slug ${item.slug})`);
        // (a) slug format
        if (!SLUG_RE.test(item.slug)) {
          note(`malformed slug "${item.slug}" at ${where} (must match ${SLUG_RE})`);
        } else {
          const prefix = Number(item.slug.slice(1, item.slug.indexOf(".")));
          if (prefix !== phaseId) {
            note(`slug "${item.slug}" at ${where} has phase prefix p${prefix} but lives in phase ${phaseId}`);
          }
        }
        // (b) duplicates within (typeId, phaseId, group)
        const prev = seen.get(item.slug);
        if (prev !== undefined) {
          note(`duplicate slug "${item.slug}" in ${typeId}/${phaseId}/${group} (indexes ${prev} and ${idx})`);
        } else {
          seen.set(item.slug, idx);
        }
      });
    }
  }
}

// ---- optional: verbatim fidelity against the v1 source ----
let v1Checked = 0;
const verifyV1 = process.argv.includes("--verify-against-v1");
if (verifyV1) {
  const v1Path = path.resolve(process.cwd(), "docs/v1-reference.html");
  let html: string;
  try {
    html = readFileSync(v1Path, "utf8");
  } catch {
    note(`--verify-against-v1: cannot read ${v1Path}`);
    html = "";
  }

  // Collect every user-facing string in the catalog.
  const strings: { where: string; value: string }[] = [];
  for (const p of PHASES) {
    strings.push({ where: `PHASES ${p.id} title`, value: p.title });
    strings.push({ where: `PHASES ${p.id} short`, value: p.short });
  }
  for (const t of PROGRAM_TYPES) {
    for (const field of ["name", "shortName", "tagline", "focus", "horizon"] as const) {
      strings.push({ where: `PROGRAM_TYPES ${t.typeId}.${field}`, value: t[field] });
    }
    t.risks.forEach((r, i) => strings.push({ where: `PROGRAM_TYPES ${t.typeId}.risks[${i}]`, value: r }));
    t.kpis.forEach((k, i) => strings.push({ where: `PROGRAM_TYPES ${t.typeId}.kpis[${i}]`, value: k }));
  }
  for (const typeId of Object.keys(PHASE_CONTENT)) {
    for (const phaseStr of Object.keys(PHASE_CONTENT[typeId])) {
      const content = PHASE_CONTENT[typeId][Number(phaseStr)];
      if (!content) continue;
      strings.push({ where: `${typeId}/${phaseStr} objective`, value: content.objective });
      strings.push({ where: `${typeId}/${phaseStr} tips`, value: content.tips });
      for (const group of GROUPS) {
        content[group].forEach((item) => {
          strings.push({ where: `${typeId}/${phaseStr}/${group} ${item.slug}`, value: item.text });
        });
      }
    }
  }

  // The v1 file stores these as plain JS string literals inside double quotes.
  // Match the full string; if a value ever contains a double quote it would be
  // escaped as \" in the source, so fall back to requiring each quote-free
  // fragment (>= 8 chars) to appear verbatim.
  const missing: string[] = [];
  for (const { where, value } of strings) {
    const fragments = value.includes('"') ? value.split('"').filter((f) => f.length >= 8) : [value];
    const ok = fragments.every((f) => html.includes(f));
    if (!ok) missing.push(where);
    v1Checked++;
  }
  for (const where of missing) {
    note(`--verify-against-v1: "${where}" not found verbatim in docs/v1-reference.html`);
  }

  // Show a deterministic sample of 6 verified items as evidence.
  const itemStrings = strings.filter((s) => s.where.includes("/activities ") || s.where.includes("/nonNeg "));
  const step = Math.max(1, Math.floor(itemStrings.length / 6));
  const sample: string[] = [];
  for (let i = 0; i < itemStrings.length && sample.length < 6; i += step) {
    const s = itemStrings[i];
    sample.push(`  ✓ ${s.where}: "${s.value.length > 80 ? `${s.value.slice(0, 80)}…` : s.value}"`);
  }
  if (missing.length === 0) console.log(`verbatim sample (6 of ${itemStrings.length} items):\n${sample.join("\n")}`);
}

// ---- verdict ----
if (violations.length > 0) {
  console.error(`check-catalog FAIL — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}

let act = 0;
let nn = 0;
for (const typeId of PROGRAM_TYPE_IDS) {
  for (const phaseId of PHASE_IDS) {
    const content = PHASE_CONTENT[typeId][phaseId];
    if (!content) continue;
    act += content.activities.length;
    nn += content.nonNeg.length;
  }
}
const v1Note = verifyV1 ? `, ${v1Checked} strings verified verbatim against docs/v1-reference.html` : "";
console.log(
  `check-catalog OK — ${PROGRAM_TYPES.length} types × ${PHASES.length} phases, ${act} activities + ${nn} nonNeg = ${act + nn} items (schema v${CATALOG_SCHEMA_VERSION})${v1Note}`,
);

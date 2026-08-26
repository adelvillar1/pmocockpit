// Derived progress helpers — progress is ALWAYS computed from item rows,
// never stored. Source of truth for the expected item set is the catalog
// (getPhaseContent), so items missing from the DB count as not-done.

import { getPhaseContent, PHASE_IDS } from "@/content/catalog";

/** Minimal structural shape of a stored checklist item. */
export interface ItemLike {
  itemKey: string;
  group: string;
  status: string;
}

export interface PhaseProgress {
  phaseId: number;
  /** nonNeg items with status "done" */
  done: number;
  /** nonNeg items with status "na" */
  na: number;
  /** total expected nonNeg items for this phase (from the catalog) */
  total: number;
  /** true when every nonNeg item is "done" or "na" (and total > 0) */
  phaseDone: boolean;
}

/**
 * Progress for a single phase, nonNeg items only.
 * Uses the catalog as the expected item set: items present in the DB but not
 * in the catalog are ignored; catalog items absent from the DB count as todo.
 */
export function phaseProgress(
  items: ItemLike[],
  typeId: string,
  phaseId: number,
): PhaseProgress {
  const expected = getPhaseContent(typeId, phaseId).nonNeg.map((i) => i.slug);
  const byKey = new Map<string, ItemLike>();
  for (const item of items) {
    if (item.group === "nonNeg") byKey.set(item.itemKey, item);
  }
  let done = 0;
  let na = 0;
  for (const slug of expected) {
    const status = byKey.get(slug)?.status;
    if (status === "done") done++;
    else if (status === "na") na++;
  }
  const total = expected.length;
  return {
    phaseId,
    done,
    na,
    total,
    phaseDone: total > 0 && done + na === total,
  };
}

export interface OverallProgress {
  phases: PhaseProgress[];
  /** done nonNeg / total nonNeg across all phases, 0..100; 0 when total = 0 */
  overallPct: number;
  done: number;
  na: number;
  total: number;
}

/** Progress across all phases of a program type, nonNeg items only. */
export function overallProgress(
  items: ItemLike[],
  typeId: string,
): OverallProgress {
  const phases = PHASE_IDS.map((phaseId) =>
    phaseProgress(items, typeId, phaseId),
  );
  let done = 0;
  let na = 0;
  let total = 0;
  for (const p of phases) {
    done += p.done;
    na += p.na;
    total += p.total;
  }
  return {
    phases,
    overallPct: total === 0 ? 0 : Math.round((done / total) * 1000) / 10,
    done,
    na,
    total,
  };
}

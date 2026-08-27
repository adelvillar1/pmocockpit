// Shared helpers for the program workspace UI.

import { PHASES } from "@/content/catalog";

/** Normalized view of one checklist item row (DB rows and optimistic
 *  overrides share this shape in the UI). */
export interface ItemView {
  itemKey: string;
  group: string;
  status: string;
  notes: string | null;
  owner: string | null;
  dueDate: Date | null;
  completedAt: Date | null;
}

export type ItemStatus = "todo" | "done" | "na";

/**
 * Normalize a program row into an itemKey -> ItemView map. Optimistic
 * updates always apply through this function so both paths stay consistent.
 */
export function itemsBySlug(
  items: ItemView[],
): Record<string, ItemView | undefined> {
  const map: Record<string, ItemView | undefined> = {};
  for (const item of items) map[item.itemKey] = item;
  return map;
}

export function formatDue(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** "2m ago" / "3h ago" style relative time, floored to sensible units. */
export function relativeTime(date: Date, now: number = Date.now()): string {
  const secs = Math.max(0, Math.floor((now - date.getTime()) / 1000));
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function shortDueLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Human-readable line for one program event (history drawer). */
export function eventLine(
  kind: string,
  itemKey: string | null,
  payload: unknown,
): string {
  const key = itemKey ? `'${itemKey}'` : "";
  switch (kind) {
    case "program_created":
      return "Program created";
    case "item_done":
      return `Marked ${key} done`;
    case "item_reopened":
      return `Reopened ${key}`;
    case "item_na":
      return `Marked ${key} not applicable`;
    case "note_edited": {
      const fields = Array.isArray(
        (payload as { fields?: unknown } | null)?.fields,
      )
        ? ((payload as { fields: string[] }).fields.join(", "))
        : "";
      return `Note edited on ${key}${fields ? ` (${fields})` : ""}`;
    }
    case "status_changed": {
      const p = payload as { from?: string; to?: string } | null;
      return p?.from && p?.to
        ? `Status changed ${p.from} → ${p.to}`
        : "Status changed";
    }
    case "phase_completed":
      return `Phase completed${itemKey ? ` (${itemKey})` : ""}`;
    default:
      return kind.replaceAll("_", " ");
  }
}

export function phaseTitle(phaseIndex: number): string {
  return PHASES[phaseIndex]?.title ?? "";
}

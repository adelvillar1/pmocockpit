"use client";

import { useEffect, useRef, useState } from "react";
import type { CatalogItem } from "@/content/catalog";
import {
  formatDue,
  itemsBySlug,
  shortDueLabel,
  type ItemStatus,
  type ItemView,
} from "./shared";

const DAY_MS = 24 * 60 * 60 * 1000;

/** One checklist row: checkbox, text, Required chip, N/A toggle, note
 *  affordance, and the expandable notes/owner/due editor. */
function ChecklistRow({
  catalogItem,
  item,
  required,
  onSetStatus,
  onSaveMeta,
}: {
  catalogItem: CatalogItem;
  item: ItemView | undefined;
  required: boolean;
  onSetStatus: (itemKey: string, status: ItemStatus) => void;
  onSaveMeta: (
    itemKey: string,
    meta: { notes: string; owner: string; dueDate: Date | null },
  ) => Promise<void> | void;
}) {
  const status = item?.status ?? "todo";
  const done = status === "done";
  const na = status === "na";
  const [open, setOpen] = useState(false);

  const hasMeta = Boolean(item?.notes || item?.owner || item?.dueDate);
  const dueDate = item?.dueDate ?? null;
  const overdue = dueDate !== null && !done && dueDate.getTime() < Date.now();
  const dueSoon =
    dueDate !== null &&
    !done &&
    !overdue &&
    dueDate.getTime() - Date.now() < 7 * DAY_MS;

  return (
    <li>
      <div className="ws-item-row">
        <input
          type="checkbox"
          checked={done}
          onChange={(e) =>
            onSetStatus(catalogItem.slug, e.target.checked ? "done" : "todo")
          }
          aria-label={catalogItem.text}
          data-testid={`check-${catalogItem.slug}`}
        />
        <div className="ws-item-body">
          <label
            className={done ? "ws-item-label done" : "ws-item-label"}
            htmlFor={`meta-${catalogItem.slug}`}
          >
            {catalogItem.text}
            {required && (
              <>
                {" "}
                <span className="ws-chip warn">Required</span>
              </>
            )}
          </label>
          {(hasMeta || na) && (
            <div className="ws-item-chips">
              {na && <span className="ws-chip ok">N/A</span>}
              {item?.owner && (
                <span className="ws-mini-chip">Owner · {item.owner}</span>
              )}
              {dueDate && (
                <span
                  className={
                    overdue
                      ? "ws-mini-chip overdue"
                      : dueSoon
                        ? "ws-mini-chip due-soon"
                        : "ws-mini-chip"
                  }
                  title={formatDue(dueDate)}
                >
                  Due {shortDueLabel(dueDate)}
                </span>
              )}
            </div>
          )}
          {open && (
            <MetaEditor
              itemKey={catalogItem.slug}
              initial={{
                notes: item?.notes ?? "",
                owner: item?.owner ?? "",
                dueDate: dueDate,
              }}
              onSave={onSaveMeta}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
        <button
          type="button"
          className={na ? "ws-na-btn active" : "ws-na-btn"}
          onClick={() => onSetStatus(catalogItem.slug, na ? "todo" : "na")}
          title="Mark not applicable"
          data-testid={`na-${catalogItem.slug}`}
        >
          N/A
        </button>
        <button
          type="button"
          className={open ? "ws-open-note open" : "ws-open-note"}
          onClick={() => setOpen((o) => !o)}
          data-testid={`note-${catalogItem.slug}`}
        >
          {open ? "Close" : hasMeta ? "Edit note" : "Add note"}
        </button>
      </div>
    </li>
  );
}

/** Inline structured editor: notes (textarea), owner (text), due (date). */
function MetaEditor({
  itemKey,
  initial,
  onSave,
  onClose,
}: {
  itemKey: string;
  initial: { notes: string; owner: string; dueDate: Date | null };
  onSave: (
    itemKey: string,
    meta: { notes: string; owner: string; dueDate: Date | null },
  ) => Promise<void> | void;
  onClose: () => void;
}) {
  const [notes, setNotes] = useState(initial.notes);
  const [owner, setOwner] = useState(initial.owner);
  const [due, setDue] = useState(
    initial.dueDate ? initial.dueDate.toISOString().slice(0, 10) : "",
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirtyRef = useRef(false);

  const markDirty = () => {
    dirtyRef.current = true;
    setSaved(false);
  };

  const dirty =
    notes !== initial.notes ||
    owner !== initial.owner ||
    due !== (initial.dueDate ? initial.dueDate.toISOString().slice(0, 10) : "");

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave(itemKey, {
        notes: notes.trim(),
        owner: owner.trim(),
        dueDate: due ? new Date(`${due}T00:00:00`) : null,
      });
      dirtyRef.current = false;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ws-item-editor" data-testid={`editor-${itemKey}`}>
      <label className="ws-field">
        Notes
        <textarea
          id={`meta-${itemKey}`}
          value={notes}
          placeholder="Context, links, decisions…"
          onChange={(e) => {
            setNotes(e.target.value);
            markDirty();
          }}
        />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <label className="ws-field">
          Owner
          <input
            type="text"
            value={owner}
            placeholder="Name or role"
            onChange={(e) => {
              setOwner(e.target.value);
              markDirty();
            }}
          />
        </label>
        <label className="ws-field">
          Due date
          <input
            type="date"
            value={due}
            onChange={(e) => {
              setDue(e.target.value);
              markDirty();
            }}
          />
        </label>
      </div>
      <div className="ws-editor-actions">
        {saved && <span className="ws-saved">Saved</span>}
        <button type="button" className="ws-btn ghost small" onClick={onClose}>
          Close
        </button>
        <button
          type="button"
          className="ws-btn primary small"
          onClick={() => void save()}
          disabled={saving || !dirty}
          data-testid={`save-${itemKey}`}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

/** A full checklist card (activities or nonNeg) for one phase. */
export function Checklist({
  programId,
  title,
  subtitle,
  catalogItems,
  items,
  required,
  warn,
  phaseComplete,
  onSetStatus,
  onSaveMeta,
}: {
  programId: string;
  title: string;
  subtitle?: string;
  catalogItems: CatalogItem[];
  items: ItemView[];
  required: boolean;
  warn?: boolean;
  phaseComplete?: boolean;
  onSetStatus: (itemKey: string, status: ItemStatus) => void;
  onSaveMeta: (
    itemKey: string,
    meta: { notes: string; owner: string; dueDate: Date | null },
  ) => Promise<void> | void;
}) {
  const bySlug = itemsBySlug(items);
  return (
    <section className={warn ? "ws-card warn" : "ws-card"}>
      <h2 className="ws-card-title">{title}</h2>
      {subtitle && <p className="ws-card-sub">{subtitle}</p>}
      <ul className="ws-list">
        {catalogItems.map((catalogItem) => (
          <ChecklistRow
            key={catalogItem.slug}
            catalogItem={catalogItem}
            item={bySlug[catalogItem.slug]}
            required={required}
            onSetStatus={onSetStatus}
            onSaveMeta={onSaveMeta}
          />
        ))}
      </ul>
      {phaseComplete && (
        <p className="ws-phase-complete" data-testid="phase-complete">
          Phase complete — every non-negotiable is done or waived.
        </p>
      )}
    </section>
  );
}

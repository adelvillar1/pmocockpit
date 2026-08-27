"use client";

import { useEffect, useState } from "react";
import { eventLine, relativeTime } from "./shared";

interface WorkspaceEvent {
  id: string;
  kind: string;
  itemKey: string | null;
  payload: unknown;
  createdAt: Date;
}

/**
 * Collapsible history panel at the bottom of the sidebar. Newest events
 * first; relative timestamps refresh every 30s while open.
 */
export function HistoryPanel({ events }: { events: WorkspaceEvent[] }) {
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(timer);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="ws-history-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        History · {events.length} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="ws-history" data-testid="history">
          {events.length === 0 ? (
            <p className="ws-muted" style={{ fontSize: "0.8rem" }}>
              No activity yet.
            </p>
          ) : (
            <ol>
              {events.map((event) => (
                <li key={event.id}>
                  {eventLine(event.kind, event.itemKey, event.payload)}
                  <time dateTime={event.createdAt.toISOString()}>
                    {relativeTime(event.createdAt)}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </>
  );
}

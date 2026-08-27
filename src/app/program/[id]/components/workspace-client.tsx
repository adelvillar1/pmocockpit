"use client";

import type { inferRouterOutputs } from "@trpc/server";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { AppRouter } from "@/server/routers/_app";
import {
  PHASES,
  PROGRAM_TYPES,
  getPhaseContent,
} from "@/content/catalog";
import { overallProgress, phaseProgress } from "@/server/progress";
import { trpc } from "@/trpc-client";
import { Checklist } from "./checklist";
import { HistoryPanel } from "./history-panel";
import type { ItemStatus } from "./shared";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type ProgramData = RouterOutputs["programs"]["get"];

type ItemPatch = Partial<{
  status: ItemStatus;
  notes: string | null;
  owner: string | null;
  dueDate: Date | null;
  completedAt: Date | null;
}>;

const PROGRAM_STATUSES = ["active", "paused", "complete", "archived"] as const;
function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * Program workspace: sidebar phase nav + per-phase checklists, inline item
 * meta editor, history drawer, and program status controls. All writes are
 * optimistic against the programs.get cache — no page reloads.
 */
export function ProgramWorkspace({
  id,
  initial,
}: {
  id: string;
  initial: ProgramData | null;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  const programQuery = trpc.programs.get.useQuery(
    { id },
    { initialData: initial ?? undefined },
  );
  const program = programQuery.data;

  const [phaseIndex, setPhaseIndex] = useState(0);

  // ---- optimistic cache helpers (programs.get is the single cache) ----
  // tRPC v11 query keys: [["programs","get"], { input, type: "query" }].
  const patchProgram = (fn: (draft: ProgramData) => ProgramData) => {
    queryClient.setQueryData<ProgramData>(
      [["programs", "get"], { input: { id }, type: "query" }],
      (prev) => (prev ? fn(prev) : prev),
    );
  };

  const patchItem = (itemKey: string, patch: ItemPatch) => {
    patchProgram((draft) => {
      const items = draft.items.map((item) =>
        item.itemKey === itemKey ? { ...item, ...patch } : item,
      );
      return { ...draft, items };
    });
  };

  // ---- mutations ----
  const setStatus = trpc.items.setStatus.useMutation({
    onMutate: ({ itemKey, status }) => {
      patchItem(itemKey, {
        status,
        completedAt: status === "done" ? new Date() : null,
      });
    },
    onSettled: () => {
      void utils.programs.get.invalidate({ id });
      void utils.programs.list.invalidate();
    },
  });

  const saveMeta = trpc.items.updateMeta.useMutation({
    onMutate: ({ itemKey, notes, owner, dueDate }) => {
      patchItem(itemKey, {
        notes: notes ?? null,
        owner: owner ?? null,
        dueDate: dueDate ?? null,
      });
    },
    onSettled: () => {
      void utils.programs.get.invalidate({ id });
    },
  });

  const setProgramStatus = trpc.programs.setStatus.useMutation({
    onMutate: ({ status }) => {
      patchProgram((draft) => ({ ...draft, status }));
    },
    onSettled: () => {
      void utils.programs.get.invalidate({ id });
      void utils.programs.list.invalidate();
    },
  });

  const deleteProgram = trpc.programs.delete.useMutation({
    onSuccess: () => {
      void utils.programs.list.invalidate();
      router.push("/");
    },
  });

  // Re-tick relative timestamps in the history drawer every 30s.
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(timer);
  }, []);

  const items = useMemo(() => program?.items ?? [], [program]);
  const overall = useMemo(
    () => (program ? overallProgress(items, program.typeId) : null),
    [items, program],
  );

  if (programQuery.isLoading) {
    return <div className="ws-loading">Loading program…</div>;
  }
  if (!program || !overall) {
    return (
      <div className="ws-notfound">
        <h1 style={{ fontSize: "1.6rem" }}>Program not found</h1>
        <p>
          It may have been deleted.{" "}
          <a href="/" style={{ color: "var(--primary)" }}>
            All programs
          </a>
        </p>
      </div>
    );
  }

  const typeDef = PROGRAM_TYPES.find((t) => t.typeId === program.typeId);
  const phase = PHASES[phaseIndex] ?? PHASES[0]!;
  const content = getPhaseContent(program.typeId, phase.id);
  const phaseProg = phaseProgress(items, program.typeId, phase.id);
  const phaseItems = items.filter((item) =>
    item.itemKey.startsWith(`p${phase.id}.`),
  );

  const handleSetStatus = (itemKey: string, status: ItemStatus) => {
    setStatus.mutate({ programId: program.id, itemKey, status });
  };
  const handleSaveMeta = async (
    itemKey: string,
    meta: { notes: string; owner: string; dueDate: Date | null },
  ) => {
    await saveMeta.mutateAsync({
      programId: program.id,
      itemKey,
      notes: meta.notes || null,
      owner: meta.owner || null,
      dueDate: meta.dueDate,
    });
  };

  const handleExport = async () => {
    try {
      const exported = await utils.programs.exportJson.fetch({
        id: program.id,
      });
      download(
        `${program.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`,
        JSON.stringify(exported, null, 2),
      );
    } catch {
      // Export is best-effort; the cache invalidate below re-syncs anyway.
      void utils.programs.get.invalidate({ id });
    }
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${program.name}"? This removes all progress and history.`,
      )
    ) {
      deleteProgram.mutate({ id: program.id });
    }
  };

  const navRows = PHASES.map((ph) => {
    const prog = phaseProgress(items, program.typeId, ph.id);
    const on = phaseIndex === ph.id;
    return (
      <button
        key={ph.id}
        type="button"
        className={on ? "ws-nav-btn on" : "ws-nav-btn"}
        onClick={() => setPhaseIndex(ph.id)}
        data-testid={`nav-${ph.id}`}
      >
        <span className={prog.phaseDone ? "ws-num done" : "ws-num"}>
          {prog.phaseDone ? "✓" : ph.id + 1}
        </span>
        {ph.short}
      </button>
    );
  });

  const sideActions = (
    <>
      <a
        href={`/program/${program.id}/report`}
        className="ws-btn"
        style={linkButtonStyle}
      >
        Report
      </a>
      <button
        type="button"
        className="ws-btn"
        onClick={() => void handleExport()}
        data-testid="export"
      >
        Export JSON
      </button>
      <select
        className="ws-select"
        value={program.status}
        onChange={(e) =>
          setProgramStatus.mutate({
            id: program.id,
            status: e.target.value as (typeof PROGRAM_STATUSES)[number],
          })
        }
        aria-label="Program status"
        data-testid="status-select"
      >
        {PROGRAM_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status[0]!.toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="ws-btn ghost danger"
        onClick={handleDelete}
        data-testid="delete"
      >
        Delete program
      </button>
      <a href="/" className="ws-btn ghost" style={linkButtonStyle}>
        All programs
      </a>
    </>
  );

  return (
    <div className="ws-layout">
      {/* Desktop sidebar */}
      <aside className="ws-sidebar fixed">
        <div className="ws-brand">
          <h2>Stratum</h2>
          <p>Program command</p>
        </div>
        <div className="ws-prog">
          <div className="ws-prog-top">
            <span>Non-negotiables</span>
            <b>{Math.round(overall.overallPct)}%</b>
          </div>
          <div className="ws-bar">
            <i style={{ width: `${overall.overallPct}%` }} />
          </div>
          <p className="ws-prog-note">
            {overall.done} of {overall.total} complete
            {overall.na > 0 ? ` · ${overall.na} n/a` : ""}
          </p>
          <p className="ws-prog-name">{program.name}</p>
          <div className="ws-prog-chips">
            <span className="ws-chip">{typeDef?.shortName ?? program.typeId}</span>
            <span
              className={
                program.status === "complete"
                  ? "ws-chip ok"
                  : program.status === "paused"
                    ? "ws-chip paused"
                    : program.status === "archived"
                      ? "ws-chip paused"
                      : "ws-chip"
              }
            >
              {program.status}
            </span>
          </div>
        </div>
        <nav className="ws-nav">{navRows}</nav>
        <HistoryPanel events={program.events} />
        <div className="ws-side-actions">{sideActions}</div>
      </aside>

      {/* Mobile top bar: brand row + horizontal phase scroller */}
      <div className="ws-topbar">
        <div className="ws-topbar-head">
          <strong>{program.name}</strong>
          <span className="ws-chip">{typeDef?.shortName ?? program.typeId}</span>
        </div>
        <div className="ws-scroller">{navRows}</div>
        <div className="ws-mobile-actions">{sideActions}</div>
      </div>

      <main className="ws-main">
        <div className="ws-inner">
          <div className="ws-banner">
            <div className="row">
              <strong>{program.name}</strong>
              <span className="ws-chip">Phase {phaseIndex + 1} of 7</span>
            </div>
            {typeDef && <p className="tagline">{typeDef.tagline}</p>}
          </div>

          <h1 className="ws-phase-title">{phase.title}</h1>
          <p className="ws-objective">{content.objective}</p>

          {phaseIndex === 0 && typeDef && (
            <section className="ws-card">
              <p className="ws-subtle">Typical horizon</p>
              <p style={{ margin: "0.35rem 0 0" }}>{typeDef.horizon}</p>
              <p className="ws-subtle" style={{ marginTop: "1rem" }}>
                Focus
              </p>
              <p className="ws-muted" style={{ margin: "0.35rem 0 0" }}>
                {typeDef.focus}
              </p>
              <p className="ws-subtle" style={{ marginTop: "1rem" }}>
                Watch for
              </p>
              <ul className="ws-plain-list">
                {typeDef.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </section>
          )}

          <Checklist
            programId={program.id}
            title="Activities"
            catalogItems={content.activities}
            items={phaseItems}
            required={false}
            onSetStatus={handleSetStatus}
            onSaveMeta={handleSaveMeta}
          />

          <Checklist
            programId={program.id}
            title="Non-negotiable deliverables"
            subtitle="A phase is complete only when every item here is done."
            catalogItems={content.nonNeg}
            items={phaseItems}
            required
            warn
            phaseComplete={phaseProg.phaseDone}
            onSetStatus={handleSetStatus}
            onSaveMeta={handleSaveMeta}
          />

          <section className="ws-card">
            <p className="ws-subtle">Oil and gas considerations</p>
            <p className="ws-muted" style={{ margin: "0.35rem 0 0" }}>
              {content.tips}
            </p>
            {phaseIndex === 0 && typeDef && (
              <>
                <p className="ws-subtle" style={{ marginTop: "1rem" }}>
                  Success measures
                </p>
                <ul className="ws-plain-list">
                  {typeDef.kpis.map((kpi) => (
                    <li key={kpi}>{kpi}</li>
                  ))}
                </ul>
              </>
            )}
            {phaseIndex === 6 && (
              <>
                <p className="ws-subtle" style={{ marginTop: "1rem" }}>
                  Cadence after go-live
                </p>
                <p className="ws-muted" style={{ margin: "0.35rem 0 0" }}>
                  <strong>Monthly</strong> — value vs baseline, adoption, open
                  risks.
                  <br />
                  <strong>Quarterly</strong> — roadmap refresh, stage-gate
                  funding, capability gaps.
                  <br />
                  <strong>Annually</strong> — operating-model review, skills
                  pipeline, cyber and data-quality audit.
                </p>
              </>
            )}
          </section>

          <div className="ws-nav-btns">
            <button
              type="button"
              className="ws-btn"
              disabled={phaseIndex === 0}
              onClick={() => setPhaseIndex((p) => Math.max(0, p - 1))}
              data-testid="prev-phase"
            >
              Previous
            </button>
            <button
              type="button"
              className="ws-btn primary"
              disabled={phaseIndex === PHASES.length - 1}
              onClick={() =>
                setPhaseIndex((p) => Math.min(PHASES.length - 1, p + 1))
              }
              data-testid="next-phase"
            >
              Next phase
            </button>
          </div>
          <p className="ws-stepper">
            {phaseIndex + 1} / {PHASES.length} · {phase.short}
          </p>
        </div>
      </main>
    </div>
  );
}

const linkButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

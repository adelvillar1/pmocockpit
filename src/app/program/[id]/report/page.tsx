import type { Metadata } from "next";
import { createCallerFactory } from "@/server/trpc";
import { createContext } from "@/server/trpc";
import { appRouter } from "@/server/routers/_app";
import { prisma } from "@/server/db";
import { PHASES, PROGRAM_TYPES, getPhaseContent } from "@/content/catalog";
import { overallProgress, phaseProgress } from "@/server/progress";
import { PrintButton } from "./print-button";
import "./report.css";

export const metadata: Metadata = {
  title: "Program report — Stratum",
};

const caller = createCallerFactory(appRouter)(createContext());

const dateFmt = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function fmtDate(value: Date | null): string {
  return value ? dateFmt.format(value) : "—";
}

const STATUS_LABEL: Record<string, string> = {
  done: "Done",
  todo: "To do",
  na: "N/A",
};

type ProgramData = Awaited<ReturnType<typeof caller.programs.get>>;
type Item = ProgramData["items"][number];

/** Item text + record for one catalog slug (missing record = untouched todo). */
function ItemRows({
  catalogItems,
  byKey,
  required,
}: {
  catalogItems: { slug: string; text: string }[];
  byKey: Map<string, Item>;
  required: boolean;
}) {
  return (
    <table className="report-table">
      <thead>
        <tr>
          <th style={{ width: "34%" }}>{required ? "Deliverable" : "Activity"}</th>
          <th style={{ width: "12%" }}>Status</th>
          <th style={{ width: "18%" }}>Owner</th>
          <th style={{ width: "18%" }}>Due</th>
          <th style={{ width: "18%" }}>Completed</th>
        </tr>
      </thead>
      <tbody>
        {catalogItems.map((catalogItem) => {
          const item = byKey.get(catalogItem.slug);
          const status = item?.status ?? "todo";
          return (
            <tr key={catalogItem.slug}>
              <td className="item-cell">
                {catalogItem.text}
                {item?.notes && <p className="report-notes">{item.notes}</p>}
              </td>
              <td>
                <span className={`report-status ${status}`}>
                  {STATUS_LABEL[status] ?? status}
                </span>
              </td>
              <td className="meta-cell">{item?.owner || "—"}</td>
              <td className="meta-cell">{fmtDate(item?.dueDate ?? null)}</td>
              <td className="meta-cell">{fmtDate(item?.completedAt ?? null)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let program: ProgramData | null = null;
  try {
    program = await caller.programs.get({ id });
  } catch {
    program = null;
  }

  if (!program) {
    return (
      <div className="report">
        <h1 className="report-title">Program not found</h1>
        <p>
          It may have been deleted.{""}
          <a href="/" style={{ color: "var(--primary)" }}>
            {" "}
            All programs
          </a>
        </p>
      </div>
    );
  }

  const typeDef = PROGRAM_TYPES.find((t) => t.typeId === program!.typeId);
  const overall = overallProgress(program.items, program.typeId);
  const byKey = new Map<string, Item>(program.items.map((i) => [i.itemKey, i]));

  // Exact event count and true first event (programs.get caps events at 100,
  // so query the table directly for the report's summary line).
  const [eventCount, firstEvent] = await Promise.all([
    prisma.programEvent.count({ where: { programId: id } }),
    prisma.programEvent.findFirst({
      where: { programId: id },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    }),
  ]);

  const generated = new Date();

  return (
    <div className="report">
      <div className="report-toolbar">
        <a href={`/program/${id}`} className="report-back">
          ← Back to program
        </a>
        <PrintButton />
      </div>

      <header className="report-header">
        <p className="report-kicker">Program report</p>
        <h1 className="report-title">{program.name}</h1>
        <p className="report-meta">
          <span className="report-chip">{typeDef?.name ?? program.typeId}</span>
          <span className="report-chip">{program.status}</span>
          <span>Created {fmtDate(program.createdAt)}</span>
        </p>
        {program.context && <p className="report-context">{program.context}</p>}
        <div className="report-progress">
          <span className="report-pct">{overall.overallPct}%</span>
          <p className="report-progress-note">
            {overall.done} of {overall.total} non-negotiables complete
            {overall.na > 0 ? ` · ${overall.na} marked n/a` : ""}
          </p>
        </div>
        <p className="report-generated">Generated {fmtDate(generated)}</p>
      </header>

      {PHASES.map((phase) => {
        const content = getPhaseContent(program!.typeId, phase.id);
        const prog = phaseProgress(program!.items, program!.typeId, phase.id);
        return (
          <section className="report-phase" key={phase.id}>
            <div className="report-phase-head">
              <span className="report-phase-num">{phase.id + 1}</span>
              <h2>{phase.title}</h2>
              <span className="report-count">
                {prog.done} of {prog.total} non-negotiables
                {prog.na > 0 ? ` · ${prog.na} n/a` : ""}
              </span>
            </div>
            <p className="report-objective">{content.objective}</p>

            <div className="report-list-head">
              <h3>Activities</h3>
            </div>
            <ItemRows
              catalogItems={content.activities}
              byKey={byKey}
              required={false}
            />

            <div className="report-list-head">
              <h3>Non-negotiable deliverables</h3>
              <span className="report-required">Required</span>
            </div>
            <ItemRows
              catalogItems={content.nonNeg}
              byKey={byKey}
              required
            />

            <p className="report-tips">{content.tips}</p>
          </section>
        );
      })}

      <footer className="report-footer">
        {eventCount > 0 && firstEvent ? (
          <p>
            {eventCount} event{eventCount === 1 ? "" : "s"} recorded since{" "}
            {fmtDate(firstEvent.createdAt)}.
          </p>
        ) : (
          <p>No events recorded yet.</p>
        )}
      </footer>
    </div>
  );
}

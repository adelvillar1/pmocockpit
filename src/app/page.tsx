"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { trpc } from "@/trpc-client";
import { PHASES, PROGRAM_TYPES } from "@/content/catalog";

export default function Home() {
  const router = useRouter();
  const programs = trpc.programs.list.useQuery();

  const [creating, setCreating] = useState(false);
  const [typeId, setTypeId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [context, setContext] = useState("");

  const create = trpc.programs.create.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/program/${id}`);
    },
  });

  const importFileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const importProgram = trpc.programs.importJson.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/program/${id}`);
    },
    onError: (error) => {
      setImporting(false);
      setImportError(error.message);
    },
  });

  const pickImportFile = () => {
    setImportError(null);
    importFileRef.current?.click();
  };

  const onImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    setImportError(null);
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as {
        items?: { dueDate?: unknown; completedAt?: unknown }[];
      };
      // The export writes dates as ISO strings; the import schema expects Date.
      if (Array.isArray(payload.items)) {
        for (const item of payload.items) {
          if (typeof item?.dueDate === "string") item.dueDate = new Date(item.dueDate);
          if (typeof item?.completedAt === "string")
            item.completedAt = new Date(item.completedAt);
        }
      }
      importProgram.mutate(payload as never);
    } catch (error) {
      setImporting(false);
      setImportError(
        error instanceof SyntaxError
          ? "That file is not valid JSON."
          : "Could not read the selected file.",
      );
    }
  };

  const openCreate = () => {
    setCreating(true);
    setTypeId(null);
    setName("");
    setContext("");
    create.reset();
  };

  const closeCreate = () => {
    setCreating(false);
    create.reset();
  };

  const submit = () => {
    if (!typeId || name.trim().length === 0 || create.isPending) return;
    create.mutate({
      typeId,
      name: name.trim(),
      context: context.trim() || undefined,
    });
  };

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <main className="home">
      <div className="topbar">
        <button type="button" className="signout" onClick={signOut}>
          Sign out
        </button>
      </div>

      <p className="kicker">Oil and gas program command</p>
      <h1 className="headline">Set up the program. Keep running it.</h1>
      <p className="lede">
        Guided setup and continuous management for DX, ERP, ETRM, AI, twins,
        reliability, integrated operations, and OT security. Progress is
        derived from the non-negotiables you complete.
      </p>

      <div className="section-head">
        <p className="subtle">Programs</p>
        {!creating && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              type="button"
              className="btn ghost"
              onClick={pickImportFile}
              disabled={importing}
              data-testid="import"
            >
              {importing ? "Importing…" : "Import"}
            </button>
            <input
              ref={importFileRef}
              type="file"
              accept="application/json,.json"
              style={{ display: "none" }}
              onChange={(e) => void onImportFile(e)}
            />
            <button type="button" className="btn primary" onClick={openCreate}>
              New program
            </button>
          </div>
        )}
      </div>

      {importError && <p className="form-error">{importError}</p>}

      {creating && (
        <section className="create">
          <p className="subtle">Choose a program type</p>
          <div className="grid">
            {PROGRAM_TYPES.map((type) => (
              <button
                key={type.typeId}
                type="button"
                className={typeId === type.typeId ? "tile selected" : "tile"}
                onClick={() => setTypeId(type.typeId)}
              >
                <h3>{type.shortName}</h3>
                <p>{type.tagline}</p>
              </button>
            ))}
          </div>

          <div className="field">
            <label htmlFor="program-name">Name</label>
            <input
              id="program-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Global ERP rollout"
            />
          </div>

          <div className="field">
            <label htmlFor="program-context">Context (optional)</label>
            <input
              id="program-context"
              className="input"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Sponsor, geography, target date…"
            />
          </div>

          {create.isError && (
            <p className="form-error">{create.error.message}</p>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn primary"
              disabled={!typeId || name.trim().length === 0 || create.isPending}
              onClick={submit}
            >
              {create.isPending ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={closeCreate}
              disabled={create.isPending}
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {programs.isError && (
        <p className="form-error">{programs.error.message}</p>
      )}

      {programs.isSuccess && programs.data.length === 0 && !creating && (
        <div className="empty">
          <h2>No programs yet</h2>
          <p>Create one to get the guided setup and the running view.</p>
          <button type="button" className="btn primary" onClick={openCreate}>
            New program
          </button>
        </div>
      )}

      {programs.isSuccess && programs.data.length > 0 && (
        <ul className="programs">
          {programs.data.map((program) => (
            <li key={program.id}>
              <button
                type="button"
                className="program-row"
                onClick={() => router.push(`/program/${program.id}`)}
              >
                <span className="program-main">
                  <span className="program-name">{program.name}</span>
                  <span className="program-meta">
                    <span className="chip">{shortNameFor(program.typeId)}</span>
                    <span className="status">{program.status}</span>
                  </span>
                </span>
                <span className="strip" aria-hidden="true">
                  {program.progress.phases.map((phase) => (
                    <span
                      key={phase.phaseId}
                      title={`${PHASES[phase.phaseId]?.short ?? `Phase ${phase.phaseId + 1}`}: ${phase.done} of ${phase.total} non-negotiables${phase.na > 0 ? `, ${phase.na} n/a` : ""}`}
                      className={phase.phaseDone ? "seg done" : "seg"}
                    />
                  ))}
                </span>
                <span className="pct">{program.progress.overallPct}%</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function shortNameFor(typeId: string): string {
  return (
    PROGRAM_TYPES.find((type) => type.typeId === typeId)?.shortName ?? typeId
  );
}

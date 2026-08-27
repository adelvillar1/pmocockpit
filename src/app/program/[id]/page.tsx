import type { Metadata } from "next";
import { createCallerFactory } from "@/server/trpc";
import { createContext } from "@/server/trpc";
import { appRouter } from "@/server/routers/_app";
import { ProgramWorkspace } from "./components/workspace-client";
import "./workspace.css";

export const metadata: Metadata = {
  title: "Program workspace — Stratum",
};

const caller = createCallerFactory(appRouter)(createContext());

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Pre-fetch on the server so the first HTML paint already contains the
  // program name, phase titles, and checklists (client query hydrates from
  // this via initialData — no second round trip).
  let initial: Awaited<ReturnType<typeof caller.programs.get>> | null = null;
  try {
    initial = await caller.programs.get({ id });
  } catch {
    initial = null;
  }

  if (!initial) {
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

  return <ProgramWorkspace id={id} initial={initial} />;
}

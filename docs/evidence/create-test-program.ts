/**
 * Live-test caller: creates a fresh "erp" program via the tRPC caller factory
 * (same code path the API uses) and prints its id. Idempotent — deletes any
 * prior "Workspace live test" programs first so each run starts clean. The
 * resulting program is intentionally left in the DB for the workspace UI
 * live test.
 *
 * Run: npx tsx docs/evidence/create-test-program.ts
 */
import "dotenv/config"; // tsx does not auto-load .env like Next.js does
import { createCallerFactory } from "../../src/server/trpc";
import { createContext } from "../../src/server/trpc";
import { appRouter } from "../../src/server/routers/_app";

const caller = createCallerFactory(appRouter)(createContext());

async function main() {
  // Clean up prior test programs so the workspace starts from a fresh state.
  const existing = await caller.programs.list();
  for (const p of existing) {
    if (p.name.startsWith("Workspace live test")) {
      await caller.programs.delete({ id: p.id });
      console.error(`deleted prior test program ${p.id}`);
    }
  }

  const name = `Workspace live test ${new Date().toISOString()}`;
  const { id } = await caller.programs.create({
    typeId: "erp",
    name,
    context: "Created by the Task 8 workspace live test.",
  });
  console.log(JSON.stringify({ id, name }));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { router } from "@/server/trpc";
import { programsRouter } from "@/server/routers/programs";
import { itemsRouter } from "@/server/routers/items";

export const appRouter = router({
  programs: programsRouter,
  items: itemsRouter,
});

/** Type-only export consumed by the tRPC client — no runtime code. */
export type AppRouter = typeof appRouter;

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";
import { createContext } from "@/server/trpc";

/**
 * tRPC v11 fetch adapter for the Next.js App Router. Auth is already enforced
 * upstream by the middleware, which gates /api/trpc at the HTTP layer.
 */
function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });
}

export { handler as GET, handler as POST };
